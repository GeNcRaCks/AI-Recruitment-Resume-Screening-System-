import os
import secrets
from urllib.parse import urlencode

import httpx
import jwt
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import RedirectResponse
from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session
from src.db.database import get_db
from src.db.models import User
from src.auth.security import hash_password, verify_password, create_access_token
from src.auth.dependencies import get_current_user
from src.auth.security import JWT_SECRET

load_dotenv()

router = APIRouter(prefix="/auth", tags=["auth"])

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000").rstrip("/")
OAUTH_STATE_MAX_AGE = 600
_state_serializer = URLSafeTimedSerializer(JWT_SECRET, salt="oauth-state")

OAUTH_PROVIDERS = {
    "google": {
        "client_id": os.getenv("GOOGLE_CLIENT_ID", ""),
        "client_secret": os.getenv("GOOGLE_CLIENT_SECRET", ""),
        "authorization_endpoint": "https://accounts.google.com/o/oauth2/v2/auth",
        "token_endpoint": "https://oauth2.googleapis.com/token",
        "userinfo_endpoint": "https://openidconnect.googleapis.com/v1/userinfo",
        "scope": "openid email profile",
    },
    "linkedin": {
        "client_id": os.getenv("LINKEDIN_CLIENT_ID", ""),
        "client_secret": os.getenv("LINKEDIN_CLIENT_SECRET", ""),
        "authorization_endpoint": "https://www.linkedin.com/oauth/v2/authorization",
        "token_endpoint": "https://www.linkedin.com/oauth/v2/accessToken",
        "userinfo_endpoint": "https://api.linkedin.com/v2/userinfo",
        "scope": "openid profile email",
    },
}


def _oauth_redirect_uri(provider: str) -> str:
    return f"{os.getenv('BACKEND_PUBLIC_URL', 'http://localhost:8000').rstrip('/')}/auth/{provider}/callback"


def _oauth_error(message: str) -> RedirectResponse:
    return RedirectResponse(f"{FRONTEND_URL}/login?oauth_error={urlencode({'error': message})[6:]}")


def _user_response(user: User) -> dict:
    token = create_access_token(user.id, user.email)
    return {"access_token": token, "token_type": "bearer",
            "user": {"id": user.id, "email": user.email, "name": user.name, "company_name": user.company_name}}


def _get_provider(provider: str) -> dict:
    config = OAUTH_PROVIDERS.get(provider)
    if not config or not config["client_id"] or not config["client_secret"]:
        raise HTTPException(503, f"{provider.title()} OAuth is not configured. Set its client ID and secret in .env.")
    return config


@router.get("/{provider}/login")
def oauth_login(provider: str):
    try:
        config = _get_provider(provider)
    except HTTPException as exc:
        return _oauth_error(str(exc.detail))
    state = _state_serializer.dumps({"provider": provider})
    query = urlencode({
        "client_id": config["client_id"],
        "redirect_uri": _oauth_redirect_uri(provider),
        "response_type": "code",
        "scope": config["scope"],
        "state": state,
    })
    return RedirectResponse(f"{config['authorization_endpoint']}?{query}")


@router.get("/{provider}/callback")
async def oauth_callback(provider: str, code: str | None = Query(None), state: str | None = Query(None), error: str | None = Query(None), db: Session = Depends(get_db)):
    if error:
        return _oauth_error(f"{provider.title()} sign-in was cancelled.")
    if not code or not state:
        return _oauth_error("The OAuth provider returned an incomplete sign-in response.")

    try:
        state_data = _state_serializer.loads(state, max_age=OAUTH_STATE_MAX_AGE)
        if state_data.get("provider") != provider:
            raise BadSignature("Provider mismatch")
    except (BadSignature, SignatureExpired):
        return _oauth_error("The sign-in session expired. Please try again.")

    try:
        config = _get_provider(provider)
        async with httpx.AsyncClient(timeout=15) as client:
            token_response = await client.post(config["token_endpoint"], data={
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": _oauth_redirect_uri(provider),
                "client_id": config["client_id"],
                "client_secret": config["client_secret"],
            })
            token_response.raise_for_status()
            access_token = token_response.json().get("access_token")
            if not access_token:
                raise ValueError("Provider did not return an access token")
            profile_response = await client.get(config["userinfo_endpoint"], headers={"Authorization": f"Bearer {access_token}"})
            profile_response.raise_for_status()
            profile = profile_response.json()

        email = profile.get("email")
        if not email:
            raise ValueError("Provider did not return a verified email address")
        email = email.lower().strip()
        name = (profile.get("name") or "").strip() or "Recruiter"
        user = db.query(User).filter(User.email == email).first()
        if not user:
            user = User(email=email, hashed_password=hash_password(secrets.token_urlsafe(32)), name=name, company_name="")
            db.add(user)
        elif not user.name or user.name == "Recruiter":
            user.name = name
        db.commit()
        db.refresh(user)
        result = _user_response(user)
        return RedirectResponse(f"{FRONTEND_URL}/auth/callback?{urlencode({'access_token': result['access_token']})}")
    except (httpx.HTTPError, ValueError, KeyError, jwt.PyJWTError) as exc:
        return _oauth_error(f"Unable to complete {provider.title()} sign-in: {exc}")

class RegisterRequest(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr              
    password: str = Field(min_length=8)
    company_name: str = ""

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UpdateProfileRequest(BaseModel):
    name: str | None = None
    company_name: str | None = None

@router.post("/register")
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
 
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(400, "An account with this email already exists.")
    user = User(email=payload.email, hashed_password=hash_password(payload.password),
                name=payload.name, company_name=payload.company_name)
    db.add(user); db.commit(); db.refresh(user)
    token = create_access_token(user.id, user.email)
    return {"access_token": token, "token_type": "bearer",
            "user": {"id": user.id, "email": user.email, "name": user.name, "company_name": user.company_name}}

@router.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(401, "Incorrect email or password.")
    token = create_access_token(user.id, user.email)
    return {"access_token": token, "token_type": "bearer",
            "user": {"id": user.id, "email": user.email, "name": user.name, "company_name": user.company_name}}

@router.post("/logout")
def logout(current_user: User = Depends(get_current_user)):
    return {"message": "Logged out."}

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {"id": current_user.id, "email": current_user.email,
            "name": current_user.name, "company_name": current_user.company_name}

@router.patch("/me")
def update_me(payload: UpdateProfileRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
  
    if payload.name is not None:
        current_user.name = payload.name
    if payload.company_name is not None:
        current_user.company_name = payload.company_name
    db.commit(); db.refresh(current_user)
    return {"id": current_user.id, "name": current_user.name, "company_name": current_user.company_name}
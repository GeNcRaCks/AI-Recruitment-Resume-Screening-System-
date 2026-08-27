import json, os
from datetime import datetime
from typing import Optional
from fastapi import FastAPI, UploadFile, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
import csv
import io
from fpdf import FPDF

from src.db.database import get_db, init_db
from src.db.models import Job, Candidate, User
from src.auth.dependencies import get_current_user
from src.api.auth_routes import router as auth_router
from src.parsing.extract import extract_resume_text, PDFExtractionError
from src.parsing.clean import normalize_text
from src.parsing.candidate_info import extract_candidate_info
from src.nlp.skill_extraction import load_skills_db, build_matcher, extract_skills
from src.scoring.final_score import compute_final_score
from src.scoring.similarity import embed_text
from src.generation.pipeline import generate_interview_package
from src.notifications.email import send_shortlist_email

app = FastAPI(title="AI Recruitment API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://recruitpro-ai-six.vercel.app",  
    ],
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+)(:\d+)?",
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router)

init_db()
_skills_db = load_skills_db()
_matcher = build_matcher(_skills_db)

ALLOWED_EXTENSIONS = {".pdf", ".docx"}
MAX_FILE_SIZE_MB = 8

class JobCreate(BaseModel):
    title: str
    jd_text: str

class SkillExtractionRequest(BaseModel):
    jd_text: str

class CandidateStatusUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None

class EmailShortlistRequest(BaseModel):
    emails: list[EmailStr]


def _job_skills(jd_text: str) -> list[str]:
    return sorted(extract_skills(jd_text, _matcher))


def _validate_and_score(db, job, filename, file_bytes, source, jd_embedding=None):

    ext = os.path.splitext(filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise ValueError(f"Unsupported file type '{ext}'. Only PDF and DOCX are accepted.")
    if len(file_bytes) > MAX_FILE_SIZE_MB * 1024 * 1024:
        raise ValueError(f"File exceeds {MAX_FILE_SIZE_MB}MB limit.")

    os.makedirs("data/uploads", exist_ok=True)
    temp_path = f"data/uploads/{datetime.now().strftime('%Y%m%d%H%M%S%f')}_{filename}"
    with open(temp_path, "wb") as f:
        f.write(file_bytes)

    try:
        raw = normalize_text(extract_resume_text(temp_path))
    except (PDFExtractionError, ValueError) as e:
        raise ValueError(f"Could not process resume: {e}")

    candidate_info = extract_candidate_info(raw)
    candidate_name = candidate_info["name"] or "Unknown Candidate"
    candidate_email = candidate_info["email"]

    jd_skills = extract_skills(job.jd_text, _matcher)
    found = extract_skills(raw, _matcher)
    matched = sorted(found & jd_skills)
    missing = sorted(jd_skills - found)
    ratio = len(matched) / max(len(jd_skills), 1)
    scores = compute_final_score(raw, job.jd_text, ratio, jd_embedding=jd_embedding)
    package = generate_interview_package(job.jd_text, matched, missing, scores["final_score"])

    candidate = Candidate(
        job_id=job.id, name=candidate_name, email=candidate_email,
        resume_filename=filename, source=source, raw_text=raw,
        skills_found=json.dumps(sorted(found)), matched_skills=json.dumps(matched),
        missing_skills=json.dumps(missing), skill_match_ratio=scores["skill_match_ratio"],
        tfidf_similarity=scores["tfidf_similarity"], semantic_similarity=scores["semantic_similarity"],
        final_score=scores["final_score"], summary=package["summary"],
        questions=package["questions"], feedback=package["feedback"],
    )
    db.add(candidate); db.commit(); db.refresh(candidate)
    return candidate


@app.post("/jobs")
def create_job(payload: JobCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if not payload.title.strip() or not payload.jd_text.strip():
        raise HTTPException(400, "Job title and description cannot be empty.")
    job = Job(title=payload.title.strip(), jd_text=payload.jd_text, created_by=user.id)
    db.add(job); db.commit(); db.refresh(job)
    return {"id": job.id, "title": job.title, "jd_text": job.jd_text,
            "detected_skills": _job_skills(job.jd_text), "created_at": job.created_at}

@app.post("/skills/extract")
def extract_job_skills(payload: SkillExtractionRequest, user: User = Depends(get_current_user)):
    return {"skills": _job_skills(payload.jd_text)}

@app.get("/jobs")
def list_jobs(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    jobs = db.query(Job).order_by(Job.created_at.desc()).all()
    return [{"id": j.id, "title": j.title, "jd_text": j.jd_text,
             "detected_skills": _job_skills(j.jd_text), "created_at": j.created_at,
             "candidate_count": len(j.candidates),
             "avg_score": round(sum(c.final_score or 0 for c in j.candidates) / len(j.candidates), 2) if j.candidates else 0,
             "top_score": max((c.final_score or 0 for c in j.candidates), default=0)} for j in jobs]

@app.get("/jobs/{job_id}")
def get_job(job_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(404, f"Job {job_id} not found.")
    return {"id": job.id, "title": job.title, "jd_text": job.jd_text,
        "detected_skills": _job_skills(job.jd_text), "created_at": job.created_at}

@app.delete("/jobs/{job_id}")
def delete_job(job_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(404, f"Job {job_id} not found.")
    db.delete(job); db.commit()
    return {"deleted": job_id}

@app.post("/jobs/{job_id}/upload-resumes")
async def upload_resumes_bulk(job_id: int, files: list[UploadFile], db: Session = Depends(get_db),
                               user: User = Depends(get_current_user)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(404, f"Job {job_id} not found.")
    results = {"succeeded": [], "failed": []}
    jd_embedding = embed_text(job.jd_text) if job.jd_text.strip() else None
    for file in files:
        try:
            c = _validate_and_score(db, job, file.filename, await file.read(), "manual", jd_embedding)
            results["succeeded"].append({"id": c.id, "name": c.name, "email": c.email,
                                         "resume_filename": c.resume_filename, "final_score": c.final_score})
        except ValueError as e:
            results["failed"].append({"name": file.filename, "error": str(e)})
    return results

@app.post("/public/jobs/{job_id}/apply")
async def public_apply(job_id: int, file: UploadFile, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(404, "This job posting is no longer available.")
    try:
        _validate_and_score(db, job, file.filename, await file.read(), "public_application")
    except ValueError as e:
        raise HTTPException(422, str(e))
    return {"message": "Application received. Thank you for applying!"}

@app.get("/jobs/{job_id}/candidates")
def get_ranked_candidates(job_id: int, min_score: Optional[float] = Query(None, ge=0, le=1),
                           status: Optional[str] = None, sort_by: str = "final_score",
                           order: str = "desc", db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if not db.query(Job).filter(Job.id == job_id).first():
        raise HTTPException(404, f"Job {job_id} not found.")
    q = db.query(Candidate).filter(Candidate.job_id == job_id)
    if min_score is not None:
        q = q.filter(Candidate.final_score >= min_score)
    if status:
        q = q.filter(Candidate.status == status)
    sort_col = getattr(Candidate, sort_by)
    q = q.order_by(sort_col.desc() if order == "desc" else sort_col.asc())
    return [{"id": c.id, "name": c.name, "email": c.email, "resume_filename": c.resume_filename,
             "source": c.source, "final_score": c.final_score,
             "status": c.status, "matched_skills": json.loads(c.matched_skills or "[]")} for c in q.all()]

@app.get("/candidates/{candidate_id}")
def get_candidate_detail(candidate_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    c = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not c:
        raise HTTPException(404, f"Candidate {candidate_id} not found.")
    return {"id": c.id, "name": c.name, "email": c.email, "resume_filename": c.resume_filename,
        "source": c.source, "status": c.status, "notes": c.notes,
        "resume_text": c.raw_text or "",
        "skill_match_ratio": c.skill_match_ratio, "tfidf_similarity": c.tfidf_similarity,
        "semantic_similarity": c.semantic_similarity, "final_score": c.final_score,
        "matched_skills": json.loads(c.matched_skills or "[]"),
        "missing_skills": json.loads(c.missing_skills or "[]"),
        "summary": c.summary, "questions": c.questions, "feedback": c.feedback}

@app.patch("/candidates/{candidate_id}")
def update_candidate(candidate_id: int, payload: CandidateStatusUpdate, db: Session = Depends(get_db),
                      user: User = Depends(get_current_user)):

    c = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not c:
        raise HTTPException(404, f"Candidate {candidate_id} not found.")
    valid_statuses = {"New", "Reviewed", "Screening", "Interview", "Offered", "Rejected", "Hired"}
    if payload.status is not None:
        if payload.status not in valid_statuses:
            raise HTTPException(400, f"Status must be one of {sorted(valid_statuses)}.")
        c.status = payload.status
    if payload.notes is not None:
        c.notes = payload.notes
    db.commit(); db.refresh(c)
    return {"id": c.id, "status": c.status, "notes": c.notes}

@app.delete("/candidates/{candidate_id}")
def delete_candidate(candidate_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(404, f"Candidate {candidate_id} not found.")
    db.delete(candidate)
    db.commit()
    return {"deleted": candidate_id}


@app.get("/jobs/{job_id}/candidates/export-csv")
def export_candidates_csv(job_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(404, f"Job {job_id} not found.")

    candidates = db.query(Candidate).filter(Candidate.job_id == job_id).order_by(Candidate.final_score.desc()).all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Name", "Status", "Score", "Matched Skills", "Missing Skills", "Notes"])

    for c in candidates:
        writer.writerow([
            c.name, c.status, f"{c.final_score:.2f}",
            ", ".join(json.loads(c.matched_skills or "[]")),
            ", ".join(json.loads(c.missing_skills or "[]")),
            c.notes or ""
        ])

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=job_{job_id}_candidates.csv"}
    )


@app.get("/jobs/{job_id}/candidates/export-pdf")
def export_candidates_pdf(job_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(404, f"Job {job_id} not found.")

    candidates = db.query(Candidate).filter(Candidate.job_id == job_id).order_by(Candidate.final_score.desc()).all()

    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)
    content_width = pdf.w - pdf.l_margin - pdf.r_margin

    def write_multiline(text: str, height: float = 6):
        pdf.set_x(pdf.l_margin)
        pdf.multi_cell(content_width, height, text.encode("latin-1", "replace").decode("latin-1"))

    pdf.set_font("Arial", "B", 16)
    pdf.cell(content_width, 10, f"Candidate Shortlist: {job.title}", ln=True, align="C")
    pdf.ln(10)

    pdf.set_font("Arial", size=12)
    for c in candidates:
        pdf.set_font("Arial", "B", 12)
        pdf.set_x(pdf.l_margin)
        pdf.cell(content_width, 8, f"Name: {c.name} | Score: {c.final_score:.2f} | Status: {c.status}", ln=True)
        pdf.set_font("Arial", size=11)
        write_multiline(f"Matched Skills: {', '.join(json.loads(c.matched_skills or '[]'))}")
        write_multiline(f"Missing Skills: {', '.join(json.loads(c.missing_skills or '[]'))}")
        if c.notes:
            write_multiline(f"Notes: {c.notes}")
        pdf.ln(5)

    pdf_output = pdf.output()
    pdf_bytes = bytes(pdf_output)
    
    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=job_{job_id}_candidates.pdf"}
    )


@app.post("/jobs/{job_id}/candidates/email-shortlist")
def email_shortlist(job_id: int, payload: EmailShortlistRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(404, f"Job {job_id} not found.")
    
    # Simple top 5 candidates
    candidates = db.query(Candidate).filter(Candidate.job_id == job_id).order_by(Candidate.final_score.desc()).limit(5).all()
    
    if not candidates:
        raise HTTPException(400, "No candidates found for this job.")

    body = f"Here is the top candidate shortlist for {job.title}:\n\n"
    for idx, c in enumerate(candidates, 1):
        body += f"{idx}. {c.name} (Score: {c.final_score:.2f}, Status: {c.status})\n"
        body += f"   Skills: {', '.join(json.loads(c.matched_skills or '[]'))}\n"
        if c.notes:
            body += f"   Notes: {c.notes}\n"
        body += "\n"
    body += "Log into the AI Recruitment Dashboard to view full details.\n"

    try:
        send_shortlist_email(payload.emails, job.title, body)
        return {"message": f"Email(s) sent successfully to {len(payload.emails)} recipient(s)."}
    except Exception as e:
        raise HTTPException(500, f"Failed to send email: {str(e)}")

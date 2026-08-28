import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker
from src.db.models import Base, Candidate
from src.parsing.candidate_info import extract_candidate_info

load_dotenv() 

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./recruitment.db")
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)
    needs_backfill = False
    if engine.dialect.name == "sqlite":
        columns = {column["name"] for column in inspect(engine).get_columns("candidates")}
        with engine.begin() as connection:
            if "email" not in columns:
                connection.execute(text("ALTER TABLE candidates ADD COLUMN email VARCHAR"))
                needs_backfill = True
            if "resume_filename" not in columns:
                connection.execute(text("ALTER TABLE candidates ADD COLUMN resume_filename VARCHAR"))
                needs_backfill = True

    # Only run the expensive per-row backfill when columns were just added
    # for the first time. On every subsequent startup this is skipped entirely.
    if needs_backfill:
        db = SessionLocal()
        try:
            for candidate in db.query(Candidate).all():
                changed = False
                if not candidate.resume_filename:
                    candidate.resume_filename = candidate.name or "unknown_resume"
                    changed = True
                info = extract_candidate_info(candidate.raw_text or "")
                if info["email"] and candidate.email != info["email"]:
                    candidate.email = info["email"]
                    changed = True
                if info["name"] and candidate.name != info["name"]:
                    candidate.name = info["name"]
                    changed = True
                if not info["name"] and (not candidate.name or candidate.name == candidate.resume_filename):
                    candidate.name = "Unknown Candidate"
                    changed = True
                if changed:
                    db.add(candidate)
            db.commit()
        finally:
            db.close()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
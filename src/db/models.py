from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    name = Column(String)
    company_name = Column(String, default="")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class Job(Base):
    __tablename__ = "jobs"
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String, nullable=False)
    jd_text = Column(Text, nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    candidates = relationship("Candidate", back_populates="job", cascade="all, delete-orphan")


class Candidate(Base):
    __tablename__ = "candidates"
    id = Column(Integer, primary_key=True, autoincrement=True)
    job_id = Column(Integer, ForeignKey("jobs.id"), index=True, nullable=False)
    name = Column(String)
    email = Column(String)
    resume_filename = Column(String)
    source = Column(String, default="manual")
    raw_text = Column(Text)
    skills_found = Column(Text)
    matched_skills = Column(Text)
    missing_skills = Column(Text)
    skill_match_ratio = Column(Float)
    tfidf_similarity = Column(Float)
    semantic_similarity = Column(Float)
    final_score = Column(Float)
    summary = Column(Text)
    questions = Column(Text)
    feedback = Column(Text)
    status = Column(String, default="New")
    notes = Column(Text, default="")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    job = relationship("Job", back_populates="candidates")
from src.db.database import init_db, SessionLocal
from src.db.models import Job

def test_job_status_db_and_api():
    init_db()
    db = SessionLocal()
    try:
        test_job = Job(title="Backend Engineer", jd_text="Python FastAPI SQL", status="Draft")
        db.add(test_job)
        db.commit()
        db.refresh(test_job)

        assert test_job.id is not None
        assert test_job.status == "Draft"

        test_job.status = "Active"
        db.commit()
        db.refresh(test_job)
        assert test_job.status == "Active"

        db.delete(test_job)
        db.commit()
    finally:
        db.close()

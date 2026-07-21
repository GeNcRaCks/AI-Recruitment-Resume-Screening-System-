import os
from src.parsing.extract import extract_resume_text

for fname in os.listdir("data/resumes"):
    path = os.path.join("data/resumes", fname)
    try:
        text = extract_resume_text(path)
        print(f"{fname}: {len(text)} characters extracted")
    except Exception as e:
        print(f"{fname}: FAILED - {e}")
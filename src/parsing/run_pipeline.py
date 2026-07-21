import os
from src.parsing.extract import extract_resume_text
from src.parsing.clean import normalize_text, split_into_sections

os.makedirs("data/parsed_output", exist_ok=True)
for fname in os.listdir("data/resumes"):
    path = os.path.join("data/resumes", fname)
    raw = extract_resume_text(path)
    clean = normalize_text(raw)
    sections = split_into_sections(clean)
    out_path = f"data/parsed_output/{fname}.txt"
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(clean)
    print(f"Saved {out_path} | sections found: {list(sections.keys())}")
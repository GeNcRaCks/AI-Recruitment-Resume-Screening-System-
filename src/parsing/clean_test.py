from src.parsing.extract import extract_resume_text
from src.parsing.clean import normalize_text, split_into_sections

raw = extract_resume_text("data/resumes/Resume_09.docx")
clean = normalize_text(raw)
sections = split_into_sections(clean)
print(sections.keys())
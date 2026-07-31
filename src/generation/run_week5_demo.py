
import json
from src.nlp.skill_extraction import load_skills_db, build_matcher, extract_skills
from src.scoring.final_score import compute_final_score
from src.generation.pipeline import generate_interview_package


CANDIDATE_FILE = "data/parsed_output/Resume_06.docx.txt"
JD_FILE = "data/job_descriptions/jd_3.txt"

resume_text = open(CANDIDATE_FILE, encoding="utf-8").read()
jd_text = open(JD_FILE, encoding="utf-8").read()

skills_db = load_skills_db()
matcher = build_matcher(skills_db)

jd_skills = extract_skills(jd_text, matcher)
resume_skills = extract_skills(resume_text, matcher)

matched_skills = sorted(resume_skills & jd_skills)
missing_skills = sorted(jd_skills - resume_skills)
skill_match_ratio = len(matched_skills) / max(len(jd_skills), 1)

scores = compute_final_score(resume_text, jd_text, skill_match_ratio)
print("Scores:", scores)
print("Matched skills:", matched_skills)
print("Missing skills:", missing_skills)

package = generate_interview_package(
    jd_text=jd_text,
    matched_skills=matched_skills,
    missing_skills=missing_skills,
    final_score=scores["final_score"],
)

print("\n" + json.dumps(package, indent=2))

with open("data/week5_sample_output.json", "w", encoding="utf-8") as f:
    json.dump({**scores, "matched_skills": matched_skills, "missing_skills": missing_skills, **package},
               f, indent=2)
print("\nSaved to data/week5_sample_output.json")
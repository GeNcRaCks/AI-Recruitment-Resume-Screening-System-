import os
from src.nlp.skill_extraction import load_skills_db, build_matcher, extract_skills
from src.scoring.rank_by_skills import rank_candidates_by_skills

jd_text = open("data/job_descriptions/jd_3.txt", encoding="utf-8").read()

skills_db = load_skills_db()
matcher = build_matcher(skills_db)
jd_skills = extract_skills(jd_text, matcher)

print(f"Skills detected in JD: {sorted(jd_skills)}\n")

resume_texts = {}
for fname in os.listdir("data/parsed_output"):
    with open(f"data/parsed_output/{fname}", encoding="utf-8") as f:
        resume_texts[fname] = f.read()

ranked = rank_candidates_by_skills(resume_texts, jd_skills)
print(ranked[["candidate", "match_count"]])
ranked.to_csv("data/week3_ranking.csv", index=False)
print("\nSaved to data/week3_ranking.csv")
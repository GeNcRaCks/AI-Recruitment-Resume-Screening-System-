import os
import pandas as pd
from src.nlp.skill_extraction import load_skills_db, build_matcher, extract_skills
from src.scoring.final_score import compute_final_score

JD_FILES = ["jd_1.txt", "jd_2.txt", "jd_3.txt"]

skills_db = load_skills_db()
matcher = build_matcher(skills_db)

# load all parsed resumes once
resume_texts = {}
for fname in os.listdir("data/parsed_output"):
    with open(f"data/parsed_output/{fname}", encoding="utf-8") as f:
        resume_texts[fname] = f.read()

all_rows = []
for jd_file in JD_FILES:
    jd_path = f"data/job_descriptions/{jd_file}"
    with open(jd_path, encoding="utf-8") as f:
        jd_text = f.read()

    jd_skills = extract_skills(jd_text, matcher)
    print(f"\n=== {jd_file} — {len(jd_skills)} skills detected ===")

    for candidate, text in resume_texts.items():
        try:
            found = extract_skills(text, matcher)
            ratio = len(found & jd_skills) / max(len(jd_skills), 1)
            result = compute_final_score(text, jd_text, ratio)
            result["candidate"] = candidate
            result["job_description"] = jd_file
            all_rows.append(result)
        except Exception as e:
            # one bad file (e.g. unexpectedly empty parsed output) shouldn't
            # kill the whole batch run — log it and keep going
            print(f"  SKIPPED {candidate}: {e}")

df = pd.DataFrame(all_rows)
df = df.sort_values(["job_description", "final_score"], ascending=[True, False]).reset_index(drop=True)

print("\n", df[["job_description", "candidate", "skill_match_ratio", "tfidf_similarity",
                 "semantic_similarity", "final_score"]])

df.to_csv("data/week4_scores.csv", index=False)
print("\nSaved to data/week4_scores.csv")
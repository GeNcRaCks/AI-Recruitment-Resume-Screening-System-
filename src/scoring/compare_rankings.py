import os
import pandas as pd
from src.nlp.skill_extraction import load_skills_db, build_matcher, extract_skills
from src.scoring.rank_by_skills import rank_candidates_by_skills

skills_db = load_skills_db()
matcher = build_matcher(skills_db)

jd_text = open("data/job_descriptions/jd_1.txt", encoding="utf-8").read()
jd_skills = extract_skills(jd_text, matcher)

resume_texts = {}
for fname in os.listdir("data/parsed_output"):
    with open(f"data/parsed_output/{fname}", encoding="utf-8") as f:
        resume_texts[fname] = f.read()

# Week 3 ranking (skills only)
week3_ranked = rank_candidates_by_skills(resume_texts, jd_skills)
week3_ranked["week3_rank"] = week3_ranked.index + 1

# Week 4 ranking (combined score) for the same JD
week4_full = pd.read_csv("data/week4_scores.csv")
week4_jd1 = week4_full[week4_full["job_description"] == "jd_1.txt"].reset_index(drop=True)
week4_jd1["week4_rank"] = week4_jd1.index + 1

comparison = week3_ranked[["candidate", "week3_rank", "match_count"]].merge(
    week4_jd1[["candidate", "week4_rank", "final_score"]], on="candidate"
)
comparison["rank_change"] = comparison["week3_rank"] - comparison["week4_rank"]
comparison = comparison.sort_values("week4_rank")

print(comparison)
comparison.to_csv("data/week3_vs_week4_comparison.csv", index=False)
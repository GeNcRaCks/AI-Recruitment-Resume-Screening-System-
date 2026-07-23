import pandas as pd
from src.nlp.skill_extraction import load_skills_db, build_matcher, extract_skills


def rank_candidates_by_skills(resume_texts: dict[str, str], jd_skills: set[str]) -> pd.DataFrame:
    skills_db = load_skills_db()
    matcher = build_matcher(skills_db)
    rows = []
    for name, text in resume_texts.items():
        found = extract_skills(text, matcher)
        matched_to_jd = found & jd_skills
        missing_from_jd = jd_skills - found
        rows.append({
            "candidate": name,
            "skills_found": sorted(found),
            "matched_to_jd": sorted(matched_to_jd),
            "missing_skills": sorted(missing_from_jd),
            "match_count": len(matched_to_jd),
        })
    df = pd.DataFrame(rows)
    return df.sort_values("match_count", ascending=False).reset_index(drop=True)
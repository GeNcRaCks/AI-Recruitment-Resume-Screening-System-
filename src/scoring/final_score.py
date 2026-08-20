import math
from src.scoring.similarity import tfidf_similarity, semantic_similarity


def compute_final_score(resume_text: str, jd_text: str, skill_match_ratio: float,
                         w_skill: float = 0.6, w_tfidf: float = 0.1, w_semantic: float = 0.3) -> dict:
    total_weight = w_skill + w_tfidf + w_semantic
    if not math.isclose(total_weight, 1.0, rel_tol=1e-6):
        raise ValueError(f"Weights must sum to 1.0, got {total_weight} "
                          f"(w_skill={w_skill}, w_tfidf={w_tfidf}, w_semantic={w_semantic})")

    # clip in case an upstream bug ever passes something outside 0-1
    skill_match_ratio = max(0.0, min(1.0, skill_match_ratio))

    tfidf_sim = tfidf_similarity(resume_text, jd_text)
    sem_sim = semantic_similarity(resume_text, jd_text)
    final = (w_skill * skill_match_ratio) + (w_tfidf * tfidf_sim) + (w_semantic * sem_sim)

    return {
        "skill_match_ratio": round(skill_match_ratio, 3),
        "tfidf_similarity": round(tfidf_sim, 3),
        "semantic_similarity": round(sem_sim, 3),
        "final_score": round(final, 3),
    }
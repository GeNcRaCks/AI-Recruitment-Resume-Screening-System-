from concurrent.futures import ThreadPoolExecutor, as_completed
from src.generation.questions import generate_interview_questions
from src.generation.summary import generate_candidate_summary
from src.generation.feedback import generate_feedback


def generate_interview_package(jd_text: str, matched_skills: list[str],
                                missing_skills: list[str], final_score: float) -> dict:
    """
    Generates all three outputs concurrently via a thread pool.

    Each task is independently wrapped so that if one LLM call fails
    (rate limit, network drop, etc.), the other two still succeed.
    The thread pool fires all 3 Groq requests simultaneously, cutting
    total latency from ~3× to ~1× a single Groq round-trip.
    """
    tasks = {
        "questions": lambda: generate_interview_questions(jd_text, matched_skills, missing_skills),
        "summary":   lambda: generate_candidate_summary(jd_text, matched_skills, missing_skills, final_score),
        "feedback":  lambda: generate_feedback(matched_skills, missing_skills),
    }

    package: dict[str, str] = {}
    with ThreadPoolExecutor(max_workers=3) as executor:
        futures = {executor.submit(fn): key for key, fn in tasks.items()}
        for future in as_completed(futures):
            key = futures[future]
            try:
                package[key] = future.result()
            except Exception as e:
                package[key] = f"[Could not generate {key}: {e}]"

    return package
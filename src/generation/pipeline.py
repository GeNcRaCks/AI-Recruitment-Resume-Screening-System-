from src.generation.questions import generate_interview_questions
from src.generation.summary import generate_candidate_summary
from src.generation.feedback import generate_feedback


def generate_interview_package(jd_text: str, matched_skills: list[str],
                                missing_skills: list[str], final_score: float) -> dict:
    """
    Generates all three outputs. Each is wrapped independently so that if
    one LLM call fails (rate limit exhausted, network drop, etc.), the
    other two still succeed instead of the whole package being lost.
    """
    package = {}

    try:
        package["questions"] = generate_interview_questions(jd_text, matched_skills, missing_skills)
    except Exception as e:
        package["questions"] = f"[Could not generate interview questions: {e}]"

    try:
        package["summary"] = generate_candidate_summary(jd_text, matched_skills, missing_skills, final_score)
    except Exception as e:
        package["summary"] = f"[Could not generate candidate summary: {e}]"

    try:
        package["feedback"] = generate_feedback(matched_skills, missing_skills)
    except Exception as e:
        package["feedback"] = f"[Could not generate feedback: {e}]"

    return package
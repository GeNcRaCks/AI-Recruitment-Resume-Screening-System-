from src.generation.client import call_llm


def generate_candidate_summary(jd_text: str, matched_skills: list[str], missing_skills: list[str],
                                final_score: float) -> str:
    matched_str = ", ".join(matched_skills) if matched_skills else "None identified"
    missing_str = ", ".join(missing_skills) if missing_skills else "None — candidate matched all detected requirements"

    prompt = f"""Write a concise, neutral 4-sentence hiring summary for this candidate: their overall
fit for the role (score: {final_score:.2f} out of 1.0), key strengths, notable gaps, and one honest
recommendation (interview, hold, or reject) with a one-line reason.

Job Description: {jd_text}
Matched Skills: {matched_str}
Missing Skills: {missing_str}
"""
    return call_llm(prompt, max_tokens=300)
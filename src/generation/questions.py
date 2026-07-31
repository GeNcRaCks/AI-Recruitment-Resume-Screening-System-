from src.generation.client import call_llm


def generate_interview_questions(jd_text: str, matched_skills: list[str], missing_skills: list[str]) -> str:
    matched_str = ", ".join(matched_skills) if matched_skills else "None identified"
    missing_str = ", ".join(missing_skills) if missing_skills else "None — candidate matched all detected requirements"

    prompt = f"""You are a technical interviewer. Based on this job description and candidate profile,
generate 6 interview questions: questions probing depth on their matched skills, and questions assessing
whether they can quickly pick up any missing skills. If there are no missing skills, focus all 6 questions
on probing depth and real-world application of the matched skills instead.

Job Description:
{jd_text}

Candidate's Matched Skills: {matched_str}
Candidate's Missing Skills: {missing_str}

Return only a numbered list of 6 questions, nothing else — no preamble, no closing remarks.
"""
    return call_llm(prompt)
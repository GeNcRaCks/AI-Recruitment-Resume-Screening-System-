from src.generation.client import call_llm


def generate_feedback(matched_skills: list[str], missing_skills: list[str]) -> str:
    matched_str = ", ".join(matched_skills) if matched_skills else "None identified"

    if not missing_skills:
        prompt = f"""Give the candidate 2 short, constructive pieces of feedback based on their matched
skills: {matched_str}. Since they matched all detected requirements, focus on how to present these
skills even more effectively on their resume (e.g. quantifying impact, specific tools/versions used).
"""
    else:
        prompt = f"""Give the candidate 2 short, constructive pieces of feedback: one skill to
highlight more clearly on their resume, and one skill gap to address before applying to similar roles.
Matched: {matched_str}
Missing: {", ".join(missing_skills)}
"""
    return call_llm(prompt, max_tokens=200)
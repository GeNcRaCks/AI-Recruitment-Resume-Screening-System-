import re
from functools import lru_cache
EMAIL_PATTERN = re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b")
IGNORED_HEADINGS = {
    "resume", "cv", "curriculum vitae", "profile", "summary", "objective",
    "contact", "professional summary", "technical skills", "skills",
}
IGNORED_NAME_TERMS = {
    "address", "amazon", "application", "associate", "associates", "bachelor",
    "business", "computer", "contact", "details", "designer", "developer",
    "education", "employment", "engineering", "experience", "fashion", "guard",
    "human", "information", "intern", "manager", "profile", "resume", "security",
    "software", "student", "summary", "technical", "university", "warehouse",
    "angeles", "antonio", "birth", "cisco", "coursework", "data", "kali", "linux",
    "los", "nationality", "place", "relevant", "sales", "san",
}
@lru_cache(maxsize=1)
def _get_nlp():
    try:
        import spacy
        return spacy.load("en_core_web_sm")
    except Exception:
        return None
def extract_email(text: str) -> str | None:
    match = EMAIL_PATTERN.search(text or "")
    return match.group(0) if match else None
def _clean_name_candidate(value: str) -> str:
    value = re.sub(r"\s+", " ", value).strip(" |,-:")
    value = re.sub(EMAIL_PATTERN, "", value).strip(" |,-:")
    value = re.sub(r"(?:\+?\d[\d\s().-]{7,})", "", value).strip(" |,-:")
    value = re.sub(r"^(?:name|full name|candidate name)\s*[:\-]?\s*", "", value, flags=re.I)
    return value
def _is_name_candidate(value: str) -> bool:
    words = value.split()
    if not 2 <= len(words) <= 5:
        return False
    if value.lower() in IGNORED_HEADINGS or any(char.isdigit() for char in value):
        return False
    if any(token in value.lower() for token in ("@", "linkedin", "github", "http")):
        return False
    if any(word.lower().strip(".,") in IGNORED_NAME_TERMS for word in words):
        return False
    if any(len(word.strip(".,")) < 2 for word in words):
        return False
    if not all(word[0].isupper() or word.isupper() for word in words):
        return False
    return all(re.fullmatch(r"[A-Za-z][A-Za-z'.-]*", word) for word in words)
def _name_from_line(value: str) -> str | None:
    value = _clean_name_candidate(value)
    value = re.split(r"\s*[|,]\s*|\s+-\s+", value, maxsplit=1)[0].strip()
    words = value.split()
    if len(words) > 2 and all(word.isupper() for word in words):
        value = " ".join(words)
    elif len(words) > 2 and all(word.isupper() for word in words[:2]):
        value = " ".join(words[:2])
    return value if _is_name_candidate(value) else None

def extract_name(text: str) -> str | None:
    lines = [line.strip() for line in (text or "").splitlines() if line.strip()]
    email = extract_email(text)
    email_indexes = [index for index, line in enumerate(lines) if email and email in line]
    for index, line in enumerate(lines):
        if line.lower().rstrip(":") in {"name", "full name", "candidate name"} and index + 1 < len(lines):
            candidate = _name_from_line(lines[index + 1])
            if candidate:
                return candidate
    for line in lines[:12]:
        candidate = _name_from_line(line)
        if candidate:
            return candidate
    nearby_indexes = []
    for index in email_indexes:
        nearby_indexes.extend([index, index - 1, index + 1, index - 2, index + 2])
    for index in nearby_indexes:
        if 0 <= index < len(lines):
            candidate = _name_from_line(lines[index])
            if candidate:
                return candidate
    for line in lines[:40]:
        candidate = _name_from_line(line)
        if candidate:
            return candidate
    header = (text or "")[:3000]
    nlp = _get_nlp()
    if nlp:
        doc = nlp(header)
        for entity in doc.ents:
            candidate = _clean_name_candidate(entity.text)
            if entity.label_ == "PERSON" and _is_name_candidate(candidate):
                return candidate
    return None

def extract_candidate_info(text: str) -> dict[str, str | None]:
    return {"name": extract_name(text), "email": extract_email(text)}
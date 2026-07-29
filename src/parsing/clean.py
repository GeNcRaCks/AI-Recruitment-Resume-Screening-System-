import re

_EMOJI_PATTERN = re.compile(
    "["
    "\U0001F300-\U0001FAFF"
    "\U00002600-\U000027BF"
    "\U0001F1E6-\U0001F1FF"
    "\uFE0F"
    "]+",
    flags=re.UNICODE,
)

# Known resume-builder ad copy and unfilled template placeholder phrases.
# These come from free resume-template websites and are NOT real resume
# content — left in, they add noise that can skew TF-IDF and especially
# semantic embedding scores (generic "professional-sounding" filler text
# can artificially inflate similarity to a job description).
_BOILERPLATE_PATTERNS = [
    r"resume builder\??",
    r"fill in your details",
    r"choose and download\s*\d*\s*resume designs?",
    r"only\s*\$\s*\d+([.,]\d+)?",
    r"more responsibilities here",
    r"lorem ipsum",
    r"insert your (details|text) here",
    r"add your text here",
    r"your text here",
    r"\[?placeholder\]?",
    r"click here to (edit|download|customize)",
    r"powered by\s+\w+",
    r"template\s+by\s+\w+",
    r"download\s+(this|our)\s+(resume\s+)?template",
]
_BOILERPLATE_RE = re.compile("|".join(_BOILERPLATE_PATTERNS), flags=re.IGNORECASE)


def strip_boilerplate(text: str) -> str:
    """
    Removes lines matching known resume-builder ad copy or unfilled
    template placeholder text. Operates line-by-line so a single junk
    line doesn't take out surrounding real content.
    """
    lines = text.split("\n")
    cleaned_lines = [line for line in lines if not _BOILERPLATE_RE.search(line)]
    return "\n".join(cleaned_lines)


def normalize_text(text: str) -> str:
    text = strip_boilerplate(text)                     # remove template ad/placeholder junk
    text = _EMOJI_PATTERN.sub("", text)                 # strip icons/emoji
    text = re.sub(r"[\u2022\u25cf\u25aa\u2023\u2043]", "-", text)  # bullet symbols -> dash
    text = re.sub(r"[ \t]+", " ", text)                 # collapse repeated spaces/tabs
    text = re.sub(r"\n{3,}", "\n\n", text)              # collapse 3+ blank lines to 1
    return text.strip()


SECTION_HEADERS = [
    "professional summary", "summary", "objective", "professional objective", "career objective",
    "contact", "contact information",
    "experience", "work experience", "professional experience", "employment history",
    "education", "academic background", "academic qualifications",
    "skills", "technical skills", "core competencies", "soft skills", "key skills",
    "tools", "tools & technologies", "technologies",
    "projects", "personal projects", "academic projects",
    "certifications", "certificates", "licenses",
    "languages",
    "achievements", "awards", "honors",
    "publications",
    "volunteer experience", "volunteering",
    "references", "interests", "hobbies",
    "extracurricular activities", "activities",
]


def split_into_sections(text: str) -> dict:
    pattern = r"(?im)^\s*(" + "|".join(SECTION_HEADERS) + r")\s*:?\s*$"
    matches = list(re.finditer(pattern, text))
    sections = {}
    for i, m in enumerate(matches):
        start = m.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        header = m.group(1).lower()
        sections[header] = text[start:end].strip()
    sections["_full_text"] = text
    return sections
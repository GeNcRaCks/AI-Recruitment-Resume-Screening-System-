import re
_EMOJI_PATTERN = re.compile(
    "["
    "\U0001F300-\U0001FAFF"   # pictographs, symbols, supplemental symbols
    "\U00002600-\U000027BF"   # misc symbols and dingbats
    "\U0001F1E6-\U0001F1FF"   # regional indicator symbols (flags)
    "\uFE0F"                  # variation selector (used after some emoji)
    "]+",
    flags=re.UNICODE,
)

def normalize_text(text: str) -> str:
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
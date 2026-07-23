import json
import spacy
from spacy.matcher import PhraseMatcher

nlp = spacy.load("en_core_web_sm")


def load_skills_db(path: str = "data/skills_db.json") -> dict:
    """Returns the raw {category: {canonical_skill: [synonyms]}} structure."""
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def build_matcher(skills_db: dict) -> PhraseMatcher:
    """
    Builds a PhraseMatcher where each synonym group is registered under its
    canonical skill name as the match ID. This means matches automatically
    resolve back to one consistent name, regardless of which synonym
    ("ML" vs "Machine Learning") appeared in the text.
    """
    matcher = PhraseMatcher(nlp.vocab, attr="LOWER")
    for category, skills in skills_db.items():
        for canonical_name, synonyms in skills.items():
            patterns = [nlp.make_doc(syn) for syn in synonyms]
            matcher.add(canonical_name, patterns)
    return matcher


def extract_skills(text: str, matcher: PhraseMatcher) -> set[str]:
    """
    Returns the set of canonical skill names found in the text — e.g. both
    "ML" and "Machine Learning" in the source text resolve to the single
    canonical entry "Machine Learning".
    """
    doc = nlp(text)
    matches = matcher(doc)
    canonical_names = set()
    for match_id, start, end in matches:
        canonical_names.add(nlp.vocab.strings[match_id])
    return canonical_names


def get_all_canonical_skills(skills_db: dict) -> set[str]:
    """Flat set of every canonical skill name across all categories —
    useful later for computing 'missing skills' (all - found)."""
    all_skills = set()
    for category, skills in skills_db.items():
        all_skills.update(skills.keys())
    return all_skills
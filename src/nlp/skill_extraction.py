"""
Skill extraction using a pure-Python regex matcher.

No spaCy or any ML model needed here -- we just need fast case-insensitive
phrase lookup from a fixed vocabulary (the skills_db). A single compiled
regex alternation (longest-match, word-boundary anchored) is equivalent to
spaCy's PhraseMatcher for this use case and removes ~60 MB from the
deployment image.
"""
import json
import re


def load_skills_db(path: str = "data/skills_db.json") -> dict:
    """Returns the raw {category: {canonical_skill: [synonyms]}} structure."""
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


class SkillMatcher:
    """
    Compiled regex-based phrase matcher.
    Replaces spaCy PhraseMatcher -- same interface, no spaCy dependency.

    Synonyms are sorted longest-first so the alternation greedily matches
    the most specific phrase (e.g. "Machine Learning" before "ML").
    """

    def __init__(self, skills_db: dict):
        # synonym -> canonical_name mapping
        self._synonym_to_canonical: dict[str, str] = {}
        all_synonyms: list[str] = []

        for _category, skills in skills_db.items():
            for canonical_name, synonyms in skills.items():
                for syn in synonyms:
                    syn_lower = syn.lower()
                    self._synonym_to_canonical[syn_lower] = canonical_name
                    all_synonyms.append(syn)

        # Sort longest first so alternation is greedy for multi-word skills
        all_synonyms.sort(key=len, reverse=True)

        # Build one big pattern: word-boundary anchored, case-insensitive
        escaped = [re.escape(s) for s in all_synonyms]
        pattern = r"\b(?:" + "|".join(escaped) + r")\b"
        self._regex = re.compile(pattern, re.IGNORECASE)

    def match(self, text: str) -> set[str]:
        """Return the set of canonical skill names found in text."""
        canonical_names: set[str] = set()
        for m in self._regex.finditer(text):
            syn_lower = m.group(0).lower()
            canonical = self._synonym_to_canonical.get(syn_lower)
            if canonical:
                canonical_names.add(canonical)
        return canonical_names


def build_matcher(skills_db: dict) -> SkillMatcher:
    """Build and return a SkillMatcher from a skills_db dict."""
    return SkillMatcher(skills_db)


def extract_skills(text: str, matcher: SkillMatcher) -> set[str]:
    """
    Returns the set of canonical skill names found in the text.
    Both 'ML' and 'Machine Learning' resolve to the canonical entry.
    """
    return matcher.match(text)


def get_all_canonical_skills(skills_db: dict) -> set[str]:
    """Flat set of every canonical skill name across all categories."""
    all_skills: set[str] = set()
    for _category, skills in skills_db.items():
        all_skills.update(skills.keys())
    return all_skills

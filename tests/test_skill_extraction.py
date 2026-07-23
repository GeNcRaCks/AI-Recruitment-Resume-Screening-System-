from src.nlp.skill_extraction import load_skills_db, build_matcher, extract_skills

def test_synonym_normalization():
    skills_db = load_skills_db()
    matcher = build_matcher(skills_db)
    found = extract_skills("Proficient in ML and also NLP, with strong Python skills.", matcher)
    assert "Machine Learning" in found   # from the "ML" synonym
    assert "Natural Language Processing" in found  # from the "NLP" synonym
    assert "Python" in found

def test_no_obvious_false_positive():
    skills_db = load_skills_db()
    matcher = build_matcher(skills_db)
    found = extract_skills("I plan to go to the market and get R&D done.", matcher)
    assert "Golang" not in found
    assert "R Programming" not in found
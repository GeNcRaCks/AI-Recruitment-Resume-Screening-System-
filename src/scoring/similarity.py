import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer, util

def tfidf_similarity(resume_text: str, jd_text: str) -> float:
    """
    Returns a 0-1 lexical similarity score based on shared vocabulary.
    Returns 0.0 (instead of crashing) if either text is empty or contains
    only stopwords/punctuation — both are realistic edge cases given some
    resumes may have failed extraction upstream or be very short.
    """
    if not resume_text.strip() or not jd_text.strip():
        return 0.0

    try:
        vectorizer = TfidfVectorizer(stop_words="english")
        tfidf = vectorizer.fit_transform([resume_text, jd_text])
    except ValueError:
        # "empty vocabulary" — text had no words left after stopword removal
        return 0.0

    score = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]
    if np.isnan(score):
        return 0.0
    return float(score)

_model = SentenceTransformer("all-MiniLM-L6-v2")
_MAX_WORDS_PER_CHUNK = 200   # keeps each chunk within the model's ~256 token limit


def _chunk_text(text: str, max_words: int = _MAX_WORDS_PER_CHUNK) -> list[str]:
    """
    Splits long text into word-count-based chunks. all-MiniLM-L6-v2 silently
    truncates anything beyond ~256 tokens, so a 9,000-character resume would
    otherwise only be judged on its first paragraph. Chunking + averaging
    lets the whole resume contribute to the similarity score.
    """
    words = text.split()
    if not words:
        return [""]
    return [" ".join(words[i:i + max_words]) for i in range(0, len(words), max_words)]


def semantic_similarity(resume_text: str, jd_text: str) -> float:
    if not resume_text.strip() or not jd_text.strip():
        return 0.0

    resume_chunks = _chunk_text(resume_text)
    resume_chunk_embeddings = _model.encode(resume_chunks, convert_to_tensor=True)
    resume_embedding = resume_chunk_embeddings.mean(dim=0)   # average across chunks

    jd_embedding = _model.encode(jd_text, convert_to_tensor=True)

    score = util.cos_sim(resume_embedding, jd_embedding).item()
    return float(score)
"""
Handcrafted and semantic text features for attention prediction.
- Basic: length, word count, punctuation, numbers, caps ratio, sentiment, readability.
- Semantic: sentence-transformers embeddings.
- Hook-style: curiosity gap, listicle, urgency, emotional valence (optional).
TODO: Implement once sentence-transformers and data are available.
"""

def extract_text_features(text: str) -> dict:
    """Extract all text features for one string. Placeholder returns minimal dict."""
    # TODO: add handcrafted + embedding pipeline
    return {"text_length": len(text), "word_count": len(text.split())}

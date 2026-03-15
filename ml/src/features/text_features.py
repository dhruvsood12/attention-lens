"""
Handcrafted and semantic text features for attention prediction.
- Basic: length, word count, punctuation, numbers, caps ratio, sentiment proxy, readability.
- Hook-style: question mark, exclamation, listicle, numbers (optional).
Semantic embeddings (sentence-transformers) can be added later.
"""

from __future__ import annotations

import re
from typing import Optional

import numpy as np


def _safe_len(x: str) -> int:
    return len(x) if x else 0


def _word_count(text: str) -> int:
    return len(text.split()) if text else 0


def _punctuation_counts(text: str) -> dict[str, int]:
    if not text:
        return {"exclamation": 0, "question": 0, "period": 0}
    return {
        "exclamation": text.count("!"),
        "question": text.count("?"),
        "period": text.count("."),
    }


def _has_number(text: str) -> bool:
    return bool(re.search(r"\d", text)) if text else False


def _caps_ratio(text: str) -> float:
    if not text or not text.strip():
        return 0.0
    letters = [c for c in text if c.isalpha()]
    if not letters:
        return 0.0
    return sum(1 for c in letters if c.isupper()) / len(letters)


def _readability_proxy(text: str) -> float:
    """Simple proxy: words per sentence (inverse as rough complexity). Lower = shorter sentences."""
    if not text or not text.strip():
        return 0.0
    sents = re.split(r"[.!?]+", text)
    sents = [s.strip() for s in sents if s.strip()]
    if not sents:
        return 0.0
    words_per_sent = np.mean([_word_count(s) for s in sents])
    return min(float(words_per_sent), 50.0)  # cap for stability


def _listicle_indicator(text: str) -> bool:
    """Rough: starts with digit or contains 'top N' / 'N ways' etc."""
    if not text:
        return False
    t = text.lower().strip()
    if t and t[0].isdigit():
        return True
    return bool(re.search(r"\b(top|best|\d+)\s*(ways|things|reasons|tips)\b", t))


def _curiosity_gap(text: str) -> bool:
    """Rough: question mark or phrases like 'what happened', 'you won't believe'."""
    if not text:
        return False
    t = text.lower()
    if "?" in t:
        return True
    return bool(
        re.search(
            r"\b(what happened|you won't believe|secret|here's what|this is why)\b",
            t,
        )
    )


def extract_text_features(text: str) -> dict[str, float]:
    """
    Extract handcrafted text features for one string.
    Returns a flat dict suitable for pandas DataFrame or model input.
    """
    if not isinstance(text, str):
        text = str(text) if text is not None else ""
    text = text.strip()

    punc = _punctuation_counts(text)
    wc = _word_count(text)

    features = {
        "text_length": float(_safe_len(text)),
        "word_count": float(wc),
        "exclamation_count": float(punc["exclamation"]),
        "question_count": float(punc["question"]),
        "period_count": float(punc["period"]),
        "has_number": 1.0 if _has_number(text) else 0.0,
        "caps_ratio": _caps_ratio(text),
        "words_per_sentence": _readability_proxy(text),
        "listicle": 1.0 if _listicle_indicator(text) else 0.0,
        "curiosity_gap": 1.0 if _curiosity_gap(text) else 0.0,
    }
    return features


def extract_text_features_batch(texts: list[str]) -> list[dict[str, float]]:
    """Extract features for a list of texts."""
    return [extract_text_features(t) for t in texts]

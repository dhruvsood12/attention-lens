"""
End-to-end inference pipeline for the API.
Loads saved model, runs features, predicts score/bucket, builds explanations.
"""

from __future__ import annotations

import os
from typing import Optional, Any

from ..features.text_features import extract_text_features

# Feature order must match train_text_model.FEATURE_ORDER
FEATURE_ORDER = [
    "text_length",
    "word_count",
    "exclamation_count",
    "question_count",
    "period_count",
    "has_number",
    "caps_ratio",
    "words_per_sentence",
    "listicle",
    "curiosity_gap",
]

BINS = [0, 40, 65, 100]
BUCKET_LABELS = ["low", "medium", "high"]


def _score_to_bucket(score: float) -> str:
    score = max(0, min(100, score))
    if score < 40:
        return "low"
    if score < 65:
        return "medium"
    return "high"


def _load_artifact(path: str) -> dict:
    import joblib
    if not os.path.isfile(path):
        raise FileNotFoundError(f"Model not found: {path}")
    return joblib.load(path)


def _feature_vector(features: dict) -> list[float]:
    return [features.get(k, 0.0) for k in FEATURE_ORDER]


def _explanations_from_importance(
    feature_importance: dict[str, float],
    feature_values: dict[str, float],
    score: float,
) -> list[dict[str, Any]]:
    """Build human-readable explanations from feature importance and current values."""
    out = []
    bucket = _score_to_bucket(score)
    # Length
    length = feature_values.get("text_length", 0)
    if length > 80:
        out.append({
            "factor": "length",
            "direction": "negative",
            "description": "Title may be too long for quick scanning.",
            "impact": -0.1,
        })
    elif 20 <= length <= 70:
        out.append({
            "factor": "length",
            "direction": "positive",
            "description": "Length is in an attention-friendly range.",
            "impact": 0.05,
        })
    elif length < 20 and length > 0:
        out.append({
            "factor": "length",
            "direction": "neutral",
            "description": "Short titles can work but may lack specificity.",
            "impact": 0.0,
        })
    if feature_values.get("question_count", 0) >= 1:
        out.append({
            "factor": "curiosity",
            "direction": "positive",
            "description": "Question-based framing can increase curiosity.",
            "impact": 0.08,
        })
    if feature_values.get("has_number", 0) >= 1:
        out.append({
            "factor": "specificity",
            "direction": "positive",
            "description": "Numbers can add specificity and credibility.",
            "impact": 0.05,
        })
    if feature_values.get("listicle", 0) >= 1:
        out.append({
            "factor": "format",
            "direction": "positive",
            "description": "List-style titles often perform well.",
            "impact": 0.05,
        })
    if not out:
        out.append({
            "factor": "content",
            "direction": "neutral",
            "description": "Analysis based on text features.",
            "impact": 0.0,
        })
    return out


def _recommendations(text: str, features: dict, score: float) -> list[dict[str, str]]:
    recs = []
    if features.get("text_length", 0) > 80:
        recs.append({
            "type": "length",
            "message": "Consider shortening to under 60 characters for better scanability.",
            "priority": "high",
        })
    if features.get("has_number", 0) < 1 and text:
        recs.append({
            "type": "specificity",
            "message": "Adding a number or statistic can increase perceived value.",
            "priority": "medium",
        })
    if not recs:
        recs.append({
            "type": "general",
            "message": "Try A/B testing this against another variant to see what resonates.",
            "priority": "low",
        })
    return recs


def run_text_pipeline(
    text: str,
    model_path: str,
    platform: Optional[str] = None,
) -> dict[str, Any]:
    """
    Preprocess text -> features -> model -> response dict.
    Returns keys: score, bucket, confidence, explanations, recommendations, model_used, feature_summary.
    """
    artifact = _load_artifact(model_path)
    model = artifact["model"]
    feature_order = artifact.get("feature_order", FEATURE_ORDER)

    feats = extract_text_features(text or "")
    vec = [feats.get(k, 0.0) for k in feature_order]
    import numpy as np
    X = np.array([vec], dtype=np.float64)
    score = float(model.predict(X)[0])
    score = max(0.0, min(100.0, round(score, 1)))

    bucket = _score_to_bucket(score)
    # Confidence from model uncertainty proxy: use inverse of predicted variance if available, else fixed
    try:
        preds = model.predict(X)
        confidence = 0.75  # placeholder; could use ensemble std or calibration
    except Exception:
        confidence = 0.7
    confidence = round(min(0.95, max(0.5, confidence)), 2)

    importance = {}
    if hasattr(model, "feature_importances_"):
        for i, name in enumerate(feature_order):
            if i < len(model.feature_importances_):
                importance[name] = float(model.feature_importances_[i])
    explanations = _explanations_from_importance(importance, feats, score)
    recommendations = _recommendations(text, feats, score)

    return {
        "score": score,
        "bucket": bucket,
        "confidence": confidence,
        "explanations": explanations,
        "recommendations": recommendations,
        "model_used": "text_baseline",
        "feature_summary": feats,
    }


def run_multimodal_pipeline(
    text: str,
    image_input: Any,
    model_path: str,
    platform: Optional[str] = None,
) -> dict[str, Any]:
    """Multimodal: not implemented yet; falls back to text-only if text provided."""
    if text and os.path.isfile(model_path.replace("multimodal", "text")):
        return run_text_pipeline(text, model_path.replace("multimodal", "text"), platform)
    raise NotImplementedError("Multimodal model not yet implemented.")

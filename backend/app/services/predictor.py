"""
Prediction service: mock implementation for MVP; swap for real ML pipeline later.
"""

from __future__ import annotations

import random
from typing import Optional
from app.schemas.predict import (
    PredictionResponse,
    ExplanationItem,
    RecommendationItem,
)
from app.schemas.compare import CompareResponse, RankedCandidate
from app.core.config import settings


MOCK_MODEL_NAME = "mock_baseline"


def _mock_score() -> float:
    """Return a plausible score for demo (slight bias toward mid-high)."""
    return round(random.uniform(35, 82), 1)


def _mock_confidence() -> float:
    return round(random.uniform(0.6, 0.95), 2)


def _mock_bucket(score: float) -> str:
    if score < 40:
        return "low"
    if score < 65:
        return "medium"
    return "high"


def _mock_explanations(text: Optional[str], has_image: bool) -> list[ExplanationItem]:
    """Generate plausible heuristic-style explanations from input."""
    explanations: list[ExplanationItem] = []
    if text:
        n = len(text)
        if n > 80:
            explanations.append(ExplanationItem(
                factor="length",
                direction="negative",
                description="Title may be too long for quick scanning.",
                impact=-0.1,
            ))
        elif n < 20:
            explanations.append(ExplanationItem(
                factor="length",
                direction="neutral",
                description="Short titles can work but may lack specificity.",
                impact=0.0,
            ))
        else:
            explanations.append(ExplanationItem(
                factor="length",
                direction="positive",
                description="Length is in a typical attention-friendly range.",
                impact=0.05,
            ))
        if "?" in text:
            explanations.append(ExplanationItem(
                factor="curiosity",
                direction="positive",
                description="Question-based framing can increase curiosity.",
                impact=0.08,
            ))
        if any(c.isdigit() for c in text):
            explanations.append(ExplanationItem(
                factor="specificity",
                direction="positive",
                description="Numbers can add specificity and credibility.",
                impact=0.05,
            ))
    if has_image:
        explanations.append(ExplanationItem(
            factor="thumbnail",
            direction="positive",
            description="Thumbnail provided; visual hook will be used in full model.",
            impact=0.05,
        ))
    if not explanations:
        explanations.append(ExplanationItem(
            factor="input",
            direction="neutral",
            description="Analysis based on available features.",
            impact=0.0,
        ))
    return explanations


def _mock_recommendations(text: Optional[str]) -> list[RecommendationItem]:
    recs: list[RecommendationItem] = []
    if text:
        if len(text) > 80:
            recs.append(RecommendationItem(
                type="length",
                message="Consider shortening to under 60 characters for better scanability.",
                priority="high",
            ))
        if not any(c.isdigit() for c in text):
            recs.append(RecommendationItem(
                type="specificity",
                message="Adding a number or statistic can increase perceived value.",
                priority="medium",
            ))
    if not recs:
        recs.append(RecommendationItem(
            type="general",
            message="Try A/B testing this against another variant to see what resonates.",
            priority="low",
        ))
    return recs


def predict_text(text: str, platform: Optional[str] = None, content_type: Optional[str] = None) -> PredictionResponse:
    """Run text-only prediction (mock)."""
    score = _mock_score()
    return PredictionResponse(
        score=score,
        bucket=_mock_bucket(score),
        confidence=_mock_confidence(),
        explanations=_mock_explanations(text, False),
        recommendations=_mock_recommendations(text),
        model_used=MOCK_MODEL_NAME,
        feature_summary={"text_length": len(text), "word_count": len(text.split())} if text else None,
    )


def predict_image(
    image_base64: Optional[str] = None,
    image_url: Optional[str] = None,
    platform: Optional[str] = None,
    content_type: Optional[str] = None,
) -> PredictionResponse:
    """Run image-only prediction (mock)."""
    has_image = bool(image_base64 or image_url)
    score = _mock_score()
    explanations = [
        ExplanationItem(
            factor="thumbnail",
            direction="positive" if has_image else "neutral",
            description="Thumbnail analysis will use CLIP and visual stats in full pipeline.",
            impact=0.05,
        )
    ]
    return PredictionResponse(
        score=score,
        bucket=_mock_bucket(score),
        confidence=_mock_confidence(),
        explanations=explanations,
        recommendations=[
            RecommendationItem(
                type="visual",
                message="Ensure strong contrast and a clear focal point.",
                priority="medium",
            )
        ],
        model_used=MOCK_MODEL_NAME,
        feature_summary={"has_image": has_image},
    )


def predict_multimodal(
    text: str,
    image_base64: Optional[str] = None,
    image_url: Optional[str] = None,
    platform: Optional[str] = None,
    content_type: Optional[str] = None,
) -> PredictionResponse:
    """Run combined text + image prediction (mock)."""
    has_image = bool(image_base64 or image_url)
    score = _mock_score()
    return PredictionResponse(
        score=score,
        bucket=_mock_bucket(score),
        confidence=_mock_confidence(),
        explanations=_mock_explanations(text, has_image),
        recommendations=_mock_recommendations(text),
        model_used=MOCK_MODEL_NAME,
        feature_summary={
            "text_length": len(text),
            "has_image": has_image,
        },
    )


def compare_candidates(
    candidates: list[dict],
    platform: Optional[str] = None,
    content_type: Optional[str] = None,
) -> CompareResponse:
    """Rank candidates by predicted attention (mock)."""
    results: list[tuple[float, str, float, list, list]] = []
    for c in candidates:
        text = c.get("text") or ""
        has_image = bool(c.get("image_base64") or c.get("image_url"))
        score = _mock_score()
        bucket = _mock_bucket(score)
        conf = _mock_confidence()
        expl = _mock_explanations(text, has_image)
        recs = _mock_recommendations(text)
        results.append((score, bucket, conf, expl, recs))

    # Sort by score descending and assign ranks
    indexed = list(enumerate(results))
    indexed.sort(key=lambda x: x[1][0], reverse=True)
    ranked: list[RankedCandidate] = []
    for rank, (idx, (score, bucket, conf, expl, recs)) in enumerate(indexed, start=1):
        ranked.append(RankedCandidate(
            id=candidates[idx].get("id", str(idx)),
            rank=rank,
            score=score,
            bucket=bucket,
            confidence=conf,
            explanations=expl,
            recommendations=recs,
        ))
    return CompareResponse(
        ranked=ranked,
        model_used=MOCK_MODEL_NAME,
        summary="Candidates ranked by predicted attention potential (mock).",
    )

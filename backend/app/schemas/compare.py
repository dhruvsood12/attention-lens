"""Schemas for candidate comparison (e.g. multiple titles)."""

from typing import Optional
from pydantic import BaseModel, Field

from app.schemas.predict import ExplanationItem, RecommendationItem


class CompareCandidate(BaseModel):
    """One candidate in a comparison (e.g. one title or one thumbnail)."""
    id: str = Field(..., description="Client-provided id for this candidate")
    text: Optional[str] = None
    image_base64: Optional[str] = None
    image_url: Optional[str] = None


class CompareRequest(BaseModel):
    """Request to compare multiple candidates."""
    candidates: list[CompareCandidate] = Field(..., min_length=2, max_length=10)
    platform: Optional[str] = None
    content_type: Optional[str] = Field(None, description="e.g. title, thumbnail")


class RankedCandidate(BaseModel):
    """One candidate with its prediction and rank."""
    id: str
    rank: int
    score: float
    bucket: str
    confidence: float
    explanations: list[ExplanationItem] = Field(default_factory=list)
    recommendations: list[RecommendationItem] = Field(default_factory=list)


class CompareResponse(BaseModel):
    """Ranked list of candidates by predicted attention."""
    ranked: list[RankedCandidate]
    model_used: str
    # Optional: pairwise or top-choice explanation
    summary: Optional[str] = None

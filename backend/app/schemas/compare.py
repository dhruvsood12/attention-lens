"""Schemas for candidate comparison (e.g. multiple titles)."""

from typing import Optional
from pydantic import BaseModel, Field, model_validator
from pydantic.networks import HttpUrl

from app.schemas.predict import ExplanationItem, RecommendationItem


class CompareCandidate(BaseModel):
    """One candidate in a comparison (e.g. one title or one thumbnail)."""
    id: str = Field(..., description="Client-provided id for this candidate")
    text: Optional[str] = None
    image_base64: Optional[str] = Field(None, max_length=5_000_000)
    image_url: Optional[HttpUrl] = None

    @model_validator(mode="after")
    def validate_candidate(self):
        if not (self.text or self.image_base64 or self.image_url):
            raise ValueError("Candidate must include at least one of: text, image_base64, image_url.")
        if self.image_base64 and self.image_url:
            raise ValueError("Provide at most one of image_base64 or image_url per candidate.")
        if self.image_base64 and (not self.image_base64.startswith("data:image/") or ";base64," not in self.image_base64):
            raise ValueError("image_base64 must be a valid image data URL.")
        return self


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

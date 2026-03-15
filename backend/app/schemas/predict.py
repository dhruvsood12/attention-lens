"""Request/response schemas for prediction endpoints."""

from typing import Optional
from pydantic import BaseModel, Field


# --- Request bodies ---

class PredictTextRequest(BaseModel):
    """Text-only prediction (headline, caption, title)."""
    text: str = Field(..., min_length=1, max_length=10_000, description="Headline, caption, or title")
    platform: Optional[str] = Field(None, description="e.g. youtube, twitter, reddit, article")
    content_type: Optional[str] = Field(None, description="e.g. title, caption, headline")


class PredictImageRequest(BaseModel):
    """Image-only prediction (thumbnail). Base64 or URL in actual implementation."""
    # For MVP we accept base64 data URL from frontend
    image_base64: Optional[str] = Field(None, description="Base64-encoded image data URL")
    image_url: Optional[str] = Field(None, description="URL to image (if supported)")
    platform: Optional[str] = Field(None, description="e.g. youtube")
    content_type: Optional[str] = Field(None, description="e.g. thumbnail")


class PredictMultimodalRequest(BaseModel):
    """Combined text + image prediction."""
    text: str = Field(..., min_length=1, max_length=10_000)
    image_base64: Optional[str] = None
    image_url: Optional[str] = None
    platform: Optional[str] = None
    content_type: Optional[str] = None


# --- Shared response components ---

class ExplanationItem(BaseModel):
    """One driver of attention (positive or negative)."""
    factor: str
    direction: str = Field(..., description="positive | negative | neutral")
    description: str
    impact: Optional[float] = Field(None, description="Relative impact if available")


class RecommendationItem(BaseModel):
    """One improvement suggestion."""
    type: str = Field(..., description="e.g. length, specificity, emotion")
    message: str
    priority: str = Field("medium", description="low | medium | high")


class PredictionResponse(BaseModel):
    """Unified prediction response for text, image, or multimodal."""
    score: float = Field(..., ge=0, le=100, description="Predicted attention score 0–100")
    bucket: str = Field(..., description="low | medium | high")
    confidence: float = Field(..., ge=0, le=1)
    explanations: list[ExplanationItem] = Field(default_factory=list)
    recommendations: list[RecommendationItem] = Field(default_factory=list)
    model_used: str = Field(..., description="e.g. text_baseline, mock")
    # Optional: raw feature summary for debugging or advanced UI
    feature_summary: Optional[dict] = None

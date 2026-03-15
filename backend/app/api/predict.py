from fastapi import APIRouter, HTTPException

from app.schemas import (
    PredictTextRequest,
    PredictImageRequest,
    PredictMultimodalRequest,
    PredictionResponse,
)
from app.services.predictor import predict_text, predict_image, predict_multimodal
from app.core.config import settings

router = APIRouter()


@router.post("/text", response_model=PredictionResponse)
def post_predict_text(body: PredictTextRequest) -> PredictionResponse:
    """Predict attention potential for a text-only input (headline, caption, title)."""
    return predict_text(
        text=body.text,
        platform=body.platform,
        content_type=body.content_type,
    )


@router.post("/image", response_model=PredictionResponse)
def post_predict_image(body: PredictImageRequest) -> PredictionResponse:
    """Predict attention potential for an image-only input (e.g. thumbnail)."""
    return predict_image(
        image_base64=body.image_base64,
        image_url=body.image_url,
        platform=body.platform,
        content_type=body.content_type,
    )


@router.post("/multimodal", response_model=PredictionResponse)
def post_predict_multimodal(body: PredictMultimodalRequest) -> PredictionResponse:
    """Predict attention potential for combined text + image."""
    return predict_multimodal(
        text=body.text,
        image_base64=body.image_base64,
        image_url=body.image_url,
        platform=body.platform,
        content_type=body.content_type,
    )

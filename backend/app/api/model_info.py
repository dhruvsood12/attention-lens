from fastapi import APIRouter
from app.core.config import settings

router = APIRouter()


@router.get("/info")
def model_info():
    """Return current model configuration (which models are loaded, mock vs real)."""
    return {
        "mock": settings.use_mock_predictor,
        "models": {
            "text": settings.model_text_path,
            "image": settings.model_image_path,
            "multimodal": settings.model_multimodal_path,
        },
        "description": "AttentionLens prediction models (mock baseline when mock=True).",
    }

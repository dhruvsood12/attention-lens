from fastapi import APIRouter
from app.core.config import settings
import os

router = APIRouter()


@router.get("/info")
def model_info():
    """Return current model configuration (which models are loaded, mock vs real)."""
    # Avoid leaking filesystem paths. Only report whether artifacts appear present.
    def exists(p: str) -> bool:
        if os.path.isabs(p):
            return os.path.isfile(p)
        return os.path.isfile(os.path.join(os.path.dirname(__file__), "..", "..", "..", p))

    return {
        "mock": settings.use_mock_predictor,
        "models": {
            "text_available": exists(settings.model_text_path),
            "image_available": exists(settings.model_image_path),
            "multimodal_available": exists(settings.model_multimodal_path),
        },
        "description": "AttentionLens prediction models (mock baseline when mock=True).",
    }

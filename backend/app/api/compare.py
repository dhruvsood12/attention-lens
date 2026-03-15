from fastapi import APIRouter

from app.schemas import CompareRequest, CompareResponse
from app.services.predictor import compare_candidates

router = APIRouter()


@router.post("", response_model=CompareResponse)
def post_compare(body: CompareRequest) -> CompareResponse:
    """Compare multiple candidates (e.g. titles or thumbnails) and return ranked list."""
    candidates = [
        {
            "id": c.id,
            "text": c.text,
            "image_base64": c.image_base64,
            "image_url": c.image_url,
        }
        for c in body.candidates
    ]
    return compare_candidates(
        candidates=candidates,
        platform=body.platform,
        content_type=body.content_type,
    )

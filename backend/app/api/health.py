from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
def health():
    """Liveness/readiness for deployment and local dev."""
    return {"status": "ok", "service": "AttentionLens API"}

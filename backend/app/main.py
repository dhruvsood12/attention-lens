"""
AttentionLens API — entry point.
Multimodal attention prediction for content before you post.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import health, predict, compare, model_info
from app.core.config import settings

app = FastAPI(
    title="AttentionLens API",
    description="Predict content attention potential from text, images, or both.",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, tags=["Health"])
app.include_router(predict.router, prefix="/predict", tags=["Prediction"])
app.include_router(compare.router, prefix="/compare", tags=["Comparison"])
app.include_router(model_info.router, prefix="/model", tags=["Model Info"])


@app.get("/")
def root():
    """Root redirect to docs."""
    return {"service": "AttentionLens API", "docs": "/docs"}

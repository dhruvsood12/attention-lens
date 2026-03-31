"""
AttentionLens API — entry point.
Multimodal attention prediction for content before you post.
"""

import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.api import health, predict, compare, model_info
from app.core.config import settings
from app.core.middleware import BodySizeLimitMiddleware, InMemoryRateLimitMiddleware
from app.core.observability import RequestIdMiddleware, configure_logging

configure_logging(settings.log_level)
logger = logging.getLogger("attentionlens.api")

app = FastAPI(
    title="AttentionLens API",
    description="Predict content attention potential from text, images, or both.",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(RequestIdMiddleware)
app.add_middleware(BodySizeLimitMiddleware, max_bytes=settings.max_request_body_bytes)
app.add_middleware(
    InMemoryRateLimitMiddleware,
    requests_per_window=settings.rate_limit_requests,
    window_seconds=settings.rate_limit_window_seconds,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=settings.cors_allow_credentials,
    allow_methods=settings.cors_allow_methods,
    allow_headers=settings.cors_allow_headers,
)

app.include_router(health.router, tags=["Health"])
app.include_router(predict.router, prefix="/predict", tags=["Prediction"])
app.include_router(compare.router, prefix="/compare", tags=["Comparison"])
app.include_router(model_info.router, prefix="/model", tags=["Model Info"])

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    # Return consistent envelope while preserving FastAPI validation details.
    details = exc.errors()
    # Ensure details are JSON-serializable (FastAPI may include raw exception objects in ctx)
    for err in details:
        ctx = err.get("ctx")
        if isinstance(ctx, dict):
            for k, v in list(ctx.items()):
                if not isinstance(v, (str, int, float, bool, type(None), list, dict)):
                    ctx[k] = str(v)
    return JSONResponse(
        status_code=422,
        content={
            "error": "validation_error",
            "message": "Request validation failed.",
            "details": details,
        },
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled exception")
    return JSONResponse(
        status_code=500,
        content={"error": "internal_error", "message": "Unexpected server error."},
    )


@app.get("/")
def root():
    """Root redirect to docs."""
    return {"service": "AttentionLens API", "docs": "/docs"}

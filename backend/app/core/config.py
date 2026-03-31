"""Application configuration via environment variables."""

from __future__ import annotations

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Load from env; .env in repo root is loaded when running from backend/ or root."""

    environment: str = "dev"  # dev | prod

    api_host: str = "0.0.0.0"
    api_port: int = 8000
    log_level: str = "info"

    # Model paths (used when mock is disabled)
    model_text_path: str = "ml/saved_models/text_baseline.joblib"
    model_image_path: str = "ml/saved_models/image_baseline.joblib"
    model_multimodal_path: str = "ml/saved_models/multimodal_baseline.joblib"

    # When True, prediction endpoints return mock data without loading ML models
    use_mock_predictor: bool = True

    cors_origins: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    cors_allow_credentials: bool = False
    cors_allow_methods: list[str] = ["GET", "POST"]
    cors_allow_headers: list[str] = ["Content-Type"]

    # Abuse / DoS guards (NOTE: in-memory limits are per-process; use a gateway for real production scale)
    max_request_body_bytes: int = 2_500_000  # ~2.5MB (base64 inflates vs raw)
    rate_limit_requests: int = 60
    rate_limit_window_seconds: int = 60

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

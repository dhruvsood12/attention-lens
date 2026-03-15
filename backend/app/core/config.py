"""Application configuration via environment variables."""

from __future__ import annotations

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Load from env; .env in repo root is loaded when running from backend/ or root."""

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

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

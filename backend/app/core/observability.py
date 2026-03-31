"""
Observability utilities: request IDs and basic logging config.

Goal: make debugging and audits possible without adding heavy infra.
"""

from __future__ import annotations

import contextvars
import logging
import uuid

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware


request_id_var: contextvars.ContextVar[str] = contextvars.ContextVar("request_id", default="-")


class RequestIdFilter(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        record.request_id = request_id_var.get("-")
        return True


def configure_logging(level: str = "info") -> None:
    """
    Configure standard library logging for the app.
    Uvicorn has its own loggers; we ensure our app logs include request_id.
    """
    lvl = getattr(logging, level.upper(), logging.INFO)
    root = logging.getLogger()
    root.setLevel(lvl)

    # If handlers already exist (e.g. uvicorn), just attach the filter.
    for h in root.handlers:
        h.addFilter(RequestIdFilter())

    if not root.handlers:
        handler = logging.StreamHandler()
        handler.addFilter(RequestIdFilter())
        formatter = logging.Formatter(
            fmt="%(asctime)s %(levelname)s [%(name)s] request_id=%(request_id)s %(message)s"
        )
        handler.setFormatter(formatter)
        root.addHandler(handler)


class RequestIdMiddleware(BaseHTTPMiddleware):
    """Attach a request ID to logs and responses."""

    async def dispatch(self, request: Request, call_next):
        rid = request.headers.get("x-request-id") or str(uuid.uuid4())
        token = request_id_var.set(rid)
        try:
            response = await call_next(request)
            response.headers["X-Request-Id"] = rid
            return response
        finally:
            request_id_var.reset(token)


"""
Shared FastAPI middleware for basic security and abuse controls.

These are pragmatic demo-safe controls. For production, enforce limits at a reverse proxy/API gateway too.
"""

from __future__ import annotations

import time
from collections import deque
from typing import Deque, Dict, Tuple

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse


class BodySizeLimitMiddleware(BaseHTTPMiddleware):
    """Reject requests with Content-Length above a configured limit."""

    def __init__(self, app, max_bytes: int):
        super().__init__(app)
        self.max_bytes = max(0, int(max_bytes))

    async def dispatch(self, request: Request, call_next):
        if self.max_bytes <= 0:
            return await call_next(request)

        # Prefer Content-Length when present (cheap). This won't catch chunked bodies;
        # still worth having as a baseline guard.
        content_length = request.headers.get("content-length")
        if content_length is not None:
            try:
                if int(content_length) > self.max_bytes:
                    return JSONResponse(
                        status_code=413,
                        content={
                            "error": "payload_too_large",
                            "message": f"Request body exceeds {self.max_bytes} bytes.",
                        },
                    )
            except ValueError:
                # malformed content-length; treat as suspicious
                return JSONResponse(
                    status_code=400,
                    content={"error": "bad_request", "message": "Invalid Content-Length header."},
                )

        return await call_next(request)


class InMemoryRateLimitMiddleware(BaseHTTPMiddleware):
    """
    Simple in-memory sliding-window rate limiter.

    - Keyed by (client_ip, route_prefix) to keep it coarse and low-overhead.
    - Per-process only (not shared across replicas).
    """

    def __init__(
        self,
        app,
        requests_per_window: int,
        window_seconds: int,
        protected_prefixes: Tuple[str, ...] = ("/predict", "/compare"),
    ):
        super().__init__(app)
        self.requests_per_window = max(1, int(requests_per_window))
        self.window_seconds = max(1, int(window_seconds))
        self.protected_prefixes = protected_prefixes
        self._hits: Dict[Tuple[str, str], Deque[float]] = {}

    def _client_ip(self, request: Request) -> str:
        # NOTE: behind a proxy you’d trust X-Forwarded-For after configuring proxy headers.
        return request.client.host if request.client else "unknown"

    def _route_bucket(self, path: str) -> str:
        for p in self.protected_prefixes:
            if path.startswith(p):
                return p
        return ""

    async def dispatch(self, request: Request, call_next):
        bucket = self._route_bucket(request.url.path)
        if not bucket:
            return await call_next(request)

        ip = self._client_ip(request)
        key = (ip, bucket)
        now = time.time()
        window_start = now - self.window_seconds

        q = self._hits.get(key)
        if q is None:
            q = deque()
            self._hits[key] = q

        while q and q[0] < window_start:
            q.popleft()

        if len(q) >= self.requests_per_window:
            return JSONResponse(
                status_code=429,
                content={
                    "error": "rate_limited",
                    "message": "Too many requests. Please wait and try again.",
                    "retry_after_seconds": self.window_seconds,
                },
                headers={"Retry-After": str(self.window_seconds)},
            )

        q.append(now)
        return await call_next(request)


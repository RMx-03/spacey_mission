import time
import uuid
from typing import Callable

import structlog
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response


logger = structlog.get_logger(__name__)


class RequestIdLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Callable):
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        start = time.perf_counter()
        try:
            response: Response = await call_next(request)
        except Exception as exc:
            duration_ms = (time.perf_counter() - start) * 1000
            logger.exception(
                "http.error",
                method=request.method,
                path=request.url.path,
                request_id=request_id,
                duration_ms=duration_ms,
            )
            raise
        duration_ms = (time.perf_counter() - start) * 1000
        response.headers["X-Request-ID"] = request_id
        logger.info(
            "http.request",
            method=request.method,
            path=request.url.path,
            status_code=response.status_code,
            request_id=request_id,
            duration_ms=duration_ms,
        )
        return response



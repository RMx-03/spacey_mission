from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
import structlog


logger = structlog.get_logger(__name__)


async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    payload = {
        "error": {
            "type": "http_error",
            "status_code": exc.status_code,
            "detail": exc.detail,
        }
    }
    return JSONResponse(status_code=exc.status_code, content=payload)


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    payload = {
        "error": {
            "type": "validation_error",
            "status_code": 422,
            "detail": exc.errors(),
        }
    }
    return JSONResponse(status_code=422, content=payload)


async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("server.error", path=str(request.url), method=request.method)
    payload = {
        "error": {
            "type": "internal_server_error",
            "status_code": 500,
            "detail": "Internal server error",
        }
    }
    return JSONResponse(status_code=500, content=payload)



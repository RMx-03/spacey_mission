from contextlib import asynccontextmanager
from typing import AsyncIterator

import structlog
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator

from app.core.config import get_settings
from app.core.logging import configure_structlog
from app.core.middleware import RequestIdLoggingMiddleware
from app.core.errors import http_exception_handler, validation_exception_handler, unhandled_exception_handler
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.core.observability import init_observability
from app.api.routes.health import router as health_router
from app.api.routes.auth import router as auth_router
from app.api.routes.lessons import router as lessons_router
from app.api.routes.chat import router as chat_router
from app.api.routes.documents import router as documents_router
from app.api.routes.admin import router as admin_router
from app.api.routes.ws import router as ws_router


logger = structlog.get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    configure_structlog()
    init_observability()
    settings = get_settings()
    logger.info("app.start", env=settings.app_env, name=settings.app_name)
    try:
        if settings.prometheus_enabled:
            Instrumentator().instrument(app).expose(app)
        yield
    finally:
        logger.info("app.stop")


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title=settings.app_name,
        version="0.1.0",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health_router)
    app.include_router(auth_router, prefix="/auth")
    app.include_router(lessons_router, prefix="/v1")
    app.include_router(chat_router, prefix="/v1")
    app.include_router(documents_router, prefix="/v1")
    app.include_router(admin_router, prefix="/admin")
    app.include_router(ws_router, prefix="/v1")
    app.add_middleware(RequestIdLoggingMiddleware)
    # Exception handlers
    app.add_exception_handler(Exception, unhandled_exception_handler)
    app.add_exception_handler(StarletteHTTPException, http_exception_handler)  # type: ignore[name-defined]
    app.add_exception_handler(RequestValidationError, validation_exception_handler)  # type: ignore[name-defined]
    return app


app = create_app()



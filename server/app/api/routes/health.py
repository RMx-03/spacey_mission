from fastapi import APIRouter
from app.core.config import get_settings


router = APIRouter()


@router.get("/health")
async def health():
    settings = get_settings()
    return {
        "status": "ok",
        "name": settings.app_name,
        "env": settings.app_env,
    }



from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import get_settings
from app.core.redis_client import redis_ping
from app.core.rate_limit import rate_limit_ip
from app.db.session import get_db


router = APIRouter()


@router.get("/health", dependencies=[Depends(rate_limit_ip(120, 60))])
async def health(db: AsyncSession = Depends(get_db)):
    settings = get_settings()
    db_ok = True
    try:
        await db.execute(text("SELECT 1"))
    except Exception:
        db_ok = False

    redis_ok = await redis_ping()
    overall = "ok" if (db_ok and redis_ok) else "degraded"
    return {
        "status": overall,
        "name": settings.app_name,
        "env": settings.app_env,
        "checks": {
            "database": "ok" if db_ok else "error",
            "redis": "ok" if redis_ok else "error",
        },
    }



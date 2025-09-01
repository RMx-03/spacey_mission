from typing import AsyncIterator

from redis import asyncio as aioredis

from app.core.config import get_settings


_redis: aioredis.Redis | None = None


def get_redis() -> aioredis.Redis:
    global _redis
    if _redis is None:
        settings = get_settings()
        _redis = aioredis.from_url(settings.redis_url, encoding="utf-8", decode_responses=True)
    return _redis


async def redis_ping() -> bool:
    try:
        client = get_redis()
        pong = await client.ping()
        return bool(pong)
    except Exception:
        return False



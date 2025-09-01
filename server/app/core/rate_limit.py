from datetime import timedelta
from typing import Callable

from fastapi import Depends, HTTPException, status

from app.core.redis_client import get_redis
from app.core.security import get_current_user_claims
from fastapi import Request


def rate_limit(limit: int, window_seconds: int) -> Callable:
    async def dependency(claims: dict = Depends(get_current_user_claims)) -> None:
        uid = claims.get("uid", "anonymous")
        key = f"rl:{uid}:{window_seconds}"
        redis = get_redis()
        # Use atomic INCR with expiry
        count = await redis.incr(key)
        if count == 1:
            await redis.expire(key, window_seconds)
        if count > limit:
            ttl = await redis.ttl(key)
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail={"message": "Rate limit exceeded", "retry_after": max(ttl, 0)},
            )

    return dependency


def rate_limit_ip(limit: int, window_seconds: int) -> Callable:
    async def dependency(request: Request) -> None:
        client_ip = request.client.host if request.client else "unknown"
        key = f"rlip:{client_ip}:{window_seconds}"
        redis = get_redis()
        count = await redis.incr(key)
        if count == 1:
            await redis.expire(key, window_seconds)
        if count > limit:
            ttl = await redis.ttl(key)
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail={"message": "IP rate limit exceeded", "retry_after": max(ttl, 0)},
            )

    return dependency



import asyncio
import httpx


async def test_health_running():
    async with httpx.AsyncClient(base_url="http://localhost:8000") as client:
        r = await client.get("/health")
        assert r.status_code == 200
        data = r.json()
        assert data.get("status") == "ok"



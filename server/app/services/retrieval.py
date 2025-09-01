from typing import List, Tuple

from sqlalchemy import text, bindparam
from sqlalchemy.ext.asyncio import AsyncSession
from pgvector.sqlalchemy import Vector

from app.services.llm import embed


async def search_chunks(db: AsyncSession, query: str, top_k: int = 5) -> List[Tuple[str, float]]:
    vectors = embed([query])
    q = vectors[0]
    stmt = (
        text(
            """
            SELECT id, text, 1 - (embedding <#> :q) AS score
            FROM document_chunks
            ORDER BY embedding <#> :q
            LIMIT :k
            """
        )
        .bindparams(bindparam("q", value=q, type_=Vector(3072)))
        .bindparams(bindparam("k", value=top_k))
    )
    rows = await db.execute(stmt)
    results: List[Tuple[str, float]] = []
    for row in rows:
        # row: (id, text, score)
        results.append((row[1], float(row[2])))
    return results



from app.celery_app import celery_app
from app.core.config import get_settings
from app.db.session import AsyncSessionLocal
from app.db.models import Document, DocumentChunk
from app.services.llm import embed


def _chunk_text(text: str, max_tokens: int = 800) -> list[str]:
    # naive splitter by sentences length; improve as needed
    sentences = [s.strip() for s in text.split(".") if s.strip()]
    chunks: list[str] = []
    current: list[str] = []
    count = 0
    for s in sentences:
        length = max(1, len(s.split()))
        if count + length > max_tokens and current:
            chunks.append(". ".join(current))
            current = [s]
            count = length
        else:
            current.append(s)
            count += length
    if current:
        chunks.append(". ".join(current))
    return chunks


@celery_app.task(name="tasks.ingest.index_document")
def index_document(document_id: str, text: str, title: str = "", source_url: str | None = None) -> dict:
    chunks = _chunk_text(text)
    vectors = embed(chunks)
    settings = get_settings()
    # Do DB writes in a short-lived async session
    import asyncio
    import uuid

    async def _write():
        async with AsyncSessionLocal() as db:
            doc = Document(id=uuid.UUID(document_id), title=title or "Untitled", source_url=source_url)
            db.add(doc)
            for i, (chunk, vec) in enumerate(zip(chunks, vectors)):
                db.add(DocumentChunk(document_id=uuid.UUID(document_id), chunk_index=i, text=chunk, embedding=vec))
            await db.commit()

    asyncio.run(_write())
    return {"document_id": document_id, "status": "indexed", "chunks": len(chunks)}



from uuid import uuid4
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.security import get_current_user_claims
from app.tasks.ingest import index_document
from app.db.session import get_db
from app.db.models import Document


router = APIRouter()


class DocumentIngestRequest(BaseModel):
    title: str
    text: str
    source_url: str | None = None


@router.post("/documents/ingest")
async def ingest_document(payload: DocumentIngestRequest, claims: dict = Depends(get_current_user_claims)):
    document_id = str(uuid4())
    index_document.delay(document_id=document_id, text=payload.text, title=payload.title, source_url=payload.source_url)
    return {"document_id": document_id, "status": "queued"}


@router.get("/documents")
async def list_documents(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Document).order_by(Document.created_at.desc()).limit(100))
    docs = result.scalars().all()
    return [
        {"id": str(d.id), "title": d.title, "source_url": d.source_url, "created_at": d.created_at.isoformat()}
        for d in docs
    ]


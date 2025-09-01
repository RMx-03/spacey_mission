from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete

from app.core.security import get_current_user_claims
from app.db.session import get_db
from app.db.models import Document


router = APIRouter()


def admin_required(claims: dict = Depends(get_current_user_claims)):
    if not claims.get("admin", False) and "admin" not in claims.get("roles", []):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return claims


@router.get("/documents")
async def admin_list_documents(db: AsyncSession = Depends(get_db), _: dict = Depends(admin_required)):
    result = await db.execute(select(Document).order_by(Document.created_at.desc()).limit(500))
    docs = result.scalars().all()
    return [
        {"id": str(d.id), "title": d.title, "source_url": d.source_url, "created_at": d.created_at.isoformat()}
        for d in docs
    ]


@router.delete("/documents/{document_id}")
async def admin_delete_document(document_id: str, db: AsyncSession = Depends(get_db), _: dict = Depends(admin_required)):
    from uuid import UUID

    await db.execute(delete(Document).where(Document.id == UUID(document_id)))
    await db.commit()
    return {"status": "deleted", "id": document_id}



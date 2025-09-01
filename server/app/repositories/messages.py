from typing import List
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import LessonMessage


class LessonMessageRepository:
    @staticmethod
    async def add(db: AsyncSession, lesson_id: UUID, role: str, content: dict) -> LessonMessage:
        msg = LessonMessage(lesson_id=lesson_id, role=role, content=content)
        db.add(msg)
        await db.commit()
        await db.refresh(msg)
        return msg

    @staticmethod
    async def list_recent(db: AsyncSession, lesson_id: UUID, limit: int = 50) -> List[LessonMessage]:
        result = await db.execute(
            select(LessonMessage)
            .where(LessonMessage.lesson_id == lesson_id)
            .order_by(LessonMessage.created_at.asc())
            .limit(limit)
        )
        return list(result.scalars().all())



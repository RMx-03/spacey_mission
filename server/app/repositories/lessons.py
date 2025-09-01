from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import Lesson


class LessonRepository:
    @staticmethod
    async def create(db: AsyncSession, user_id: UUID, title: str) -> Lesson:
        lesson = Lesson(user_id=user_id, title=title)
        db.add(lesson)
        await db.commit()
        await db.refresh(lesson)
        return lesson

    @staticmethod
    async def get_by_id(db: AsyncSession, lesson_id: UUID) -> Lesson | None:
        result = await db.execute(select(Lesson).where(Lesson.id == lesson_id))
        return result.scalar_one_or_none()

    @staticmethod
    async def list_for_user(db: AsyncSession, user_id: UUID, limit: int = 20, offset: int = 0) -> list[Lesson]:
        result = await db.execute(
            select(Lesson).where(Lesson.user_id == user_id).order_by(Lesson.created_at.desc()).limit(limit).offset(offset)
        )
        return list(result.scalars().all())

    @staticmethod
    async def get_or_create_active_for_user(db: AsyncSession, user_id: UUID, title: str = "My Lesson") -> Lesson:
        result = await db.execute(select(Lesson).where(Lesson.user_id == user_id).order_by(Lesson.created_at.desc()))
        existing = result.scalars().first()
        if existing:
            return existing
        return await LessonRepository.create(db, user_id=user_id, title=title)



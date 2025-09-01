from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import get_current_user_claims
from app.db.session import get_db
from app.repositories.users import UserRepository
from app.repositories.lessons import LessonRepository
from app.repositories.messages import LessonMessageRepository
from app.schemas.lesson import LessonCreate, LessonOut
from app.core.rate_limit import rate_limit


router = APIRouter()


@router.post("/lessons", response_model=LessonOut, dependencies=[Depends(rate_limit(30, 60))])
async def create_lesson(payload: LessonCreate, claims: dict = Depends(get_current_user_claims), db: AsyncSession = Depends(get_db)):
    user = await UserRepository.get_or_create_by_firebase_uid(db, firebase_uid=claims.get("uid"), email=claims.get("email"))
    lesson = await LessonRepository.create(db, user_id=user.id, title=payload.title)
    return {"id": str(lesson.id), "title": lesson.title, "user_id": str(lesson.user_id), "status": lesson.status}


@router.get("/lessons/{lesson_id}", response_model=LessonOut)
async def get_lesson(lesson_id: UUID, claims: dict = Depends(get_current_user_claims), db: AsyncSession = Depends(get_db)):
    lesson = await LessonRepository.get_by_id(db, lesson_id)
    if not lesson:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found")
    return {"id": str(lesson.id), "title": lesson.title, "user_id": str(lesson.user_id), "status": lesson.status}


@router.get("/lessons", response_model=list[LessonOut])
async def list_lessons(
    claims: dict = Depends(get_current_user_claims),
    db: AsyncSession = Depends(get_db),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    user = await UserRepository.get_or_create_by_firebase_uid(db, firebase_uid=claims.get("uid"), email=claims.get("email"))
    lessons = await LessonRepository.list_for_user(db, user_id=user.id, limit=limit, offset=offset)
    return [
        {"id": str(l.id), "title": l.title, "user_id": str(l.user_id), "status": l.status}
        for l in lessons
    ]


@router.get("/lessons/{lesson_id}/messages")
async def lesson_messages(
    lesson_id: UUID,
    claims: dict = Depends(get_current_user_claims),
    db: AsyncSession = Depends(get_db),
    limit: int = Query(50, ge=1, le=200),
):
    lesson = await LessonRepository.get_by_id(db, lesson_id)
    if not lesson:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found")
    msgs = await LessonMessageRepository.list_recent(db, lesson_id=lesson_id, limit=limit)
    return [
        {"id": str(m.id), "role": m.role, "content": m.content, "created_at": m.created_at.isoformat()}
        for m in msgs
    ]



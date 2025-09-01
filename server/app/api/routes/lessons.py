from uuid import UUID, uuid4
from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.core.security import get_current_user_claims


router = APIRouter()


class LessonCreate(BaseModel):
    title: str


@router.post("/lessons")
async def create_lesson(payload: LessonCreate, claims: dict = Depends(get_current_user_claims)):
    # TODO: persist to DB. For now, return a stub
    return {"id": str(uuid4()), "title": payload.title, "user": claims.get("uid")}


@router.get("/lessons/{lesson_id}")
async def get_lesson(lesson_id: UUID, claims: dict = Depends(get_current_user_claims)):
    # TODO: fetch from DB
    return {"id": str(lesson_id), "title": "Sample Lesson", "user": claims.get("uid")}



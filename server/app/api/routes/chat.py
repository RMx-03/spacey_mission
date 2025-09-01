from typing import List, Literal, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from app.core.security import get_current_user_claims
from app.services.orchestrator import run_orchestrator
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.repositories.users import UserRepository
from app.repositories.lessons import LessonRepository
from app.repositories.messages import LessonMessageRepository
from app.core.rate_limit import rate_limit


router = APIRouter()


class ChatMessage(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str


class ChatRequest(BaseModel):
    lesson_id: Optional[str] = None
    messages: List[ChatMessage] = Field(default_factory=list)
    hints: Optional[dict] = None


@router.post("/chat", dependencies=[Depends(rate_limit(120, 60))])
async def chat(request: ChatRequest, claims: dict = Depends(get_current_user_claims), db: AsyncSession = Depends(get_db)):
    last_user = next((m for m in reversed(request.messages) if m.role == "user"), None)
    if not last_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No user message provided")

    user = await UserRepository.get_or_create_by_firebase_uid(db, firebase_uid=claims.get("uid"), email=claims.get("email"))
    # Ensure lesson exists
    if request.lesson_id:
        from uuid import UUID as _UUID

        lesson = await LessonRepository.get_by_id(db, _UUID(request.lesson_id))
        if not lesson:
            lesson = await LessonRepository.get_or_create_active_for_user(db, user.id)
    else:
        lesson = await LessonRepository.get_or_create_active_for_user(db, user.id)

    # Persist the user message
    await LessonMessageRepository.add(db, lesson_id=lesson.id, role="user", content={"text": last_user.content})

    # Build history from persisted messages
    recent = await LessonMessageRepository.list_recent(db, lesson_id=lesson.id, limit=30)
    history = [
        {"role": m.role, "content": (m.content.get("text") if isinstance(m.content, dict) else str(m.content))}
        for m in recent if m.role in ("assistant", "system")
    ]
    reply_data = await run_orchestrator(db, last_user.content, history=history)
    reply = f"[{reply_data['route']}] {reply_data['response']}"
    # Persist assistant message
    await LessonMessageRepository.add(db, lesson_id=lesson.id, role="assistant", content={"text": reply})
    return {"lesson_id": str(lesson.id), "messages": request.messages + [ChatMessage(role="assistant", content=reply)], "user": claims.get("uid")}



from typing import List, Literal, Optional
from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

from app.core.security import get_current_user_claims
from app.services.orchestrator import run_orchestrator


router = APIRouter()


class ChatMessage(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str


class ChatRequest(BaseModel):
    lesson_id: Optional[str] = None
    messages: List[ChatMessage] = Field(default_factory=list)
    hints: Optional[dict] = None


@router.post("/chat")
async def chat(request: ChatRequest, claims: dict = Depends(get_current_user_claims)):
    last_user = next((m for m in reversed(request.messages) if m.role == "user"), None)
    reply_data = run_orchestrator(last_user.content if last_user else "")
    reply = f"[{reply_data['route']}] {reply_data['response']}"
    return {
        "lesson_id": request.lesson_id,
        "messages": request.messages + [ChatMessage(role="assistant", content=reply)],
        "user": claims.get("uid"),
    }



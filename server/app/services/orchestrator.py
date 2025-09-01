from typing import Any, Dict, List

from sqlalchemy.ext.asyncio import AsyncSession

from app.services.llm import chat as llm_chat
from app.services.retrieval import search_chunks


async def run_orchestrator(db: AsyncSession, user_message: str, history: List[Dict[str, str]] | None = None) -> Dict[str, Any]:
    history = history or []
    # Retrieve supporting context
    contexts = await search_chunks(db, query=user_message, top_k=5)
    context_text = "\n\n".join([c[0] for c in contexts])

    system_prompt = (
        "You are Spacey, an expert AI tutor. Use the provided context if relevant.\n"
        "Cite facts concisely and guide with clarity.\n"
        "If you are unsure, say so and ask a follow-up.\n"
        f"Context:\n{context_text}\n"
    )

    messages = [{"role": "system", "content": system_prompt}] + history + [
        {"role": "user", "content": user_message}
    ]
    answer = llm_chat(messages)
    return {"route": "tutor", "response": answer}



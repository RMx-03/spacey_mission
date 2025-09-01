from typing import Any, Dict, List

import os
from litellm import completion, embedding
from fastapi import HTTPException, status

from app.core.config import get_settings


class LLMError(RuntimeError):
    pass


def _require_provider() -> None:
    settings = get_settings()
    if not (
        os.environ.get("OPENAI_API_KEY")
        or os.environ.get("ANTHROPIC_API_KEY")
        or os.environ.get("GOOGLE_API_KEY")
    ):
        raise LLMError("No LLM provider configured. Set OPENAI_API_KEY/ANTHROPIC_API_KEY/GOOGLE_API_KEY.")


def chat(messages: List[Dict[str, str]], model: str | None = None, temperature: float = 0.2) -> str:
    try:
        _require_provider()
    except LLMError as e:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(e))
    final_model = model or os.environ.get("LLM_MODEL") or "gpt-4o-mini"
    try:
        resp = completion(model=final_model, messages=messages, temperature=temperature)
        content = resp.choices[0].message["content"]  # type: ignore[index]
        return content
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=f"LLM provider error: {e}")


def embed(texts: List[str], model: str | None = None) -> List[List[float]]:
    try:
        _require_provider()
    except LLMError as e:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(e))
    final_model = model or os.environ.get("EMBEDDINGS_MODEL") or "text-embedding-3-large"
    try:
        resp = embedding(model=final_model, input=texts)
        vectors = [row["embedding"] for row in resp["data"]]
        return vectors
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=f"Embeddings provider error: {e}")


def chat_stream(messages: List[Dict[str, str]], model: str | None = None, temperature: float = 0.2):
    try:
        _require_provider()
    except LLMError as e:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(e))
    final_model = model or os.environ.get("LLM_MODEL") or "gpt-4o-mini"
    try:
        resp = completion(model=final_model, messages=messages, temperature=temperature, stream=True)
        accumulated = 0
        for chunk in resp:  # type: ignore
            piece = ""
            try:
                c0 = chunk.choices[0]  # type: ignore[attr-defined]
                delta = getattr(c0, "delta", None)
                if isinstance(delta, dict):
                    piece = delta.get("content") or delta.get("text") or ""
                else:
                    msg = getattr(c0, "message", None)
                    if isinstance(msg, dict):
                        piece = msg.get("content", "")
            except Exception:
                piece = ""
            if piece:
                accumulated += len(piece)
                yield piece
        if accumulated == 0:
            # Fallback to non-streaming if provider didn't stream content
            full = chat(messages, model=final_model, temperature=temperature)
            if full:
                yield full
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=f"LLM streaming error: {e}")



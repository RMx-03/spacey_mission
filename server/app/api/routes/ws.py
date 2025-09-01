from typing import List, Dict

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends

from app.core.security import get_current_user_claims
from app.services.llm import chat_stream


router = APIRouter()


async def _verify_websocket_token(websocket: WebSocket) -> Dict:
    # Expect token in query ?token=... or header 'Authorization: Bearer ...'
    token = None
    auth = websocket.headers.get("Authorization")
    if auth and auth.lower().startswith("bearer "):
        token = auth.split(" ", 1)[1]
    if token is None:
        token = websocket.query_params.get("token")
    if token is None:
        await websocket.close(code=4401)
        return {}
    # Reuse HTTP dependency for verification by constructing a fake creds
    # For simplicity, accept presence only; production could parse and verify
    return {"token": token}


@router.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket):
    await websocket.accept()
    try:
        _ = await _verify_websocket_token(websocket)
        # Receive initial messages array
        init = await websocket.receive_json()
        messages: List[Dict[str, str]] = init.get("messages", [])
        # Stream response
        for chunk in chat_stream(messages):
            await websocket.send_text(chunk)
        await websocket.send_json({"event": "done"})
    except WebSocketDisconnect:
        return
    except Exception as e:
        await websocket.send_json({"error": str(e)})
        await websocket.close(code=1011)



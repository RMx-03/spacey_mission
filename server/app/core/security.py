from typing import Optional

import firebase_admin
from firebase_admin import auth as fb_auth, credentials
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.config import get_settings


_firebase_initialized = False


def _ensure_firebase_initialized() -> None:
    global _firebase_initialized
    if _firebase_initialized:
        return
    settings = get_settings()
    if not firebase_admin._apps:  # type: ignore[attr-defined]
        if settings.firebase_credentials_file:
            cred = credentials.Certificate(settings.firebase_credentials_file)
            firebase_admin.initialize_app(cred, {
                "projectId": settings.firebase_project_id,
            })
        else:
            firebase_admin.initialize_app()
    _firebase_initialized = True


bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_user_claims(
    token: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
):
    if token is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing Authorization header")

    _ensure_firebase_initialized()
    try:
        decoded = fb_auth.verify_id_token(token.credentials)
        return decoded
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Firebase ID token")



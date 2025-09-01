from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import get_current_user_claims
from app.db.session import get_db
from app.repositories.users import UserRepository
from app.schemas.user import UserOut


router = APIRouter()


@router.get("/me", response_model=UserOut)
async def me(claims: dict = Depends(get_current_user_claims), db: AsyncSession = Depends(get_db)):
    firebase_uid: str = claims.get("uid")
    email: str | None = claims.get("email")
    user = await UserRepository.get_or_create_by_firebase_uid(db, firebase_uid=firebase_uid, email=email)
    return {
        "id": str(user.id),
        "firebase_uid": user.firebase_uid,
        "email": user.email,
        "display_name": user.display_name,
        "avatar_url": user.avatar_url,
    }



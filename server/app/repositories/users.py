from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import User


class UserRepository:
    @staticmethod
    async def get_or_create_by_firebase_uid(db: AsyncSession, firebase_uid: str, email: Optional[str] = None) -> User:
        result = await db.execute(select(User).where(User.firebase_uid == firebase_uid))
        user = result.scalar_one_or_none()
        if user:
            return user
        user = User(firebase_uid=firebase_uid, email=email)
        db.add(user)
        await db.commit()
        await db.refresh(user)
        return user



from fastapi import APIRouter, Depends

from app.core.security import get_current_user_claims


router = APIRouter()


@router.get("/me")
async def me(claims: dict = Depends(get_current_user_claims)):
    return {"claims": claims}



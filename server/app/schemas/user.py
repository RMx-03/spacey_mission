from pydantic import BaseModel


class UserOut(BaseModel):
    id: str
    firebase_uid: str
    email: str | None = None
    display_name: str | None = None
    avatar_url: str | None = None

    class Config:
        from_attributes = True



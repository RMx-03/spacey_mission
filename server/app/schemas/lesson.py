from pydantic import BaseModel


class LessonCreate(BaseModel):
    title: str


class LessonOut(BaseModel):
    id: str
    title: str
    user_id: str
    status: str

    class Config:
        from_attributes = True



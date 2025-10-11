from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.diary import Diary
from app.schemas.diary import DiaryOut

router = APIRouter(prefix="/diaries", tags=["diaries"])


@router.get("/{diary_id}", response_model=DiaryOut)
def read_diary(diary_id: int, db: Annotated[Session, Depends(get_db)]) -> Diary:
    diary = db.get(Diary, diary_id)
    if diary is None:
        raise HTTPException(status_code=404, detail="Diary not found")
    return diary

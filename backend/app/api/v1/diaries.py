from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.diary import Diary
from app.schemas.diary import DiaryOut
from sqlalchemy import select
from typing import Sequence

router = APIRouter(prefix="/diaries", tags=["diaries"])


@router.get("/{diary_id}", response_model=DiaryOut)
def read_diary(diary_id: int, db: Annotated[Session, Depends(get_db)]) -> Diary:
    diary = db.get(Diary, diary_id)
    if diary is None:
        raise HTTPException(status_code=404, detail="Diary not found")
    return diary

@router.get("/", response_model=list[DiaryOut])
def read_diaries(db: Annotated[Session, Depends(get_db)]) -> Sequence[Diary]:
    """全日記取得"""
    try:
        diaries = db.execute(select(Diary)).scalars().all()
        return diaries
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching items: {str(e)}",
        ) from e

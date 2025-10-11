from collections.abc import Sequence
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.diary import Diary
from app.schemas.diary import DiaryBase, DiaryOut

router = APIRouter(prefix="/diaries", tags=["diaries"])


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


@router.get("/{diary_id}", response_model=DiaryOut)
def read_diary(diary_id: int, db: Annotated[Session, Depends(get_db)]) -> Diary:
    diary = db.get(Diary, diary_id)
    if diary is None:
        raise HTTPException(status_code=404, detail="Diary not found")
    return diary


@router.put("/{diary_id}", response_model=DiaryOut)
def update_diary(
    diary_id: int,
    diary_update: DiaryBase,
    db: Annotated[Session, Depends(get_db)],
) -> Diary:
    try:
        diary = Diary.active(db).filter(Diary.id == diary_id).first()
        if diary is None:
            raise HTTPException(status_code=404, detail="Diary not found")

        # 変更可能なのは bodyのみ
        diary.body = diary_update.body
        # それ以外は変更不可

        # bodyを下にscoreを再計算
        # TODO: ここにスコア計算の処理を書く
        score = len(diary.body)  # 仮のスコア計算

        diary.score = score

        db.add(diary)
        db.commit()
        db.refresh(diary)
        return diary
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error updating diary: {str(e)}",
        ) from e

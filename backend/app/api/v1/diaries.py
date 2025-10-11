from collections.abc import Sequence
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import not_, select
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.diary import Diary
from app.schemas.diary import DiaryBase, DiaryCreate, DiaryOut
from app.utils import parse_date

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


@router.post("/", response_model=DiaryOut)
def create_diary(
    diary_in: DiaryCreate,
    db: Annotated[Session, Depends(get_db)],
) -> Diary:
    try:
        # 必須項目のチェック
        essential_fields = ["body", "date"]
        if not all(getattr(diary_in, field) is not None for field in essential_fields):
            raise HTTPException(status_code=400, detail="Missing essential fields")

        _, month, day = parse_date(diary_in.date)
        if month < 1 or month > 12 or day < 1 or day > 31:
            raise HTTPException(status_code=400, detail="Invalid date")

        # すでに同じ日付の日記が存在するか確認
        existing_diary = (
            db.query(Diary).filter(Diary.date == diary_in.date, not_(Diary.is_deleted)).first()
        )
        if existing_diary:
            raise HTTPException(status_code=400, detail="Diary for this date already exists")

        # 日記の内容を元にスコアを計算
        score = len(diary_in.body)  # 仮のスコア計算

        user_id = 1  # 仮のユーザーID

        diary = Diary(**diary_in.model_dump(), score=score, user_id=user_id)
        db.add(diary)
        db.commit()
        db.refresh(diary)
        return diary
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error creating diary: {str(e)}",
        ) from e


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

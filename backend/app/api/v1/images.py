from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.image import Image
from app.schemas.image import ImageOut
from sqlalchemy import select, desc
from typing import Sequence

router = APIRouter(prefix="/images", tags=["images"])


@router.get("/", response_model=ImageOut)
def get_latest_image(user_id: int, db: Annotated[Session, Depends(get_db)]) -> Image:
    """指定した user_id の最新の画像を取得"""
    stmt = (
        select(Image)
        .where(Image.user_id == user_id, Image.is_deleted == False)
        .order_by(desc(Image.updated_at))
        .limit(1)
    )

    image = db.execute(stmt).scalars().first()
    if image is None:
        raise HTTPException(status_code=404, detail="Image not found")
    return image


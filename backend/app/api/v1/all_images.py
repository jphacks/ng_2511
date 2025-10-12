from collections.abc import Sequence
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import not_, select
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.image import Image
from app.schemas.image import ImageOut

router = APIRouter(prefix="/all_images", tags=["all_images"])


@router.get("/", response_model=list[ImageOut])
def get_all_image(db: Annotated[Session, Depends(get_db)]) -> Sequence[Image]:
    """全ての画像を取得"""
    stmt = (
        select(Image)
        .where(not_(Image.is_deleted))
    )

    image = db.execute(stmt).scalars().all()
    if len(image) == 0:
        raise HTTPException(status_code=404, detail="Image not found")
    return image

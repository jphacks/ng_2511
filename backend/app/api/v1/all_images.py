from collections.abc import Sequence
from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.image import Image
from app.schemas.image import ImageOut

router = APIRouter(prefix="/all_images", tags=["all_images"])


@router.get("/", response_model=list[ImageOut])
def get_latest_image_per_diary(db: Annotated[Session, Depends(get_db)]) -> Sequence[Image]:
    # 各 diary_id の中で updated_at DESC, id DESC の順に並べ、先頭(rn=1)だけを取る
    rn = (
        func.row_number()
        .over(
            partition_by=Image.diary_id,
            order_by=(Image.updated_at.desc(), Image.id.desc()),
        )
        .label("rn")
    )

    ranked = (
        select(
            Image.id,
            Image.diary_id,
            Image.uri,
            Image.created_at,
            Image.updated_at,
            Image.is_deleted,
            rn,
        )
        .where(Image.is_deleted.is_(False), Image.diary_id.is_not(None))
        .subquery()
    )

    stmt = (
        select(Image)
        .join(ranked, Image.id == ranked.c.id)
        .where(ranked.c.rn == 1)
        .order_by(Image.diary_id.asc())
    )

    images = db.execute(stmt).scalars().all()

    # 空配列を返すか 404 にするかは好み。API的には 200 + [] が一般的。
    # if not images:
    #     raise HTTPException(status_code=404, detail="Image not found")
    return images

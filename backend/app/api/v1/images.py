import os
from typing import Annotated

import cloudinary
import cloudinary.uploader
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy import desc, not_, select
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.image import Image
from app.models.diary import Diary
from app.models.user import User
from app.schemas.image import ImageCreateOut, ImageOut

cloudinary.config(  # type: ignore
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)

router = APIRouter(prefix="/images", tags=["images"])


@router.get("/", response_model=ImageOut)
def get_latest_image(user_id: int, db: Annotated[Session, Depends(get_db)]) -> Image:
    """
    指定した user_id の最新の画像を取得

    処理の流れ:
    1. user_id に紐づく最新の日記 (diary) を取得
    2. その diary_id に紐づく最新の画像 (image) を取得
    """
    # Step 1: 最新の日記を取得
    diary_stmt = (
        select(Diary)
        .where(Diary.user_id == user_id, not_(Diary.is_deleted))
        .order_by(desc(Diary.updated_at))
        .limit(1)
    )
    latest_diary = db.execute(diary_stmt).scalars().first()

    if latest_diary is None:
        raise HTTPException(status_code=404, detail="Diary not found for this user")

    # Step 2: その日記に紐づく最新画像を取得
    image_stmt = (
        select(Image)
        .where(Image.diary_id == latest_diary.id, not_(Image.is_deleted))
        .order_by(desc(Image.updated_at))
        .limit(1)
    )
    image = db.execute(image_stmt).scalars().first()

    if image is None:
        raise HTTPException(status_code=404, detail="Image not found for this diary")

    return image


@router.post("/", response_model=ImageCreateOut)
async def upload_image(
    file: Annotated[UploadFile, File(...)],
    db: Annotated[Session, Depends(get_db)],
    folder: Annotated[str | None, Form()] = "uploads",
) -> ImageCreateOut:
    """
    Cloudinary に画像をアップロードし、
    取得した URL を user_id=1 の User.image_url に保存して返す
    """
    # 1) MIME チェック
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="画像のみアップロード可能です。")

    # 2) Cloudinary へアップロード
    try:
        res = cloudinary.uploader.upload(  # type: ignore
            file.file,
            folder=folder,
            resource_type="image",
            use_filename=True,
            unique_filename=True,
            overwrite=False,
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Cloudinary upload failed: {e}") from e

    secure_url = res.get("secure_url")
    if not secure_url:
        raise HTTPException(status_code=500, detail="Cloudinary response is missing secure_url.")

    # 3) DB に保存
    try:
        target_user_id = 1
        user = db.get(User, target_user_id)
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        # userのimage_urlをsecure_urlに更新
        user.image_url = secure_url
        db.add(user)
        db.commit()
        db.refresh(user)
    except Exception as e:
        db.rollback()
        # 失敗した場合 Cloudinary をクリーンアップ
        public_id = res.get("public_id")
        if public_id:
            try:
                cloudinary.uploader.destroy(public_id, resource_type="image")  # type: ignore
            except Exception:
                pass
        raise HTTPException(status_code=500, detail=f"DB保存に失敗しました: {e}") from e

    return ImageCreateOut(image_url=secure_url)

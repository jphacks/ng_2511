from collections.abc import Sequence
from io import BytesIO
from typing import (
    Annotated,
    Any,
    NotRequired,
    Required,
    TypedDict,
)
from uuid import uuid4

import cloudinary
import cloudinary.uploader
from fastapi import APIRouter, Depends, HTTPException, status
from PIL.Image import Image as PILImage
from sqlalchemy import desc, not_
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.diary import Diary
from app.models.image import Image
from app.schemas.diary import DiaryBase, DiaryCreate, DiaryOut
from app.utils.generate_diary_score import generate_diary_score_using_Gemini
from app.utils.generate_image import generate_image
from app.utils.parse_image import parse_date


class CloudinaryUploadResult(TypedDict):
    public_id: Required[str]
    secure_url: Required[str]
    width: NotRequired[int]
    height: NotRequired[int]
    format: NotRequired[str]
    bytes: NotRequired[int]
    resource_type: NotRequired[str]
    url: NotRequired[str]
    folder: NotRequired[str]
    original_filename: NotRequired[str]
    version: NotRequired[int]
    placeholder: NotRequired[bool]


router = APIRouter(prefix="/diaries", tags=["diaries"])


def upload_pil_to_cloudinary(
    img: PILImage,
    *,
    folder: str = "generated",
    filename: str | None = None,
    quality: int = 85,
) -> CloudinaryUploadResult:
    """
    Pillow画像をCloudinaryへアップロードして、Cloudinaryのレスポンス(dict)を返す。
    返り値の主要キー: public_id, secure_url, width, height, format, bytes
    """
    # 透過があるのにJPEGにすると黒/白背景になるので、適切なフォーマットを選ぶ
    fmt = (img.format or "PNG").upper()
    if fmt == "JPEG" and (img.mode in ("RGBA", "LA", "P")):
        fmt = "PNG"  # 透過維持したい場合はPNG/WEBPに

    # JPEG保存時はRGBに変換しておく
    work = img.convert("RGB") if fmt == "JPEG" and img.mode != "RGB" else img

    buf = BytesIO()
    save_kwargs: dict[str, Any] = {"format": fmt}
    if fmt == "JPEG":
        save_kwargs.update({"quality": quality, "optimize": True, "progressive": True})
    work.save(buf, **save_kwargs)
    buf.seek(0)

    # ファイル名（public_idベース）を決める
    base_name = filename or str(uuid4())
    # Cloudinaryは拡張子不要でもOKだが、付けておくと分かりやすい
    public_id = f"{folder}/{base_name}"

    # アップロード（file-like をそのまま渡せる）
    # resource_type='image' を明示
    res = cloudinary.uploader.upload(  # type: ignore
        buf,
        resource_type="image",
        public_id=public_id,  # unique_filename=False にしない限り上書きされません
        overwrite=False,
        use_filename=True,
        folder=folder,
    )
    return res


@router.get("/", response_model=list[DiaryOut])
def read_diaries(db: Annotated[Session, Depends(get_db)]) -> Sequence[Diary]:
    """全日記取得"""
    try:
        diaries = db.query(Diary).filter(not_(Diary.is_deleted)).all()
        return diaries
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching items: {str(e)}",
        ) from e


@router.get("/{diary_id}", response_model=DiaryOut)
def read_diary(diary_id: int, db: Annotated[Session, Depends(get_db)]) -> Diary:
    try:
        diary = db.query(Diary).filter(Diary.id == diary_id, not_(Diary.is_deleted)).first()
        if diary is None:
            raise HTTPException(status_code=404, detail="Diary not found")
        return diary
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching diary: {str(e)}",
        ) from e


@router.post("/", response_model=DiaryOut)
async def create_diary(
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
        score: int = generate_diary_score_using_Gemini(diary_in.body)

        user_id = 1  # 仮のユーザーID

        # 今までのImageから最新のrecordを取得してuriを取得する
        latest_image = (
            db.query(Image)
            .filter(Image.user_id == user_id, not_(Image.is_deleted))
            .order_by(desc(Image.updated_at))
            .first()
        )

        if latest_image is None:
            raise HTTPException(status_code=400, detail="No image found for the user")

        # 画像のURIを取得
        image_uri = latest_image.uri

        # 画像を生成
        generated_image = generate_image(score, image_uri)

        # 生成した画像をCloudinaryにアップロード
        upload_res = upload_pil_to_cloudinary(generated_image, folder="generated")

        if not upload_res.get("secure_url"):
            raise HTTPException(status_code=500, detail="Failed to upload generated image")

        # 生成した画像のURLをImageテーブルに保存
        new_image = Image(user_id=user_id, uri=upload_res["secure_url"])
        db.add(new_image)
        db.commit()
        db.refresh(new_image)

        diary = Diary(**diary_in.model_dump(), score=score, user_id=user_id)
        db.add(diary)
        db.commit()
        db.refresh(diary)
        return diary
    except HTTPException:
        raise
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
        score: int = generate_diary_score_using_Gemini(diary.body)

        diary.score = score

        # 新しいスコアに基づいて画像を再生成する
        user_id = diary.user_id
        latest_image = (
            db.query(Image)
            .filter(Image.user_id == user_id, not_(Image.is_deleted))
            .order_by(desc(Image.updated_at))
            .first()
        )

        if latest_image is None:
            raise HTTPException(status_code=400, detail="No image found for the user")

        image_uri = latest_image.uri

        # 画像を生成
        generated_image = generate_image(score, image_uri)

        # 生成した画像をCloudinaryにアップロード
        upload_res = upload_pil_to_cloudinary(generated_image, folder="generated")

        if not upload_res.get("secure_url"):
            raise HTTPException(status_code=500, detail="Failed to upload generated image")

        # 生成した画像のURLをImageテーブルに保存
        new_image = Image(user_id=user_id, uri=upload_res["secure_url"])
        db.add(new_image)
        db.commit()
        db.refresh(new_image)

        db.add(diary)
        db.commit()
        db.refresh(diary)
        return diary
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error updating diary: {str(e)}",
        ) from e


# responseは204 No Content
@router.delete("/{diary_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_diary(
    diary_id: int,
    db: Annotated[Session, Depends(get_db)],
) -> None:
    try:
        diary = Diary.active(db).filter(Diary.id == diary_id).first()
        if diary is None:
            raise HTTPException(status_code=404, detail="Diary not found")

        # 論理削除
        diary.is_deleted = True

        db.add(diary)
        db.commit()
        return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error deleting diary: {str(e)}",
        ) from e


@router.get("/date/{date}", response_model=DiaryOut)
def read_diary_by_date(date: int, db: Annotated[Session, Depends(get_db)]) -> Diary:
    try:
        diary = db.query(Diary).filter(Diary.date == date, not_(Diary.is_deleted)).first()
        if diary is None:
            raise HTTPException(status_code=404, detail="Diary not found")
        return diary
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching diary: {str(e)}",
        ) from e

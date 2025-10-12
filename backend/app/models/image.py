from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import TIMESTAMP, Boolean, ForeignKey, Index, Integer, String, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base

if TYPE_CHECKING:
    from .diary import Diary


class Image(Base):
    __tablename__ = "images"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    diary_id: Mapped[int] = mapped_column(
        ForeignKey("diaries.id", ondelete="RESTRICT"), nullable=False
    )
    uri: Mapped[str] = mapped_column(String(255), nullable=False)

    created_at: Mapped[datetime | None] = mapped_column(
        TIMESTAMP, server_default=text("CURRENT_TIMESTAMP")
    )
    updated_at: Mapped[datetime | None] = mapped_column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP"),
        server_onupdate=text("CURRENT_TIMESTAMP"),
    )
    is_deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("FALSE"))

    # リレーション
    diary: Mapped[Diary] = relationship(back_populates="images", lazy="joined")

    __table_args__ = (
        Index("ix_images_diary_id", "diary_id"),
        Index("ix_images_is_deleted", "is_deleted"),
        Index("ix_images_created_at", "created_at"),
    )

    def __repr__(self) -> str:
        return f"Image(id={self.id!r}, diary_id={self.diary_id!r})"

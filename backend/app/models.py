from __future__ import annotations

from datetime import datetime

from sqlalchemy import (
    TIMESTAMP,
    Boolean,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .db import Base


# -------------------------------------------------------------
# items
# -------------------------------------------------------------
class Item(Base):
    __tablename__ = "items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)

    def __repr__(self) -> str:
        return f"Item(id={self.id!r}, name={self.name!r})"


# -------------------------------------------------------------
# users
# -------------------------------------------------------------
class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    image_url: Mapped[str] = mapped_column(String(255), nullable=False)

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
    diaries: Mapped[list[Diary]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    images: Mapped[list[Image]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

    # あると便利なインデックス（論理削除フラグ・作成日）
    __table_args__ = (
        Index("ix_users_is_deleted", "is_deleted"),
        Index("ix_users_created_at", "created_at"),
    )

    def __repr__(self) -> str:
        return f"User(id={self.id!r}, name={self.name!r})"


# -------------------------------------------------------------
# diaries
# -------------------------------------------------------------
class Diary(Base):
    __tablename__ = "diaries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="RESTRICT"), nullable=False
    )
    body: Mapped[str] = mapped_column(Text, nullable=False)

    score: Mapped[int] = mapped_column(Integer, nullable=False)

    created_at: Mapped[datetime | None] = mapped_column(
        TIMESTAMP, server_default=text("CURRENT_TIMESTAMP")
    )
    updated_at: Mapped[datetime | None] = mapped_column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP"),
        server_onupdate=text("CURRENT_TIMESTAMP"),
    )
    is_deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("FALSE"))

    user: Mapped[User] = relationship(back_populates="diaries", lazy="joined")

    __table_args__ = (
        Index("ix_diaries_user_id", "user_id"),
        Index("ix_diaries_is_deleted", "is_deleted"),
        Index("ix_diaries_created_at", "created_at"),
    )

    def __repr__(self) -> str:
        return f"Diary(id={self.id!r}, user_id={self.user_id!r})"


# -------------------------------------------------------------
# images
# -------------------------------------------------------------
class Image(Base):
    __tablename__ = "images"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="RESTRICT"), nullable=False
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

    user: Mapped[User] = relationship(back_populates="images", lazy="joined")

    __table_args__ = (
        Index("ix_images_user_id", "user_id"),
        Index("ix_images_is_deleted", "is_deleted"),
        Index("ix_images_created_at", "created_at"),
    )

    def __repr__(self) -> str:
        return f"Image(id={self.id!r}, user_id={self.user_id!r})"

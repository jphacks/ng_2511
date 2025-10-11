from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING, TypeVar

from sqlalchemy import TIMESTAMP, Boolean, ForeignKey, Index, Integer, Text, not_, text
from sqlalchemy.orm import Mapped, Query, Session, mapped_column, relationship

from app.db import Base

if TYPE_CHECKING:
    from .user import User

TD = TypeVar("TD", bound="Diary")


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

    @classmethod
    def active(cls: type[TD], session: Session) -> Query[TD]:
        return session.query(cls).filter(not_(cls.is_deleted))

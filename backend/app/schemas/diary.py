from datetime import datetime

from pydantic import BaseModel, ConfigDict


class DiaryBase(BaseModel):
    """日記共通のベーススキーマ

    ここには、日記に共通するフィールドを置きます。リクエストの検証や
    レスポンスの共通部分として他のスキーマから継承して使います。

    属性:
        body (str): 日記の内容。必須フィールド。
    """

    body: str


class DiaryOut(DiaryBase):
    """レスポンス用スキーマ（日記出力）

    DiaryOut はサーバーがクライアントに返す日記表現を定義します。
    DB の主キー `id` や、内部でのみ管理しているフィールドをここに含めます。

    column情報は全部返す
    """

    id: int
    user_id: int
    score: int
    date: int
    created_at: datetime | None
    updated_at: datetime | None
    is_deleted: bool

    model_config = ConfigDict(from_attributes=True)

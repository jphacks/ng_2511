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


class DiaryCreate(DiaryBase):
    """日記作成用スキーマ

    DiaryCreate はクライアントからの新規日記作成リクエストを検証するためのスキーマです。
    必須フィールドをここに含めます。

    属性:
        body (str): 日記の内容。必須フィールド。
        date (int): 日記の日付（Unixタイムスタンプ）。必須フィールド。
    """

    date: int  # 8桁のYYYYMMDD形式

    model_config = ConfigDict(from_attributes=True)


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


# POSTとPUTで返すスキーマはscoreを含まない
class PostAndPutDiaryResponse(DiaryBase):
    """レスポンス用スキーマ（日記出力）

    DiaryOut はサーバーがクライアントに返す日記表現を定義します。
    DB の主キー `id` や、内部でのみ管理しているフィールドをここに含めます。

    column情報は全部返す
    """

    id: int
    user_id: int
    date: int
    created_at: datetime | None
    updated_at: datetime | None
    is_deleted: bool

    model_config = ConfigDict(from_attributes=True)

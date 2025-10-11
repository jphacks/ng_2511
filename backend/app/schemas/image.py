from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.models.user import User

class ImageBase(BaseModel):
    """Image共通のベーススキーマ

    ここには、Imageに共通するフィールドを置きます。リクエストの検証や
    レスポンスの共通部分として他のスキーマから継承して使います。

    属性:
        uri (str): Imageの内容。必須フィールド。
    """

    uri: str


class ImageOut(ImageBase):
    """レスポンス用スキーマ（Image出力）

    ImageOut はサーバーがクライアントに返す日記表現を定義します。
    DB の主キー `id` や、内部でのみ管理しているフィールドをここに含めます。

    column情報は全部返す
    """

    id: int
    user_id: int
    created_at: datetime | None
    updated_at: datetime | None
    is_deleted: bool

    model_config = ConfigDict(from_attributes=True)

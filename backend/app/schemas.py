from pydantic import BaseModel, ConfigDict

# -------------------------------------------------------------
# Pydantic スキーマ定義
#
# このモジュールには API 入出力で使用するデータスキーマを定義します。
# Pydantic の BaseModel を継承することで、自動的に入力のバリデーションや
# 型変換、ドキュメント生成（FastAPI などで利用）を行えます。
#
# 命名規則（このリポジトリの慣例）:
# - ItemBase: 共通フィールドを持つベーススキーマ
# - ItemCreate: クライアントからの作成リクエスト (POST) 用
# - ItemOut: サーバーから返却するレスポンス用（DB の id 等を含む）
# -------------------------------------------------------------


class ItemBase(BaseModel):
    """アイテム共通のベーススキーマ

    ここには、アイテムに共通するフィールドを置きます。リクエストの検証や
    レスポンスの共通部分として他のスキーマから継承して使います。

    属性:
        name (str): アイテムの名前。必須フィールド。
    """

    # 単純な文字列フィールド。ここで型を宣言することで Pydantic が
    # 自動でバリデーション（例えば必須チェックや型チェック）を行います。
    name: str


class ItemCreate(ItemBase):
    """POST /items 用のスキーマ（作成リクエスト）

    ItemCreate はクライアントがアイテムを新規作成する際に送る JSON の形式を
    定義します。現在はベースの `name` だけを受け取るため、新しい属性は追加
    していませんが、将来的に description や price 等を追加する場合はここに
    フィールドを追加します。

    例:
        {
            "name": "りんご"
        }
    """

    # 追加のバリデーションやフィールドが不要な場合は pass で問題ありません。
    pass


class ItemOut(ItemBase):
    """レスポンス用スキーマ（出力）

    ItemOut はサーバーがクライアントに返すアイテム表現を定義します。
    DB の主キー `id` や、内部でのみ管理しているフィールドをここに含めます。

    注意: SQLAlchemy のオブジェクトを Pydantic モデルに変換する際、属性名が
    Pydantic の期待と一致する必要があります。`from_attributes = True` を
    Config に設定することで、オブジェクトの属性から値を読み取れるように
    なります（Pydantic v2 の設定）。
    """

    # DB の主キー（例: 自動採番された id）を含める
    id: int

    # SQLAlchemy の ORM モデルから Pydantic モデルを生成する設定
    model_config = ConfigDict(from_attributes=True)

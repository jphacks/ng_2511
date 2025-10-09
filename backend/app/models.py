# Module-level docstring for models
"""DB の ORM モデルを定義するモジュール

ここでは SQLAlchemy 2 系の記法を用いてデータベースのテーブルマッピングを
定義します。各モデルは `Base` を継承して宣言的に定義します。
"""

from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from .db import Base


# -------------------------------------------------------------
# SQLAlchemy 2 系の宣言的モデル定義
#
# このファイルは DB のテーブル定義（ORM モデル）を格納します。
# SQLAlchemy 2 から導入された型注釈ベースの記述（Mapped / mapped_column）を
# 利用しており、型安全かつ IDE に優しい定義が可能です。
#
# 主要な要素の説明:
# - DeclarativeBase / Base:
#     伝統的な `declarative_base()` と似た役割を持つ基底クラスです。
# - Mapped[T]:
#     カラムの Python 型を表す注釈で、静的解析や補完に役立ちます。
# - mapped_column(...):
#     カラムの詳細（型、制約、インデックス等）を指定するための関数。
#
# 小さめのプロジェクトではこのファイルでテーブルを定義し、
# `Base.metadata.create_all()` を使ってテーブルを作成できます。
# ただし、本番環境でのスキーマ変更は Alembic 等のマイグレーションツールを
# 使うことを推奨します。
# -------------------------------------------------------------

class Item(Base):
    """アイテムテーブルの ORM モデル

    属性:
        __tablename__ (str): DB 上のテーブル名
        id (int): 主キー。自動採番される想定
        name (str): アイテム名。NULL 不許可、最大長 255

    SQLAlchemy 2 の `Mapped` と `mapped_column` を使うことで、型ヒントが有効になり
    IDE の補完や静的解析ツールがより正確に動作します。
    """

    # テーブル名
    __tablename__ = "items"

    # カラム定義（型注釈 + mapped_column）
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)



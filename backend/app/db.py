"""
データベース接続ユーティリティ

このモジュールは SQLAlchemy を使ったデータベース接続の初期化と
セッション管理のユーティリティを提供します。環境変数で接続情報を
指定することで、ローカルやコンテナ環境で動作します。

環境変数:
  - DB_USER
  - DB_PASSWORD
  - DB_HOST (default: db)
  - DB_PORT (default: 3306)
  - DB_NAME
"""

import os
from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

# -------------------------------------------------------------
# データベース接続設定
# -------------------------------------------------------------

DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST", "db")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_NAME = os.getenv("DB_NAME")

# 必須の環境変数が設定されているかを検証
missing_vars = [
    var
    for var, val in [("DB_USER", DB_USER), ("DB_PASSWORD", DB_PASSWORD), ("DB_NAME", DB_NAME)]
    if not val
]
if missing_vars:
    raise RuntimeError(f"Required environment variable(s) missing: {', '.join(missing_vars)}")
# SQLAlchemy のデータベース URL を組み立て
DATABASE_URL = (
    f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}?charset=utf8mb4"
)


# -------------------------------------------------------------
# SQLAlchemy エンジン / セッション / ベースクラス
# -------------------------------------------------------------


class Base(DeclarativeBase):
    pass


engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    """依存注入用の DB セッションジェネレータ

    FastAPI の Depends で使うためのジェネレータです。関数内でセッションを
    作成し、yield で渡した後に finally ブロックで必ずクローズします。

    使い方例:
        def endpoint(db: Session = Depends(get_db)):
            # db を使ってクエリ実行

    このパターンにより、各リクエストごとに新しいセッションが作られ、
    リクエスト後に確実に閉じられることが保証されます。
    """

    db = SessionLocal()

    try:
        yield db
    finally:
        # 使用後にセッションを閉じてリソースを解放
        db.close()

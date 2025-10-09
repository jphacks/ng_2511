"""
アプリケーションのエントリポイント

このモジュールは FastAPI アプリケーションインスタンスと主要なエンドポイントを
定義します。開発用の簡易 API サーバとして以下のエンドポイントを提供します:
    - /health: DB 接続のヘルスチェック
    - /items: CRUD 操作 (GET/POST/PATCH/DELETE)

注意: テーブル生成に `Base.metadata.create_all()` を使っていますが、本番では
Alembic のようなマイグレーションツールを用いることを推奨します。
"""

from typing import List

from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy import text, select
from sqlalchemy.orm import Session

from .db import Base, engine, get_db
from .models import Item
from .schemas import ItemOut, ItemCreate

from contextlib import asynccontextmanager


@asynccontextmanager
async def lifespan(app: FastAPI):
        # 起動時処理
        Base.metadata.create_all(bind=engine)
        yield
        # 終了時処理
        # 特に何もしない

# -------------------------------------------------------------
# FastAPI アプリケーションのエントリポイント
# -------------------------------------------------------------

app = FastAPI(title="JPHACKS API", lifespan=lifespan)


@app.get("/health")
def health(db: Session = Depends(get_db)):
    """ヘルスチェックエンドポイント

    データベース接続テストを行い、接続可能であれば OK を返します。

    例:
        GET /health
        -> { "status": "ok", "message": "Database connection is healthy." }
    """
    try:
        # 軽いクエリで DB との疎通確認
        db.execute(text("SELECT 1"))
        return { "status": "ok", "message": "Database connection is healthy." }
    except Exception as e:
        # 例外が発生した場合は 500 エラーとして返す
        raise HTTPException(status_code=500, detail=f"Database connection failed: {str(e)}")

@app.get("/items", response_model=List[ItemOut])
def read_items(db: Session = Depends(get_db)):
    """全アイテム取得エンドポイント

    データベースから全てのアイテムを取得し、リストとして返します。

    例:
        GET /items
        -> [
            { "id": 1, "name": "りんご" },
            { "id": 2, "name": "バナナ" }
           ]
    """
    try:
        items = db.execute(select(Item)).scalars().all()
        return items
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching items: {str(e)}")


@app.post("/items", response_model=ItemOut, status_code=201)
def create_item(item: ItemCreate, db: Session = Depends(get_db)):
    """アイテム作成エンドポイント

    クライアントから送られた JSON ボディを元に新しいアイテムをデータベースに
    作成します。作成されたアイテムをレスポンスとして返します。

    例:
        POST /items
        {
            "name": "みかん"
        }
        -> { "id": 3, "name": "みかん" }
    """
    try:
        new_item = Item(name=item.name)
        db.add(new_item)
        db.commit()
        db.refresh(new_item)  # 作成されたオブジェクトを再取得して ID 等を反映
        return new_item
    except Exception as e:
        db.rollback()  # エラー時はロールバック
        raise HTTPException(status_code=500, detail=f"Error creating item: {str(e)}")

@app.get("/items/{item_id}", response_model=ItemOut)
def read_item(item_id: int, db: Session = Depends(get_db)):
    """単一アイテム取得エンドポイント

    指定された ID のアイテムをデータベースから取得し、返します。
    アイテムが存在しない場合は 404 エラーを返します。

    例:
        GET /items/1
        -> { "id": 1, "name": "りんご" }
    """
    try:
        item = db.get(Item, item_id)
        if item is None:
            raise HTTPException(status_code=404, detail="Item not found")
        return item
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching item: {str(e)}")

@app.patch("/items/{item_id}", response_model=ItemOut)
def update_item(item_id: int, item: ItemCreate, db: Session = Depends(get_db)):
    """アイテム更新エンドポイント

    指定された ID のアイテムをデータベースから取得し、クライアントから送られた
    JSON ボディの内容で更新します。更新されたアイテムを返します。
    アイテムが存在しない場合は 404 エラーを返します。

    例:
        PATCH /items/1
        {
            "name": "青りんご"
        }
        -> { "id": 1, "name": "青りんご" }
    """
    try:
        existing_item = db.get(Item, item_id)
        if existing_item is None:
            raise HTTPException(status_code=404, detail="Item not found")

        existing_item.name = item.name
        db.commit()
        db.refresh(existing_item)
        return existing_item
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error updating item: {str(e)}")

@app.delete("/items/{item_id}", status_code=204)
def delete_item(item_id: int, db: Session = Depends(get_db)):
    """アイテム削除エンドポイント

    指定された ID のアイテムをデータベースから削除します。
    アイテムが存在しない場合は 404 エラーを返します。

    例:
        DELETE /items/1
        -> (204 No Content)
    """
    try:
        existing_item = db.get(Item, item_id)
        if existing_item is None:
            raise HTTPException(status_code=404, detail="Item not found")

        db.delete(existing_item)
        db.commit()
        return
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error deleting item: {str(e)}")
from collections.abc import AsyncIterator, Sequence
from contextlib import asynccontextmanager
from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy import select, text
from sqlalchemy.orm import Session

from .db import Base, engine, get_db
from .models import Item
from .schemas import ItemCreate, ItemOut


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """アプリのライフサイクル管理"""
    Base.metadata.create_all(bind=engine)
    yield
    # 終了時処理は特になし


app = FastAPI(title="JPHACKS API", lifespan=lifespan)


@app.get("/health")
def health(db: Annotated[Session, Depends(get_db)]) -> dict[str, str]:
    """ヘルスチェックエンドポイント"""
    try:
        db.execute(text("SELECT 1"))
        return {"status": "ok", "message": "Database connection is healthy."}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Database connection failed: {str(e)}",
        ) from e


@app.get("/items", response_model=list[ItemOut])
def read_items(db: Annotated[Session, Depends(get_db)]) -> Sequence[Item]:
    """全アイテム取得"""
    try:
        items = db.execute(select(Item)).scalars().all()
        return items
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching items: {str(e)}",
        ) from e


@app.post("/items", response_model=ItemOut, status_code=201)
def create_item(item: ItemCreate, db: Annotated[Session, Depends(get_db)]) -> Item:
    """作成"""
    try:
        new_item = Item(name=item.name)
        db.add(new_item)
        db.commit()
        db.refresh(new_item)
        return new_item
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error creating item: {str(e)}",
        ) from e


@app.get("/items/{item_id}", response_model=ItemOut)
def read_item(item_id: int, db: Annotated[Session, Depends(get_db)]) -> Item:
    """単一取得"""
    try:
        item = db.get(Item, item_id)
        if item is None:
            raise HTTPException(status_code=404, detail="Item not found")
        return item
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching item: {str(e)}",
        ) from e


@app.put("/items/{item_id}", response_model=ItemOut)
def update_item(item_id: int, item: ItemCreate, db: Annotated[Session, Depends(get_db)]) -> Item:
    """更新"""
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
        raise HTTPException(
            status_code=500,
            detail=f"Error updating item: {str(e)}",
        ) from e


@app.delete("/items/{item_id}", status_code=204)
def delete_item(item_id: int, db: Annotated[Session, Depends(get_db)]) -> None:
    """削除"""
    try:
        existing_item = db.get(Item, item_id)
        if existing_item is None:
            raise HTTPException(status_code=404, detail="Item not found")
        db.delete(existing_item)
        db.commit()
        return None
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error deleting item: {str(e)}",
        ) from e

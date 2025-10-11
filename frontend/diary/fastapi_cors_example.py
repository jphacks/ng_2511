# FastAPI サーバー側で必要なCORS設定の例

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js開発サーバー
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 日記一覧取得エンドポイントの例
@app.get("/diaries")
async def get_diaries():
    return [
        {
            "id": 1,
            "user_id": 1,
            "body": "今日はとても良い天気でした。",
            "score": 5,
            "created_at": "2024-12-15T10:30:00+09:00",
            "updated_at": "2024-12-15T10:30:00+09:00",
            "is_deleted": False,
            "date": 20241215
        }
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
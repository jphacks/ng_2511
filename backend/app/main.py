from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.lifespan import lifespan


def create_app() -> FastAPI:
    app = FastAPI(title="My App", version="1.0.0", lifespan=lifespan)

    # CORS（必要なら）
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ルータ登録はここだけ
    app.include_router(api_router)
    return app


app = create_app()

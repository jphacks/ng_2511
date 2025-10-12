from fastapi import APIRouter

from . import all_images, diaries, images

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(diaries.router)
# api_router.include_router(items.router)
api_router.include_router(images.router)
# api_router.include_router(users.router)
api_router.include_router(all_images.router)

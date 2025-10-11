# Base.metadata に全モデルを登録させるための import 集約
from app.db import Base  # noqa: F401

from .diary import Diary  # noqa: F401
from .image import Image  # noqa: F401
from .user import User  # noqa: F401

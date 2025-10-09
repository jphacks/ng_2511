# ==============================
# ベースイメージ
# ==============================
FROM python:3.12-slim

# 作業ディレクトリ設定
WORKDIR /app

# ==============================
# システム依存関係のインストール
# ==============================
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      default-mysql-client \
      build-essential \
      curl \
      git \
      pkg-config \
      python3-venv \
 && rm -rf /var/lib/apt/lists/*

# ==============================
# uv のインストール（グローバル）
# ==============================
RUN pip install --no-cache-dir uv

# ==============================
# Python依存関係の同期
# ==============================
# プロジェクトメタだけ先にコピー（キャッシュを効かせるため）
COPY pyproject.toml uv.lock* uv.toml* ./

# ==============================
# アプリケーション本体コピー
# ==============================
COPY app ./app

# venv作成と依存パッケージのインストール
RUN python -m venv .venv \
 && .venv/bin/python -m pip install --upgrade pip \
 && .venv/bin/python -m pip install --no-cache-dir .

# ==============================
# 実行設定
# ==============================
EXPOSE 8000

# FastAPI起動コマンド
CMD [".venv/bin/python","-m","uvicorn","app.main:app","--host","0.0.0.0","--port","8000","--reload"]
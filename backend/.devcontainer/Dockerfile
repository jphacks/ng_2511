FROM python:3.12-slim

WORKDIR /app

RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      default-mysql-client \
      build-essential \
      curl \
      git \
      pkg-config \
      python3-venv \
 && rm -rf /var/lib/apt/lists/*

# uvをグローバルに入れる
RUN pip install --no-cache-dir uv

# 依存メタだけ先に（キャッシュ用）
COPY pyproject.toml uv.lock* uv.toml* ./

# アプリ本体
COPY . .

# .venv作成 + ロックに基づいて同期（devツールも入れるなら --all-groups）
RUN uv venv .venv \
 && uv sync --python .venv/bin/python \
 && uv sync --python .venv/bin/python --extra dev

EXPOSE 8000
# uvicornは.venv配下に入っているのでパスを直指定
CMD [".venv/bin/uvicorn","app.main:app","--host","0.0.0.0","--port","8000","--reload"]
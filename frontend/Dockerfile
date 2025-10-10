# Node.js 24.10.0 + Alpine
FROM node:24.10.0-alpine

# bash と git をインストール
RUN apk add --no-cache bash git

# 作業ディレクトリ
WORKDIR /usr/src/app

# npm キャッシュをクリア（Alpine特有の問題回避）
RUN npm cache clean --force

# デフォルトコマンド
CMD ["bash"]

# フロントエンド

## Docker containerの起動

コマンド：
```
docker compose up --build
```

その後，リモート接続から「実行中のコンテナにアタッチ」で Docker 環境に入る

！！注意！！

Docker Desktop を起動しておくこと

## アプリの起動

コマンド：
```
npm install
npm install lucide-react #ヘッダの作成に使用
npm run dev
```

その後，http://localhost:3000/ にアクセスすると，Topページにアクセスできる．
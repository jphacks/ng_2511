# プロジェクト README

このリポジトリは FastAPI と SQLAlchemy を使った簡易 API サーバです。ここではローカル開発および Docker / docker-compose を使った起動方法、必要な環境変数をまとめます。

## 起動コマンド

- 今回は VSCode の Dev Container を使うことを想定しています。

1. VS Code で/backend フォルダを開きます。
2. 画面左下の緑色のアイコンをクリックし、"Reopen in Container" を選択します。

※Dev Container を使わない場合

```bash
docker compose up --build
```

- もしかしたらあらかじめ uv をインストールしておく必要があるかもしれません。

## 起動確認

`localhost:8000/docs` にアクセスして、FastAPI の自動生成されたドキュメントが表示されれば成功です。

## CLI で mysql に接続する方法

- 基本的には ORM を使うので CLI で接続する必要はありませんが、DB の中身を直接確認したい場合などに使います。

```bash
mysql -u appuser -papp_pass -h db app_db
```

## formatter linter を実行する場合

```
ruff check .
```

# ミライかもね

[![IMAGE ALT TEXT HERE](https://jphacks.com/wp-content/uploads/2025/05/JPHACKS2025_ogp.jpg)](https://www.youtube.com/watch?v=lA9EluZugD8)

## 製品概要

### 背景 (製品開発のきっかけ、課題等）

- 日記は書くことによって自己理解や自己成長、精神の安定など多くのいい効果があるが、継続して行うことはなかなか難しく、気づいたら書かなくなってしまったということが多い。

### 製品説明（具体的な製品の説明）

- そこで、使うことで自然に日記を継続できるようなアプリケーションを開発した。

### 特長

#### 1. 特長 1

- 日記の内容をもとに将来の自分の姿が変化する。
  - 書いた内容によって未来の自分が健康的になったり、はたまた、体調が悪そうになったりと変化する
  - これによって、将来の自分を意識し、日記を継続するモチベーションが上がる

#### 2. 特長 2

- 今までの日記による未来の自分の変遷を確認できる
  - 日記を継続することで未来の自分がどのように変化していったかを確認できる

### 解決出来ること

- 日記を継続することが難しかった人が日記を継続できるようになる

### 今後の展望

### 注力したこと（こだわり等）

- ユーザーの使いやすさを考慮しシンプルなデザインにし、直感的に使いやすい UI にした。
- LLM を活用し、日記の内容をもとに未来の自分の姿を変化させる仕組みを実装した。
-

## 開発技術

- Frontend: TypeScript, Next.js
- Backend: Python, FastAPI
- DB: MySQL, Cloudinary

### 活用した技術

#### API・データ

- Google Gemini

#### フレームワーク・ライブラリ・モジュール

- Frontend
  - TypeScript
    - Next.js
    - React
    - Tailwind CSS
- Backend
  - Python
    - FastAPI
    - SQLAlchemy
- DB
  - MySQL
    - 主なデータを保存
  - Cloudinary
    - 画像保存

#### デバイス

- PC

### 独自技術

#### ハッカソンで開発した独自機能・技術

- 日記の内容をもとに未来の自分の姿を変化させる仕組み
  - LLM を活用し、日記の内容からスコアを算出し、そのスコアと画像データをもとに未来の自分の姿を変化させる仕組みを実装した。
- ファイルリンク
  - [backend/app/utils/generate_image.py](./backend/app/utils/generate_image.py)
  - [backend/app/utils/generate_diary_score.py](./backend/app/utils/generate_diary_score.py)
  - [backend/app/api/v1/diaries.py](./backend/app/api/v1/diaries.py)

## 要件

### タイトル

- 未来の自分の姿が進化する日記帳
- 未来（の自分）を映す日記帳

### ターゲット

- 日記を続けたい人
- 何かを継続したい人

### 課題（やりたいこと）

- 物事の継続支援
- 日々の生活を記録する

### 解決のアプローチ

- 日記に何かを記録したら未来の自分が変化する
  - positive→ 成長
  - negative→ みすぼらしく
- 何も書かなければどんどんみすぼらしくなる

### 実装要件

- 日記を入力できる
- 未来の自分を確認できる

- [ ] 未来の自分とは何を映すの？
  - 自分の画像、デフォルト画像、動物？ ...

#### MUST

- 日記入力フォーム
  - 日記のデータの CRUD 操作
- いままでの日記の内容を確認できる
  - 編集できる
- 未来の自分を映すフレーム
  - 日記の入力状況（日記の内容＋継続日数）によって変化する
  - 画像の upload
- 未来の自分の画像生成
  - 何パターンか用意しとく（可能性もあり）
- 日記の内容の判定
  - ポジネガ or 0 ~ 100

#### WANT

- 日記の内容を要約
- メンタルケア
- ユーザー登録
  - share 機能
- パーソナル情報を登録
- 背景とユーザのモデルを連動
- 日記が書かれるごとに画像を生成する
- リマインド機能
- positive/negative 表示
  - 日，週，月ごとのグラフなど

### 画面設計

- 画面 A
  - 日記入力フォーム
  - 未来の自分の画像を表示
- 画面 B
  - 日記一覧

### API 設計

- 日記の CRUD
  - POST /diaries/create
  - GET /diaries
  - GET /diaries/:id
  - PATCH /diaries/:id
  - DELETE /diaries/:id
- 画像のアップロード
  - POST /image/upload
- 未来の自分の画像取得
  - GET /image

### DB 設計

- users

  - id (int)(PK)
  - name (string)
  - image_url (string)
  - created_at (datetime)
  - updated_at (datetime)
  - is_deleted (boolean)

- diaries

  - id (int) (PK)
  - user_id (int) (FK)
  - body (text)
  - score (int)
  - created_at (datetime)
  - updated_at (datetime)
  - is_deleted (boolean)

- images
  - id (int) (PK)
  - diary_id (int) (FK)
  - uri (string)
  - created_at (datetime)
  - updated_at (datetime)
  - is_deleted (boolean)

## 実装

### Front

- language
  - TypeScript
- framework
  - Next.js or React

### Back

- language
  - Python
- framework
  - FastAPI
- API
  - Gemini, OpenAI
- DB
  - MySQL

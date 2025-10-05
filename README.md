# サンプル（プロダクト名）

[![IMAGE ALT TEXT HERE](https://jphacks.com/wp-content/uploads/2025/05/JPHACKS2025_ogp.jpg)](https://www.youtube.com/watch?v=lA9EluZugD8)

## 製品概要
### 背景(製品開発のきっかけ、課題等）
### 製品説明（具体的な製品の説明）
### 特長
#### 1. 特長1
#### 2. 特長2
#### 3. 特長3

### 解決出来ること
### 今後の展望
### 注力したこと（こだわり等）
* 
* 

## 開発技術
### 活用した技術
#### API・データ
* 
* 

#### フレームワーク・ライブラリ・モジュール
* 
* 

#### デバイス
* 
* 

### 独自技術
#### ハッカソンで開発した独自機能・技術
* 独自で開発したものの内容をこちらに記載してください
* 特に力を入れた部分をファイルリンク、またはcommit_idを記載してください。

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
    - positive→成長
    - negative→みすぼらしく
- 何も書かなければどんどんみすぼらしくなる

### 実装要件

- 日記を入力できる
- 未来の自分を確認できる

- [ ] 未来の自分とは何を映すの？
    - 自分の画像、デフォルト画像、動物？ ...

#### MUST

- 日記入力フォーム
    - 日記のデータのCRUD操作
- いままでの日記の内容を確認できる
    - 編集できる
- 未来の自分を映すフレーム
    - 日記の入力状況（日記の内容＋継続日数）によって変化する
    - 画像のupload
- 未来の自分の画像生成
    - 何パターンか用意しとく（可能性もあり）
- 日記の内容の判定
    - ポジネガ or 0 ~ 100


#### WANT

- 日記の内容を要約
- メンタルケア
- ユーザー登録
    - share機能
- パーソナル情報を登録
- 背景とユーザのモデルを連動
- 日記が書かれるごとに画像を生成する
- リマインド機能
- positive/negative 表示
    - 日，週，月ごとのグラフなど

### 画面設計
    
- 画面A
    - 日記入力フォーム
    - 未来の自分の画像を表示
- 画面B
    - 日記一覧

### API設計

- 日記のCRUD
    - POST /diaries/create
    - GET /diaries
    - GET /diaries/:id
    - PATCH /diaries/:id
    - DELETE /diaries/:id
- 画像のアップロード
    - POST /image/upload
- 未来の自分の画像取得
    - GET /image

### DB設計

- diaries
    - id (int) (PK)
    - user_id (int) (FK)
    - body (text)
    - score (int)
    - created_at (datetime)
    - updated_at (datetime)
    - is_deleted (boolean)

- users
    - id (int)(PK)
    - name (string)
    - image (string)
    - created_at (datetime)
    - updated_at (datetime)
    - is_deleted (boolean)


- images
    - id (int) (PK)
    - user_id (int) (FK)
    - path (string)
    - created_at (datetime)
    - updated_at (datetime)
    - is_deleted (boolean)
## 実装
### Front
- language
    - TypeScript
- flamework
    - Next.js or React


### Back
- language
    - Python
- flamework
    - FastAPI
- API
    - Gemini, OpenAI
- DB
    - MySQL

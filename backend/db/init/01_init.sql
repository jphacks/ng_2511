CREATE TABLE IF NOT EXISTS items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS diaries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  body TEXT NOT NULL,
  score INT NOT NULL,
  date INT NOT NULL DEFAULT 20250101,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  diary_id INT NOT NULL,
  uri VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (diary_id) REFERENCES diaries(id)
);

INSERT INTO items (name) VALUES ('hello'), ('fastapi');
INSERT INTO users (name, image_url) VALUES ('Alice', 'https://res.cloudinary.com/dj7kgegji/image/upload/v1760238558/young-woman-walking-through-neighborhood_scgxhd.jpg');
INSERT INTO diaries (user_id, body, score, date) 
VALUES 
  (1, '今日は朝から大学へ行き、一日中研究室で過ごした。最近、研究の進捗があまりなくて気持ちが沈みがちだ。しかも明日はJP HACKS本番。初めての参加だから不安で頭がいっぱいで、どうも集中できなかった。いつもの金曜日のように、17時半から歯医者の予約があったので、研究を切り上げて行ってきた。今日は虫歯の治療の続き。前回治療した歯がずっとしみるのに、全然改善しなくて、本当にこの歯医者大丈夫なのか疑っている。これ以上お金をかけたくないから、早く治療を終わらせたい。今日の治療はかなり痛くて、終わってから一時間くらいは食事もできなかった。お腹は空くし、気分も最悪だった。夜はJP HACKSで使う技術を少しでも事前に勉強しようと思って、つい夜中の1時まで起きてしまった。明日は7時半に起きなきゃいけないのに……。', -85, 20251011), 
  (1, '今日は本当に最悪な一日だった。朝から頭が重くて、起き上がるのもつらかった。JP HACKSの初日だったけど、全然集中できず、チームメンバーの話も頭に入ってこなかった。自分だけ何も貢献できない感じがして、自己嫌悪に陥った。昼頃から頭痛がひどくなり、結局夕方には早退してしまった。せっかくのイベントなのに、楽しむ余裕なんてまったくなかった。帰ってからも何も食べる気がせず、ベッドに倒れ込むようにして眠った。身体も心も限界に近い。こんな状態で明日も動けるのか不安しかない。', -95, 20251012),
  (1, '昨日はほとんど寝込んでいたけれど、今日は少し体調が戻ってきた。JP HACKSの二日目。朝は気分が重かったけど、チームメンバーが「昨日は無理しないでよかったね」と優しく声をかけてくれて、少し救われた。午後からはコードの調整を担当した。久しぶりに頭が働く感じがして、作業がうまく進んだときはちょっと嬉しかった。夕方の発表準備はバタバタだったけど、みんなで協力して形にできた。結果はともかく、今日は「やりきった」感があった。夜はぐっすり眠れそう。少しだけ前向きな気分を取り戻せた一日。', 85, 20251013 ),
  (1, 'イベントが終わって気が抜けたのか、今日は朝から倦怠感がひどかった。研究室に行ったものの、集中力がまったく続かない。教授とのミーティングで研究の進展を聞かれても、答えに詰まってしまった。自分の力不足を痛感して、また落ち込んだ。歯の痛みもまだ残っていて、食事をするたびにズキッとする。なんだか体も心もバラバラな感じ。夜はやる気が出ず、適当に動画を見て時間を潰してしまった。何かを変えなきゃいけないとわかっているけど、動けない。', -95, 20251014),
  (1, '今朝は久しぶりに気持ちのいい目覚めだった。空が明るくて、気温もちょうどよく、自然とやる気が湧いてきた。午前中は研究の実験を集中して進め、これまで悩んでいた部分がようやくうまく動いた。思わず声を上げるほど嬉しかった。昼は友達と学食で食事をして、久しぶりにたくさん笑った。食欲も戻ってきて、体調もかなり良い。夜はJP HACKSで得たアイデアを整理して、今後の研究にどう活かすか考えた。少しずつ前に進んでいる実感がある。今日は本当に充実した、最高の一日だった。', 100, 20251015);
INSERT INTO images (diary_id, uri) 
VALUES 
  (1, 'https://res.cloudinary.com/dj7kgegji/image/upload/v1760238526/20251011_lnhtc5.png'), 
  (2, 'https://res.cloudinary.com/dj7kgegji/image/upload/v1760238526/20251012_tagvbs.png'),
  (3, 'https://res.cloudinary.com/dj7kgegji/image/upload/v1760238526/20251013_xar1xq.png'),
  (4, 'https://res.cloudinary.com/dj7kgegji/image/upload/v1760238526/20251014_crdqr4.png'),
  (5, 'https://res.cloudinary.com/dj7kgegji/image/upload/v1760238527/20251015_bi71dv.png');
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  uri VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO items (name) VALUES ('hello'), ('fastapi');
INSERT INTO users (name, image_url) VALUES ('Alice', 'https://example.com/alice.jpg'), ('Bob', 'https://example.com/bob.jpg');
INSERT INTO diaries (user_id, body, score) VALUES (1, 'This is Alice\'s first diary entry.', 10), (2, 'This is Bob\'s first diary entry.', 15);
INSERT INTO images (user_id, uri) VALUES (1, 'https://example.com/alice1.jpg'), (2, 'https://example.com/bob1.jpg');
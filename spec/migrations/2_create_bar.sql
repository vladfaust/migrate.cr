-- +migrate up
CREATE TABLE bar (
  id      SERIAL PRIMARY KEY,
  content TEXT NOT NULL
);

-- Indexes
CREATE UNIQUE INDEX bar_content_index ON bar (content);

-- +migrate down
DROP TABLE bar;

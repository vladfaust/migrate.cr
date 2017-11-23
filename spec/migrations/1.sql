-- !migrate up
CREATE TABLE foo (
  id      SERIAL PRIMARY KEY,
  content TEXT NOT NULL
);

-- Indexes
CREATE UNIQUE INDEX foo_content_index ON foo (content);

-- !migrate down
DROP TABLE foo;

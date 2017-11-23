-- !migrate up
CREATE TABLE baz (
  id      SERIAL PRIMARY KEY,
  content TEXT NOT NULL
);

-- Indexes
CREATE UNIQUE INDEX baz_content_index ON baz (content);

-- !migrate down
DROP TABLE baz;

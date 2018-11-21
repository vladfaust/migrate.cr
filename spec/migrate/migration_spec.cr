require "../spec_helper"

describe Migrate::Migration do
  migration_sql = <<-SQL
  -- +migrate up
  CREATE TABLE foo (
    id      SERIAL PRIMARY KEY,
    content TEXT NOT NULL
  );

  -- Indexes
  CREATE UNIQUE INDEX foo_content_index ON foo (content);

  -- Statements that might contain semicolons
  -- +migrate start
  CREATE OR REPLACE FUNCTION trigger_set_timestamp()
  RETURNS TRIGGER AS
  $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;
  -- +migrate end

  -- +migrate down
  DROP TABLE foo;

  SQL

  migration = Migrate::Migration.new(migration_sql.lines.each)

  describe "#queries_up" do
    q1 = <<-SQL
    CREATE TABLE foo (
      id      SERIAL PRIMARY KEY,
      content TEXT NOT NULL
    );
    SQL

    q2 = <<-SQL
    CREATE UNIQUE INDEX foo_content_index ON foo (content);
    SQL

    q3 = <<-SQL
    CREATE OR REPLACE FUNCTION trigger_set_timestamp()
    RETURNS TRIGGER AS
    $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
    SQL

    it do
      migration.queries_up.should eq [q1, q2, q3]
    end
  end

  describe "#sql_down" do
    q1 = <<-SQL
    DROP TABLE foo;
    SQL

    it do
      migration.queries_down.should eq [q1]
    end
  end
end

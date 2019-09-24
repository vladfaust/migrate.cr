require "spec"
require "pg"

require "../src/migrate"

MUTEX = Mutex.new

def drop_db
  DB.open(ENV["DATABASE_URL"]) do |db|
    db.exec <<-SQL
      DROP SCHEMA public CASCADE;
    SQL

    db.exec <<-SQL
      CREATE SCHEMA public;
    SQL
  end
end

require "../spec_helper"

db = DB.open(ENV["DATABASE_URL"])

{% for table in %w(foo bar baz) %}
  def {{table.id}}_exists?(db)
    db.scalar("SELECT COUNT(*) FROM {{table.id}}").as(Int64)
  rescue
    false
  end
{% end %}

describe "Migrate::Migrator with errors" do
  puts "Trying 1.."
  MUTEX.lock
  puts "Locked 1"

  drop_db

  migrator = Migrate::Migrator.new(
    db,
    Logger.new(STDOUT).tap(&.level = Logger::DEBUG),
    File.join("spec", "migrations_with_errors")
  )

  describe "direction-specific errors" do
    it do
      migrator.up

      expect_raises Migrate::Migration::Error do
        migrator.down
      end

      migrator.current_version.should eq 1
    end
  end

  describe "top-level errors" do
    it do
      expect_raises Migrate::Migration::Error do
        migrator.up
      end

      migrator.current_version.should eq 1
    end
  end

  puts "Unlocking 1.."
  MUTEX.unlock
  puts "Unlocked 1"
end

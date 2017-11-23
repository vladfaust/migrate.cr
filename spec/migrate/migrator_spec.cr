require "../spec_helper"

db = DB.open(ENV["DATABASE_URL"])

{% for table in %w(foo bar baz) %}
  def {{table.id}}_exists?(db)
    db.scalar("SELECT COUNT(*) FROM {{table.id}}").as(Int64)
  rescue
    false
  end
{% end %}

describe Migrate::Migrator do
  drop_db

  migrator = Migrate::Migrator.new(
    db,
    Logger.new(STDOUT).tap(&.level = Logger::DEBUG),
    File.join("spec", "migrations")
  )

  describe "#current_version" do
    context "on fresh DB" do
      it "returns 0" do
        migrator.current_version.should eq 0
      end
    end
  end

  describe "#next_version" do
    context "on fresh DB" do
      it "returns 1" do
        migrator.next_version.should eq 1
      end
    end
  end

  describe "#previous_version" do
    context "on fresh DB" do
      it "returns nil" do
        migrator.previous_version.should eq nil
      end
    end
  end

  describe "#up" do
    it do
      migrator.up
      migrator.current_version.should eq 1
      migrator.up
      migrator.current_version.should eq 2
    end

    it "creates tables" do
      foo_exists?(db).should be_truthy
      bar_exists?(db).should be_truthy
    end
  end

  describe "#previous_version" do
    context "after migrations 1 & 2" do
      it "returns 1" do
        migrator.previous_version.should eq 1
      end
    end
  end

  describe "#next_version" do
    context "after migrations 1 & 2" do
      it "returns 10" do
        migrator.next_version.should eq 10
      end
    end
  end

  describe "#down" do
    it do
      migrator.down
      migrator.current_version.should eq 1
    end

    it "drops table" do
      foo_exists?(db).should be_truthy
      bar_exists?(db).should be_falsey
    end
  end

  describe "#to" do
    it do
      migrator.to(10)
      migrator.current_version.should eq 10
    end

    it "creates tables" do
      foo_exists?(db).should be_truthy
      bar_exists?(db).should be_truthy
      baz_exists?(db).should be_truthy
    end

    context "when already at this version" do
      it "doesn't raise" do
        migrator.to(10)
        migrator.current_version.should eq 10
      end
    end

    context "when unknown version" do
      it "raises" do
        expect_raises do
          migrator.to(42)
        end
      end
    end
  end

  describe "#next_version" do
    context "on the last migration" do
      it "returns nil" do
        migrator.next_version.should eq nil
      end
    end
  end

  describe "#redo" do
    it do
      migrator.redo
      migrator.current_version.should eq 10
    end

    it "persists tables" do
      foo_exists?(db).should be_truthy
      bar_exists?(db).should be_truthy
      baz_exists?(db).should be_truthy
    end
  end

  describe "#reset" do
    it do
      migrator.reset
      migrator.current_version.should eq 0
    end

    it "drops tables" do
      foo_exists?(db).should be_falsey
      bar_exists?(db).should be_falsey
      baz_exists?(db).should be_falsey
    end
  end

  describe "#to_latest" do
    it do
      migrator.to_latest
      migrator.current_version.should eq 10
    end

    it "creates tables" do
      foo_exists?(db).should be_truthy
      bar_exists?(db).should be_truthy
      baz_exists?(db).should be_truthy
    end
  end
end

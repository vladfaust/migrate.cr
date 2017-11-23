require "logger"
require "time_format"
require "db"

require "./migration"

module Migrate
  class Migrator
    MIGRATION_FILE_REGEX = /(?<version>\d+)(_(?<name>\w+))?\.sql/

    def initialize(
                   @db : DB::Database,
                   @logger : Logger? = nil,
                   @dir : String = File.join("db", "migrations"),
                   @table : String = "version",
                   @column : String = "version")
      ensure_version_table_exist
    end

    # Return actual DB version.
    def current_version
      query = "SELECT %{column} FROM %{table}" % {
        column: @column,
        table:  @table,
      }

      @logger.try &.debug(query)
      @db.scalar(query).as(Int32 | Int64)
    end

    # Return the next version as defined in migrations dir.
    def next_version
      current_index = all_versions.index(current_version) || raise("Current version #{current_version} is not found in migrations directory!")

      if current_index == all_versions.size - 1
        return nil # Means the current version is the last
      else
        return all_versions[current_index + 1]
      end
    end

    # Return previous version as defined in migrations dir.
    def previous_version
      current_index = all_versions.index(current_version) || raise("Current version #{current_version} is not found in migrations directory!")

      if current_index == 0
        return nil # Means the current version is the first
      else
        return all_versions[current_index - 1]
      end
    end

    # Apply all the migrations from current version to the last one.
    def to_latest
      to(all_versions.last)
    end

    # Migrate one step up.
    def up
      _next = next_version
      to(_next) if _next
    end

    # Migrate one step down.
    def down
      previous = previous_version
      to(previous) if previous
    end

    # Revert all migrations.
    def reset
      to(0)
    end

    # Revert all migrations and then migrate to current version.
    def remigrate
      current = current_version
      reset
      to(current)
    end

    # Migrate to specific version.
    def to(target_version : Int32 | Int64)
      started_at = Time.now
      current = current_version

      if target_version == current
        @logger.try &.info("Already at version #{current}; aborting")
        return nil
      end

      raise("There is no version #{target_version} in migrations dir!") unless all_versions.includes?(target_version)

      direction = target_version > current ? Direction::Up : Direction::Down

      applied_versions = all_versions.to_a.select do |version|
        case direction
        when Direction::Up
          version > current && version <= target_version
        when Direction::Down
          version - 1 < current && version - 1 >= target_version
        end
      end

      @logger.try &.debug("Applied versions: #{applied_versions.map(&.to_s).join(", ")}")

      applied_files = migrations.select do |filename|
        applied_versions.includes?(MIGRATION_FILE_REGEX.match(filename).not_nil!["version"].to_i)
      end

      queries = applied_files.map do |file_path|
        migration = Migration.new(File.join(@dir, file_path))

        case direction
        when Direction::Up
          migration.queries_up
        when Direction::Down
          migration.queries_down
        end.not_nil!
      end.flatten

      @db.transaction do |tx|
        queries.each do |query|
          tx.connection.exec(query)
        end

        tx.connection.exec(update_version_query(target_version))
      end

      previous = current
      current = current_version

      @logger.try &.info("Successfully migrated from version #{previous} to #{current} in #{TimeFormat.auto(Time.now - started_at)}")
      return current
    end

    private UPDATE_VERSION_SQL = <<-SQL
    UPDATE %{table} SET %{column} = %{value}
    SQL

    protected def update_version_query(version)
      UPDATE_VERSION_SQL % {
        table:  @table,
        column: @column,
        value:  version,
      }
    end

    # Return a sorted array of versions extracted from filenames in migrations dir. Contains 0 version which means no migrations.
    protected def all_versions
      migrations.map do |filename|
        MIGRATION_FILE_REGEX.match(filename).not_nil!["version"].to_i
      end.unshift(0)
    end

    # Return sorted array of migration file names.
    protected def migrations
      Dir.entries(@dir).select do |filename|
        MIGRATION_FILE_REGEX.match(filename)
      end.sort_by do |filename|
        MIGRATION_FILE_REGEX.match(filename).not_nil!["version"].to_i
      end
    end

    private CREATE_TABLE_SQL = <<-SQL
    CREATE TABLE IF NOT EXISTS %{table} (%{column} INT NOT NULL)
    SQL

    private COUNT_ROWS_SQL = <<-SQL
    SELECT COUNT(%{column}) FROM %{table}
    SQL

    private INSERT_SQL = <<-SQL
    INSERT INTO %{table} (%{column}) VALUES (%{value})
    SQL

    protected def ensure_version_table_exist
      table_query = CREATE_TABLE_SQL % {
        table:  @table,
        column: @column,
      }

      count_query = COUNT_ROWS_SQL % {
        table:  @table,
        column: @column,
      }

      insert_query = INSERT_SQL % {
        table:  @table,
        column: @column,
        value:  0,
      }

      @logger.try &.debug(table_query)
      @db.exec(table_query)

      @logger.try &.debug(count_query)
      count = @db.scalar(count_query).as(Int64)

      if count == 0
        @logger.try &.debug(insert_query)
        @db.exec(insert_query)
      end
    end
  end
end

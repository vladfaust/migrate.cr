# Migrate

A simple(r) migration solution.

[![Build Status](https://travis-ci.org/vladfaust/migrate.cr.svg?branch=master)](https://travis-ci.org/vladfaust/migrate.cr) [![Docs](https://img.shields.io/badge/docs-available-brightgreen.svg)](https://vladfaust.com/migrate.cr) [![Dependency Status](https://shards.rocks/badge/github/vladfaust/migrate.cr/status.svg)](https://shards.rocks/github/vladfaust/migrate.cr) [![GitHub release](https://img.shields.io/github/release/vladfaust/migrate.cr.svg)](https://github.com/vladfaust/migrate.cr/releases)

## Motivation

In comparsion to [micrate.cr](https://github.com/juanedi/micrate) (which seems to be abandoned as for 23/11/17):

- Can specify generic number as migration version (e.g. `1.sql`, `2_create_users.sql` or `1511464469_create_posts.sql`).
- Can migrate to a specific version.
- All migrations are executed in transactions.
- Can pass `DB::Database` instance to migrator.
- Current version is stored in a database table `"version"` (can be changed) with a single value `"version"` (can be changed as well).
- CLI removed.

This shard **is not compatible** with [micrate.cr](https://github.com/juanedi/micrate).

## Installation

Add this to your application's `shard.yml`:

```yaml
dependencies:
  migrate:
    github: vladfaust/migrate.cr
```

## Usage

### Migration files

`db/migrations/1.sql`:

```sql
-- !migrate up
CREATE TABLE foo (
  id      SERIAL PRIMARY KEY,
  content TEXT NOT NULL
);

-- Indexes
CREATE UNIQUE INDEX foo_content_index ON foo (content);

-- !migrate down
DROP TABLE foo;
```

`db/migrations/2_create_bar.sql`:

```sql
-- !migrate up
CREATE TABLE bar (
  id      SERIAL PRIMARY KEY,
  content TEXT NOT NULL
);

-- Indexes
CREATE UNIQUE INDEX bar_content_index ON bar (content);

-- !migrate down
DROP TABLE bar;
```

`db/migrations/10_create_baz.sql`:

```sql
-- !migrate up
CREATE TABLE baz (
  id      SERIAL PRIMARY KEY,
  content TEXT NOT NULL
);

-- Indexes
CREATE UNIQUE INDEX baz_content_index ON baz (content);

-- !migrate down
DROP TABLE baz;
```

### Migration in the code

All migrations are executed as **transactions**. That means that if a migration is invalid, all statements in this session will be cancelled.

```crystal
require "pg"
require "migrate"

migrator = Migrate::Migrator.new(
  DB.open(ENV["DATABASE_URL"]),
  Logger.new(STDOUT),
  File.join("db", "migrations"), # Path to migrations
  "version", # Version table name
  "version" # Version column name
)

migrator.current_version  # => 0
migrator.next_version     # => 1
migrator.previous_version # => nil

migrator.up
# =>  INFO -- : Successfully migrated from version 0 to 1 in 37.602ms
migrator.current_version  # => 1
migrator.previous_version # => 0

migrator.down
# =>  INFO -- : Successfully migrated from version 1 to 0 in 27.027ms
migrator.current_version # => 0

migrator.to(10)
# =>  INFO -- : Successfully migrated from version 0 to 10 in 62.214ms
migrator.current_version # => 10
migrator.next_version    # => nil

migrator.remigrate
# =>  INFO -- : Successfully migrated from version 10 to 0 in 30.006ms
# =>  INFO -- : Successfully migrated from version 0 to 10 in 72.877ms
migrator.current_version # => 10

migrator.reset
# =>  INFO -- : Successfully migrated from version 10 to 0 in 28.958ms
migrator.current_version # => 0

migrator.to_latest
# =>  INFO -- : Successfully migrated from version 0 to 10 in 39.189ms
migrator.current_version # => 10
```

### [Cakefile](https://github.com/axvm/cake)

Note that `Cakefile` doesn't support task arguments (that means `Migrator#to` is not available).

```crystal
require "pg"
require "migrate"

migrator = Migrate::Migrator.new(ditto)

desc "Migrate Database to the latest version"
task :dbmigrate do
  migrator.to_latest
end
```

Usage:

```
$ cake db:migrate
DEBUG -- : CREATE TABLE IF NOT EXISTS version (version INT NOT NULL)
DEBUG -- : SELECT COUNT(version) FROM version
DEBUG -- : SELECT version FROM version
DEBUG -- : Applied versions: 1, 2, 10
DEBUG -- : SELECT version FROM version
 INFO -- : Successfully migrated from version 0 to 10 in 33.46ms
```

### [Sam.cr](https://github.com/imdrasil/sam.cr)

```crystal
require "sam"
require "migrate"

Sam.namespace "db" do
  migrator = Migrate::Migrator.new(ditto)

  task "migrate" do
    migrator.to_latest
  end
end
```

Usage:

```
crystal sam.cr -- db:migrate
ditto
```

## Testing

```
env DATABASE_URL=<YOUR_DATABASE_URL> crystal spec
```

## Contributing

1. Fork it ( https://github.com/vladfaust/migrate.cr/fork )
2. Create your feature branch (git checkout -b my-new-feature)
3. Commit your changes (git commit -am 'Add some feature')
4. Push to the branch (git push origin my-new-feature)
5. Create a new Pull Request

## Contributors

- [@vladfaust](https://github.com/vladfaust) Vlad Faust - creator, maintainer

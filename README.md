# Migrate

Simple database migration solution.

[![Build Status](https://travis-ci.org/vladfaust/migrate.cr.svg?branch=master)](https://travis-ci.org/vladfaust/migrate.cr) [![Docs](https://img.shields.io/badge/docs-available-brightgreen.svg)](https://vladfaust.com/migrate.cr) [![Dependency Status](https://shards.rocks/badge/github/vladfaust/migrate.cr/status.svg)](https://shards.rocks/github/vladfaust/migrate.cr) [![GitHub release](https://img.shields.io/github/release/vladfaust/migrate.cr.svg)](https://github.com/vladfaust/migrate.cr/releases)

## Motivation

In comparsion to [micrate.cr](https://github.com/juanedi/micrate):

- Can specify generic number as migration version (e.g. `1.sql`, `2_create_users.sql` or `1511464469_create_posts.sql`).
- Can migrate to a specific version.
- Can pass `DB::Database` instance to migrator.
- All migrations are applied in a single transaction.
- SQL errors are logged and do abort the transaction.
- Actual migration version is stored in a database table `"version"` (can be changed) with a single value `"version"` (can be changed as well).
- CLI removed.

This shard **is not compatible** with [micrate.cr](https://github.com/juanedi/micrate), because it uses diferrent notations in SQL files (`-- +migrate Up` instead of `-- !micrate Up`) and db scheme (see above). In fact, if you really want, you can transfer your existing app to Migrate, but this will require some manual changes.

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
-- +migrate up
CREATE TABLE foo (
  id      SERIAL PRIMARY KEY,
  content TEXT NOT NULL
);

-- Indexes (it's just a comment, no utility function)
CREATE UNIQUE INDEX foo_content_index ON foo (content);

-- +migrate down
DROP TABLE foo;
```

`db/migrations/2_create_bar.sql`:

```sql
-- +migrate up
CREATE TABLE bar (
  id      SERIAL PRIMARY KEY,
  content TEXT NOT NULL
);

-- Indexes
CREATE UNIQUE INDEX bar_content_index ON bar (content);

-- +migrate down
DROP TABLE bar;
```

`db/migrations/10_create_baz.sql`:

```sql
-- +migrate up
CREATE TABLE baz (
  id      SERIAL PRIMARY KEY,
  content TEXT NOT NULL
);

-- Indexes
CREATE UNIQUE INDEX baz_content_index ON baz (content);

-- +migrate down
DROP TABLE baz;
```

### Migration in the code

All migrations are applied in a single **transaction**. That means that if a migration is invalid, all statements in this transaction will be rolled back.

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

migrator.redo
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

Note that `Cakefile` doesn't support task arguments (that means that `Migrator#to` will not be available). Also see [cake-bake](https://github.com/vladfaust/cake-bake.cr) for baking Cakefiles (this could be helpful in Docker deployments).

```crystal
require "pg"
require "migrate"

desc "Migrate Database to the latest version"
task :dbmigrate do
  migrator = Migrate::Migrator.new(ditto)
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

1. Create an empty PostgreSQL database (e.g. `migrate`)
2. `cd migrate`
3. `env DATABASE_URL=postgres://postgres:postgres@localhost:5432/migrate crystal spec`

## Contributing

1. Fork it ( https://github.com/vladfaust/migrate.cr/fork )
2. Create your feature branch (git checkout -b my-new-feature)
3. Commit your changes (git commit -am 'Add some feature')
4. Push to the branch (git push origin my-new-feature)
5. Create a new Pull Request

## Contributors

- [@vladfaust](https://github.com/vladfaust) Vlad Faust - creator, maintainer

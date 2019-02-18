# Migrate

[![Built with Crystal](https://img.shields.io/badge/built%20with-crystal-000000.svg?style=flat-square)](https://crystal-lang.org/)
[![Build status](https://img.shields.io/travis/vladfaust/migrate.cr/master.svg?style=flat-square)](https://travis-ci.org/vladfaust/migrate.cr)
[![API Docs](https://img.shields.io/badge/api_docs-online-brightgreen.svg?style=flat-square)](https://github.vladfaust.com/migrate.cr)
[![Releases](https://img.shields.io/github/release/vladfaust/migrate.cr.svg?style=flat-square)](https://github.com/vladfaust/migrate.cr/releases)
[![Awesome](https://github.com/vladfaust/awesome/blob/badge-flat-alternative/media/badge-flat-alternative.svg)](https://github.com/veelenga/awesome-crystal)
[![vladfaust.com](https://img.shields.io/badge/style-.com-lightgrey.svg?longCache=true&style=flat-square&label=vladfaust&colorB=0a83d8)](https://vladfaust.com)
[![Patrons count](https://img.shields.io/badge/dynamic/json.svg?label=patrons&url=https://www.patreon.com/api/user/11296360&query=$.included[0].attributes.patron_count&style=flat-square&colorB=red&maxAge=86400)](https://www.patreon.com/vladfaust)

A database migration tool for [Crystal](https://crystal-lang.org/).

[![Become Patron](https://vladfaust.com/img/patreon-small.svg)](https://www.patreon.com/vladfaust)

## Installation

Add this to your application's `shard.yml`:

```yaml
dependencies:
  migrate:
    github: vladfaust/migrate.cr
    version: ~> 0.4.1
```

This shard follows [Semantic Versioning v2.0.0](http://semver.org/), so check [releases](https://github.com/vladfaust/core/releases) and change the `version` accordingly.

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

-- Statements which might contain semicolons
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
# =>  INFO -- : Migrating up to version 0 → 1
# =>  INFO -- : Successfully migrated from version 0 to 1 in 37.602ms
migrator.current_version  # => 1
migrator.previous_version # => 0

migrator.down
# =>  INFO -- : Migrating down to version 1 → 0
# =>  INFO -- : Successfully migrated from version 1 to 0 in 27.027ms
migrator.current_version # => 0

migrator.to(10)
# =>  INFO -- : Migrating up to version 0 → 1 → 2 → 10
# =>  INFO -- : Successfully migrated from version 0 to 10 in 62.214ms
migrator.current_version # => 10
migrator.next_version    # => nil

migrator.redo
# =>  INFO -- : Migrating down to version 10 → 2 → 1 → 0
# =>  INFO -- : Successfully migrated from version 10 to 0 in 30.006ms
# =>  INFO -- : Migrating up to version 0 → 1 → 2 → 10
# =>  INFO -- : Successfully migrated from version 0 to 10 in 72.877ms
migrator.current_version # => 10

migrator.reset
# =>  INFO -- : Migrating down to version 10 → 2 → 1 → 0
# =>  INFO -- : Successfully migrated from version 10 to 0 in 28.958ms
migrator.current_version # => 0

migrator.to_latest
# =>  INFO -- : Migrating up to version 0 → 1 → 2 → 10
# =>  INFO -- : Successfully migrated from version 0 to 10 in 39.189ms
migrator.current_version # => 10
```

### Errors

A special command `+migrate error` is available. It raises `Migrate::Migration::Error` when a specific migration file is run. A error can be either top-level or direction-specific. This is useful to point out irreversible migrations:

```sql
-- +migrate up
CREATE TABLE foo;

-- +migrate down
-- +migrate error Could not migrate down from this point
```

```sql
-- +migrate error Could not run this migration file at all
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
 INFO -- : Migrating up to version 0 → 1 → 2 → 10
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

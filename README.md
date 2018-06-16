# Migrate

[![Built with Crystal](https://img.shields.io/badge/built%20with-crystal-000000.svg?style=flat-square)](https://crystal-lang.org/)
[![Build status](https://img.shields.io/travis/vladfaust/migrate.cr/master.svg?style=flat-square)](https://travis-ci.org/vladfaust/migrate.cr)
[![Docs](https://img.shields.io/badge/docs-available-brightgreen.svg?style=flat-square)](https://vladfaust.com/migrate.cr)
[![Releases](https://img.shields.io/github/release/vladfaust/migrate.cr.svg?style=flat-square)](https://github.com/vladfaust/migrate.cr/releases)
[![Awesome](https://img.shields.io/badge/style-awesome-lightgrey.svg?longCache=true&style=flat-square&label=&colorA=fc60a8&colorB=494368&status=ok&logo=data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PHN2ZyAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIiAgIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIgICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiICAgd2lkdGg9IjE1NC43ODEyNW1tIiAgIGhlaWdodD0iODAuMTE1ODI5bW0iICAgdmlld0JveD0iMCAwIDE1NC43ODEyNSA4MC4xMTU4MjkiICAgdmVyc2lvbj0iMS4xIiAgIGlkPSJzdmc4IiAgIGlua3NjYXBlOnZlcnNpb249IjAuOTIuMSByMTUzNzEiICAgc29kaXBvZGk6ZG9jbmFtZT0iYXdlc29tZS5zdmciPiAgPGRlZnMgICAgIGlkPSJkZWZzMiIgLz4gIDxzb2RpcG9kaTpuYW1lZHZpZXcgICAgIGlkPSJiYXNlIiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiICAgICBib3JkZXJvcGFjaXR5PSIxLjAiICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMC4wIiAgICAgaW5rc2NhcGU6cGFnZXNoYWRvdz0iMiIgICAgIGlua3NjYXBlOnpvb209IjAuNyIgICAgIGlua3NjYXBlOmN4PSIxMzMuMTU2NTYiICAgICBpbmtzY2FwZTpjeT0iMTAxLjUzNjMiICAgICBpbmtzY2FwZTpkb2N1bWVudC11bml0cz0ibW0iICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJsYXllcjEiICAgICBzaG93Z3JpZD0iZmFsc2UiICAgICBmaXQtbWFyZ2luLXRvcD0iMCIgICAgIGZpdC1tYXJnaW4tbGVmdD0iMCIgICAgIGZpdC1tYXJnaW4tcmlnaHQ9IjAiICAgICBmaXQtbWFyZ2luLWJvdHRvbT0iMCIgICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTkyMCIgICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjEwMTciICAgICBpbmtzY2FwZTp3aW5kb3cteD0iLTgiICAgICBpbmtzY2FwZTp3aW5kb3cteT0iLTgiICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIxIiAvPiAgPG1ldGFkYXRhICAgICBpZD0ibWV0YWRhdGE1Ij4gICAgPHJkZjpSREY+ICAgICAgPGNjOldvcmsgICAgICAgICByZGY6YWJvdXQ9IiI+ICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD4gICAgICAgIDxkYzp0eXBlICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPiAgICAgICAgPGRjOnRpdGxlPjwvZGM6dGl0bGU+ICAgICAgPC9jYzpXb3JrPiAgICA8L3JkZjpSREY+ICA8L21ldGFkYXRhPiAgPGcgICAgIGlua3NjYXBlOmxhYmVsPSJMYXllciAxIiAgICAgaW5rc2NhcGU6Z3JvdXBtb2RlPSJsYXllciIgICAgIGlkPSJsYXllcjEiICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMzIuMjA5MjQzLC05OS4zODI3MDcpIj4gICAgPHBhdGggICAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtzdHJva2Utd2lkdGg6MC4yNjQ1ODMzMiIgICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIgICAgICAgZD0ibSAxODYuOTkwNDksMTM1LjgxNTgzIC0zOS42ODc1LC0zNi40MDY2NjQgLTUuNTgyNzEsNi4wODU0MTQgMzMuMDcyOTIsMzAuMzIxMjUgSCA0NC40MzI5OTQgTCA3Ny41MDU5MSwxMDUuNDY4MTIgNzEuOTIzMjAyLDk5LjM4MjcwNyAzMi4yMzU3MDMsMTM1LjgxNTgzIGggLTAuMDI2NDYgdiAyMy45OTc3MSBjIDAsMTAuODQ3OTEgMTAuNDUxMDQxLDE5LjY4NSAyMy4yODMzMzIsMTkuNjg1IGggMjQuNDczOTU4IGMgMTIuODMyMjkyLDAgMjMuMjgzMzM3LC04LjgzNzA5IDIzLjI4MzMzNywtMTkuNjg1IHYgLTE1Ljc2OTE3IGggMTIuNyB2IDE1Ljc2OTE3IGMgMCwxMC44NDc5MSAxMC40NTEwNCwxOS42ODUgMjMuMjgzMzMsMTkuNjg1IGggMjQuNDczOTYgYyAxMi44MzIyOSwwIDIzLjI4MzMzLC04LjgzNzA5IDIzLjI4MzMzLC0xOS42ODUgeiIgICAgICAgaWQ9InBhdGg0NDg3IiAvPiAgPC9nPjwvc3ZnPg==)](https://github.com/veelenga/awesome-crystal)
[![vladfaust.com](https://img.shields.io/badge/style-.com-lightgrey.svg?longCache=true&style=flat-square&label=vladfaust&colorB=0a83d8)](https://vladfaust.com)

Simple database migration solution for [Crystal](https://crystal-lang.org/).

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

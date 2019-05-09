crystal_doc_search_index_callback({"repository_name":"github.com/vladfaust/migrate.cr","body":"# Migrate\n\n[![Built with Crystal](https://img.shields.io/badge/built%20with-crystal-000000.svg?style=flat-square)](https://crystal-lang.org/)\n[![Build status](https://img.shields.io/travis/vladfaust/migrate.cr/master.svg?style=flat-square)](https://travis-ci.org/vladfaust/migrate.cr)\n[![API Docs](https://img.shields.io/badge/api_docs-online-brightgreen.svg?style=flat-square)](https://github.vladfaust.com/migrate.cr)\n[![Releases](https://img.shields.io/github/release/vladfaust/migrate.cr.svg?style=flat-square)](https://github.com/vladfaust/migrate.cr/releases)\n[![Awesome](https://awesome.re/badge-flat2.svg)](https://github.com/veelenga/awesome-crystal)\n[![vladfaust.com](https://img.shields.io/badge/style-.com-lightgrey.svg?longCache=true&style=flat-square&label=vladfaust&colorB=0a83d8)](https://vladfaust.com)\n[![Patrons count](https://img.shields.io/badge/dynamic/json.svg?label=patrons&url=https://www.patreon.com/api/user/11296360&query=$.included[0].attributes.patron_count&style=flat-square&colorB=red&maxAge=86400)](https://www.patreon.com/vladfaust)\n[![Gitter chat](https://img.shields.io/badge/chat%20on-gitter-green.svg?colorB=ED1965&logo=gitter&style=flat-square)](https://gitter.im/vladfaust/migrate.cr)\n\nA database migration tool for [Crystal](https://crystal-lang.org/).\n\n## Supporters\n\nThanks to all my patrons, I can continue working on beautiful Open Source Software! 🙏\n\n[Lauri Jutila](https://github.com/ljuti), [Alexander Maslov](https://seendex.ru), Dainel Vera\n\n*You can become a patron too in exchange of prioritized support and other perks*\n\n[![Become Patron](https://vladfaust.com/img/patreon-small.svg)](https://www.patreon.com/vladfaust)\n\n## Installation\n\nAdd this to your application's `shard.yml`:\n\n```yaml\ndependencies:\n  migrate:\n    github: vladfaust/migrate.cr\n    version: ~> 0.4.1\n```\n\nThis shard follows [Semantic Versioning v2.0.0](http://semver.org/), so check [releases](https://github.com/vladfaust/core/releases) and change the `version` accordingly.\n\n## Usage\n\n### Migration files\n\n`db/migrations/1.sql`:\n\n```sql\n-- +migrate up\nCREATE TABLE foo (\n  id      SERIAL PRIMARY KEY,\n  content TEXT NOT NULL\n);\n\n-- Indexes (it's just a comment, no utility function)\nCREATE UNIQUE INDEX foo_content_index ON foo (content);\n\n-- +migrate down\nDROP TABLE foo;\n```\n\n`db/migrations/2_create_bar.sql`:\n\n```sql\n-- +migrate up\nCREATE TABLE bar (\n  id      SERIAL PRIMARY KEY,\n  content TEXT NOT NULL\n);\n\n-- Indexes\nCREATE UNIQUE INDEX bar_content_index ON bar (content);\n\n-- +migrate down\nDROP TABLE bar;\n```\n\n`db/migrations/10_create_baz.sql`:\n\n```sql\n-- +migrate up\nCREATE TABLE baz (\n  id      SERIAL PRIMARY KEY,\n  content TEXT NOT NULL\n);\n\n-- Indexes\nCREATE UNIQUE INDEX baz_content_index ON baz (content);\n\n-- Statements which might contain semicolons\n-- +migrate start\nCREATE OR REPLACE FUNCTION trigger_set_timestamp()\nRETURNS TRIGGER AS\n$$\nBEGIN\n  NEW.updated_at = NOW();\n  RETURN NEW;\nEND;\n$$ LANGUAGE plpgsql;\n-- +migrate end\n\n-- +migrate down\nDROP TABLE baz;\n```\n\n### Migration in the code\n\nAll migrations run in separate **transactions**. That means that if a migration is invalid, all its statements will be rolled back (but not the previously applied migrations in a batch).\n\n```crystal\nrequire \"pg\"\nrequire \"migrate\"\n\nmigrator = Migrate::Migrator.new(\n  DB.open(ENV[\"DATABASE_URL\"]),\n  Logger.new(STDOUT),\n  File.join(\"db\", \"migrations\"), # Path to migrations\n  \"version\", # Version table name\n  \"version\" # Version column name\n)\n\nmigrator.current_version  # => 0\nmigrator.next_version     # => 1\nmigrator.previous_version # => nil\n\nmigrator.up\n# =>  INFO -- : Migrating up to version 0 → 1\n# =>  INFO -- : Successfully migrated from version 0 to 1 in 37.602ms\nmigrator.current_version  # => 1\nmigrator.previous_version # => 0\n\nmigrator.down\n# =>  INFO -- : Migrating down to version 1 → 0\n# =>  INFO -- : Successfully migrated from version 1 to 0 in 27.027ms\nmigrator.current_version # => 0\n\nmigrator.to(10)\n# =>  INFO -- : Migrating up to version 0 → 1 → 2 → 10\n# =>  INFO -- : Successfully migrated from version 0 to 10 in 62.214ms\nmigrator.current_version # => 10\nmigrator.next_version    # => nil\n\nmigrator.redo\n# =>  INFO -- : Migrating down to version 10 → 2 → 1 → 0\n# =>  INFO -- : Successfully migrated from version 10 to 0 in 30.006ms\n# =>  INFO -- : Migrating up to version 0 → 1 → 2 → 10\n# =>  INFO -- : Successfully migrated from version 0 to 10 in 72.877ms\nmigrator.current_version # => 10\n\nmigrator.reset\n# =>  INFO -- : Migrating down to version 10 → 2 → 1 → 0\n# =>  INFO -- : Successfully migrated from version 10 to 0 in 28.958ms\nmigrator.current_version # => 0\n\nmigrator.to_latest\n# =>  INFO -- : Migrating up to version 0 → 1 → 2 → 10\n# =>  INFO -- : Successfully migrated from version 0 to 10 in 39.189ms\nmigrator.current_version # => 10\n```\n\n### Errors\n\nA special command `+migrate error` is available. It raises `Migrate::Migration::Error` when a specific migration file is run. A error can be either top-level or direction-specific. This is useful to point out irreversible migrations:\n\n```sql\n-- +migrate up\nCREATE TABLE foo;\n\n-- +migrate down\n-- +migrate error Could not migrate down from this point\n```\n\n```sql\n-- +migrate error Could not run this migration file at all\n```\n\n### [Cakefile](https://github.com/axvm/cake)\n\nNote that `Cakefile` doesn't support task arguments (that means that `Migrator#to` will not be available). Also see [cake-bake](https://github.com/vladfaust/cake-bake.cr) for baking Cakefiles (this could be helpful in Docker deployments).\n\n```crystal\nrequire \"pg\"\nrequire \"migrate\"\n\ndesc \"Migrate Database to the latest version\"\ntask :dbmigrate do\n  migrator = Migrate::Migrator.new(ditto)\n  migrator.to_latest\nend\n```\n\nUsage:\n\n```\n$ cake db:migrate\n INFO -- : Migrating up to version 0 → 1 → 2 → 10\n INFO -- : Successfully migrated from version 0 to 10 in 33.46ms\n```\n\n### [Sam.cr](https://github.com/imdrasil/sam.cr)\n\n```crystal\nrequire \"sam\"\nrequire \"migrate\"\n\nSam.namespace \"db\" do\n  migrator = Migrate::Migrator.new(ditto)\n\n  task \"migrate\" do\n    migrator.to_latest\n  end\nend\n```\n\nUsage:\n\n```\ncrystal sam.cr -- db:migrate\nditto\n```\n\n## Testing\n\n1. Create an empty PostgreSQL database (e.g. `migrate`)\n2. `cd migrate`\n3. `env DATABASE_URL=postgres://postgres:postgres@localhost:5432/migrate crystal spec`\n\n## Contributing\n\n1. Fork it ( https://github.com/vladfaust/migrate.cr/fork )\n2. Create your feature branch (git checkout -b my-new-feature)\n3. Commit your changes (git commit -am 'Add some feature')\n4. Push to the branch (git push origin my-new-feature)\n5. Create a new Pull Request\n\n## Contributors\n\n- [@vladfaust](https://github.com/vladfaust) Vlad Faust - creator, maintainer\n","program":{"html_id":"github.com/vladfaust/migrate.cr/toplevel","path":"toplevel.html","kind":"module","full_name":"Top Level Namespace","name":"Top Level Namespace","abstract":false,"superclass":null,"ancestors":[],"locations":[],"repository_name":"github.com/vladfaust/migrate.cr","program":true,"enum":false,"alias":false,"aliased":"","const":false,"constants":[],"included_modules":[],"extended_modules":[],"subclasses":[],"including_types":[],"namespace":null,"doc":null,"summary":null,"class_methods":[],"constructors":[],"instance_methods":[],"macros":[],"types":[{"html_id":"github.com/vladfaust/migrate.cr/Migrate","path":"Migrate.html","kind":"module","full_name":"Migrate","name":"Migrate","abstract":false,"superclass":null,"ancestors":[],"locations":[{"filename":"migrate/migration/error.cr","line_number":1,"url":"https://github.com/vladfaust/migrate.cr/blob/ce963c509bb265d6fd1be7fe667228c2d5b7214f/src/migrate/migration/error.cr"},{"filename":"migrate/migration.cr","line_number":3,"url":"https://github.com/vladfaust/migrate.cr/blob/ce963c509bb265d6fd1be7fe667228c2d5b7214f/src/migrate/migration.cr"},{"filename":"migrate/migrator.cr","line_number":7,"url":"https://github.com/vladfaust/migrate.cr/blob/ce963c509bb265d6fd1be7fe667228c2d5b7214f/src/migrate/migrator.cr"},{"filename":"migrate/version.cr","line_number":1,"url":"https://github.com/vladfaust/migrate.cr/blob/ce963c509bb265d6fd1be7fe667228c2d5b7214f/src/migrate/version.cr"},{"filename":"migrate.cr","line_number":3,"url":"https://github.com/vladfaust/migrate.cr/blob/ce963c509bb265d6fd1be7fe667228c2d5b7214f/src/migrate.cr"}],"repository_name":"github.com/vladfaust/migrate.cr","program":false,"enum":false,"alias":false,"aliased":"","const":false,"constants":[{"id":"VERSION","name":"VERSION","value":"\"0.2.0\"","doc":null,"summary":null}],"included_modules":[],"extended_modules":[],"subclasses":[],"including_types":[],"namespace":null,"doc":null,"summary":null,"class_methods":[],"constructors":[],"instance_methods":[],"macros":[],"types":[{"html_id":"github.com/vladfaust/migrate.cr/Migrate/Migrator","path":"Migrate/Migrator.html","kind":"class","full_name":"Migrate::Migrator","name":"Migrator","abstract":false,"superclass":{"html_id":"github.com/vladfaust/migrate.cr/Reference","kind":"class","full_name":"Reference","name":"Reference"},"ancestors":[{"html_id":"github.com/vladfaust/migrate.cr/Reference","kind":"class","full_name":"Reference","name":"Reference"},{"html_id":"github.com/vladfaust/migrate.cr/Object","kind":"class","full_name":"Object","name":"Object"}],"locations":[{"filename":"migrate/migrator.cr","line_number":8,"url":"https://github.com/vladfaust/migrate.cr/blob/ce963c509bb265d6fd1be7fe667228c2d5b7214f/src/migrate/migrator.cr"}],"repository_name":"github.com/vladfaust/migrate.cr","program":false,"enum":false,"alias":false,"aliased":"","const":false,"constants":[{"id":"MIGRATION_FILE_REGEX","name":"MIGRATION_FILE_REGEX","value":"/(?<version>\\d+)(_(?<name>\\w+))?\\.sql/","doc":null,"summary":null}],"included_modules":[],"extended_modules":[],"subclasses":[],"including_types":[],"namespace":{"html_id":"github.com/vladfaust/migrate.cr/Migrate","kind":"module","full_name":"Migrate","name":"Migrate"},"doc":null,"summary":null,"class_methods":[],"constructors":[{"id":"new(db:DB::Database,logger:Logger?=nil,dir:String=File.join(&quot;db&quot;,&quot;migrations&quot;),table:String=&quot;version&quot;,column:String=&quot;version&quot;)-class-method","html_id":"new(db:DB::Database,logger:Logger?=nil,dir:String=File.join(&amp;quot;db&amp;quot;,&amp;quot;migrations&amp;quot;),table:String=&amp;quot;version&amp;quot;,column:String=&amp;quot;version&amp;quot;)-class-method","name":"new","doc":null,"summary":null,"abstract":false,"args":[{"name":"db","doc":null,"default_value":"","external_name":"db","restriction":"DB::Database"},{"name":"logger","doc":null,"default_value":"nil","external_name":"logger","restriction":"Logger | ::Nil"},{"name":"dir","doc":null,"default_value":"File.join(\"db\", \"migrations\")","external_name":"dir","restriction":"String"},{"name":"table","doc":null,"default_value":"\"version\"","external_name":"table","restriction":"String"},{"name":"column","doc":null,"default_value":"\"version\"","external_name":"column","restriction":"String"}],"args_string":"(db : DB::Database, logger : Logger? = <span class=\"n\">nil</span>, dir : String = <span class=\"t\">File</span>.join(<span class=\"s\">&quot;db&quot;</span>, <span class=\"s\">&quot;migrations&quot;</span>), table : String = <span class=\"s\">&quot;version&quot;</span>, column : String = <span class=\"s\">&quot;version&quot;</span>)","source_link":"https://github.com/vladfaust/migrate.cr/blob/ce963c509bb265d6fd1be7fe667228c2d5b7214f/src/migrate/migrator.cr#L11","def":{"name":"new","args":[{"name":"db","doc":null,"default_value":"","external_name":"db","restriction":"DB::Database"},{"name":"logger","doc":null,"default_value":"nil","external_name":"logger","restriction":"Logger | ::Nil"},{"name":"dir","doc":null,"default_value":"File.join(\"db\", \"migrations\")","external_name":"dir","restriction":"String"},{"name":"table","doc":null,"default_value":"\"version\"","external_name":"table","restriction":"String"},{"name":"column","doc":null,"default_value":"\"version\"","external_name":"column","restriction":"String"}],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"_ = allocate\n_.initialize(db, logger, dir, table, column)\nif _.responds_to?(:finalize)\n  ::GC.add_finalizer(_)\nend\n_\n"}}],"instance_methods":[{"id":"current_version-instance-method","html_id":"current_version-instance-method","name":"current_version","doc":"Return actual DB version.","summary":"<p>Return actual DB version.</p>","abstract":false,"args":[],"args_string":"","source_link":"https://github.com/vladfaust/migrate.cr/blob/ce963c509bb265d6fd1be7fe667228c2d5b7214f/src/migrate/migrator.cr#L22","def":{"name":"current_version","args":[],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"query = \"SELECT %{column} FROM %{table}\" % {column: @column, table: @table}\n(@db.scalar(query)).as(Int32 | Int64)\n"}},{"id":"down-instance-method","html_id":"down-instance-method","name":"down","doc":"Migrate one step down.","summary":"<p>Migrate one step down.</p>","abstract":false,"args":[],"args_string":"","source_link":"https://github.com/vladfaust/migrate.cr/blob/ce963c509bb265d6fd1be7fe667228c2d5b7214f/src/migrate/migrator.cr#L70","def":{"name":"down","args":[],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"previous = previous_version\nif previous\n  to(previous)\nend\n"}},{"id":"latest?-instance-method","html_id":"latest?-instance-method","name":"latest?","doc":"Return if current version is the latest one.","summary":"<p>Return if current version is the latest one.</p>","abstract":false,"args":[],"args_string":"","source_link":"https://github.com/vladfaust/migrate.cr/blob/ce963c509bb265d6fd1be7fe667228c2d5b7214f/src/migrate/migrator.cr#L54","def":{"name":"latest?","args":[],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"next_version.nil?"}},{"id":"next_version-instance-method","html_id":"next_version-instance-method","name":"next_version","doc":"Return the next version as defined in migrations dir.","summary":"<p>Return the next version as defined in migrations dir.</p>","abstract":false,"args":[],"args_string":"","source_link":"https://github.com/vladfaust/migrate.cr/blob/ce963c509bb265d6fd1be7fe667228c2d5b7214f/src/migrate/migrator.cr#L32","def":{"name":"next_version","args":[],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"current_index = (all_versions.index(current_version)) || (raise(\"Current version #{current_version} is not found in migrations directory!\"))\nif current_index == (all_versions.size - 1)\n  return nil\nelse\n  return all_versions[current_index + 1]\nend\n"}},{"id":"previous_version-instance-method","html_id":"previous_version-instance-method","name":"previous_version","doc":"Return previous version as defined in migrations dir.","summary":"<p>Return previous version as defined in migrations dir.</p>","abstract":false,"args":[],"args_string":"","source_link":"https://github.com/vladfaust/migrate.cr/blob/ce963c509bb265d6fd1be7fe667228c2d5b7214f/src/migrate/migrator.cr#L43","def":{"name":"previous_version","args":[],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"current_index = (all_versions.index(current_version)) || (raise(\"Current version #{current_version} is not found in migrations directory!\"))\nif current_index == 0\n  return nil\nelse\n  return all_versions[current_index - 1]\nend\n"}},{"id":"redo-instance-method","html_id":"redo-instance-method","name":"redo","doc":"Revert all migrations and then migrate to current version.","summary":"<p>Revert all migrations and then migrate to current version.</p>","abstract":false,"args":[],"args_string":"","source_link":"https://github.com/vladfaust/migrate.cr/blob/ce963c509bb265d6fd1be7fe667228c2d5b7214f/src/migrate/migrator.cr#L81","def":{"name":"redo","args":[],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"current = current_version\nreset\nto(current)\n"}},{"id":"reset-instance-method","html_id":"reset-instance-method","name":"reset","doc":"Revert all migrations.","summary":"<p>Revert all migrations.</p>","abstract":false,"args":[],"args_string":"","source_link":"https://github.com/vladfaust/migrate.cr/blob/ce963c509bb265d6fd1be7fe667228c2d5b7214f/src/migrate/migrator.cr#L76","def":{"name":"reset","args":[],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"to(0)"}},{"id":"to(target_version:Int32|Int64)-instance-method","html_id":"to(target_version:Int32|Int64)-instance-method","name":"to","doc":"Migrate to specific version.","summary":"<p>Migrate to specific version.</p>","abstract":false,"args":[{"name":"target_version","doc":null,"default_value":"","external_name":"target_version","restriction":"Int32 | Int64"}],"args_string":"(target_version : Int32 | Int64)","source_link":"https://github.com/vladfaust/migrate.cr/blob/ce963c509bb265d6fd1be7fe667228c2d5b7214f/src/migrate/migrator.cr#L88","def":{"name":"to","args":[{"name":"target_version","doc":null,"default_value":"","external_name":"target_version","restriction":"Int32 | Int64"}],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"started_at = Time.now\ncurrent = current_version\nif target_version == current\n  @logger.try(&.info(\"Already at version #{current}; aborting\"))\n  return nil\nend\nif all_versions.includes?(target_version)\nelse\n  raise(\"There is no version #{target_version} in migrations dir!\")\nend\ndirection = target_version > current ? Direction::Up : Direction::Down\napplied_versions = all_versions.to_a.select do |version|\n  case direction\n  when Direction::Up\n    version > current && version <= target_version\n  when Direction::Down\n    (version - 1) < current && (version - 1) >= target_version\n  end\nend\ncase direction\nwhen Direction::Up\n  @logger.try(&.info(\"Migrating up to version #{(applied_versions.dup.unshift(current.to_i64)).map(&.to_s).join(\" → \")}\"))\nwhen Direction::Down\n  versions = applied_versions.dup.tap do |v|\n    index = all_versions.index(v[0])\n    if index && index > 0\n      v.unshift(all_versions[index - 1])\n    end\n  end\n  @logger.try(&.info(\"Migrating down to version #{versions.reverse.map(&.to_s).join(\" → \")}\"))\nend\napplied_files = migrations.select do |filename|\n  applied_versions.includes?((MIGRATION_FILE_REGEX.match(filename)).not_nil![\"version\"].to_i64)\nend\nif direction == Direction::Down\n  applied_files.reverse!\nend\nmigrations = applied_files.map do |path|\n  Migration.new(File.join(@dir, path))\nend\nmigrations.each do |migration|\n  if error = migration.error\n    raise(error)\n  end\n  case direction\n  when Direction::Up\n    if error = migration.error_up\n      raise(error)\n    end\n    version = next_version\n    queries = migration.queries_up\n  when Direction::Down\n    if error = migration.error_down\n      raise(error)\n    end\n    version = previous_version\n    queries = migration.queries_down\n  end\n  @db.transaction do |tx|\n    if queries.not_nil!.empty?\n      @logger.try(&.warn(\"No queries to run in migration file with version #{version}, applying anyway\"))\n    else\n      queries.not_nil!.each do |query|\n        @logger.try(&.debug(query))\n        tx.connection.exec(query)\n      end\n    end\n    @logger.try(&.debug(update_version_query(version)))\n    tx.connection.exec(update_version_query(version))\n  end\nend\nprevious = current\ncurrent = current_version\n@logger.try(&.info(\"Successfully migrated from version #{previous} to #{current} in #{TimeFormat.auto(Time.now - started_at)}\"))\nreturn current\n"}},{"id":"to_latest-instance-method","html_id":"to_latest-instance-method","name":"to_latest","doc":"Apply all the migrations from current version to the last one.","summary":"<p>Apply all the migrations from current version to the last one.</p>","abstract":false,"args":[],"args_string":"","source_link":"https://github.com/vladfaust/migrate.cr/blob/ce963c509bb265d6fd1be7fe667228c2d5b7214f/src/migrate/migrator.cr#L59","def":{"name":"to_latest","args":[],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"to(all_versions.last)"}},{"id":"up-instance-method","html_id":"up-instance-method","name":"up","doc":"Migrate one step up.","summary":"<p>Migrate one step up.</p>","abstract":false,"args":[],"args_string":"","source_link":"https://github.com/vladfaust/migrate.cr/blob/ce963c509bb265d6fd1be7fe667228c2d5b7214f/src/migrate/migrator.cr#L64","def":{"name":"up","args":[],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"_next = next_version\nif _next\n  to(_next)\nend\n"}}],"macros":[],"types":[]}]}]}})
module Migrate
  struct Migration
    # Could be raised after `error` command. See README for examples.
    class Error < Exception
    end
  end
end

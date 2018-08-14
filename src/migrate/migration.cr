module Migrate
  # :nodoc:
  struct Migration
    CMD_PREFIX = "-- +migrate"

    getter queries_up = Array(String).new, queries_down = Array(String).new

    def initialize(lines : Iterator)
      direction : Direction? = nil

      buffer = String.new

      lines.each do |line|
        if line.starts_with?(CMD_PREFIX)
          cmd = line[CMD_PREFIX.size..-1].strip.downcase
          case cmd
          when "up"
            direction = Direction::Up
          when "down"
            direction = Direction::Down
          else
            raise "Unknown command #{cmd}!"
          end
        elsif !line.starts_with?("--")
          buffer += (line + "\n") if direction
        end

        if !line.starts_with?("--") && line.strip.ends_with?(";")
          case direction
          when Direction::Up
            @queries_up.push(buffer.dup.strip)
          when Direction::Down
            @queries_down.push(buffer.dup.strip)
          end

          buffer = String.new
        end
      end
    end

    def initialize(file_path : String)
      File.open(file_path) do |file|
        initialize(file.each_line)
      end
    end

    def initialize(file : File)
      initialize(file.path)
    end
  end
end

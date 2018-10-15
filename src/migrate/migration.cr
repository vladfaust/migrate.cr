require "./migration/*"

module Migrate
  # :nodoc:
  struct Migration
    CMD_PREFIX = "-- +migrate"

    getter queries_up = Array(String).new, queries_down = Array(String).new
    getter error : Exception | Nil, error_up : Exception | Nil, error_down : Exception | Nil

    def initialize(lines : Iterator)
      direction : Direction? = nil

      buffer = String.new

      lines.each do |line|
        if line.starts_with?(CMD_PREFIX)
          cmd = /^#{Regex.escape(CMD_PREFIX)} (?<cmd>\w+)(?:\s.+)?/.match(line).not_nil!["cmd"].strip.downcase

          case cmd
          when "up"
            direction = Direction::Up
          when "down"
            direction = Direction::Down
          when "error"
            message = /^#{Regex.escape(CMD_PREFIX)} error (?<message>.+)$/.match(line).try &.["message"]

            case direction
            when Direction::Up   then @error_up ||= Error.new(message)
            when Direction::Down then @error_down ||= Error.new(message)
            else                      @error ||= Error.new(message)
            end
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

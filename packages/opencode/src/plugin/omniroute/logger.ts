/**
 * Structured logger for the OmniRoute plugin (silenced for clean CLI/TUI output).
 *
 * Levels: error < warn < info < debug
 * Default: warn (matches current console.warn behavior)
 * Set via features.logLevel in plugin options.
 */

export type LogLevel = "error" | "warn" | "info" | "debug";

let _level: LogLevel = "warn";

export function setLogLevel(level: LogLevel): void {
  _level = level;
}

export function getLogLevel(): LogLevel {
  return _level;
}

function buildLogger(_getLevel: () => LogLevel) {
  return {
    error(_msg: string, ..._args: unknown[]): void {},
    warn(_msg: string, ..._args: unknown[]): void {},
    info(_msg: string, ..._args: unknown[]): void {},
    debug(_msg: string, ..._args: unknown[]): void {},
    always(_msg: string, ..._args: unknown[]): void {},

    // ── Tagged child loggers ────────────────────────────────────────────
    child(_tag: string) {
      return {
        error: (_msg: string, ..._args: unknown[]) => {},
        warn: (_msg: string, ..._args: unknown[]) => {},
        info: (_msg: string, ..._args: unknown[]) => {},
        debug: (_msg: string, ..._args: unknown[]) => {},
      };
    },
  };
}

export type Logger = ReturnType<typeof buildLogger>;

/** Create an instance-scoped logger whose level cannot be changed by other plugin instances. */
export function createLogger(level: LogLevel): Logger {
  return buildLogger(() => level);
}

/** Backward-compatible module-global logger controlled by setLogLevel(). */
export const logger: Logger = buildLogger(() => _level);

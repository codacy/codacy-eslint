// logging utilities.
// help print messages when environment variable DEBUG is passed to the docker.

export const DEBUG: boolean = Boolean(process.env.DEBUG)
export type LoggingMessageType =
    | string
    | number
    | boolean
    | object
    | null

export function debug (msg: LoggingMessageType): void {
  if (!DEBUG) return

  switch (typeof msg) {
    case "object":
      console.log("\x1b[36m[DEBUG]\x1b[0m")
      console.dir(msg, { depth: null })
      break
    case "string":
    case "number":
    case "boolean":
      console.log("\x1b[36m[DEBUG]\x1b[0m", msg)
      break
    default:
      console.log("\x1b[36m[DEBUG]\x1b[0m", "null")
      break
  }
}

export function debugEach (arr?: Array<LoggingMessageType>): void {
  if (!DEBUG) return

  arr?.forEach(msg => {
    debug(msg)
  })
}

export function debugWhen (cond: boolean, msg: LoggingMessageType): void {
  cond && debug(msg)
}

export function debugEither (cond: boolean, msgTrue: LoggingMessageType, msgFalse: LoggingMessageType): void {
  cond ? debug(msgTrue) : debug(msgFalse)
}

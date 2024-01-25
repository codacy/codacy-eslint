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

  console.log("\x1b[36m[DEBUG]\x1b[0m", JSON.parse(JSON.stringify(msg, null, 2)))
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

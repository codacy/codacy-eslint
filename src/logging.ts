// logging utilities.
// help print messages when environment variable DEBUG is passed to the docker.

export const DEBUG: boolean = Boolean(process.env.DEBUG)

export function debug(msg: any): void {
  if (!DEBUG) return

  console.log("\x1b[36m[DEBUG]\x1b[0m", JSON.parse(JSON.stringify(msg, null, 2)))
}

export function debugEach<T>(arr?: Array<T>): void {
  if (!DEBUG) return

  arr?.forEach(value => {
    debug(value)
  })
}

export function debugWhen(cond: boolean, msg: string): void {
  cond && debug(msg)
}

export function debugEither(cond: boolean, msgTrue: string, msgFalse: string): void {
  cond ? debug(msgTrue) : debug(msgFalse)
}

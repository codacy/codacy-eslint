// logging utilities.
// help print messages when environment variable DEBUG is passed to the docker.

export function debug(msg: String): void {
    //if (process.env.DEBUG) {
        console.log("[DEBUG] " + msg)
    //}
}

export function debugEach<T>(arr: Array<T> | undefined): void {
    arr?.forEach((value) => {
        debug(value.toString())
    })
}

export function debugJson(jsonObject: any): void {
    debug(JSON.stringify(jsonObject))
}

export function debugWhen(cond: Boolean, msg: string): void {
    if (cond) {
        debug(msg)
    }
}

export function debugEither(cond: Boolean, msgTrue: string, msgFalse: string): void {
    (cond) ? debug(msgTrue) : debug(msgFalse)
}

// logging utilities.
// help print messages when environment variable DEBUG is passed to the docker.

export function debug(msg: String) {
    if (process.env.DEBUG) {
        console.log(msg)
    }
}

export function debugEach<T>(arr: Array<T> | undefined) {
    arr?.forEach( (value) => { 
        debug(String(value))
    })
}

export function debugJson(jsonObject: any) {
    debug(JSON.stringify(jsonObject))
}

export function debugWhen(cond: Boolean, msg: string) {
    if (cond) debug(msg)
}

export function debugRun<T>(fn: () => void) {
    fn()
}

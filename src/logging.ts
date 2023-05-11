// logging utilities.
// help print messages when environment variable DEBUG is passed to the docker.

export function debug(msg: String) {
    if (true) console.debug(msg)
}

export function debugEach<T>(arr: Array<T> | undefined, msg: (value: T) => String) {
    if (true) arr?.forEach(value => console.debug(msg(value)))
}

export function debugJson(jsonObject: any, msg: (value: any) => String) {
    if (true) console.log(msg(JSON.stringify(jsonObject, null, 2)))
}

export function debugWhen(cond: Boolean, msg: string) {
    if (true && cond) console.log(msg)
}

export function debugRun<T>(fn: () => void) {
    if (true) fn()
}

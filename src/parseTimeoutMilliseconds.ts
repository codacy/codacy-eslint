export const defaultTimeout = 15 * 60

export function parseTimeoutMilliseconds(timeoutString?: string): number {
  if (!timeoutString) return defaultTimeout
  const l = timeoutString
    .replace(".", " ")
    .split(" ")
    .filter(i => i) // remove empty strings
  if (l.length !== 2) return defaultTimeout
  const number = parseInt(l[0])
  const timeUnit = l[1]
  if (isNaN(number)) return defaultTimeout
  switch (timeUnit) {
    case "nanosecond":
    case "nanoseconds":
      return number / 1000000
    case "microsecond":
    case "microseconds":
      return number / 1000
    case "millisecond":
    case "milliseconds":
      return number
    case "second":
    case "seconds":
      return number * 1000
    case "minute":
    case "minutes":
      return number * 60 * 1000
    case "hour":
    case "hours":
      return number * 60 * 60 * 1000
    case "day":
    case "days":
      return number * 24 * 60 * 60 * 1000
    default:
      return defaultTimeout
  }
}

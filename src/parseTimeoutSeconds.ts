export const defaultTimeout = 15 * 60

export function parseTimeoutSeconds(timeoutString?: string): number {
  if (!timeoutString) return defaultTimeout
  const number = parseInt(timeoutString)
  if (isNaN(number) || number < 0) return defaultTimeout
  return number
}

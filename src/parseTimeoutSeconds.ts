export const defaultTimeout = 15 * 60

export function parseTimeoutSeconds(timeoutString?: string): number {
  if(!timeoutString) return defaultTimeout
  let l = timeoutString
            .split(' ')
            .filter(i => i) // remove empty strings
  if(l.length != 2) return defaultTimeout
  let number = parseInt(l[0])
  let timeUnit = l[1]
  if(isNaN(number)) return defaultTimeout
  else if(timeUnit == 'second' || timeUnit == 'seconds') return number
  else if(timeUnit == 'minute' || timeUnit == 'minutes') return number * 60
  else if(timeUnit == 'hour' || timeUnit == 'hours') return number * 60 * 60
  else return defaultTimeout
}

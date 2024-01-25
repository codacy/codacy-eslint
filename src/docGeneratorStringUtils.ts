export function capitalize (s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function patternTitle (patternId: string): string {
  const capitalizeAndJoin = (s: string) =>
    capitalize(s).split("-").join(" ")

  const parts = patternId.split("/").map(capitalizeAndJoin)

  return (parts.length > 2
    ? [parts[0], `[${parts.slice(1, -1).join(" ")}] ${parts[parts.length - 1]}`]
    : parts).join(": ")
}

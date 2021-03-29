const blacklistRegexes: RegExp[] = [
  /import\/.+/,
  /node\/no-missing-require/,
  /promise\/no-native/,
]

const documentationBlacklistRegexes: RegExp[] = []

function testRegex(regexes: RegExp[], value: string): boolean {
  return regexes.some((regex) => regex.test(value))
}

export function isBlacklisted(ruleId: string): boolean {
  return testRegex(blacklistRegexes, ruleId)
}

// Removes a pattern from the documentation
// but still supports it with eslint config file
export function isBlacklistedOnlyFromDocumentation(ruleId: string): boolean {
  return testRegex(documentationBlacklistRegexes, ruleId)
}

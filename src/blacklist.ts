const blacklistRegexes: RegExp[] = [
  /@typescript-eslint\/lines-between-class-members/
]

const documentationBlacklistRegexes: RegExp[] = [
  /unused-imports\/.*-ts/,
  /@shopify\/no-debugger/
]

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

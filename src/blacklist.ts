const blacklistRegexes: RegExp[] = [
  /@typescript-eslint\/lines-between-class-members/,
  /canonical\/id-match/,
  /ember\/no-restricted-property-modifications/,
  /unused-imports\/.*-ts/,
]

const documentationBlacklistRegexes: RegExp[] = [
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

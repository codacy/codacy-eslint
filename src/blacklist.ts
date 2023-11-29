const blacklistRegexes: RegExp[] = [
  /@lwc\/lwc\/no-unexpected-wire-adapter-usages/,
  /@lwc\/lwc\/no-unknown-wire-adapters/,
  /@typescript-eslint\/lines-between-class-members/,
  /angular\/service-name/,
  /ember\/no-restricted-property-modifications/,
  /header\/header/,
  /unused-imports\/.*-ts/,
  /yml\/sort-sequence-values/,
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

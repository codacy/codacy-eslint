const blacklistRegexes: RegExp[] = [
  /@lwc\/lwc\/no-unexpected-wire-adapter-usages/,
  /@lwc\/lwc\/no-unknown-wire-adapters/,
  /@typescript-eslint\/consistent-type-imports/,
  /angular\/service-name/,
  /ember\/no-restricted-property-modifications/,
  /ember\/template-indent/,
  /functional\/functional-parameters/,
  /functional\/immutable-data/,
  /functional\/no-conditional-statements/,
  /functional\/no-expression-statements/,
  /functional\/no-let/,
  /functional\/no-mixed-types/,
  /functional\/no-return-void/,
  /functional\/no-throw-statements/,
  /functional\/no-try-statements/,
  /functional\/prefer-immutable-types/,
  /functional\/type-declaration-immutability/,
  /header\/header/,
  /unused-imports\/.*-ts/,
  /yml\/sort-sequence-values/
]

const documentationBlacklistRegexes: RegExp[] = [
  /@shopify\/no-debugger/
]

function testRegex (regexes: RegExp[], value: string): boolean {
  return regexes.some((regex) => regex.test(value))
}

export function isBlacklisted (ruleId: string): boolean {
  return testRegex(blacklistRegexes, ruleId)
}

// Removes a pattern from the documentation
// but still supports it with eslint config file
export function isBlacklistedOnlyFromDocumentation (ruleId: string): boolean {
  return testRegex(documentationBlacklistRegexes, ruleId)
}

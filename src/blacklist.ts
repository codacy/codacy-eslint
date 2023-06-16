const blacklistRegexes: RegExp[] = [
  /@nx\/enforce-module-boundaries/,
  /@shopify\/eslint-plugin\/no-debugger/,
  /@typescript-eslint\/await-thenable/,
  /angular\/service-name/,
  /babel\/generator-star-spacing/,
  /babel\/array-bracket-spacing/,
  /babel\/arrow-parens/,
  /babel\/no-await-in-loop/,
  /babel\/func-params-comma-dangle/,
  /babel\/flow-object-type/,
  /canonical\/id-match/,
  /ember\/no-restricted-property-modifications/,
  /header\/header/,
  /import\/.+/,
  /jest\/unbound-method/,
  /jsdoc\/newline-after-description/,
  /mongodb\/.+/,
  /node\/no-missing-require/,
  /promise\/no-native/,
  /ramda\/.+/,
  /react\/jsx-.+/,
  /rxjs\/.+/,
  /rxjs-angular\/.+/,
  /unicorn\/import-index/,
  /unicorn\/no-array-instanceof/,
  /unicorn\/no-fn-reference-in-iterator/,
  /unicorn\/no-reduce/,
  /unicorn\/prefer-.+/,
  /unicorn\/regex-shorthand/,
  /unused-imports\/no-unused-.+-ts/,
  /yml\/sort-sequence-values/
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

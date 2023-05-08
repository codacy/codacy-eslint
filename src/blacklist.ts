const blacklistRegexes: RegExp[] = [
  /import\/.+/,
  /node\/no-missing-require/,
  /promise\/no-native/,
  /ember\/no-restricted-property-modifications/,
  /jest\/unbound-method/,
  /jsdoc\/newline-after-description/,
  /unused-imports\/no-unused-.+-ts/,
  /unicorn\/import-index/,
  /unicorn\/no-array-instanceof/,
  /unicorn\/no-fn-reference-in-iterator/,
  /unicorn\/no-reduce/,
  /unicorn\/prefer-dataset/,
  /unicorn\/prefer-event-key/,
  /unicorn\/prefer-exponentiation-operator/,
  /unicorn\/prefer-flat-map/,
  /unicorn\/prefer-node-append/,
  /unicorn\/prefer-node-remove/,
  /unicorn\/prefer-object-has-own/,
  /unicorn\/prefer-replace-all/,
  /unicorn\/prefer-starts-ends-with/,
  /unicorn\/prefer-text-content/,
  /unicorn\/prefer-trim-start-end/,
  /unicorn\/regex-shorthand/,
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

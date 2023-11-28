const blacklistRegexes: RegExp[] = [
  /@lwc\/lwc\/no-unexpected-wire-adapter-usages/,
  /@lwc\/lwc\/no-unknown-wire-adapters/,
  /@typescript-eslint\/lines-between-class-members/,
  // /canonical\/id-match/,
  /ember\/no-restricted-property-modifications/,
  /unused-imports\/.*-ts/,
  /yml\/sort-sequence-values/,

  // /@nx\/enforce-module-boundaries/,
  // /@shopify\/no-debugger/,
  // /@typescript-eslint\/await-thenable/,
  // /@typescript-eslint\/indent*/,
  // /@typescript-eslint\/no-parameter-properties/,
  // /angular\/service-name/,
  // /babel\/generator-star-spacing/,
  // /babel\/array-bracket-spacing/,
  // /babel\/arrow-parens/,
  // /babel\/no-await-in-loop/,
  // /babel\/func-params-comma-dangle/,
  // /babel\/flow-object-type/,
  // /eslint\/indent/,
  // /header\/header/,
  // /import\/named/,
  // /import\/namespace/,
  // /import\/default/,
  // /import\/no-named-as-default-member/,
  // /import\/no-named-as-default/,
  // /import\/no-cycle/,
  // /import\/no-unused-modules/,
  // /import\/no-deprecated/,
  // /jest\/unbound-method/,
  // /jsdoc\/check-examples/,
  // /jsdoc\/newline-after-description/,
  // /node\/no-missing-require/,
  // /promise\/no-native/,
  // /ramda\/.+/,
  // /react\/jsx-.+/,
  // /rxjs\/.+/,
  // /rxjs-angular\/.+/,
  // /testing-library\/.+/,
  // /unicorn\/import-index/,
  // /unicorn\/no-array-instanceof/,
  // /unicorn\/no-fn-reference-in-iterator/,
  // /unicorn\/no-reduce/,
  // /unicorn\/prefer-dataset/,
  // /unicorn\/prefer-node-append/,
  // /unicorn\/prefer-starts-ends-with/,
  // /unicorn\/prefer-event-key/,
  // /unicorn\/prefer-node-remove/,
  // /unicorn\/prefer-object-has-own/,
  // /unicorn\/prefer-replace-all/,
  // /unicorn\/prefer-flat-map/,
  // /unicorn\/prefer-exponentiation-operator/,
  // /unicorn\/prefer-text-content/,
  // /unicorn\/prefer-trim-start-end/,
  // /unicorn\/regex-shorthand/,


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

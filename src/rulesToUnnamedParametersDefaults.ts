export const rulesToUnnamedParametersDefaults = new Map<string, any>([
  ["array-bracket-spacing", "never"],
  ["arrow-parens", "always"],
  ["block-spacing", "always"],
  ["brace-style", "1tbs"],
  ["comma-dangle", "never"],
  ["comma-style", "last"],
  ["complexity", 4],
  ["computed-property-spacing", "never"],
  ["consistent-this", "self"],
  ["curly", "all"],
  ["dot-location", "property"],
  ["ember-suave/lines-between-object-properties", "never"],
  ["eqeqeq", "smart"],
  ["filenames/match-exported", "camel"],
  ["filenames/match-regex", "^([a-z0-9]+)([A-Z][a-z0-9]+)*$"],
  ["func-style", "expression"],
  ["id-match", "^[a-z]+([A-Z][a-z]+)*$"],
  ["indent", 2],
  ["jsdoc/check-line-alignment", "never"],
  ["jsonc/indent", 4],
  ["jsx-quotes", "prefer-double"],
  ["init-declarations", "always"],
  ["max-nested-callbacks", 5],
  ["newline-after-var", "always"],
  ["no-cond-assign", "except-parens"],
  ["no-inner-declarations", "functions"],
  ["no-restricted-modules", "always"],
  ["no-return-assign", "always"],
  ["object-curly-spacing", "never"],
  ["one-var", "always"],
  ["operator-linebreak", "after"],
  ["quotes", "double"],
  ["padded-blocks", "always"],
  ["semi", "always"],
  ["sort-keys", "asc"],
  ["space-before-blocks", "always"],
  ["space-before-function-paren", "always"],
  ["space-in-parens", "never"],
  ["spaced-comment", "always"],
  ["strict", "function"],
  ["@typescript-eslint/brace-style", "1tbs"],
  ["@typescript-eslint/indent", 2],
  ["vue/brace-style", "1tbs"],
  ["vue/sort-keys", "asc"],
  ["wrap-iife", "outside"],
  ["yoda", "never"],
])

export class rulesNamedParametersAndDefaults {
  private static readonly array: [string, string, any][] = [
    ["ember/no-restricted-service-injections", "paths", [""]],
    ["ember/no-restricted-service-injections", "services", [""]],
    [
      "ember/no-restricted-service-injections",
      "message",
      "Injecting this service is not allowed from this file.",
    ],
    ["indent", "ArrayExpression", 1],
    ["indent", "CallExpression", { arguments: 1 }],
    ["indent", "FunctionDeclaration", { parameters: 1, body: 1 }],
    ["indent", "FunctionExpression", { parameters: 1, body: 1 }],
    ["indent", "ignoredNodes", []],
    ["indent", "ImportDeclaration", 1],
    ["indent", "MemberExpression", 1],
    ["indent", "ObjectExpression", 1],
    ["indent", "outerIIFEBody", 1],
    ["indent", "offsetTernaryExpressions", false],
    ["indent", "VariableDeclarator", 1],
    ["jsdoc/check-examples", "checkEslintrc", false],
    ["jsonc/sort-array-values", "pathPattern", "^$"],
    ["jsonc/sort-array-values", "order", {type: "asc"}],
    ["jsdoc/no-missing-syntax", "contexts", []],
    ["padded-blocks", "allowSingleLineBlocks", true],
    ["quotes", "avoidEscape", false],
    ["quotes", "allowTemplateLiterals", false],
    ["react/display-name", "ignoreTranspilerName", false],
    ["sort-imports-es6-autofix/sort-imports-es6", "ignoreCase", false],
    ["sort-imports-es6-autofix/sort-imports-es6", "ignoreMemberSort", false],
    [
      "sort-imports-es6-autofix/sort-imports-es6",
      "memberSyntaxSortOrder",
      ["none", "all", "multiple", "single"],
    ],
    ["testing-library/consistent-data-testid", "testIdPattern", ""],
    ["testing-library/consistent-data-testid", "customMessage", ""]
  ]

  static has(patternId: string, parameter: string): boolean {
    return this.array.some(
      ([pId, param, ]) => pId === patternId && param === parameter
    )
  }

  static parameter(
    patternId: string,
    parameter: string
  ): [string, any] | undefined {
    const e = this.array.find(
      ([pId, param, ]) => pId === patternId && param === parameter
    )
    return e ? [parameter, e[2]] : undefined
  }
}

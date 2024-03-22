import { JSONSchema4Type } from "json-schema"

export const rulesToUnnamedParametersDefaults = new Map<string, JSONSchema4Type>([
  ["@stylistic/array-bracket-spacing", "never"],
  ["@stylistic/arrow-parens", "always"],
  ["flowtype/arrow-parens", "always"],
  ["@stylistic/block-spacing", "always"],
  ["@stylistic/brace-style", "1tbs"],
  ["vue/brace-style", "1tbs"],
  ["jsdoc/check-line-alignment", "never"],
  ["@stylistic/comma-dangle", "never"],
  ["@stylistic/comma-style", "last"],
  ["complexity", 4],
  ["@stylistic/computed-property-spacing", "never"],
  ["consistent-this", "self"],
  ["curly", "all"],
  ["@stylistic/dot-location", "property"],
  ["ember-suave/lines-between-object-properties", "never"],
  ["eqeqeq", "smart"],
  ["filenames/match-exported", "camel"],
  ["filenames/match-regex", "^([a-z0-9]+)([A-Z][a-z0-9]+)*$"],
  ["func-style", "expression"],
  ["id-match", "^[a-z]+([A-Z][a-z]+)*$"],
  ["@stylistic/indent", 2],
  ["jsonc/indent", 2],
  ["init-declarations", "always"],
  ["@stylistic/jsx-quotes", "prefer-double"],
  ["@stylistic/lines-between-class-members", "always"],
  ["max-nested-callbacks", 5],
  ["@stylistic/multiline-ternary", "always"],
  ["newline-after-var", "always"],
  ["no-cond-assign", "except-parens"],
  ["no-inner-declarations", "functions"],
  ["no-restricted-modules", "always"],
  ["no-return-assign", "always"],
  ["@stylistic/object-curly-spacing", "never"],
  ["one-var", "always"],
  ["@stylistic/operator-linebreak", "after"],
  ["@stylistic/padded-blocks", "always"],
  ["@stylistic/quotes", "double"],
  ["@stylistic/semi", "always"],
  ["sort-keys", "asc"],
  ["vue/sort-keys", "asc"],
  ["@stylistic/space-before-blocks", "always"],
  ["@stylistic/space-before-function-paren", "always"],
  ["@stylistic/space-in-parens", "never"],
  ["@stylistic/spaced-comment", "always"],
  ["strict", "function"],
  ["@stylistic/wrap-iife", "outside"],
  ["vue/multiline-ternary", "always"],
  ["yoda", "never"]
])

export class rulesNamedParametersAndDefaults {
  private static readonly array: [string, string, JSONSchema4Type][] = [
    ["ember/no-restricted-service-injections", "paths", [""]],
    ["ember/no-restricted-service-injections", "services", [""]],
    [
      "ember/no-restricted-service-injections",
      "message",
      "Injecting this service is not allowed from this file."
    ],
    ["@stylistic/indent", "ArrayExpression", 1],
    ["@stylistic/indent", "CallExpression", { "arguments": 1 }],
    ["@stylistic/indent", "FunctionDeclaration", { "parameters": 1, "body": 1 }],
    ["@stylistic/indent", "FunctionExpression", { "parameters": 1, "body": 1 }],
    ["@stylistic/indent", "ignoredNodes", []],
    ["@stylistic/indent", "ImportDeclaration", 1],
    ["@stylistic/indent", "MemberExpression", 1],
    ["@stylistic/indent", "ObjectExpression", 1],
    ["@stylistic/indent", "outerIIFEBody", 1],
    ["@stylistic/indent", "offsetTernaryExpressions", false],
    ["@stylistic/indent", "VariableDeclarator", 1],
    ["jsdoc/check-examples", "checkEslintrc", false],
    ["jsonc/sort-array-values", "pathPattern", "^$"],
    ["jsonc/sort-array-values", "order", { "type": "asc" }],
    ["jsdoc/no-missing-syntax", "contexts", []],
    ["@stylistic/padded-blocks", "allowSingleLineBlocks", true],
    ["@stylistic/quotes", "avoidEscape", false],
    ["@stylistic/quotes", "allowTemplateLiterals", false],
    ["react/display-name", "ignoreTranspilerName", false],
    ["sort-imports-es6-autofix/sort-imports-es6", "ignoreCase", false],
    ["sort-imports-es6-autofix/sort-imports-es6", "ignoreMemberSort", false],
    [
      "sort-imports-es6-autofix/sort-imports-es6",
      "memberSyntaxSortOrder",
      ["none", "all", "multiple", "single"]
    ],
    ["testing-library/consistent-data-testid", "testIdPattern", ""],
    ["testing-library/consistent-data-testid", "customMessage", ""]
  ]

  static has (patternId: string, parameter: string): boolean {
    return this.array.some(
      ([pId, param ]) => pId === patternId && param === parameter
    )
  }

  static parameter (
    patternId: string,
    parameter: string
  ): [string, JSONSchema4Type] | undefined {
    const e = this.array.find(
      ([pId, param ]) => pId === patternId && param === parameter
    )
    return e ? [parameter, e[2]] : undefined
  }
}

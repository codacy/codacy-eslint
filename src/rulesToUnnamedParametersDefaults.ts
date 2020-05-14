import { PatternsParameter } from "codacy-seed"

export const rulesToUnnamedParametersDefaults = new Map<string, any>([
  ["array-bracket-spacing", "never"],
  ["arrow-parens", "always"],
  ["block-spacing", "always"],
  ["comma-dangle", "never"],
  ["comma-style", "last"],
  ["complexity", 4],
  ["computed-property-spacing", "never"],
  ["consistent-this", "self"],
  ["curly", "all"],
  ["dot-location", "property"],
  ["eqeqeq", "smart"],
  ["id-match", "^[a-z]+([A-Z][a-z]+)*$"],
  ["indent", 2],
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
  ["space-before-blocks", "always"],
  ["space-before-function-paren", "always"],
  ["space-in-parens", "never"],
  ["spaced-comment", "always"],
  ["strict", "function"],
  ["wrap-iife", "outside"],
  ["yoda", "never"],
  ["brace-style", "1tbs"],
])

export class rulesNamedParametersAndDefaults {
  private static readonly array: [string, string, any][] = [
    ["padded-blocks", "allowSingleLineBlocks", true],
    ["react/display-name", "ignoreTranspilerName", false],
    ["sort-imports-es6-autofix/sort-imports-es6", "ignoreCase", false],
    ["sort-imports-es6-autofix/sort-imports-es6", "ignoreMemberSort", false],
    [
      "sort-imports-es6-autofix/sort-imports-es6",
      "memberSyntaxSortOrder",
      ["none", "all", "multiple", "single"],
    ],
  ]

  static has(patternId: string, parameter: string): boolean {
    return this.array.some(
      ([pId, param, _]) => pId === patternId && param === parameter
    )
  }

  static parameter(
    patternId: string,
    parameter: string
  ): PatternsParameter | undefined {
    const e = this.array.find(
      ([pId, param, _]) => pId === patternId && param === parameter
    )
    return e ? new PatternsParameter(parameter, e[2]) : undefined
  }
}

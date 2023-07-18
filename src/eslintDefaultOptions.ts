import { ESLint } from "eslint"
import { pluginsNames } from "./eslintPlugins"

const baseConfigs: string[] = [
  "standard",
  "eslint:recommended",
  "plugin:backbone/recommended",
  "plugin:chai-expect/recommended",
  "plugin:chai-friendly/recommended",
  "plugin:compat/recommended",
  "plugin:cypress/recommended",
  "plugin:ember/recommended",
  "plugin:eslint-plugin/recommended",
  "plugin:flowtype/recommended",
  "plugin:i18next/recommended",
  "plugin:import/recommended",
  "plugin:import/typescript",
  "plugin:jest-dom/recommended",
  "plugin:jest-formatting/recommended",
  "plugin:json/recommended",
  "plugin:lit/recommended",
  "plugin:lodash/recommended",
  "plugin:monorepo/recommended",
  //"plugin:@mysticatea/es2015",
  //"plugin:@mysticatea/+eslint-plugin",
  "plugin:perfectionist/recommended-natural",
  "plugin:prettier/recommended",
  "plugin:react/recommended",
  "plugin:security/recommended",
  "plugin:test-selectors/recommended",
  "plugin:you-dont-need-lodash-underscore/compatible"
]

const typescriptConfigs: string[] = [
  "plugin:node/recommended",
  "plugin:@angular-eslint/recommended",
  "plugin:@angular-eslint/template/process-inline-templates",
  "plugin:@typescript-eslint/recommended"
]

export const defaultOptions: ESLint.Options = {
  baseConfig: {
    extends: baseConfigs,
    env: {
      es6: true,
      node: true,
      browser: true,
      commonjs: true,
      jquery: true,
      phantomjs: true,
      jasmine: true,
      mocha: true,
      amd: true,
      worker: true,
      qunit: true,
    },
    ignorePatterns: [
      "**/node_modules/**/*",
      "**/dist/**/*",
      "**/bin/**/*",
      "**/build/**/*",
      "**/docs/tests/**/*",
      "tsconfig.json"
    ],
    plugins: pluginsNames,
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaFeatures: {
        "jsx": true,
      },
      requireConfigFile: false,
      sourceType: "module",
    },
    settings: {
      "node": {
        "tryExtensions": [".js", ".json", ".node"],
      },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
        },
      },
      jest: {
        version: 26,
      },
      react: {
        version: "18.2.0",
      },
    },
    overrides: [
      {
        files: ["**/*.ts", "**/*.tsx"],
        extends: typescriptConfigs,
        parserOptions: {
          project: ["./tsconfig.json"],
          sourceType: "module",
        },
      },
      {
        files: ["**/*.js", "**/*.json"],
        rules: {
          "@typescript-eslint/await-thenable": "off",
          "@typescript-eslint/consistent-type-exports": "off",
          "@typescript-eslint/dot-notation": "off",
          "@typescript-eslint/naming-convention": "off",
          "@typescript-eslint/no-base-to-string": "off",
          "@typescript-eslint/no-confusing-void-expression": "off",
          "@typescript-eslint/no-duplicate-type-constituents": "off",
          "@typescript-eslint/no-floating-promises": "off",
          "@typescript-eslint/no-for-in-array": "off",
          "@typescript-eslint/no-implied-eval": "off",
          "@typescript-eslint/no-meaningless-void-operator": "off",
          "@typescript-eslint/no-misused-promises": "off",
          "@typescript-eslint/no-mixed-enums": "off",
          "@typescript-eslint/no-redundant-type-constituents": "off",
          "@typescript-eslint/no-throw-literal": "off",
          "@typescript-eslint/no-unnecessary-boolean-literal-compare": "off",
          "@typescript-eslint/no-unnecessary-condition": "off",
          "@typescript-eslint/no-unnecessary-qualifier": "off",
          "@typescript-eslint/no-unnecessary-type-arguments": "off",
          "@typescript-eslint/no-unnecessary-type-assertion": "off",
          "@typescript-eslint/no-unsafe-argument": "off",
          "@typescript-eslint/no-unsafe-assignment": "off",
          "@typescript-eslint/no-unsafe-call": "off",
          "@typescript-eslint/no-unsafe-enum-comparison": "off",
          "@typescript-eslint/no-unsafe-member-access": "off",
          "@typescript-eslint/no-unsafe-return": "off",
          "@typescript-eslint/non-nullable-type-assertion-style": "off",
          "@typescript-eslint/prefer-includes": "off",
          "@typescript-eslint/prefer-nullish-coalescing": "off",
          "@typescript-eslint/prefer-optional-chain": "off",
          "@typescript-eslint/prefer-readonly": "off",
          "@typescript-eslint/prefer-readonly-parameter-types": "off",
          "@typescript-eslint/prefer-reduce-type-parameter": "off",
          "@typescript-eslint/prefer-regexp-exec": "off",
          "@typescript-eslint/prefer-return-this-type": "off",
          "@typescript-eslint/prefer-string-starts-ends-with": "off",
          "@typescript-eslint/promise-function-async": "off",
          "@typescript-eslint/require-array-sort-compare": "off",
          "@typescript-eslint/require-await": "off",
          "@typescript-eslint/restrict-plus-operands": "off",
          "@typescript-eslint/restrict-template-expressions": "off",
          "@typescript-eslint/return-await": "off",
          "@typescript-eslint/strict-boolean-expressions": "off",
          "@typescript-eslint/switch-exhaustiveness-check": "off",
          "@typescript-eslint/unbound-method": "off",
          "deprecation/deprecation": "off"
        },
      },
      {
        files: ["**/*.vue"],
        parser: require.resolve("vue-eslint-parser"),
        parserOptions: {
          ecmaVersion: 2020,
          sourceType: "module",
        },
      },
      {
        files: ["**/*.jsx"],
        parser: "@babel/eslint-parser",
        parserOptions: {
          babelOptions: {
            presets: ["@babel/preset-react"],
          },
        },
      },  
      {
        files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
        extends: ['plugin:testing-library/react'],
      },
    ],
  },
}

export const defaultEngine = new ESLint(defaultOptions)

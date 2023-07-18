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
        extends: [
          "plugin:@typescript-eslint/disable-type-checked",
        ]
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

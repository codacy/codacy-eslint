import { ESLint } from "eslint"
import { pluginsNames } from "./eslintPlugins"

const baseConfigs: string[] = [
  "standard",
  "eslint:recommended",
  "plugin:backbone/recommended",
  "plugin:canonical/recommended",
  "plugin:chai-expect/recommended",
  "plugin:chai-friendly/recommended",
  "plugin:compat/recommended",
  "plugin:cypress/recommended",
  "plugin:ember/recommended",
  "plugin:ember-suave/recommended",
  "plugin:flowtype/recommended",
  "plugin:jest-formatting/recommended",
  "plugin:json/recommended",
  "plugin:lodash/recommended",
  "plugin:monorepo/recommended",
  //"plugin:@mysticatea/es2015",
  //"plugin:@mysticatea/+eslint-plugin",
  "plugin:perfectionist/recommended-natural",
  "plugin:react/recommended",
  "plugin:security/recommended",
  "plugin:prettier/recommended"
]

const typescriptConfigs: string[] = [
  "plugin:node/recommended",
  "plugin:@angular-eslint/recommended",
  "plugin:@angular-eslint/template/process-inline-templates",
  "plugin:@typescript-eslint/eslint-recommended",
  "plugin:@typescript-eslint/recommended",
  "plugin:node/recommended"
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
    plugins: pluginsNames,
    parser: "@typescript-eslint/parser",
    parserOptions: {
      requireConfigFile: false,
      ecmaFeatures: {
        "jsx": true
      }
    },
    settings: {
      "node": {
        "tryExtensions": [".js", ".json", ".node"]
      },
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
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
        version: "18.2.0"
      },
    },
    overrides: [
      {
        files: ["**/*.ts", "**/*.tsx"],
        extends: typescriptConfigs,
        parserOptions: {
          sourceType: "module",
          project: ['./tsconfig.json'],
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
          }
        },
      },
      {
        files: ["**/*.html"],
        extends: [
          "plugin:@angular-eslint/template/recommended",
          "plugin:@angular-eslint/template/accessibility"
        ]
      },       
    ],
  },
}

export const defaultEngine = new ESLint(defaultOptions)

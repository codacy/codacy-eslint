import { ESLint } from "eslint"
import { pluginsNames } from "./eslintPlugins"

const baseConfigs: string[] = [
  "standard",
  "plugin:lodash/recommended",
  "plugin:security/recommended"
]
const typescriptConfigs: string[] = [
  "lodash-fp",
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
      requireConfigFile: false
    },
    overrides: [
      {
        files: ["**/*.ts", "**/*.tsx"],
        extends: baseConfigs.concat(typescriptConfigs),
        parser: "@typescript-eslint/parser",
        parserOptions: {
          sourceType: "module",
        },
        rules: {
          "lodash-fp/consistent-compose": "off",
          "lodash-fp/consistent-name": [
            "error",
            "_"
          ],
          "lodash-fp/no-argumentless-calls": "error",
          "lodash-fp/no-chain": "error",
          "lodash-fp/no-extraneous-args": "error",
          "lodash-fp/no-extraneous-function-wrapping": "error",
          "lodash-fp/no-extraneous-iteratee-args": "error",
          "lodash-fp/no-extraneous-partials": "error",
          "lodash-fp/no-for-each": "off",
          "lodash-fp/no-partial-of-curried": "error",
          "lodash-fp/no-single-composition": "error",
          "lodash-fp/no-submodule-destructuring": "error",
          "lodash-fp/no-unused-result": "error",
          "lodash-fp/prefer-compact": "error",
          "lodash-fp/prefer-composition-grouping": "error",
          "lodash-fp/prefer-constant": [
            "error",
            {
              "arrowFunctions": false
            }
          ],
          "lodash-fp/prefer-flat-map": "error",
          "lodash-fp/prefer-get": "error",
          "lodash-fp/prefer-identity": [
            "error",
            {
              "arrowFunctions": false
            }
          ],
          "lodash-fp/preferred-alias": "off",
          "lodash-fp/use-fp": "error"
        }
      },
      {
        files: ["./**/*.vue"],
        parser: require.resolve("vue-eslint-parser"),
        parserOptions: {
          ecmaVersion: 2020,
          sourceType: "module",
        },
      },
      {
        files: ["**/*.jsx"],
        parserOptions: {
          babelOptions: {
            presets: ["@babel/preset-react"],
          }
        },
      },
    ],
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
    },
  },
}

export const defaultEngine = new ESLint(defaultOptions)

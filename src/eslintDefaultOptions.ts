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
  //"plugin:@mysticatea/es2015",
  //"plugin:@mysticatea/+eslint-plugin",
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
    overrides: [
      {
        files: ["**/*.ts", "**/*.tsx"],
        extends: baseConfigs.concat(typescriptConfigs),
        parserOptions: {
          sourceType: "module",
        }
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
      {
        files: ["**/*.js"],
        plugins: ["lodash-fp"],
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

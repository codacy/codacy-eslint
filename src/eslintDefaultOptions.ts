import { ESLint } from "eslint"
import { pluginsNames } from "./eslintPlugins"

const baseConfigs: string[] = [
  "better-styled-components",
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
  "plugin:@mysticatea/eslint-plugin",
  "plugin:security/recommended",
  "plugin:@typescript-eslint/recommended",
  "prettier",
  "standard"
]

const typescriptConfigs: string[] = [
  "eslint:recommended",
  "plugin:@angular-eslint/recommended",
  "plugin:@angular-eslint/template/process-inline-templates",
  "plugin:@typescript-eslint/eslint-recommended",
  "plugin:@typescript-eslint/recommended",
  "plugin:node/recommended",
  "@typescript-eslint"
]

export const defaultOptions: ESLint.Options = {
  baseConfig: {
    root: true,
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
    },
    overrides: [
      {
        files: ["**/*.ts", "**/*.tsx"],
        extends: baseConfigs.concat(typescriptConfigs),
        parser: "@typescript-eslint/parser",
        parserOptions: {
          sourceType: "module",
          project: "tsconfig.json"
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
        ],
      }
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

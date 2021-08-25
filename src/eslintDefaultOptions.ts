import { CLIEngine } from "eslint"

const baseConfigs: string[] = ["standard", "plugin:security/recommended"]
const typescriptConfigs: string[] = [
  "plugin:@typescript-eslint/eslint-recommended",
  "plugin:@typescript-eslint/recommended",
]

export const defaultOptions: CLIEngine.Options = {
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
    plugins: [
      "angular",
      "angularjs-security-rules",
      "babel",
      "backbone",
      "better-styled-components",
      "chai-expect",
      "chai-friendly",
      "compat",
      "cypress",
      "drupal",
      "ember",
      "ember-suave",
      "filenames",
      "flowtype",
      "functional",
      "graphql-fragments",
      "hapi",
      "html",
      "import",
      "jasmine",
      "jest",
      "jest-formatting",
      "jsdoc",
      "json",
      "jsx-a11y",
      "lodash",
      "lodash-fp",
      "meteor",
      "mocha",
      "mongodb",
      "monorepo",
      "no-only-tests",
      "no-unsafe-innerhtml",
      "no-unsanitized",
      "node",
      "playwright",
      "prettier",
      "prettier-vue",
      "promise",
      "ramda",
      "react-hooks",
      "react-native",
      "react",
      "redux-saga",
      "regexp",
      "relay",
      "scanjs-rules",
      "security",
      "sonarjs",
      "sort-imports-es6-autofix",
      "standard",
      "@typescript-eslint",
      "unicorn",
      "vue",
      "wdio",
      "xss"
    ],
    parser: "babel-eslint",
    overrides: [
      {
        files: ["**/*.ts", "**/*.tsx"],
        extends: baseConfigs.concat(typescriptConfigs),
        parser: "@typescript-eslint/parser",
        parserOptions: {
          sourceType: "module",
        },
      },
      {
        files: ["./**/*.vue"],
        parser: require.resolve("vue-eslint-parser"),
        parserOptions: {
          ecmaVersion: 2020,
          sourceType: "module",
        },
      },
    ],
    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
        },
      },
      jest: {
        version: 26
      }
    },
  },
}

export const defaultEngine = new CLIEngine(defaultOptions)

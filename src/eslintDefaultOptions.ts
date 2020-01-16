import { CLIEngine } from "eslint"

const baseConfigs: string[] = ["standard", "plugin:security/recommended"]
const typescriptConfigs: string[] = [
  "plugin:@typescript-eslint/eslint-recommended",
  "plugin:@typescript-eslint/recommended"
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
      qunit: true
    },
    plugins: [
      "angular",
      "angularjs-security-rules",
      "babel",
      "backbone",
      "chai-expect",
      "chai-friendly",
      "compat",
      "cypress",
      "drupal",
      "ember",
      "ember-suave",
      "flowtype",
      "graphql",
      "hapi",
      "html",
      "import",
      "jasmine",
      "jest",
      "jsdoc",
      "json",
      "jsx-a11y",
      "lodash",
      "lodash-fp",
      "meteor",
      "mocha",
      "mongodb",
      "no-only-tests",
      "no-unsafe-innerhtml",
      "no-unsanitized",
      "node",
      "prettier",
      "promise",
      "react-hooks",
      "react-native",
      "react",
      "redux-saga",
      "relay",
      "security",
      "sonarjs",
      "standard",
      "@typescript-eslint",
      "vue",
      "wdio",
      "xss"
    ],
    parser: "babel-eslint",
    overrides: [
      {
        files: ["**/*.ts", "**/*.tsx"],
        extends: baseConfigs.concat(typescriptConfigs),
        parser: "@typescript-eslint/parser"
      }
    ]
  }
}

export const defaultEngine = new CLIEngine(defaultOptions)

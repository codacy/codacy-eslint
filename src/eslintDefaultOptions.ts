import { ESLint } from "eslint"
import { pluginsNames } from "./eslintPlugins"

const baseConfigs: string[] = [
  "standard",
  "eslint:recommended",
  "plugin:eslint-plugin/recommended",
  "plugin:prettier/recommended",
  "prettier",
]

const typescriptConfigs: string[] = [
  "plugin:node/recommended",
  "plugin:@typescript-eslint/recommended"
]

export const defaultOptions: ESLint.Options = {
  baseConfig: {
    extends: baseConfigs,
    env: {
      browser: true,
      node: true,
      commonjs: true,
      es6: true,
      es2022: true,
      worker: true,
      amd: true,
      mocha: true,
      jasmine: true,
      jest: true,
      phantomjs: true,
      qunit: true,
      jquery: true,
      prototypejs: true,
      embertest: true,
    },
    globals: {
      document: "readonly",
      navigator: "readonly",
      window: "readonly",

      // // ECMAScript
      // ArrayBuffer: "readonly",
      // Atomics: "readonly",
      // BigInt: "readonly",
      // BigInt64Array: "readonly",
      // BigUint64Array: "readonly",
      // DataView: "readonly",
      // Float32Array: "readonly",
      // Float64Array: "readonly",
      // Int16Array: "readonly",
      // Int32Array: "readonly",
      // Int8Array: "readonly",
      // Map: "readonly",
      // Promise: "readonly",
      // Proxy: "readonly",
      // Reflect: "readonly",
      // Set: "readonly",
      // SharedArrayBuffer: "readonly",
      // Symbol: "readonly",
      // Uint16Array: "readonly",
      // Uint32Array: "readonly",
      // Uint8Array: "readonly",
      // Uint8ClampedArray: "readonly",
      // WeakMap: "readonly",
      // WeakSet: "readonly",

      // // ECMAScript (experimental)
      // globalThis: "readonly",

      // // ECMA-402
      // Intl: "readonly",

      // // Web Standard
      // TextDecoder: "readonly",
      // TextEncoder: "readonly",
      // URL: "readonly",
      // URLSearchParams: "readonly",
      // WebAssembly: "readonly",
      // clearInterval: "readonly",
      // clearTimeout: "readonly",
      // console: "readonly",
      // queueMicrotask: "readonly",
      // setInterval: "readonly",
      // setTimeout: "readonly",

      // // Node.js
      // Buffer: "readonly",
      // GLOBAL: "readonly",
      // clearImmediate: "readonly",
      // global: "readonly",
      // process: "readonly",
      // root: "readonly",
      // setImmediate: "readonly",

      // // Backbone
      // Backbone: false,
      // _: false,

      // // Cypress
      // "cypress/globals": true,
    },
    ignorePatterns: [
      "**/node_modules/**/*",
      "**/dist/**/*",
      "**/bin/**/*",
      "**/build/**/*",
      "**/docs/tests/**/*",
      "tsconfig.json",
    ],
    plugins: pluginsNames,
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: 2022,
      ecmaFeatures: {
        "jsx": true,
      },
      requireConfigFile: false,
      sourceType: "module",
    },
    settings: {
      node: {
        paths: ["src"],
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        tryExtensions: [".js", ".json", ".node"],
      },
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"]
      },
      "import/resolver": {
        node: {
          "extensions": [".js", ".jsx", ".ts", ".tsx"]
        },
        typescript: {
          alwaysTryTypes: true
        },
        webpack: true,
        caseSensitive: false
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
          project: ["/tsconfig.json"],
          sourceType: "module",
        },
        rules: {
          "constructor-super": "off", // ts(2335) & ts(2377)
          "getter-return": "off", // ts(2378)
          "no-const-assign": "off", // ts(2588)
          "no-dupe-args": "off", // ts(2300)
          "no-dupe-class-members": "off", // ts(2393) & ts(2300)
          "no-dupe-keys": "off", // ts(1117)
          "no-func-assign": "off", // ts(2539)
          "no-import-assign": "off", // ts(2539) & ts(2540)
          "no-new-symbol": "off", // ts(7009)
          "no-obj-calls": "off", // ts(2349)
          "no-redeclare": "off", // ts(2451)
          "no-setter-return": "off", // ts(2408)
          "no-this-before-super": "off", // ts(2376)
          "no-undef": "off", // ts(2304)
          "no-unreachable": "off", // ts(7027)
          "no-unsafe-negation": "off", // ts(2365) & ts(2360) & ts(2358)
        },
      },
      {
        files: ["**/*.js", "**/*.jsx", "**/*.json"],
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
        parser: "vue-eslint-parser",
        parserOptions: {
          parser: "@typescript-eslint/parser",
          ecmaVersion: 2018,
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
        files: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
        extends: ["plugin:testing-library/react"],
      },
      {
        files: ["**/*.gjs", "**/*.gts"],
        processor: "ember/<template>",
      },
    ],
  },
}

export const defaultEngine = new ESLint(defaultOptions)

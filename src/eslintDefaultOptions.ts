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

      // ECMAScript
      ArrayBuffer: "readonly",
      Atomics: "readonly",
      BigInt: "readonly",
      BigInt64Array: "readonly",
      BigUint64Array: "readonly",
      DataView: "readonly",
      Float32Array: "readonly",
      Float64Array: "readonly",
      Int16Array: "readonly",
      Int32Array: "readonly",
      Int8Array: "readonly",
      Map: "readonly",
      Promise: "readonly",
      Proxy: "readonly",
      Reflect: "readonly",
      Set: "readonly",
      SharedArrayBuffer: "readonly",
      Symbol: "readonly",
      Uint16Array: "readonly",
      Uint32Array: "readonly",
      Uint8Array: "readonly",
      Uint8ClampedArray: "readonly",
      WeakMap: "readonly",
      WeakSet: "readonly",

      // ECMAScript (experimental)
      globalThis: "readonly",

      // ECMA-402
      Intl: "readonly",

      // Web Standard
      TextDecoder: "readonly",
      TextEncoder: "readonly",
      URL: "readonly",
      URLSearchParams: "readonly",
      WebAssembly: "readonly",
      clearInterval: "readonly",
      clearTimeout: "readonly",
      console: "readonly",
      queueMicrotask: "readonly",
      setInterval: "readonly",
      setTimeout: "readonly",

      // Node.js
      Buffer: "readonly",
      GLOBAL: "readonly",
      clearImmediate: "readonly",
      global: "readonly",
      process: "readonly",
      root: "readonly",
      setImmediate: "readonly",

      // Backbone
      Backbone: false,
      _: false,

      // Cypress
      "cypress/globals": true,
    },
    ignorePatterns: [
      "node_modules/",
      "dist/",
      "bin/",
      "build/",
      "docs/tests/",
      "vendor/",
      "tsconfig.json",
      ".eslintrc*"
    ],
    plugins: pluginsNames,
    parser: "@typescript-eslint/parser",
    parserOptions: {
      allowAutomaticSingleRunInference: true,
      ecmaVersion: "latest",
      ecmaFeatures: {
        "jsx": true,
      },
      errorOnTypeScriptSyntacticAndSemanticIssues: false,
      extraFileExtensions: [".json"],
      project: ["/tsconfig.json"],
    },
    root: true,
    settings: {
      node: {
        paths: ["/src"],
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        tryExtensions: [".ts", ".tsx", ".js", ".json", ".node"],
      },
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
      "import/resolver": {
        node: {
          "extensions": [".js", ".jsx", ".ts", ".tsx", ".node"],
        },
        typescript: {
          alwaysTryTypes: true,
        },
        webpack: true,
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
        rules: {
          // https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/src/configs/eslint-recommended.ts
          "constructor-super": "off",
          "getter-return": "off",
          "no-const-assign": "off",
          "no-dupe-args": "off",
          "no-dupe-class-members": "off",
          "no-dupe-keys": "off",
          "no-func-assign": "off",
          "no-import-assign": "off",
          "no-new-symbol": "off",
          "no-obj-calls": "off",
          "no-redeclare": "off",
          "no-setter-return": "off",
          "no-this-before-super": "off",
          "no-undef": "off",
          "no-unreachable": "off",
          "no-unsafe-negation": "off",
        },
      },
      {
        files: ["**/*.js", "**/*.jsx", "**/*.json"],
        extends: ['plugin:@typescript-eslint/disable-type-checked'],
        rules: {
          // turn off other type-aware rules
          'deprecation/deprecation': 'off',
          '@typescript-eslint/internal/no-poorly-typed-ts-props': 'off',
          // turn off rules that don't apply to JS code
          '@typescript-eslint/explicit-function-return-type': 'off',
        },
      },
      {
        files: ["**/*.jsx"],
        parser: "@babel/eslint-parser",
        parserOptions: {
          babelOptions: {
            presets: ["@babel/preset-react"],
          },
          requireConfigFile: false,
        },
      },  
      {
        files: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
        extends: ["plugin:testing-library/react"],
      },
    ],
  },
}

//export const defaultEngine = new ESLint(defaultOptions)

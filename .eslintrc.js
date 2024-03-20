module.exports = {
  env: {
    es6: true,
    es2022: true,
    node: true,
    mocha: true
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@stylistic/ts/disable-legacy",
    "plugin:@stylistic/ts/all-extends",
    "prettier"
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  ignorePatterns: [
    "node_modules/",
    "dist/",
    "tests/",
    "tsconfig.json",
    ".eslintrc*"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2022,
    project: true
  },
  plugins: [
    "@typescript-eslint",
    "@stylistic",
    "simple-import-sort",
    "unused-imports"
  ],
  root: true,
  rules: {
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "unused-imports/no-unused-imports": "error",
    "@stylistic/operator-linebreak": ["error", "before"],
    "@stylistic/ts/indent": ["error", 2],
    "@stylistic/indent-binary-ops": ["error", 2],
    "@stylistic/ts/semi": ["error", "never", {"beforeStatementContinuationChars": "never"}],
    "@stylistic/multiline-ternary": ["error", "always-multiline"],
    "@stylistic/ts/object-curly-spacing": ["error", "always", { "objectsInObjects": false, "arraysInObjects": false }],
    "@typescript-eslint/no-var-requires": "off"
  },
  overrides: [
    {
      files: ["*.spec.js", "*.spec.ts"],
      env: {
        mocha: true
      }
    }
  ]
}

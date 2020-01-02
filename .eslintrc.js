module.exports = {
  env: {
    es6: true,
    node: true
  },
  extends: ["prettier"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },
  plugins: ["@typescript-eslint", "simple-import-sort", "unused-imports"],
  rules: {
    "simple-import-sort/sort": "error"
  }
}

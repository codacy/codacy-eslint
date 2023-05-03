module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: ["prettier"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    project: "tsconfig.json",
  },
  plugins: ["@typescript-eslint", "simple-import-sort", "unused-imports"],
  rules: {
    "simple-import-sort/imports": "error",
    '@typescript-eslint/unbound-method': 'error',
  },
  overrides: [
    {
      files: ["src/**"],
      plugins: ["jest"],
      rules: {
        '@typescript-eslint/unbound-method': 'off',
        'jest/unbound-method': 'error',
      },
    },
  ],
}

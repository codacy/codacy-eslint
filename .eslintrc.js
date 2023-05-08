module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "prettier"
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2018,
    ecmaFeatures: {
      jsx: true
    },
    sourceType: "module",
    project: "./tsconfig.json",
    projects: ["./tsconfig.json"],
    
  },
  plugins: [
    "@typescript-eslint",
    "simple-import-sort",
    "unused-imports",
    "react",
    "jest"
  ],
  rules: {
    "simple-import-sort/imports": "error",
    '@typescript-eslint/unbound-method': 'off'
  },
}

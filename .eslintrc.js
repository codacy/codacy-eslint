module.exports = {
  env: {
    es6: true,
    node: true,
    mocha: true
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "prettier"
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
    describe: true,
    it: true
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
    ecmaVersion: 2018,
    ecmaFeatures: {
      jsx: true
    },
    project: "/tsconfig.json",
    projects: ["/tsconfig.json"],
    
  },
  plugins: [
    "@typescript-eslint",
    "simple-import-sort",
    "unused-imports",
    "react",
    "jest"
  ],
  root: true,
  rules: {
    "simple-import-sort/imports": "error",
    '@typescript-eslint/unbound-method': 'off'
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

module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
      'plugin:react/recommended',
      'plugin:@typescript-eslint/recommended',
      'prettier/@typescript-eslint',  // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
      'plugin:prettier/recommended',  // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  parserOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
      ecmaFeatures: {
          jsx: true,
      },
  },
  env: {
      es6: true,
      browser: true,
      node: true,
  },
  rules: {
      'prettier/prettier': 'warn',
      'object-curly-spacing': [2, 'always'],
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',

      'no-unused-vars': 'off', // prevent duplicate errors with @typescript-eslint/no-unused-vars
      '@typescript-eslint/no-unused-vars': 'warn',
  },
  settings: {
      react: {
          version: 'detect',
      },
  },
};

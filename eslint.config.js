const react = require('eslint-plugin-react');
const globals = require('globals');

export default [
    {
        files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
        plugins: {
            react,
        },
        languageOptions: {
            parserOptions: {
                ecmaVersion: 6,
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
            ...globals.browser,
            },
        },
        rules: {
            "semi": "error",
            "no-unused-vars": "error"
        },
    },
];

module.exports = {
    env: {
        es6: true,
        node: true
    },
    parser: "@babel/eslint-parser",
    parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ["@babel/preset-react"],
        },
        ecmaVersion: 2018,
        sourceType: "module"
    },
    plugins: [
        "m6web-i18n"
    ],
    rules: {
        "m6web-i18n/no-unknown-key": "error",
        "m6web-i18n/no-unknown-key-secondary-langs": "warn",
        "m6web-i18n/no-text-as-children": ["error", { "ignorePattern": "^\\s?[/.]\\s?$" }],
        "m6web-i18n/no-text-as-attribute": ["error", { "attributes": ["alt", "title"] }],
        "m6web-i18n/interpolation-data": ["error", { "interpolationPattern": "\\{\\.+\\}" }]
    },
    settings: {
        i18n: {
            // Used in 'no-unknown-key' rule
            principalLangs: [
                {
                    name: "fr",
                    translationPath: "fr.json"
                }
            ],
            // Used in 'no-unknown-key-secondary-langs' rule
            secondaryLangs: [
                {
                    name: "en",
                    translationPath: "en.json"
                }
            ],
            // Translate function
            functionName: "t",
            pluralizedKeys: ["one", "other"],
            translationsCacheTTL: 300
        }
    }
};

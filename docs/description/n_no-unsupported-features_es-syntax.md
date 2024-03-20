# Disallow unsupported ECMAScript syntax on the specified version (`n/no-unsupported-features/es-syntax`)

💼 This rule is enabled in the following [configs](https://github.com/eslint-community/eslint-plugin-n#-configs): ☑️ `flat/recommended`, 🟢 `flat/recommended-module`, ✅ `flat/recommended-script`, ☑️ `recommended`, 🟢 `recommended-module`, ✅ `recommended-script`.

<!-- end auto-generated rule header -->

ECMAScript standard is updating every two months.
You can check [node.green](https://node.green/) to know which Node.js version supports each ECMAScript feature.

This rule reports unsupported ECMAScript syntax on the configured Node.js version as lint errors.
Editor integrations of ESLint would be useful to know it in real-time.

## 📖 Rule Details

### Supported ECMAScript features

This rule supports ECMAScript 2019 and proposals that have been approved as Stage 4 by August 2019.
See also [TC39 finished proposals](https://github.com/tc39/proposals/blob/master/finished-proposals.md).

Please configure your `.eslintrc` file to succeed to succeed in parsing the syntax.
For example, set `2020` to `parserOptions.ecmaVersion`.

### Configured Node.js version range

[Configured Node.js version range](https://github.com/eslint-community/eslint-plugin-n/tree/README.md#configured-nodejs-version-range)

### Options

```json
{
    "n/no-unsupported-features/es-syntax": ["error", {
        "version": ">=16.0.0",
        "ignores": []
    }]
}
```

#### version

As mentioned above, this rule reads the [`engines`] field of `package.json`.
But, you can overwrite the version by `version` option.

The `version` option accepts [the valid version range of `node-semver`](https://github.com/npm/node-semver#range-grammar).

#### ignores

If you are using transpilers, maybe you want to ignore the warnings about some features.
You can use this `ignores` option to ignore the given features.

The `"ignores"` option accepts an array of the following strings.

<details>

**ES2020:**

- `"bigint"`
- `"dynamicImport"`
- `"optionalChaining"`
- `"nullishCoalescingOperators"`

**ES2019:**

- `"jsonSuperset"`
- `"optionalCatchBinding"`

**ES2018:**

- `"asyncIteration"`
- `"malformedTemplateLiterals"`
- `"regexpLookbehind"`
- `"regexpNamedCaptureGroups"`
- `"regexpS"`
- `"regexpUnicodeProperties"`
- `"restSpreadProperties"`

**ES2017:**

- `"asyncFunctions"`
- `"trailingCommasInFunctions"`

**ES2016:**

- `"exponentialOperators"`

**ES2015:**

- `"arrowFunctions"`
- `"binaryNumericLiterals"`
- `"blockScopedFunctions"`
- `"blockScopedVariables"`
- `"classes"`
- `"computedProperties"`
- `"defaultParameters"`
- `"destructuring"`
- `"forOfLoops"`
- `"generators"`
- `"modules"`
- `"new.target"`
- `"objectSuperProperties"`
- `"octalNumericLiterals"`
- `"propertyShorthands"`
- `"regexpU"`
- `"regexpY"`
- `"restParameters"`
- `"spreadElements"`
- `"templateLiterals"`
- `"unicodeCodePointEscapes"`

</details>

[`engines`]: https://docs.npmjs.com/files/package.json#engines

### Shared Settings

The following options can be set by [shared settings](http://eslint.org/docs/user-guide/configuring.html#adding-shared-settings).
Several rules have the same option, but we can set this option at once.

- `version`

For Example:

```json
{
    "settings": {
        "node": {
            "version": ">=16.0.0",
        }
    },
    "rules": {
        "n/no-unsupported-features/es-syntax": ["error", {
            "ignores": []
        }]
    }
}
```

## 🔎 Implementation

- [Rule source](https://github.com/eslint-community/eslint-plugin-n/tree/lib/rules/no-unsupported-features/es-syntax.js)
- [Test source](https://github.com/eslint-community/eslint-plugin-n/tree/tests/lib/rules/no-unsupported-features/es-syntax.js)

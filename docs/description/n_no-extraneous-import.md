# Disallow `import` declarations which import extraneous modules (`n/no-extraneous-import`)

💼 This rule is enabled in the following [configs](https://github.com/eslint-community/eslint-plugin-n#-configs): ☑️ `flat/recommended`, 🟢 `flat/recommended-module`, ✅ `flat/recommended-script`, ☑️ `recommended`, 🟢 `recommended-module`, ✅ `recommended-script`.

<!-- end auto-generated rule header -->

If an `import` declaration's source is extraneous (it's not written in `package.json`), the program works in local, but will not work after dependencies are re-installed. It will cause troubles to your team/contributors.
This rule disallows `import` declarations of extraneous modules.

## 📖 Rule Details

This rule warns `import` declarations of extraneous modules.

### Options

```json
{
    "rules": {
        "n/no-extraneous-import": ["error", {
            "allowModules": [],
            "resolvePaths": []
        }]
    }
}
```

#### allowModules

This can be configured in the rule options or as a shared setting [`settings.allowModules`](https://github.com/eslint-community/eslint-plugin-n/tree/master/docs/shared-settings.md#allowmodules).
Please see the shared settings documentation for more information.

#### resolvePaths

This can be configured in the rule options or as a shared setting [`settings.resolvePaths`](https://github.com/eslint-community/eslint-plugin-n/tree/master/docs/shared-settings.md#resolvepaths).
Please see the shared settings documentation for more information.

#### convertPath

This can be configured in the rule options or as a shared setting [`settings.convertPath`](https://github.com/eslint-community/eslint-plugin-n/tree/master/docs/shared-settings.md#convertpath).
Please see the shared settings documentation for more information.

## 🔎 Implementation

- [Rule source](https://github.com/eslint-community/eslint-plugin-n/tree/master/lib/rules/no-extraneous-import.js)
- [Test source](https://github.com/eslint-community/eslint-plugin-n/tree/master/tests/lib/rules/no-extraneous-import.js)

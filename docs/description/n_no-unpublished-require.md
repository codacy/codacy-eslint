# Disallow `require()` expressions which import private modules (`n/no-unpublished-require`)

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/eslint-community/eslint-plugin-n#-configs).

<!-- end auto-generated rule header -->

If a `require()` expression's target is not published, the program works in local, but will not work after published to npm.
This rule disallows `require()` expressions of unpublished files/modules.

## 📖 Rule Details

If a source code file satisfies all of the following conditions, the file is \*published\*.

- `"files"` field of `package.json` includes the file or `"files"` field of `package.json` does not exist.
- `.npmignore` does not include the file.

Then this rule warns `require()` expressions in \*published\* files if the `require()` expression imports \*unpublished\* files or the packages of `devDependencies`.

> This intends to prevent "Module Not Found" error after `npm publish`.\
> 💡 If you want to import `devDependencies`, please write `.npmignore` or `"files"` field of `package.json`.

### Options

```json
{
    "rules": {
        "n/no-unpublished-require": ["error", {
            "allowModules": [],
            "convertPath": null,
            "tryExtensions": [".js", ".json", ".node"]
        }]
    }
}
```

#### allowModules

Some platforms have additional embedded modules.
For example, Electron has `electron` module.

We can specify additional embedded modules with this option.
This option is an array of strings as module names.

```json
{
    "rules": {
        "n/no-unpublished-require": ["error", {
            "allowModules": ["electron"]
        }]
    }
}
```

#### convertPath

If we use transpilers (e.g. Babel), perhaps the file path to a source code is never published.
`convertPath` option tells to the rule, it needs to convert file paths.

For example:

```json
{
    "rules": {
        "n/no-unpublished-require": ["error", {
            "convertPath": {
                "src/**/*.jsx": ["^src/(.+?)\\.jsx$", "lib/$1.js"]
            },
            "tryExtensions": [".js", ".jsx", ".json"]
        }]
    }
}
```

This option has the following shape: `<targetFiles>: [<fromRegExp>, <toString>]`

`targetFiles` is a glob pattern.
It converts paths which are matched to the pattern with the following way.

```js
path.replace(new RegExp(fromRegExp), toString);
```

So on this example, `src/a/foo.jsx` is handled as `lib/a/foo.js`.

The `convertPath` option can be an array as well.

For example:

```json
{
    "rules": {
        "n/no-unpublished-require": ["error", {
            "convertPath": [
                {
                    "include": ["src/**/*.js"],
                    "exclude": ["**/*.spec.js"],
                    "replace": ["^src/(.+)$", "lib/$1"]
                }
            ]
        }]
    }
}
```

In this style, this option has the following shape as the same expression as above: `{include: [<targetFiles>], replace: [<fromRegExp>, <toString>]}`.
In addition, we can specify glob patterns to exclude files.

#### tryExtensions

When an import path does not exist, this rule checks whether or not any of `path.js`, `path.json`, and `path.node` exists.
`tryExtensions` option is the extension list this rule uses at the time.

Default is `[".js", ".json", ".node"]`.

#### resolvePaths

TODO

### Shared Settings

The following options can be set by [shared settings](http://eslint.org/docs/user-guide/configuring.html#adding-shared-settings).
Several rules have the same option, but we can set this option at once.

- `allowModules`
- `convertPath`
- `tryExtensions`

For Example:

```json
{
    "settings": {
        "node": {
            "allowModules": ["electron"],
            "convertPath": {
                "src/**/*.jsx": ["^src/(.+?)\\.jsx$", "lib/$1.js"]
            },
            "tryExtensions": [".js", ".jsx", ".json"]
        }
    },
    "rules": {
        "n/no-unpublished-require": "error"
    }
}
```

## 🔎 Implementation

- [Rule source](../../lib/rules/no-unpublished-require.js)
- [Test source](../../tests/lib/rules/no-unpublished-require.js)

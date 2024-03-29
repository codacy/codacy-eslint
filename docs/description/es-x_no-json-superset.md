---
title: "es-x/no-json-superset"
description: "disallow `\\u2028` and `\\u2029` in string literals"
since: "[eslint-plugin-es] v1.3.0"
---

# es-x/no-json-superset
> disallow `\u2028` and `\u2029` in string literals

- ✅ The following configurations enable this rule: `plugin:es-x/no-new-in-es2019`, `plugin:es-x/restrict-to-es3`, `plugin:es-x/restrict-to-es5`, `plugin:es-x/restrict-to-es2015`, `plugin:es-x/restrict-to-es2016`, `plugin:es-x/restrict-to-es2017`, and `plugin:es-x/restrict-to-es2018`
- 🔧 The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

This rule reports ES2019 `\u2028` and `\u2029` in string literals as errors.

## 💡 Examples

⛔ Examples of **incorrect** code for this rule:

<eslint-playground fix type="bad" code="/*eslint es-x/no-json-superset: error */
const u2028 = &quot;&#x2028;&quot; // a \u2028 is in this string
const u2029 = &quot;&#x2029;&quot; // a \u2029 is in this string
">

```js
/*eslint es-x/no-json-superset: error */
const u2028 = " " // a \u2028 is in this string
const u2029 = " " // a \u2029 is in this string
```

</eslint-playground>

## 🚀 Version

This rule was introduced in [eslint-plugin-es] v1.3.0.

[eslint-plugin-es]: https://github.com/mysticatea/eslint-plugin-es

## 📚 References

- [Rule source](https://github.com/eslint-community/eslint-plugin-es-x/blob/master/lib/rules/no-json-superset.js)
- [Test source](https://github.com/eslint-community/eslint-plugin-es-x/blob/master/tests/lib/rules/no-json-superset.js)

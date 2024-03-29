---
title: "es-x/no-block-scoped-functions"
description: "disallow block-scoped function declarations"
since: "[eslint-plugin-es] v1.0.0"
---

# es-x/no-block-scoped-functions
> disallow block-scoped function declarations

- ✅ The following configurations enable this rule: `plugin:es-x/no-new-in-es2015`, `plugin:es-x/restrict-to-es3`, and `plugin:es-x/restrict-to-es5`

This rule reports ES2015 block-scoped function declarations as errors.

## 💡 Examples

⛔ Examples of **incorrect** code for this rule:

<eslint-playground type="bad">

```js
/*eslint es-x/no-block-scoped-functions: error */
if (a) {
    function f() {}
} else {
    function g() {}
}
```

</eslint-playground>

## 🚀 Version

This rule was introduced in [eslint-plugin-es] v1.0.0.

[eslint-plugin-es]: https://github.com/mysticatea/eslint-plugin-es

## 📚 References

- [Rule source](https://github.com/eslint-community/eslint-plugin-es-x/blob/master/lib/rules/no-block-scoped-functions.js)
- [Test source](https://github.com/eslint-community/eslint-plugin-es-x/blob/master/tests/lib/rules/no-block-scoped-functions.js)

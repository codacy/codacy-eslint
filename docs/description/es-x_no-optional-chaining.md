---
title: "es-x/no-optional-chaining"
description: "disallow optional chaining"
since: "[eslint-plugin-es] v4.0.0"
---

# es-x/no-optional-chaining
> disallow optional chaining

- ✅ The following configurations enable this rule: `plugin:es-x/no-new-in-es2020`, `plugin:es-x/restrict-to-es3`, `plugin:es-x/restrict-to-es5`, `plugin:es-x/restrict-to-es2015`, `plugin:es-x/restrict-to-es2016`, `plugin:es-x/restrict-to-es2017`, `plugin:es-x/restrict-to-es2018`, and `plugin:es-x/restrict-to-es2019`

This rule reports ES2020 [Optional Chaining](https://github.com/tc39/proposal-optional-chaining) as errors.

## 💡 Examples

⛔ Examples of **incorrect** code for this rule:

<eslint-playground type="bad">

```js
/*eslint es-x/no-optional-chaining: error */
var x = a?.b
var x = a?.[b]
foo?.()
```

</eslint-playground>

👌 Examples of **correct** code for this rule:

<eslint-playground type="good">

```js
/*eslint es-x/no-optional-chaining: error */
var x = a != null ? a.b : undefined
var x = a && a.b
var x = a != null ? a[b] : undefined
var x = a && a[b]
foo && foo()
```

</eslint-playground>

## 🚀 Version

This rule was introduced in [eslint-plugin-es] v4.0.0.

[eslint-plugin-es]: https://github.com/mysticatea/eslint-plugin-es

## 📚 References

- [Rule source](https://github.com/eslint-community/eslint-plugin-es-x/blob/master/lib/rules/no-optional-chaining.js)
- [Test source](https://github.com/eslint-community/eslint-plugin-es-x/blob/master/tests/lib/rules/no-optional-chaining.js)

---
title: "es-x/no-nullish-coalescing-operators"
description: "disallow nullish coalescing operators"
since: "[eslint-plugin-es] v4.0.0"
---

# es-x/no-nullish-coalescing-operators
> disallow nullish coalescing operators

- ✅ The following configurations enable this rule: `plugin:es-x/no-new-in-es2020`, `plugin:es-x/restrict-to-es3`, `plugin:es-x/restrict-to-es5`, `plugin:es-x/restrict-to-es2015`, `plugin:es-x/restrict-to-es2016`, `plugin:es-x/restrict-to-es2017`, `plugin:es-x/restrict-to-es2018`, and `plugin:es-x/restrict-to-es2019`

This rule reports ES2020 [Nullish Coalescing operators](https://github.com/tc39/proposal-nullish-coalescing) as errors.

## 💡 Examples

⛔ Examples of **incorrect** code for this rule:

<eslint-playground type="bad">

```js
/*eslint es-x/no-nullish-coalescing-operators: error */
var x = a ?? b
```

</eslint-playground>

👌 Examples of **correct** code for this rule:

<eslint-playground type="good">

```js
/*eslint es-x/no-nullish-coalescing-operators: error */
var x = a || b
var x = a != null ? a : b
```

</eslint-playground>

## 🚀 Version

This rule was introduced in [eslint-plugin-es] v4.0.0.

[eslint-plugin-es]: https://github.com/mysticatea/eslint-plugin-es

## 📚 References

- [Rule source](https://github.com/eslint-community/eslint-plugin-es-x/blob/master/lib/rules/no-nullish-coalescing-operators.js)
- [Test source](https://github.com/eslint-community/eslint-plugin-es-x/blob/master/tests/lib/rules/no-nullish-coalescing-operators.js)

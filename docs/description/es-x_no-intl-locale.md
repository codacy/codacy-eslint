---
title: "es-x/no-intl-locale"
description: "disallow the `Intl.Locale` object"
since: "v6.0.0"
---

# es-x/no-intl-locale
> disallow the `Intl.Locale` object

- ✅ The following configurations enable this rule: `plugin:es-x/no-new-in-es2020-intl-api`, `plugin:es-x/restrict-to-es-intl-api-1st-edition`, `plugin:es-x/restrict-to-es2015-intl-api`, `plugin:es-x/restrict-to-es2016-intl-api`, `plugin:es-x/restrict-to-es2017-intl-api`, `plugin:es-x/restrict-to-es2018-intl-api`, and `plugin:es-x/restrict-to-es2019-intl-api`

This rule reports ES2020 Intl API `Intl.Locale` object as errors.

## 💡 Examples

⛔ Examples of **incorrect** code for this rule:

<eslint-playground type="bad">

```js
/*eslint es-x/no-intl-locale: error */
const japanese = new Intl.Locale('ja-Jpan-JP-u-ca-japanese-hc-h12');
```

</eslint-playground>

## 🚀 Version

This rule was introduced in v6.0.0.

## 📚 References

- [Rule source](https://github.com/eslint-community/eslint-plugin-es-x/blob/master/lib/rules/no-intl-locale.js)
- [Test source](https://github.com/eslint-community/eslint-plugin-es-x/blob/master/tests/lib/rules/no-intl-locale.js)

---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-empty-component-block
description: disallow the `<template>` `<script>` `<style>` block to be empty
since: v7.0.0
---

# vue/no-empty-component-block

> disallow the `<template>` `<script>` `<style>` block to be empty

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule disallows the `<template>` `<script>` `<style>` block to be empty.

This rule also checks block what has attribute `src`.
See [Vue Single-File Component (SFC) Spec](https://vue-loader.vuejs.org/spec.html#src-imports).

<eslint-code-block fix :rules="{'vue/no-empty-component-block': ['error']}">

```vue
<!-- ✓ GOOD -->
<template>
  <p>foo</p>
</template>

<script>
console.log('foo')
</script>

<style>
p {
  display: inline;
}
</style>

<template src="./template.html"></template>
<template src="./template.html" />

<script src="./script.js"></script>
<script src="./script.js" />

<style src="./style.css"></style>
<style src="./style.css" />

<!-- ✗ BAD -->
<template></template>
<template />
<template src="" />

<script></script>
<script />
<script src="" />

<style></style>
<style />
<style src="" />
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.0.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-empty-component-block.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-empty-component-block.js)

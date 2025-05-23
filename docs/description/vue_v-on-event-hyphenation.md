---
pageClass: rule-details
sidebarDepth: 0
title: vue/v-on-event-hyphenation
description: enforce v-on event naming style on custom components in template
since: v7.4.0
---

# vue/v-on-event-hyphenation

> enforce v-on event naming style on custom components in template

- :gear: This rule is included in all of `"plugin:vue/vue3-strongly-recommended"`, `*.configs["flat/strongly-recommended"]`, `"plugin:vue/vue3-recommended"` and `*.configs["flat/recommended"]`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule enforces using hyphenated v-on event names on custom components in Vue templates.

<eslint-code-block fix :rules="{'vue/v-on-event-hyphenation': ['error', 'always', { autofix: true }]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <MyComponent v-on:custom-event="handleEvent" />
  <MyComponent @custom-event="handleEvent" />

  <!-- ✗ BAD -->
  <MyComponent v-on:customEvent="handleEvent" />
  <MyComponent @customEvent="handleEvent" />
</template>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/v-on-event-hyphenation": ["error", "always" | "never", {
    "autofix": false,
    "ignore": [],
    "ignoreTags": []
  }]
}
```

- `"always"` (default) ... Use hyphenated event name.
- `"never"` ... Don't use hyphenated event name.
- `"ignore"` ... Array of event names that don't need to follow the specified casing.
- `"ignoreTags"` ... Array of tag names whose events don't need to follow the specified casing.
- `"autofix"` ... If `true`, enable autofix. If you are using Vue 2, we recommend that you do not use it due to its side effects.

### `"always"`

It errors on upper case letters.

<eslint-code-block fix :rules="{'vue/v-on-event-hyphenation': ['error', 'always', { autofix: true }]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <MyComponent v-on:custom-event="handleEvent" />

  <!-- ✗ BAD -->
  <MyComponent v-on:customEvent="handleEvent" />
</template>
```

</eslint-code-block>

### `"never"`

It errors on hyphens.

<eslint-code-block fix :rules="{'vue/v-on-event-hyphenation': ['error', 'never', { autofix: true }]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <MyComponent v-on:customEvent="handleEvent" />

  <!-- ✗ BAD -->
  <MyComponent v-on:custom-event="handleEvent" />
</template>
```

</eslint-code-block>

### `"never", { "ignore": ["custom-event"] }`

Don't use hyphenated name but allow custom event names

<eslint-code-block fix :rules="{'vue/v-on-event-hyphenation': ['error', 'never', { ignore: ['custom-event'], autofix: true }]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <MyComponent v-on:custom-event="handleEvent" />
  <MyComponent v-on:myEvent="handleEvent" />

  <!-- ✗ BAD -->
  <MyComponent v-on:my-event="handleEvent" />
</template>
```

</eslint-code-block>

### `"never", { "ignoreTags": ["/^custom-/"] }`

<eslint-code-block fix :rules="{'vue/v-on-event-hyphenation': ['error', 'never', { ignoreTags: ['/^custom-/'], autofix: true }]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <custom-component v-on:my-event="handleEvent" />

  <!-- ✗ BAD -->
  <my-component v-on:my-event="handleEvent" />
</template>
```

</eslint-code-block>

## :couple: Related Rules

- [vue/custom-event-name-casing](https://github.com/vuejs/eslint-plugin-vue/tree/master/docs/rules/custom-event-name-casing.md)
- [vue/attribute-hyphenation](https://github.com/vuejs/eslint-plugin-vue/tree/master/docs/rules/attribute-hyphenation.md)
- [vue/v-on-handler-style](https://github.com/vuejs/eslint-plugin-vue/tree/master/docs/rules/v-on-handler-style.md)

## :books: Further Reading

- [Guide - Custom Events]

[Guide - Custom Events]: https://vuejs.org/guide/components/events.html

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.4.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/v-on-event-hyphenation.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/v-on-event-hyphenation.js)

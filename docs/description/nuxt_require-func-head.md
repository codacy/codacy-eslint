# nuxt/require-func-head

> enforce `head` property in component to be a function.

## Rule Details

This rule is enforcing `head` property in component to be a function.

Examples of **incorrect** code for this rule:

```js

export default {
  head: {
    title: "My page"
  }
}

```

Examples of **correct** code for this rule:

```js

export default {
  head() {
    return {
      title: "My page"
    }
  }
}

```

## :mag: Implementation

- [Rule source](https://github.com/nuxt/eslint-plugin-nuxt/tree/master/lib/rules/require-func-head.js)
- [Test source](https://github.com/nuxt/eslint-plugin-nuxt/tree/master/lib/rules/__tests__/require-func-head.test.js)

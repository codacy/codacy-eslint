---
description: 'Disallow throwing literals as exceptions.'
---

> 🛑 This file is source code, not the primary documentation location! 🛑
>
> See **https://typescript-eslint.io/rules/no-throw-literal** for documentation.

It is considered good practice to only `throw` the `Error` object itself or an object using the `Error` object as base objects for user-defined exceptions.
The fundamental benefit of `Error` objects is that they automatically keep track of where they were built and originated.

This rule restricts what can be thrown as an exception.

:::warning
This rule is being renamed to [`only-throw-error`](https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/only-throw-error.mdx).
When it was first created, it only prevented literals from being thrown (hence the name), but it has now been expanded to only allow expressions which have a possibility of being an `Error` object.
With the `allowThrowingAny` and `allowThrowingUnknown` options, it can be configured to only allow throwing values which are guaranteed to be an instance of `Error`.

The current name `no-throw-literal` will be removed in a future major version of typescript-eslint.
:::

<!-- Intentionally Omitted: When Not To Use It -->

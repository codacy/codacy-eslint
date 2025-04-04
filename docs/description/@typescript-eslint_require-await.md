---
description: 'Disallow async functions which do not return promises and have no `await` expression.'
---

> 🛑 This file is source code, not the primary documentation location! 🛑
>
> See **https://typescript-eslint.io/rules/require-await** for documentation.

This rule extends the base [`eslint/require-await`](https://eslint.org/docs/rules/require-await) rule.
It uses type information to allow promise-returning functions to be marked as `async` without containing an `await` expression.

## Examples

Examples of **correct** code for this rule:

```ts
async function returnsPromise1() {
  return Promise.resolve(1);
}

const returnsPromise2 = () => returnsPromise1();
```

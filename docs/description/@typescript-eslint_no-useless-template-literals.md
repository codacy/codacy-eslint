---
description: 'Disallow unnecessary template expressions.'
---

> 🛑 This file is source code, not the primary documentation location! 🛑
>
> See **https://typescript-eslint.io/rules/no-useless-template-literals** for documentation.

This rule reports template literals that contain substitution expressions (also variously referred to as embedded expressions or string interpolations) that are unnecessary and can be simplified.

:::warning
This rule is being renamed to [`no-unnecessary-template-expression`](https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-unnecessary-template-expression.mdx).
The current name, `no-useless-template-literals`, will be removed in a future major version of typescript-eslint.

After the creation of this rule, it was realized that the name `no-useless-template-literals` could be misleading, seeing as this rule only targets template literals with substitution expressions.
In particular, it does _not_ aim to flag useless template literals that look like `` `this` `` and could be simplified to `"this"`.
If you are looking for such a rule, you can configure the [`@stylistic/ts/quotes`](https://eslint.style/rules/ts/quotes) rule to do this.
:::

<!-- Intentionally Omitted: When Not To Use It -->

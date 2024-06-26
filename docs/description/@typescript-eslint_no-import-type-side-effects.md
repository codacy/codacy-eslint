---
description: 'Enforce the use of top-level import type qualifier when an import only has specifiers with inline type qualifiers.'
---

> 🛑 This file is source code, not the primary documentation location! 🛑
>
> See **https://typescript-eslint.io/rules/no-import-type-side-effects** for documentation.

The [`--verbatimModuleSyntax`](https://www.typescriptlang.org/tsconfig#verbatimModuleSyntax) compiler option causes TypeScript to do simple and predictable transpilation on import declarations.
Namely, it completely removes import declarations with a top-level `type` qualifier, and it removes any import specifiers with an inline `type` qualifier.

The latter behavior does have one potentially surprising effect in that in certain cases TS can leave behind a "side effect" import at runtime:

```ts

// is transpiled to

// which is the same as
import 'mod';
```

For the rare case of needing to import for side effects, this may be desirable - but for most cases you will not want to leave behind an unnecessary side effect import.

## Examples

This rule enforces that you use a top-level `type` qualifier for imports when it only imports specifiers with an inline `type` qualifier

<!--tabs-->

#### ❌ Incorrect

```ts

```

#### ✅ Correct

```ts

```

<!--/tabs-->

## When Not To Use It

If you're not using TypeScript 5.0's `verbatimModuleSyntax` option and your project is built with a bundler that manages import side effects for you, this rule may not be as useful for you.

## Related To

- [`consistent-type-imports`](https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/consistent-type-imports.mdx)
- [`import/consistent-type-specifier-style`](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/consistent-type-specifier-style.md)
- [`import/no-duplicates` with `{"prefer-inline": true}`](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-duplicates.md#inline-type-imports)

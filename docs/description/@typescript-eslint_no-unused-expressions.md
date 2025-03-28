---
description: 'Disallow unused expressions.'
---

> 🛑 This file is source code, not the primary documentation location! 🛑
>
> See **https://typescript-eslint.io/rules/no-unused-expressions** for documentation.

This rule extends the base [`eslint/no-unused-expressions`](https://eslint.org/docs/rules/no-unused-expressions) rule.
It supports TypeScript-specific expressions:

- Marks directives in modules declarations (`"use strict"`, etc.) as not unused
- Marks the following expressions as unused if their wrapped value expressions are unused:
  - Assertion expressions: `x as number;`, `x!;`, `<number>x;`
  - Instantiation expressions: `Set<number>;`

Although the type expressions never have runtime side effects (that is, `x!;` is the same as `x;`), they can be used to assert types for testing purposes.

## Examples

<!--tabs-->

#### ❌ Incorrect

```ts
Set<number>;
1 as number;
window!;
```

#### ✅ Correct

```ts
function getSet() {
  return Set;
}

// Funtion calls are allowed, so type expressions that wrap function calls are allowed
getSet()<number>;
getSet() as Set<unknown>;
getSet()!;

// Namespaces can have directives
namespace A {
  'use strict';
}
```

<!--/tabs-->


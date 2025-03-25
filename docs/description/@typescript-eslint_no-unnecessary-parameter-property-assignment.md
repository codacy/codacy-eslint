---
description: 'Disallow unnecessary assignment of constructor property parameter.'
---

> 🛑 This file is source code, not the primary documentation location! 🛑
>
> See **https://typescript-eslint.io/rules/no-unnecessary-parameter-property-assignment** for documentation.

[TypeScript's parameter properties](https://www.typescriptlang.org/docs/handbook/2/classes.html#parameter-properties) allow creating and initializing a member in one place.
Therefore, in most cases, it is not necessary to assign parameter properties of the same name to members within a constructor.

## Examples

<!--tabs-->

#### ❌ Incorrect

```ts
class Foo {
  constructor(public bar: string) {
    this.bar = bar;
  }
}
```

#### ✅ Correct

```ts
class Foo {
  constructor(public bar: string) {}
}
```

<!--/tabs-->

## When Not To Use It

If you don't use parameter properties, you can ignore this rule.

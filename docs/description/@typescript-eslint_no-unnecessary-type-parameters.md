---
description: 'Disallow type parameters that only appear once.'
---

> 🛑 This file is source code, not the primary documentation location! 🛑
>
> See **https://typescript-eslint.io/rules/no-unnecessary-type-parameters** for documentation.

This rule forbids type parameters that only appear once in a function, method, or class definition.

Type parameters relate two types.
If a type parameter only appears once, then it is not relating anything.
It can usually be replaced with explicit types such as `unknown`.

At best unnecessary type parameters make code harder to read.
At worst they can be used to disguise unsafe type assertions.

:::warning Early Stage
This rule was recently added to typescript-eslint and still considered experimental.
It might change significantly between minor versions.
Please try it out and give us feedback!
:::

## Examples

<!--tabs-->

#### ❌ Incorrect

```ts
function second<A, B>(a: A, b: B): B {
  return b;
}

function parseJSON<T>(input: string): T {
  return JSON.parse(input);
}

function printProperty<T, K extends keyof T>(obj: T, key: K) {
  console.log(obj[key]);
}
```

#### ✅ Correct

```ts
function second<B>(a: unknown, b: B): B {
  return b;
}

function parseJSON(input: string): unknown {
  return JSON.parse(input);
}

function printProperty<T>(obj: T, key: keyof T) {
  console.log(obj[key]);
}

// T appears twice: in the type of arg and as the return type
function identity<T>(arg: T): T {
  return arg;
}

// T appears twice: "keyof T" and in the inferred return type (T[K]).
// K appears twice: "key: K" and in the inferred return type (T[K]).
function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}
```

<!--/tabs-->

## Limitations

Note that this rule allows any type parameter that is used multiple times, even if those uses are via a type argument.
For example, the following `T` is used multiple times by virtue of being in an `Array`, even though its name only appears once after declaration:

```ts
declare function createStateHistory<T>(): T[];
```

This is because the type parameter `T` relates multiple methods in the `T[]` together, making it used more than once.

Therefore, this rule won't report on type parameters used as a type argument.
That includes type arguments given to global types such as `Array` (including the `T[]` shorthand and in tuples), `Map`, and `Set`.

## When Not To Use It

This rule will report on functions that use type parameters solely to test types, for example:

```ts
function assertType<T>(arg: T) {}

assertType<number>(123);
assertType<number>('abc');
//                 ~~~~~
// Argument of type 'string' is not assignable to parameter of type 'number'.
```

If you're using this pattern then you'll want to disable this rule on files that test types.

## Further Reading

- TypeScript handbook: [Type Parameters Should Appear Twice](https://microsoft.github.io/TypeScript-New-Handbook/everything/#type-parameters-should-appear-twice)
- Effective TypeScript: [The Golden Rule of Generics](https://effectivetypescript.com/2020/08/12/generics-golden-rule/)

## Related To

- eslint-plugin-etc's [`no-misused-generics`](https://github.com/cartant/eslint-plugin-etc/blob/main/docs/rules/no-misused-generics.md)
- wotan's [`no-misused-generics`](https://github.com/fimbullinter/wotan/blob/master/packages/mimir/docs/no-misused-generics.md)
- DefinitelyTyped-tools' [`no-unnecessary-generics`](https://github.com/microsoft/DefinitelyTyped-tools/blob/main/packages/eslint-plugin/docs/rules/no-unnecessary-generics.md)

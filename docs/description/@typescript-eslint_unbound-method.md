---
description: 'Enforce unbound methods are called with their expected scope.'
---

> 🛑 This file is source code, not the primary documentation location! 🛑
>
> See **https://typescript-eslint.io/rules/unbound-method** for documentation.

Class method functions don't preserve the class scope when passed as standalone variables ("unbound").
If your function does not access `this`, [you can annotate it with `this: void`](https://www.typescriptlang.org/docs/handbook/2/functions.html#declaring-this-in-a-function), or consider using an arrow function instead.
Otherwise, passing class methods around as values can remove type safety by failing to capture `this`.

This rule reports when a class method is referenced in an unbound manner.

:::note Tip
If you're working with `jest`, you can use [`eslint-plugin-jest`'s version of this rule](https://github.com/jest-community/eslint-plugin-jest/blob/main/docs/rules/unbound-method.md) to lint your test files, which knows when it's ok to pass an unbound method to `expect` calls.
:::

## Examples

<!--tabs-->

#### ❌ Incorrect

```ts
class MyClass {
  public log(): void {
    console.log(this);
  }
}

const instance = new MyClass();

// This logs the global scope (`window`/`global`), not the class instance
const myLog = instance.log;
myLog();

// This log might later be called with an incorrect scope
const { log } = instance;

// arith.double may refer to `this` internally
const arith = {
  double(x: number): number {
    return x * 2;
  },
};
const { double } = arith;
```

#### ✅ Correct

```ts
class MyClass {
  public logUnbound(): void {
    console.log(this);
  }

  public logBound = () => console.log(this);
}

const instance = new MyClass();

// logBound will always be bound with the correct scope
const { logBound } = instance;
logBound();

// .bind and lambdas will also add a correct scope
const dotBindLog = instance.logUnbound.bind(instance);
const innerLog = () => instance.logUnbound();

// arith.double explicitly declares that it does not refer to `this` internally
const arith = {
  double(this: void, x: number): number {
    return x * 2;
  },
};
const { double } = arith;
```

<!--/tabs-->

## Options

### `ignoreStatic`

Examples of **correct** code for this rule with `{ ignoreStatic: true }`:

```ts option='{ "ignoreStatic": true }' showPlaygroundButton
class OtherClass {
  static log() {
    console.log(OtherClass);
  }
}

// With `ignoreStatic`, statics are assumed to not rely on a particular scope
const { log } = OtherClass;

log();
```

## When Not To Use It

If your project dynamically changes `this` scopes around in a way TypeScript has difficulties modeling, this rule may not be viable to use.
For example, some functions have an additional parameter for specifying the `this` context, such as `Reflect.apply`, and array methods like `Array.prototype.map`.
This semantic is not easily expressed by TypeScript.
You might consider using [ESLint disable comments](https://eslint.org/docs/latest/use/configure/rules#using-configuration-comments-1) for those specific situations instead of completely disabling this rule.

If you're wanting to use `toBeCalled` and similar matches in `jest` tests, you can disable this rule for your test files in favor of [`eslint-plugin-jest`'s version of this rule](https://github.com/jest-community/eslint-plugin-jest/blob/main/docs/rules/unbound-method.mdx).

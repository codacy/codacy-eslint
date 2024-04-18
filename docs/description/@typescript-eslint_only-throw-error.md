---
description: 'Disallow throwing non-`Error` values as exceptions.'
---

> 🛑 This file is source code, not the primary documentation location! 🛑
>
> See **https://typescript-eslint.io/rules/only-throw-error** for documentation.

It is considered good practice to only `throw` the `Error` object itself or an object using the `Error` object as base objects for user-defined exceptions.
The fundamental benefit of `Error` objects is that they automatically keep track of where they were built and originated.

This rule restricts what can be thrown as an exception.

## Examples

This rule is aimed at maintaining consistency when throwing exception by disallowing to throw literals and other expressions which cannot possibly be an `Error` object.

<!--tabs-->

#### ❌ Incorrect

```ts
throw 'error';

throw 0;

throw undefined;

throw null;

const err = new Error();
throw 'an ' + err;

const err = new Error();
throw `${err}`;

const err = '';
throw err;

function getError() {
  return '';
}
throw getError();

const foo = {
  bar: '',
};
throw foo.bar;
```

#### ✅ Correct

```ts
throw new Error();

throw new Error('error');

const e = new Error('error');
throw e;

try {
  throw new Error('error');
} catch (e) {
  throw e;
}

const err = new Error();
throw err;

function getError() {
  return new Error();
}
throw getError();

const foo = {
  bar: new Error(),
};
throw foo.bar;

class CustomError extends Error {
  // ...
}
throw new CustomError();
```

<!--/tabs-->

## Options

This rule adds the following options:

```ts
interface Options {
  /**
   * Whether to always allow throwing values typed as `any`.
   */
  allowThrowingAny?: boolean;

  /**
   * Whether to always allow throwing values typed as `unknown`.
   */
  allowThrowingUnknown?: boolean;
}

const defaultOptions: Options = {
  allowThrowingAny: false,
  allowThrowingUnknown: false,
};
```

<!-- Intentionally Omitted: When Not To Use It -->

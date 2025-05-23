---
description: 'Enforce consistent awaiting of returned promises.'
---

> 🛑 This file is source code, not the primary documentation location! 🛑
>
> See **https://typescript-eslint.io/rules/return-await** for documentation.

This rule builds on top of the [`eslint/no-return-await`](https://eslint.org/docs/rules/no-return-await) rule.
It expands upon the base rule to add support for optionally requiring `return await` in certain cases.

The extended rule is named `return-await` instead of `no-return-await` because the extended rule can enforce the positive or the negative. Additionally, while the core rule is now deprecated, the extended rule is still useful in many contexts:

- Returning an awaited promise [improves stack trace information](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await#improving_stack_trace).
- When the `return` statement is in `try...catch`, awaiting the promise also allows the promise's rejection to be caught instead of leaving the error to the caller.
- Contrary to popular belief, `return await promise;` is [at least as fast as directly returning the promise](https://github.com/tc39/proposal-faster-promise-adoption).

## Options

```ts
type Options =
  | 'in-try-catch'
  | 'always'
  | 'error-handling-correctness-only'
  | 'never';

const defaultOptions: Options = 'in-try-catch';
```

The options in this rule distinguish between "ordinary contexts" and "error-handling contexts".
An error-handling context is anywhere where returning an unawaited promise would cause unexpected control flow regarding exceptions/rejections.
See detailed examples in the sections for each option.

- If you return a promise within a `try` block, it should be awaited in order to trigger subsequent `catch` or `finally` blocks as expected.
- If you return a promise within a `catch` block, and there _is_ a `finally` block, it should be awaited in order to trigger the `finally` block as expected.
- If you return a promise between a `using` or `await using` declaration and the end of its scope, it should be awaited, since it behaves equivalently to code wrapped in a `try` block followed by a `finally`.

Ordinary contexts are anywhere else a promise may be returned.
The choice of whether to await a returned promise in an ordinary context is mostly stylistic.

With these terms defined, the options may be summarized as follows:

|              Option               | Ordinary Context <br/> (stylistic preference 🎨) |        Error-Handling Context <br/> (catches bugs 🐛)        |                 Should I use this option?                  |
| :-------------------------------: | :----------------------------------------------: | :----------------------------------------------------------: | :--------------------------------------------------------: |
|             `always`              |             `return await promise;`              |                   `return await promise;`                    |                          ✅ Yes!                           |
|          `in-try-catch`           |                `return promise;`                 |                   `return await promise;`                    |                          ✅ Yes!                           |
| `error-handling-correctness-only` |                  don't care 🤷                   |                   `return await promise;`                    | 🟡 Okay to use, but the above options would be preferable. |
|              `never`              |                `return promise;`                 | `return promise;` <br/> (⚠️ This behavior may be harmful ⚠️) |             ❌ No. This option is deprecated.              |

### `in-try-catch`

In error-handling contexts, the rule enforces that returned promises must be awaited.
In ordinary contexts, the rule enforces that returned promises _must not_ be awaited.

This is a good option if you prefer the shorter `return promise` form for stylistic reasons, wherever it's safe to use.

Examples of code with `in-try-catch`:

<!--tabs-->

#### ❌ Incorrect

```ts option='"in-try-catch"'
async function invalidInTryCatch1() {
  try {
    return Promise.reject('try');
  } catch (e) {
    // Doesn't execute due to missing await.
  }
}

async function invalidInTryCatch2() {
  try {
    throw new Error('error');
  } catch (e) {
    // Unnecessary await; rejections here don't impact control flow.
    return await Promise.reject('catch');
  }
}

// Prints 'starting async work', 'cleanup', 'async work done'.
async function invalidInTryCatch3() {
  async function doAsyncWork(): Promise<void> {
    console.log('starting async work');
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('async work done');
  }

  try {
    throw new Error('error');
  } catch (e) {
    // Missing await.
    return doAsyncWork();
  } finally {
    console.log('cleanup');
  }
}

async function invalidInTryCatch4() {
  try {
    throw new Error('error');
  } catch (e) {
    throw new Error('error2');
  } finally {
    // Unnecessary await; rejections here don't impact control flow.
    return await Promise.reject('finally');
  }
}

async function invalidInTryCatch5() {
  return await Promise.resolve('try');
}

async function invalidInTryCatch6() {
  return await 'value';
}

async function invalidInTryCatch7() {
  using x = createDisposable();
  return Promise.reject('using in scope');
}
```

#### ✅ Correct

```ts option='"in-try-catch"'
async function validInTryCatch1() {
  try {
    return await Promise.reject('try');
  } catch (e) {
    // Executes as expected.
  }
}

async function validInTryCatch2() {
  try {
    throw new Error('error');
  } catch (e) {
    return Promise.reject('catch');
  }
}

// Prints 'starting async work', 'async work done', 'cleanup'.
async function validInTryCatch3() {
  async function doAsyncWork(): Promise<void> {
    console.log('starting async work');
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('async work done');
  }

  try {
    throw new Error('error');
  } catch (e) {
    return await doAsyncWork();
  } finally {
    console.log('cleanup');
  }
}

async function validInTryCatch4() {
  try {
    throw new Error('error');
  } catch (e) {
    throw new Error('error2');
  } finally {
    return Promise.reject('finally');
  }
}

async function validInTryCatch5() {
  return Promise.resolve('try');
}

async function validInTryCatch6() {
  return 'value';
}

async function validInTryCatch7() {
  using x = createDisposable();
  return await Promise.reject('using in scope');
}
```

<!--/tabs-->

### `always`

Requires that all returned promises be awaited.

This is a good option if you like the consistency of simply always awaiting promises, or prefer not having to consider the distinction between error-handling contexts and ordinary contexts.

Examples of code with `always`:

<!--tabs-->

#### ❌ Incorrect

```ts option='"always"'
async function invalidAlways1() {
  try {
    return Promise.resolve('try');
  } catch (e) {}
}

async function invalidAlways2() {
  return Promise.resolve('try');
}

async function invalidAlways3() {
  return await 'value';
}
```

#### ✅ Correct

```ts option='"always"'
async function validAlways1() {
  try {
    return await Promise.resolve('try');
  } catch (e) {}
}

async function validAlways2() {
  return await Promise.resolve('try');
}

async function validAlways3() {
  return 'value';
}
```

<!--/tabs-->

### `error-handling-correctness-only`

In error-handling contexts, the rule enforces that returned promises must be awaited.
In ordinary contexts, the rule does not enforce any particular behavior around whether returned promises are awaited.

This is a good option if you only want to benefit from rule's ability to catch control flow bugs in error-handling contexts, but don't want to enforce a particular style otherwise.

:::info
We recommend you configure either `in-try-catch` or `always` instead of this option.
While the choice of whether to await promises outside of error-handling contexts is mostly stylistic, it's generally best to be consistent.
:::

Examples of additional correct code with `error-handling-correctness-only`:

<!--tabs-->

#### ✅ Correct

```ts option='"error-handling-correctness-only"'
async function asyncFunction(): Promise<void> {
  if (Math.random() < 0.5) {
    return await Promise.resolve();
  } else {
    return Promise.resolve();
  }
}
```

<!--/tabs-->

### `never`

Disallows awaiting any returned promises.

:::warning

This option is deprecated and will be removed in a future major version of typescript-eslint.

The `never` option introduces undesirable behavior in error-handling contexts.
If you prefer to minimize returning awaited promises, consider instead using `in-try-catch` instead, which also generally bans returning awaited promises, but only where it is _safe_ not to await a promise.

See more details at [typescript-eslint#9433](https://github.com/typescript-eslint/typescript-eslint/issues/9433).
:::

Examples of code with `never`:

<!--tabs-->

#### ❌ Incorrect

```ts option='"never"'
async function invalidNever1() {
  try {
    return await Promise.resolve('try');
  } catch (e) {}
}

async function invalidNever2() {
  return await Promise.resolve('try');
}

async function invalidNever3() {
  return await 'value';
}
```

#### ✅ Correct

```ts option='"never"'
async function validNever1() {
  try {
    return Promise.resolve('try');
  } catch (e) {}
}

async function validNever2() {
  return Promise.resolve('try');
}

async function validNever3() {
  return 'value';
}
```

<!--/tabs-->


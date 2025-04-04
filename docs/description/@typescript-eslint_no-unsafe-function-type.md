---
description: 'Disallow using the unsafe built-in Function type.'
---

> 🛑 This file is source code, not the primary documentation location! 🛑
>
> See **https://typescript-eslint.io/rules/no-unsafe-function-type** for documentation.

TypeScript's built-in `Function` type allows being called with any number of arguments and returns type `any`.
`Function` also allows classes or plain objects that happen to possess all properties of the `Function` class.
It's generally better to specify function parameters and return types with the function type syntax.

"Catch-all" function types include:

- `() => void`: a function that has no parameters and whose return is ignored
- `(...args: never) => unknown`: a "top type" for functions that can be assigned any function type, but can't be called

Examples of code for this rule:

<!--tabs-->

#### ❌ Incorrect

```ts
let noParametersOrReturn: Function;
noParametersOrReturn = () => {};

let stringToNumber: Function;
stringToNumber = (text: string) => text.length;

let identity: Function;
identity = value => value;
```

#### ✅ Correct

```ts
let noParametersOrReturn: () => void;
noParametersOrReturn = () => {};

let stringToNumber: (text: string) => number;
stringToNumber = text => text.length;

let identity: <T>(value: T) => T;
identity = value => value;
```

<!--/tabs-->

## When Not To Use It

If your project is still onboarding to TypeScript, it might be difficult to fully replace all unsafe `Function` types with more precise function types.
You might consider using [ESLint disable comments](https://eslint.org/docs/latest/use/configure/rules#using-configuration-comments-1) for those specific situations instead of completely disabling this rule.

## Related To

- [`no-empty-object-type`](https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-empty-object-type.mdx)
- [`ban-types`](https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/ban-types.mdx)
- [`no-wrapper-object-types`](https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-wrapper-object-types.mdx)

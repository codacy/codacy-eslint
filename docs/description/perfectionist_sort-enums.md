---
title: sort-enums
description: Ensure TypeScript enum members are sorted for better readability and maintainability. Use this ESLint rule to keep your enums organized
shortDescription: Enforce sorted TypeScript enums
keywords:
  - eslint
  - sort enums
  - eslint rule
  - coding standards
  - code quality
  - javascript linting
  - typescript enums sorting
---

import CodeExample from '../../components/CodeExample.svelte'
import CodeTabs from '../../components/CodeTabs.svelte'
import { dedent } from 'ts-dedent'

Enforce sorted TypeScript enum members.

Enums are essential for defining a set of named constants, and keeping them in a consistent and predictable order is a best practice for readability and maintainability.

This rule ensures that TypeScript enum members are sorted, making it easier to reason about their values and identify any missing or duplicate entries. Sorted enums enhance the clarity of your code, making it more straightforward to understand and maintain.

## Try it out

<CodeExample
  alphabetical={dedent`
    enum Priority {
      Critical = 'Critical',
      High = 'High',
      Low = 'Low',
      Medium = 'Medium',
      None = 'None',
    }

    enum Status {
      Cancelled = 'Cancelled',
      Completed = 'Completed',
      InProgress = 'In Progress',
      NotStarted = 'Not Started',
      OnHold = 'On Hold',
    }
  `}
  lineLength={dedent`
    enum Priority {
      Critical = 'Critical',
      Medium = 'Medium',
      High = 'High',
      None = 'None',
      Low = 'Low',
    }

    enum Status {
      NotStarted = 'Not Started',
      InProgress = 'In Progress',
      Completed = 'Completed',
      Cancelled = 'Cancelled',
      OnHold = 'On Hold',
    }
  `}
  initial={dedent`
    enum Priority {
      Critical = 'Critical',
      None = 'None',
      Low = 'Low',
      High = 'High',
      Medium = 'Medium',
    }

    enum Status {
      InProgress = 'In Progress',
      Completed = 'Completed',
      OnHold = 'On Hold',
      Cancelled = 'Cancelled',
      NotStarted = 'Not Started',
    }
  `}
  client:load
  lang="ts"
/>

## Options

This rule accepts an options object with the following properties:

### type

<sub>default: `'alphabetical'`</sub>

Specifies the sorting method.

- `'alphabetical'` — Sort items alphabetically (e.g., “a” < “b” < “c”).
- `'natural'` — Sort items in a natural order (e.g., “item2” < “item10”).
- `'line-length'` — Sort items by the length of the code line (shorter lines first).

### order

<sub>default: `'asc'`</sub>

Determines whether the sorted items should be in ascending or descending order.

- `'asc'` — Sort items in ascending order (A to Z, 1 to 9).
- `'desc'` — Sort items in descending order (Z to A, 9 to 1).

### ignoreCase

<sub>default: `true`</sub>

Controls whether sorting should be case-sensitive or not.

- `true` — Ignore case when sorting alphabetically or naturally (e.g., “A” and “a” are the same).
- `false` — Consider case when sorting (e.g., “A” comes before “a”).

### sortByValue

<sub>default: `false`</sub>

Controls whether sorting should be done using the enum's values or names.

- `true` — Use enum values.
- `false` — Use enum names.

When this setting is `true`, numeric enums will have their values sorted numerically regardless of the `type` setting.

### forceNumericSort

<sub>default: `false`</sub>

Controls whether numeric enums should always be sorted numerically, regardless of the `type` and `sortByValue` settings.

- `true` — Use enum values.
- `false` — Use enum names.

### partitionByComment

<sub>default: `false`</sub>

Allows you to use comments to separate the members of enums into logical groups. This can help in organizing and maintaining large enums by creating partitions within the enum based on comments.

- `true` — All comments will be treated as delimiters, creating partitions.
-	`false` — Comments will not be used as delimiters.
- string — A glob pattern to specify which comments should act as delimiters.

## Usage

<CodeTabs
  code={[
    {
      source: dedent`
        // eslint.config.js
        import perfectionist from 'eslint-plugin-perfectionist'

        export default [
          {
            plugins: {
              perfectionist,
            },
            rules: {
              'perfectionist/sort-enums': [
                'error',
                {
                  type: 'alphabetical',
                  order: 'asc',
                  ignoreCase: true,
                  partitionByComment: false,
                  sortByValue: false
                },
              ],
            },
          },
        ]
      `,
      name: 'Flat Config',
      value: 'flat',
    },
    {
      source: dedent`
        // .eslintrc.js
        module.exports = {
          plugins: [
            'perfectionist',
          ],
          rules: {
            'perfectionist/sort-enums': [
              'error',
              {
                type: 'alphabetical',
                order: 'asc',
                ignoreCase: true,
                partitionByComment: false,
                sortByValue: false,
                forceNumericSort: false
              },
            ],
          },
        }
      `,
      name: 'Legacy Config',
      value: 'legacy',
    },
  ]}
  type="config-type"
  client:load
  lang="ts"
/>

## Version

This rule was introduced in [v0.8.0](https://github.com/azat-io/eslint-plugin-perfectionist/releases/tag/v0.8.0).

## Resources

- [Rule source](https://github.com/azat-io/eslint-plugin-perfectionist/blob/main/rules/sort-enums.ts)
- [Test source](https://github.com/azat-io/eslint-plugin-perfectionist/blob/main/test/sort-enums.test.ts)

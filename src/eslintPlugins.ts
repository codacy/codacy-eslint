import { Linter, Rule } from "eslint"

import { isBlacklisted } from "./blacklist"

const packageNames = [
  "@angular-eslint/eslint-plugin",
  "@babel/eslint-plugin",
  "@lwc/eslint-plugin-lwc",
  "@salesforce/eslint-plugin-aura",
  "@salesforce/eslint-plugin-lightning",
  "@shopify/eslint-plugin",
  "@tanstack/eslint-plugin-query",
  "@typescript-eslint/eslint-plugin",
  "eslint-plugin-awscdk",
  "eslint-plugin-backbone",
  //"eslint-plugin-canonical",
  "eslint-plugin-cdk",
  "eslint-plugin-chai-expect",
  "eslint-plugin-chai-friendly",
  "eslint-plugin-codeceptjs",
  "eslint-plugin-compat",
  "eslint-plugin-css-modules",
  "eslint-plugin-cypress",
  "eslint-plugin-deprecation",
  "eslint-plugin-ember",
  "eslint-plugin-ember-suave",
  "eslint-plugin-es-x",
  "eslint-plugin-eslint-plugin",
  "eslint-plugin-filenames",
  "eslint-plugin-flowtype",
  "eslint-plugin-fp",
  "eslint-plugin-functional",
  "eslint-plugin-header",
  "eslint-plugin-html",
  "eslint-plugin-i18n-json",
  "eslint-plugin-i18next",
  "eslint-plugin-import",
  "eslint-plugin-import-alias",
  "eslint-plugin-import-newlines",
  "eslint-plugin-jasmine",
  "eslint-plugin-jest",
  "eslint-plugin-jest-dom",
  "eslint-plugin-jest-extended",
  "eslint-plugin-jest-formatting",
  "eslint-plugin-jira-ticket-todo-comment",
  "eslint-plugin-jsdoc",
  "eslint-plugin-json",
  "eslint-plugin-jsonc",
  "eslint-plugin-jsx",
  "eslint-plugin-jsx-a11y",
  "eslint-plugin-lit",
  "eslint-plugin-lodash",
  "eslint-plugin-lodash-fp",
  "eslint-plugin-meteor",
  "eslint-plugin-markdown",
  "eslint-plugin-mocha",
  "eslint-plugin-monorepo",
  "eslint-plugin-n",
  "eslint-plugin-no-only-tests",
  "eslint-plugin-no-unsanitized",
  "eslint-plugin-nuxt",
  "eslint-plugin-perfectionist",
  "eslint-plugin-playwright",
  "eslint-plugin-prefer-arrow",
  "eslint-plugin-prefer-object-spread",
  "eslint-plugin-prettier",
  "eslint-plugin-prettier-vue",
  "eslint-plugin-promise",
  "eslint-plugin-ramda",
  "eslint-plugin-react",
  "eslint-plugin-react-hooks",
  "eslint-plugin-react-native",
  "eslint-plugin-react-perf",
  "eslint-plugin-react-redux",
  "eslint-plugin-redux-saga",
  "eslint-plugin-regexp",
  "eslint-plugin-relay",
  "eslint-plugin-rxjs",
  "eslint-plugin-rxjs-angular",
  "eslint-plugin-security",
  "eslint-plugin-security-node",
  "eslint-plugin-simple-import-sort",
  "eslint-plugin-sonarjs",
  "eslint-plugin-sort-destructure-keys",
  "eslint-plugin-sort-imports-es6-autofix",
  "eslint-plugin-sort-keys-custom-order-fix",
  "eslint-plugin-sort-keys-fix",
  "eslint-plugin-sorting",
  "eslint-plugin-spellcheck",
  "eslint-plugin-storybook",
  "eslint-plugin-suitescript",
  "eslint-plugin-tailwindcss",
  "eslint-plugin-test-selectors",
  "eslint-plugin-testing-library",
  "eslint-plugin-tsdoc",
  "eslint-plugin-turbo",
  "eslint-plugin-typescript-sort-keys",
  "eslint-plugin-unicorn",
  "eslint-plugin-unused-imports",
  "eslint-plugin-vue",
  "eslint-plugin-vue-scoped-css",
  "eslint-plugin-vuejs-accessibility",
  "eslint-plugin-wdio",
  "eslint-plugin-xss",
  "eslint-plugin-yml",
  "eslint-plugin-you-dont-need-lodash-underscore"
]

const plugins = packageNames.map(packageName => {
  const rules: Rule.RuleModule = require(packageName).rules
  const name = packageName.replace(/(\/eslint-plugin$|eslint-plugin-)/, '')

  return { name, rules }
})

export const pluginsNames = plugins.map(plugin => plugin.name)

const baseRules = Array.from(new Linter().getRules().entries())
const pluginsRules = plugins
  .filter(plugin => plugin.rules)
  .flatMap(plugin =>
    Object.entries(plugin.rules).map(([patternId, rule]) => [
      `${plugin.name}/${patternId}`,
      rule,
    ])
  ) as [string, Rule.RuleModule][]

export const allRules = baseRules
  .concat(pluginsRules)
  .filter(([patternId, ]) =>
    patternId &&
    !isBlacklisted(patternId)
  )

import { rules as angularEslintRules } from "@angular-eslint/eslint-plugin"
import { rules as babelRules } from "@babel/eslint-plugin"
import { rules as cypressRules } from "eslint-plugin-cypress"
import { rules as auraRules } from "@salesforce/eslint-plugin-aura"
import { rules as lightningRules } from "@salesforce/eslint-plugin-lightning"
import { rules as shopifyRules } from "@shopify/eslint-plugin"
import { rules as queryRules } from "@tanstack/eslint-plugin-query"
import { rules as typescriptEslintRules } from "@typescript-eslint/eslint-plugin"
import { rules as angularRules } from "eslint-plugin-angular"
import { rules as backboneRules } from "eslint-plugin-backbone"
import { rules as betterStyledComponentsRules } from "eslint-plugin-better-styled-components"
//import { rules as canonicalRules } from "eslint-plugin-canonical"
import { rules as chaiExpertRules } from "eslint-plugin-chai-expect"
import { rules as chaiFriendlyRules } from "eslint-plugin-chai-friendly"
import { rules as compatRules } from "eslint-plugin-compat"
import { rules as deprecationRules } from "eslint-plugin-deprecation"
import { rules as emberRules } from "eslint-plugin-ember"
import { rules as emberSuaveRules } from "eslint-plugin-ember-suave"
import { rules as eslintPluginRules } from "eslint-plugin-eslint-plugin"
import { rules as esXRules } from "eslint-plugin-es-x"
import { rules as filenamesRules } from "eslint-plugin-filenames"
import { rules as flowtypeRules } from "eslint-plugin-flowtype"
import { rules as fpRules } from "eslint-plugin-fp"
import { rules as functionalRules } from "eslint-plugin-functional"
import { rules as headerRules } from "eslint-plugin-header"
import { rules as htmlRules } from "eslint-plugin-html"
import { rules as i18nJsonRules } from "eslint-plugin-i18n-json"
import { rules as i18nextRules } from "eslint-plugin-i18next"
import { rules as importRules } from "eslint-plugin-import"
import { rules as importAliasRules } from "eslint-plugin-import-alias"
import { rules as importNewlinesRules } from "eslint-plugin-import-newlines"
import { rules as jasmineRules } from "eslint-plugin-jasmine"
import { rules as jestRules } from "eslint-plugin-jest"
import { rules as jestDomRules } from "eslint-plugin-jest-dom"
import { rules as jestExtendedRules } from "eslint-plugin-jest-extended"
import { rules as jestFormattingRules } from "eslint-plugin-jest-formatting"
import { rules as jiraTicketTodoCommentRules } from "eslint-plugin-jira-ticket-todo-comment"
import { rules as jsdocRules } from "eslint-plugin-jsdoc"
import { rules as jsonRules } from "eslint-plugin-json"
import { rules as jsoncRules } from "eslint-plugin-jsonc"
import { rules as jsxA11yRules } from "eslint-plugin-jsx-a11y"
import { rules as litRules } from "eslint-plugin-lit"
import { rules as lodashRules } from "eslint-plugin-lodash"
import { rules as lodashFpRules } from "eslint-plugin-lodash-fp"
import { rules as meteorRules } from "eslint-plugin-meteor"
import { rules as mochaRules } from "eslint-plugin-mocha"
import { rules as mongodbRules } from "eslint-plugin-mongodb"
import { rules as monorepoRules } from "eslint-plugin-monorepo"
import { rules as noOnlyTestsRules } from "eslint-plugin-no-only-tests"
import { rules as noUnsanitizedRules } from "eslint-plugin-no-unsanitized"
import { rules as nodeRules } from "eslint-plugin-node"
import { rules as nuxtRules } from "eslint-plugin-nuxt"
import { rules as perfectionistRules } from "eslint-plugin-perfectionist"
import { rules as playwrightRules } from "eslint-plugin-playwright"
import { rules as preferObjectSpreadRules } from "eslint-plugin-prefer-object-spread"
import { rules as prettierRules } from "eslint-plugin-prettier"
import { rules as prettierVueRules } from "eslint-plugin-prettier-vue"
import { rules as promiseRules } from "eslint-plugin-promise"
import { rules as ramdaRules } from "eslint-plugin-ramda"
import { rules as reactRules } from "eslint-plugin-react"
import { rules as reactHooksRules } from "eslint-plugin-react-hooks"
import { rules as reactNativeRules } from "eslint-plugin-react-native"
import { rules as reduxSagaRules } from "eslint-plugin-redux-saga"
import { rules as regexpRules } from "eslint-plugin-regexp"
import { rules as relayRules } from "eslint-plugin-relay"
import { rules as rxjsRules } from "eslint-plugin-rxjs"
import { rules as rxjsAngularRules } from "eslint-plugin-rxjs-angular"
import { rules as scanjsRulesRules } from "eslint-plugin-scanjs-rules"
import { rules as securityRules } from "eslint-plugin-security"
import { rules as sonarjsRules } from "eslint-plugin-sonarjs"
import { rules as sortDestructureKeysRules } from "eslint-plugin-sort-destructure-keys"
import { rules as sortImportsEs6AutofixRules } from "eslint-plugin-sort-imports-es6-autofix"
import { rules as sortKeysFixRules } from "eslint-plugin-sort-keys-fix"
import { rules as spellcheckRules } from "eslint-plugin-spellcheck"
import { rules as storybookRules } from "eslint-plugin-storybook"
import { rules as tailwindcssRules } from "eslint-plugin-tailwindcss"
import { rules as testSelectorsRules } from "eslint-plugin-test-selectors"
import { rules as testingLibraryRules } from "eslint-plugin-testing-library"
import { rules as typescriptSortKeysRules } from "eslint-plugin-typescript-sort-keys"
import { rules as unicornRules } from "eslint-plugin-unicorn"
import { rules as unusedImportRules } from "eslint-plugin-unused-imports"
import { rules as vueRules } from "eslint-plugin-vue"
import { rules as vueScopedCssRules } from "eslint-plugin-vue-scoped-css"
import { rules as wdioRules } from "eslint-plugin-wdio"
import { rules as xssRules } from "eslint-plugin-xss"
import { rules as ymlRules } from "eslint-plugin-yml"
import { rules as youDontNeedLodashUnderscoreRules } from "eslint-plugin-you-dont-need-lodash-underscore"

import { Linter, Rule } from "eslint"
import { isBlacklisted, isBlacklistedOnlyFromDocumentation } from "./blacklist"

const plugins = [
  ["@angular-eslint", angularEslintRules],
  ["@babel", babelRules],
  ["@salesforce/aura", auraRules],
  ["@salesforce/lightning", lightningRules],
  ["@shopify", shopifyRules],
  ["@tanstack/query", queryRules],
  ["@typescript-eslint", typescriptEslintRules],
  ["angular", angularRules],
  ["backbone", backboneRules],
  ["better-styled-components", betterStyledComponentsRules],
  //["canonical", canonicalRules],
  ["chai-expect", chaiExpertRules],
  ["chai-friendly", chaiFriendlyRules],
  ["compat", compatRules],
  ["cypress", cypressRules],
  ["deprecation", deprecationRules],
  ["ember", emberRules],
  ["ember-suave", emberSuaveRules],
  ["es-x", esXRules],
  ["eslint-plugin", eslintPluginRules],
  ["filenames", filenamesRules],
  ["flowtype", flowtypeRules],
  ["fp", fpRules],
  ["functional", functionalRules],
  ["header", headerRules],
  ["html", htmlRules],
  ["i18n-json", i18nJsonRules],
  ["i18next", i18nextRules],
  ["import", importRules],
  ["import-alias", importAliasRules],
  ["import-newlines", importNewlinesRules],
  ["jasmine", jasmineRules],
  ["jest", jestRules],
  ["jest-dom", jestDomRules],
  ["jest-extended", jestExtendedRules],
  ["jest-formatting", jestFormattingRules],
  ["jira-ticket-todo-comment", jiraTicketTodoCommentRules],
  ["jsdoc", jsdocRules],
  ["json", jsonRules],
  ["jsonc", jsoncRules],
  ["jsx-a11y", jsxA11yRules],
  ["lit", litRules],
  ["lodash", lodashRules],
  ["lodash-fp", lodashFpRules],
  ["meteor", meteorRules],
  ["mocha", mochaRules],
  ["mongodb", mongodbRules],
  ["monorepo", monorepoRules],
  ["no-only-tests", noOnlyTestsRules],
  ["no-unsanitized", noUnsanitizedRules],
  ["node", nodeRules],
  ["nuxt", nuxtRules],
  ["perfectionist", perfectionistRules],
  ["playwright", playwrightRules],
  ["prefer-object-spread", preferObjectSpreadRules],
  ["prettier", prettierRules],
  ["prettier-vue", prettierVueRules],
  ["promise", promiseRules],
  ["ramda", ramdaRules],
  ["react-hooks", reactHooksRules],
  ["react-native", reactNativeRules],
  ["react", reactRules],
  ["redux-saga", reduxSagaRules],
  ["regexp", regexpRules],
  ["relay", relayRules],
  ["rxjs", rxjsRules],
  ["rxjs-angular", rxjsAngularRules],
  ["scanjs-rules", scanjsRulesRules],
  ["security", securityRules],
  ["sonarjs", sonarjsRules],
  ["sort-destructure-keys", sortDestructureKeysRules],
  ["sort-imports-es6-autofix", sortImportsEs6AutofixRules],
  ["sort-keys-fix", sortKeysFixRules],
  ["spellcheck", spellcheckRules],
  ["storybook", storybookRules],
  ["tailwindcss", tailwindcssRules],
  ["test-selectors", testSelectorsRules],
  ["testing-library", testingLibraryRules],
  ["typescript-sort-keys", typescriptSortKeysRules],
  ["unicorn", unicornRules],
  ["unused-imports", unusedImportRules],
  ["vue", vueRules],
  ["vue-scoped-css", vueScopedCssRules],
  ["wdio", wdioRules],
  ["xss", xssRules],
  ["yml", ymlRules],
  ["you-dont-need-lodash-underscore", youDontNeedLodashUnderscoreRules]
]

export const pluginsNames = plugins.map(([name, _]) => name)

const pluginsRules = plugins
  .filter(([_, rules]) => rules !== undefined) // plugins may not have rules
  .flatMap(([name, rules]) =>
    Object.entries(rules).map(([ruleName, rule]) => [
      `${name}/${ruleName}`,
      rule,
    ])
  ) as [string, Rule.RuleModule][]

const baseRules = Array.from(new Linter().getRules().entries())

export const allRules = baseRules
  .concat(pluginsRules)
  .filter(
    ([patternId, _]) =>
      patternId &&
      !isBlacklisted(patternId) &&
      !isBlacklistedOnlyFromDocumentation(patternId)
  )

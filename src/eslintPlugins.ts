import { rules as angularRules } from "@angular-eslint/eslint-plugin"
import { rules as salesforceEslintPluginAuraRules } from "@salesforce/eslint-plugin-aura"
import { rules as salesforceEslintPluginLightningRules } from "@salesforce/eslint-plugin-lightning"
import { rules as typescriptEslintRules } from "@typescript-eslint/eslint-plugin"
import { Linter, Rule } from "eslint"
import { rules as angularjsSecurityRules } from "eslint-plugin-angularjs-security-rules"
import { rules as babelRules } from "eslint-plugin-babel"
import { rules as backboneRules } from "eslint-plugin-backbone"
import { rules as betterStyledComponentsRules } from "eslint-plugin-better-styled-components"
import { rules as chaiExpertRules } from "eslint-plugin-chai-expect"
import { rules as chaiFriendlyRules } from "eslint-plugin-chai-friendly"
import { rules as compatRules } from "eslint-plugin-compat"
import { rules as cypressRules } from "eslint-plugin-cypress"
import { rules as drupalRules } from "eslint-plugin-drupal"
import { rules as emberRules } from "eslint-plugin-ember"
import { rules as emberSuaveRules } from "eslint-plugin-ember-suave"
import { rules as filenamesRules } from "eslint-plugin-filenames"
import { rules as flowtypeRules } from "eslint-plugin-flowtype"
import { rules as functionalRules } from "eslint-plugin-functional"
import { rules as graphqlFragmentsRules } from "eslint-plugin-graphql-fragments"
import { rules as hapiRules } from "eslint-plugin-hapi"
import { rules as htmlRules } from "eslint-plugin-html"
import { rules as i18nJsonRules } from "eslint-plugin-i18n-json"
import { rules as importRules } from "eslint-plugin-import"
import { rules as jasmineRules } from "eslint-plugin-jasmine"
import { rules as jestRules } from "eslint-plugin-jest"
import { rules as jestFormattingRules } from "eslint-plugin-jest-formatting"
import { rules as jsdocRules } from "eslint-plugin-jsdoc"
import { rules as jsonRules } from "eslint-plugin-json"
import { rules as jsxA11yRules } from "eslint-plugin-jsx-a11y"
import { rules as lodashRules } from "eslint-plugin-lodash"
import { rules as lodashFpRules } from "eslint-plugin-lodash-fp"
import { rules as meteorRules } from "eslint-plugin-meteor"
import { rules as mochaRules } from "eslint-plugin-mocha"
import { rules as mongodbRules } from "eslint-plugin-mongodb"
import { rules as monorepoRules } from "eslint-plugin-monorepo"
import { rules as noOnlyTestsRules } from "eslint-plugin-no-only-tests"
import { rules as noUnsafeInnerhtmlRules } from "eslint-plugin-no-unsafe-innerhtml"
import { rules as noUnsanitizedRules } from "eslint-plugin-no-unsanitized"
import { rules as nodeRules } from "eslint-plugin-node"
import { rules as playwrightRules } from "eslint-plugin-playwright"
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
import { rules as scanjsRulesRules } from "eslint-plugin-scanjs-rules"
import { rules as securityRules } from "eslint-plugin-security"
import { rules as sonarjsRules } from "eslint-plugin-sonarjs"
import { rules as sortImportsEs6AutofixRules } from "eslint-plugin-sort-imports-es6-autofix"
import { rules as sortKeysFixRules } from "eslint-plugin-sort-keys-fix"
import { rules as standardRules } from "eslint-plugin-standard"
import { rules as storybookRules } from "eslint-plugin-storybook"
import { rules as unicornRules } from "eslint-plugin-unicorn"
import { rules as vueRules } from "eslint-plugin-vue"
import { rules as wdioRules } from "eslint-plugin-wdio"
import { rules as xssRules } from "eslint-plugin-xss"

const plugins = [
  ["@angular-eslint", angularRules],
  ["angularjs-security-rules", angularjsSecurityRules],
  ["babel", babelRules],
  ["backbone", backboneRules],
  ["better-styled-components", betterStyledComponentsRules],
  ["chai-expect", chaiExpertRules],
  ["chai-friendly", chaiFriendlyRules],
  ["compat", compatRules],
  ["cypress", cypressRules],
  ["drupal", drupalRules],
  ["ember", emberRules],
  ["ember-suave", emberSuaveRules],
  ["filenames", filenamesRules],
  ["flowtype", flowtypeRules],
  ["functional", functionalRules],
  ["graphql-fragments", graphqlFragmentsRules],
  ["hapi", hapiRules],
  ["html", htmlRules],
  ["i18n-json", i18nJsonRules],
  ["import", importRules],
  ["jasmine", jasmineRules],
  ["jest", jestRules],
  ["jest-formatting", jestFormattingRules],
  // jsdoc doesn't support ESLint 8 yet
  // https://github.com/eslint/eslint/issues/14745
  // ["jsdoc", jsdocRules],
  ["json", jsonRules],
  ["jsx-a11y", jsxA11yRules],
  ["lodash", lodashRules],
  ["lodash-fp", lodashFpRules],
  ["meteor", meteorRules],
  ["mocha", mochaRules],
  ["mongodb", mongodbRules],
  ["monorepo", monorepoRules],
  ["no-only-tests", noOnlyTestsRules],
  ["no-unsafe-innerhtml", noUnsafeInnerhtmlRules],
  ["no-unsanitized", noUnsanitizedRules],
  ["node", nodeRules],
  ["playwright", playwrightRules],
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
  ["@salesforce/aura", salesforceEslintPluginAuraRules],
  ["@salesforce/lightning", salesforceEslintPluginLightningRules],
  ["scanjs-rules", scanjsRulesRules],
  ["security", securityRules],
  ["sonarjs", sonarjsRules],
  ["sort-imports-es6-autofix", sortImportsEs6AutofixRules],
  ["sort-keys-fix", sortKeysFixRules],
  ["standard", standardRules],
  ["storybook", storybookRules],
  ["@typescript-eslint", typescriptEslintRules],
  ["unicorn", unicornRules],
  ["vue", vueRules],
  ["wdio", wdioRules],
  ["xss", xssRules],
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

export const allRules = baseRules.concat(pluginsRules)

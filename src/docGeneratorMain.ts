import { DocGenerator } from "./docGenerator"

main()

async function main () {
  const docGenerator = new DocGenerator()

  await docGenerator.createDescriptionFile()

  await docGenerator.createPatternsFile()

  await docGenerator.createAllPatternsMultipleTestFiles()

  await docGenerator.downloadDocs(
    "@angular-eslint/eslint-plugin",
    "/angular-eslint/angular-eslint/master/packages/eslint-plugin/docs/rules/"    
  )

  await docGenerator.downloadDocs(
    "@lwc/eslint-plugin-lwc",
    "/salesforce/eslint-plugin-lwc/master/docs/rules/"
  )

  await docGenerator.downloadDocs(
    "@salesforce/eslint-plugin-aura",
    "/forcedotcom/eslint-plugin-aura/master/docs/rules/"
  )

  await docGenerator.downloadDocs(
    "@salesforce/eslint-plugin-lightning",
    "/salesforce/eslint-plugin-lightning/master/docs/rules/"
  )

  await docGenerator.downloadDocs(
    "@shopify/eslint-plugin",
    "/Shopify/web-configs/main/packages/eslint-plugin/docs/rules/",
    "@shopify/eslint-plugin@"
  )

  await docGenerator.downloadDocs(
    "@stylistic/eslint-plugin",
    "/eslint-stylistic/eslint-stylistic/main/"
  )

  await docGenerator.downloadDocs(
    "@typescript-eslint/eslint-plugin",
    "/typescript-eslint/typescript-eslint/main/packages/eslint-plugin/docs/rules/"
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-backbone",
    "/ilyavolodin/eslint-plugin-backbone/master/docs/rules/"
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-compat",
    "/amilajack/eslint-plugin-compat/main/docs/rules/"
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-cypress",
    "/cypress-io/eslint-plugin-cypress/master/docs/rules/"
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-ember",
    "/ember-cli/eslint-plugin-ember/master/docs/rules/"
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-ember-suave",
    "/DockYard/eslint-plugin-ember-suave/master/docs/rules/"
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-es-x",
    "/eslint-community/eslint-plugin-es-x/master/docs/rules/"
  )

  await docGenerator.downloadDocs(
    "eslint",
    "/eslint/eslint/main/docs/src/rules/"
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-eslint-plugin",
    "/eslint-community/eslint-plugin-eslint-plugin/main/docs/rules/"
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-functional",
    "/jonaskello/eslint-plugin-functional/master/docs/rules/"
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-i18next",
    "/edvardchen/eslint-plugin-i18next/next/docs/rules/"
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-import",
    "/un-es/eslint-plugin-i/fork-release/docs/rules/"
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-jasmine",
    "/tlvince/eslint-plugin-jasmine/master/docs/rules/"
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-jest",
    "/jest-community/eslint-plugin-jest/master/docs/rules/"
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-jest-dom",
    "/testing-library/eslint-plugin-jest-dom/main/docs/rules/"
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-jest-extended",
    "/jest-community/eslint-plugin-jest-extended/main/docs/rules/"
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-jest-formatting",
    "/dangreenisrael/eslint-plugin-jest-formatting/master/docs/rules/"
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-jsdoc",
    "/gajus/eslint-plugin-jsdoc/main/docs/rules/"
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-jsonc",
    "/ota-meshi/eslint-plugin-jsonc/master/docs/rules/"
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-jsx-a11y",
    "/jsx-eslint/eslint-plugin-jsx-a11y/main/docs/rules/"
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-lit",
    "/43081j/eslint-plugin-lit/master/docs/rules/"
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-lodash",
    "/wix-incubator/eslint-plugin-lodash/master/docs/rules/"
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-lodash-fp",
    "/jfmengels/eslint-plugin-lodash-fp/master/docs/rules/",
    false
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-meteor",
    "/dferber90/eslint-plugin-meteor/master/docs/rules/"
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-mocha",
    "/lo1tuma/eslint-plugin-mocha/master/docs/rules/"
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-n",
    "/eslint-community/eslint-plugin-n/master/docs/rules/"
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-no-unsanitized",
    "/mozilla/eslint-plugin-no-unsanitized/master/docs/rules/",
    false
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-nuxt",
    "/nuxt/eslint-plugin-nuxt/master/docs/rules/"
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-perfectionist",
    "/azat-io/eslint-plugin-perfectionist/main/docs/rules/"
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-promise",
    "/xjamundx/eslint-plugin-promise/master/docs/rules/"
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-react",
    "/jsx-eslint/eslint-plugin-react/master/docs/rules/"
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-react-native",
    "/Intellicode/eslint-plugin-react-native/master/docs/rules/"
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-react-perf",
    "/cvazac/eslint-plugin-react-perf/master/docs/rules/",
    false
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-react-redux",
    "/DianaSuvorova/eslint-plugin-react-redux/master/docs/rules/"
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-redux-saga",
    "/pke/eslint-plugin-redux-saga/master/docs/rules/",
    false
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-regexp",
    "/ota-meshi/eslint-plugin-regexp/master/docs/rules/"
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-rxjs",
    "/cartant/eslint-plugin-rxjs/main/docs/rules/",
    false
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-rxjs-angular",
    "/cartant/eslint-plugin-rxjs-angular/main/docs/rules/"
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-security",
    "/eslint-community/eslint-plugin-security/main/docs/rules/"
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-security-node",
    "/gkouziik/eslint-plugin-security-node/master/docs/rules/",
    ""
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-sonarjs",
    "/SonarSource/eslint-plugin-sonarjs/master/docs/rules/",
    ""
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-sort",
    "/mskelton/eslint-plugin-sort/main/docs/rules/"
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-sort-destructure-keys",
    "/mthadley/eslint-plugin-sort-destructure-keys/master/docs/rules/"
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-storybook",
    "/storybookjs/eslint-plugin-storybook/master/docs/rules/"
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-suitescript",
    "/acdvs/eslint-plugin-suitescript/master/docs/rules/",
    "v."
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-tailwindcss",
    "/francoismassart/eslint-plugin-tailwindcss/master/docs/rules/"
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-test-selectors",
    "/davidcalhoun/eslint-plugin-test-selectors/master/docs/rules/"
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-testing-library",
    "/testing-library/eslint-plugin-testing-library/main/docs/rules/"
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-typescript-sort-keys",
    "/infctr/eslint-plugin-typescript-sort-keys/master/docs/rules/"
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-unicorn",
    "/sindresorhus/eslint-plugin-unicorn/main/docs/rules/"
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-unused-imports",
    "/sweepline/eslint-plugin-unused-imports/master/docs/rules/",
    false
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-vue",
    "/vuejs/eslint-plugin-vue/master/docs/rules/"
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-vue-scoped-css",
    "/future-architect/eslint-plugin-vue-scoped-css/master/docs/rules/"
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-vuejs-accessibility",
    "/vue-a11y/eslint-plugin-vuejs-accessibility/main/docs/rules/"
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-wdio",
    "/webdriverio/webdriverio/main/packages/eslint-plugin-wdio/docs/rules/"
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-xss",
    "/Rantanen/eslint-plugin-xss/master/docs/rules/",
    false
  )

  await docGenerator.downloadDocs(
    "eslint-plugin-yml",
    "/ota-meshi/eslint-plugin-yml/master/docs/rules/"
  )

}


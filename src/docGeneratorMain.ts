import {DocGenerator} from "./docGenerator"

main()

async function main () {
  const docGenerator = new DocGenerator()

  await docGenerator.createDescriptionFile()

  await docGenerator.createPatternsFile()

  await docGenerator.createAllPatternsMultipleTestFiles()

  await docGenerator.downloadDocs(
    "/angular-eslint/angular-eslint/master/packages/eslint-plugin/docs/rules/",
    "@angular-eslint"
  )

  await docGenerator.downloadDocs(
    "/salesforce/eslint-plugin-lwc/master/docs/rules/",
    "@lwc/lwc"
  )

  await docGenerator.downloadDocs(
    "/forcedotcom/eslint-plugin-aura/master/docs/rules/",
    "@salesforce/aura"
  )

  await docGenerator.downloadDocs(
    "/salesforce/eslint-plugin-lightning/master/docs/rules/",
    "@salesforce/lightning"
  )

  await docGenerator.downloadDocs(
    "/Shopify/web-configs/main/packages/eslint-plugin/docs/rules/",
    "@shopify"
  )

  await docGenerator.downloadDocs(
    "/eslint-stylistic/eslint-stylistic/main/",
    "@stylistic"
  )

  await docGenerator.downloadDocs(
    "/typescript-eslint/typescript-eslint/main/packages/eslint-plugin/docs/rules/",
    "@typescript-eslint"
  )

  await docGenerator.downloadDocs(
    "/ilyavolodin/eslint-plugin-backbone/master/docs/rules/",
    "backbone"
  )

  await docGenerator.downloadDocs(
    "/amilajack/eslint-plugin-compat/main/docs/rules/",
    "compat"
  )

  await docGenerator.downloadDocs(
    "/cypress-io/eslint-plugin-cypress/master/docs/rules/",
    "cypress"
  )

  await docGenerator.downloadDocs(
    "/ember-cli/eslint-plugin-ember/master/docs/rules/",
    "ember"
  )

  await docGenerator.downloadDocs(
    "/DockYard/eslint-plugin-ember-suave/master/docs/rules/",
    "ember-suave"
  )

  await docGenerator.downloadDocs(
    "/eslint-community/eslint-plugin-es-x/master/docs/rules/",
    "es-x"
  )

  await docGenerator.downloadDocs(
    "/eslint/eslint/main/docs/src/rules/",
    ""
  )

  await docGenerator.downloadDocs(
    "/eslint-community/eslint-plugin-eslint-plugin/main/docs/rules/",
    "eslint-plugin"
  )

  await docGenerator.downloadDocs(
    "/jonaskello/eslint-plugin-functional/master/docs/rules/",
    "functional"
  )

  await docGenerator.downloadDocs(
    "/edvardchen/eslint-plugin-i18next/next/docs/rules/",
    "i18next"
  )

  await docGenerator.downloadDocs(
    "/un-es/eslint-plugin-i/fork-release/docs/rules/",
    "import"
  )

  await docGenerator.downloadDocs(
    "/tlvince/eslint-plugin-jasmine/master/docs/rules/",
    "jasmine"
  )

  await docGenerator.downloadDocs(
    "/jest-community/eslint-plugin-jest/master/docs/rules/",
    "jest"
  )

  await docGenerator.downloadDocs(
    "/testing-library/eslint-plugin-jest-dom/main/docs/rules/",
    "jest-dom"
  )

  await docGenerator.downloadDocs(
    "/jest-community/eslint-plugin-jest-extended/main/docs/rules/",
    "jest-extended"
  )

  await docGenerator.downloadDocs(
    "/dangreenisrael/eslint-plugin-jest-formatting/master/docs/rules/",
    "jest-formating"
  )

  await docGenerator.downloadDocs(
    "/gajus/eslint-plugin-jsdoc/main/docs/rules/",
    "jsdoc"
  )

  await docGenerator.downloadDocs(
    "/ota-meshi/eslint-plugin-jsonc/master/docs/rules/",
    "jsonc"
  )

  await docGenerator.downloadDocs(
    "/jsx-eslint/eslint-plugin-jsx-a11y/main/docs/rules/",
    "jsx-a11y"
  )

  await docGenerator.downloadDocs(
    "/43081j/eslint-plugin-lit/master/docs/rules/",
    "lit"
  )

  await docGenerator.downloadDocs(
    "/wix-incubator/eslint-plugin-lodash/master/docs/rules/",
    "lodash"
  )

  await docGenerator.downloadDocs(
    "/jfmengels/eslint-plugin-lodash-fp/master/docs/rules/",
    "lodash-fp"
  )

  await docGenerator.downloadDocs(
    "/dferber90/eslint-plugin-meteor/master/docs/rules/",
    "meteor"
  )

  await docGenerator.downloadDocs(
    "/lo1tuma/eslint-plugin-mocha/master/docs/rules/",
    "mocha"
  )

  await docGenerator.downloadDocs(
    "/eslint-community/eslint-plugin-n/master/docs/rules/",
    "n"
  )

  await docGenerator.downloadDocs(
    "/mozilla/eslint-plugin-no-unsanitized/master/docs/rules/",
    "no-unsanitized"
  )

  await docGenerator.downloadDocs(
    "/nuxt/eslint-plugin-nuxt/master/docs/rules/",
    "nuxt"
  )

  await docGenerator.downloadDocs(
    "/azat-io/eslint-plugin-perfectionist/main/docs/rules/",
    "perfectionist"
  )

  await docGenerator.downloadDocs(
    "/xjamundx/eslint-plugin-promise/master/docs/rules/",
    "promise"
  )

  await docGenerator.downloadDocs(
    "/jsx-eslint/eslint-plugin-react/master/docs/rules/",
    "react"
  )

  await docGenerator.downloadDocs(
    "/Intellicode/eslint-plugin-react-native/master/docs/rules/",
    "react-native"
  )

  await docGenerator.downloadDocs(
    "/cvazac/eslint-plugin-react-perf/master/docs/rules/",
    "react-perf"
  )

  await docGenerator.downloadDocs(
    "/DianaSuvorova/eslint-plugin-react-redux/master/docs/rules/",
    "react-redux"
  )

  await docGenerator.downloadDocs(
    "/pke/eslint-plugin-redux-saga/master/docs/rules/",
    "redux-saga"
  )

  await docGenerator.downloadDocs(
    "/ota-meshi/eslint-plugin-regexp/master/docs/rules/",
    "regexp"
  )

  await docGenerator.downloadDocs(
    "/cartant/eslint-plugin-rxjs/main/docs/rules/",
    "rxjs"
  )

  await docGenerator.downloadDocs(
    "/cartant/eslint-plugin-rxjs-angular/main/docs/rules/",
    "rxjs-angular"
  )

  await docGenerator.downloadDocs(
    "/eslint-community/eslint-plugin-security/main/docs/rules/",
    "security"
  )

  await docGenerator.downloadDocs(
    "/gkouziik/eslint-plugin-security-node/master/docs/rules/",
    "security-node"
  )

  await docGenerator.downloadDocs(
    "/SonarSource/eslint-plugin-sonarjs/master/docs/rules/",
    "sonarjs"
  )

  await docGenerator.downloadDocs(
    "/mskelton/eslint-plugin-sort/main/docs/rules/",
    "sort"
  )

  await docGenerator.downloadDocs(
    "/mthadley/eslint-plugin-sort-destructure-keys/master/docs/rules/",
    "sort-destructure-keys"
  )

  await docGenerator.downloadDocs(
    "/storybookjs/eslint-plugin-storybook/master/docs/rules/",
    "storybook"
  )

  await docGenerator.downloadDocs(
    "/acdvs/eslint-plugin-suitescript/master/docs/rules/",
    "suitescript"
  )


  await docGenerator.downloadDocs(
    "/francoismassart/eslint-plugin-tailwindcss/master/docs/rules/",
    "tailwindcss"
  )

  await docGenerator.downloadDocs(
    "/davidcalhoun/eslint-plugin-test-selectors/master/docs/rules/",
    "test-selectors"
  )

  await docGenerator.downloadDocs(
    "/testing-library/eslint-plugin-testing-library/main/docs/rules/",
    "test-library"
  )

  await docGenerator.downloadDocs(
    "/infctr/eslint-plugin-typescript-sort-keys/master/docs/rules/",
    "typescript-sort-keys"
  )

  await docGenerator.downloadDocs(
    "/sindresorhus/eslint-plugin-unicorn/main/docs/rules/",
    "unicorn"
  )

  await docGenerator.downloadDocs(
    "/sweepline/eslint-plugin-unused-imports/master/docs/rules/",
    "unused-imports"
  )

  await docGenerator.downloadDocs(
    "/vuejs/eslint-plugin-vue/master/docs/rules/",
    "vue"
  )

  await docGenerator.downloadDocs(
    "/future-architect/eslint-plugin-vue-scoped-css/master/docs/rules/",
    "vue-scoped-css"
  )

  await docGenerator.downloadDocs(
    "/vue-a11y/eslint-plugin-vuejs-accessibility/main/docs/rules/",
    "vuejs-accessibility"
  )

  await docGenerator.downloadDocs(
    "/webdriverio/webdriverio/main/packages/eslint-plugin-wdio/docs/rules/",
    "wdio"
  )

  await docGenerator.downloadDocs(
    "/Rantanen/eslint-plugin-xss/master/docs/rules/",
    "xss"
  )

  await docGenerator.downloadDocs(
    "/ota-meshi/eslint-plugin-yml/master/docs/rules/",
    "yml"
  )

}


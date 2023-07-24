import { writeFile } from "codacy-seed"
import { EOL } from "os"
import { DocGenerator } from "./docGenerator"
import { allRules } from "./eslintPlugins"

main()

async function main() {
  const docGenerator = new DocGenerator(allRules)

  console.log("Generate patterns.json")
  await writeJsonFile("docs/patterns.json", docGenerator.generatePatterns())

  console.log("Generate description.json")
  await writeJsonFile(
    "docs/description/description.json",
    docGenerator.generateDescriptionEntries()
  )

  console.log("Generate all-patterns multiple-test patterns.xml")
  await docGenerator.generateAllPatternsMultipleTest()

  const githubBaseUrl = "https://raw.githubusercontent.com"

  console.log("Generate @angular-eslint description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/angular-eslint/angular-eslint/master/packages/eslint-plugin/docs/rules/`,
    "@angular-eslint"
  )

  console.log("Generate @salesforce/aura description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/forcedotcom/eslint-plugin-aura/master/docs/rules/`,
    "@salesforce/aura"
  )

  console.log("Generate @salesforce/lightning description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/salesforce/eslint-plugin-lightning/master/docs/rules/`,
    "@salesforce/lightning"
  )

  console.log("Generate @shopify description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/Shopify/web-configs/main/packages/eslint-plugin/docs/rules/`,
    "@shopify"
  )

  console.log("Generate @typescript-eslint description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/typescript-eslint/typescript-eslint/main/packages/eslint-plugin/docs/rules/`,
    "@typescript-eslint",
    false
  )

  console.log("Generate angular description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/EmmanuelDemey/eslint-plugin-angular/master/docs/rules/`,
    "angular"
  )

  console.log("Generate backbone description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/ilyavolodin/eslint-plugin-backbone/master/docs/rules/`,
    "backbone"
  )

  console.log("Generate better-styled-components description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/tinloof/eslint-plugin-better-styled-components/master/docs/rules/`,
    "better-styled-components",
    true,
    // not the best way on how to deal with wrong name of rule ¯\_(ツ)_/¯
    pattern => "sort-rules-alphabetically"
  )

  console.log("Generate compat description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/amilajack/eslint-plugin-compat/main/docs/rules/`,
    "compat"
  )

  console.log("Generate cypress description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/cypress-io/eslint-plugin-cypress/master/docs/rules/`,
    "cypress"
  )

  console.log("Generate ember description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/ember-cli/eslint-plugin-ember/master/docs/rules/`,
    "ember"
  )

  console.log("Generate ember-suave description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/DockYard/eslint-plugin-ember-suave/master/docs/rules/`,
    "ember-suave"
  )

  console.log("Generate es-x description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/eslint-community/eslint-plugin-es-x/master/docs/rules/`,
    "es-x"
  )

  console.log("Generate eslint description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/eslint/eslint/main/docs/src/rules/`
  )

  console.log("Generate eslint-plugin description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/eslint-community/eslint-plugin-eslint-plugin/main/docs/rules/`,
    "eslint-plugin"
  )

  console.log("Generate functional description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/jonaskello/eslint-plugin-functional/master/docs/rules/`,
    "functional",
    false
  )

  console.log("Generate i18next description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/edvardchen/eslint-plugin-i18next/next/docs/rules/`,
    "i18next",
    false
  )

  console.log("Generate import description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/un-es/eslint-plugin-i/fork-release/docs/rules/`,
    "import",
    false
  )

  console.log("Generate jasmine description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/tlvince/eslint-plugin-jasmine/master/docs/rules/`,
    "jasmine"
  )

  console.log("Generate jest description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/jest-community/eslint-plugin-jest/master/docs/rules/`,
    "jest"
  )

  console.log("Generate jest-dom description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/testing-library/eslint-plugin-jest-dom/main/docs/rules/`,
    "jest-dom"
  )

  console.log("Generate jest-extended description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/jest-community/eslint-plugin-jest-extended/main/docs/rules/`,
    "jest-extended"
  )

  console.log("Generate jest-formating description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/dangreenisrael/eslint-plugin-jest-formatting/master/docs/rules/`,
    "jest-formating"
  )

  console.log("Generate jsdoc description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/gajus/eslint-plugin-jsdoc/main/docs/rules/`,
    "jsdoc"
  )

  console.log("Generate jsonc description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/ota-meshi/eslint-plugin-jsonc/master/docs/rules/`,
    "jsonc"
  )

  console.log("Generate jsx-a11y description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/jsx-eslint/eslint-plugin-jsx-a11y/main/docs/rules/`,
    "jsx-a11y"
  )

  console.log("Generate lit description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/43081j/eslint-plugin-lit/master/docs/rules/`,
    "lit"
  )

  console.log("Generate lodash description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/wix-incubator/eslint-plugin-lodash/master/docs/rules/`,
    "lodash"
  )

  console.log("Generate lodash-fp description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/jfmengels/eslint-plugin-lodash-fp/master/docs/rules/`,
    "lodash-fp"
  )

  console.log("Generate meteor description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/dferber90/eslint-plugin-meteor/master/docs/rules/`,
    "meteor"
  )

  console.log("Generate mocha description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/lo1tuma/eslint-plugin-mocha/master/docs/rules/`,
    "mocha"
  )

  console.log("Generate n description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/eslint-community/eslint-plugin-n/master/docs/rules/`,
    "n"
  )

  console.log("Generate no-unsanitized description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/mozilla/eslint-plugin-no-unsanitized/master/docs/rules/`,
    "no-unsanitized"
  )

  console.log("Generate nuxt description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/nuxt/eslint-plugin-nuxt/master/docs/rules/`,
    "nuxt",
    false
  )

  console.log("Generate perfectionist description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/azat-io/eslint-plugin-perfectionist/main/docs/rules/`,
    "perfectionist"
  )

  console.log("Generate promise description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/xjamundx/eslint-plugin-promise/master/docs/rules/`,
    "promise"
  )

  console.log("Generate react description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/jsx-eslint/eslint-plugin-react/master/docs/rules/`,
    "react"
  )

  console.log("Generate react-native description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/Intellicode/eslint-plugin-react-native/master/docs/rules/`,
    "react-native"
  )

  console.log("Generate redux-saga description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/pke/eslint-plugin-redux-saga/master/docs/rules/`,
    "redux-saga"
  )

  console.log("Generate regexp description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/ota-meshi/eslint-plugin-regexp/master/docs/rules/`,
    "regexp"
  )

  console.log("Generate rxjs description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/cartant/eslint-plugin-rxjs/main/docs/rules/`,
    "rxjs"
  )

  console.log("Generate rxjs-angular description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/cartant/eslint-plugin-rxjs-angular/main/docs/rules/`,
    "rxjs-angular"
  )

  console.log("Generate security description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/eslint-community/eslint-plugin-security/main/docs/rules/`,
    "security"
  )

  console.log("Generate sonarjs description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/SonarSource/eslint-plugin-sonarjs/master/docs/rules/`,
    "sonarjs"
  )

  console.log("Generate sort-destructure-keys description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/mthadley/eslint-plugin-sort-destructure-keys/master/docs/rules/`,
    "sort-destructure-keys"
  )

  console.log("Generate storybook description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/storybookjs/eslint-plugin-storybook/master/docs/rules/`,
    "storybook"
  )

  console.log("Generate tailwindcss description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/francoismassart/eslint-plugin-tailwindcss/master/docs/rules/`,
    "tailwindcss"
  )

  console.log("Generate test-selectors description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/davidcalhoun/eslint-plugin-test-selectors/master/docs/rules/`,
    "test-selectors"
  )

  console.log("Generate test-library description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/testing-library/eslint-plugin-testing-library/main/docs/rules/`,
    "test-library"
  )

  console.log("Generate typescript-sort-keys description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/infctr/eslint-plugin-typescript-sort-keys/master/docs/rules/`,
    "typescript-sort-keys"
  )

  console.log("Generate unicorn description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/sindresorhus/eslint-plugin-unicorn/main/docs/rules/`,
    "unicorn"
  )

  console.log("Generate unused-imports description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/sweepline/eslint-plugin-unused-imports/master/docs/rules/`,
    "unused-imports",
    false
  )

  console.log("Generate vue description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/vuejs/eslint-plugin-vue/master/docs/rules/`,
    "vue"
  )

  console.log("Generate vue-scoped-css description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/future-architect/eslint-plugin-vue-scoped-css/master/docs/rules/`,
    "vue-scoped-css"
  )

  console.log("Generate wdio description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/webdriverio/webdriverio/main/packages/eslint-plugin-wdio/docs/rules/`,
    "wdio"
  )

  console.log("Generate xss description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/Rantanen/eslint-plugin-xss/master/docs/rules/`,
    "xss"
  )

  console.log("Generate yml description files")
  await docGenerator.downloadDocs(
    `${githubBaseUrl}/ota-meshi/eslint-plugin-yml/master/docs/rules/`,
    "yml"
  )

}

function writeJsonFile(file: string, json: any): Promise<void> {
  return writeFile(file, JSON.stringify(json, null, 2) + EOL)
}

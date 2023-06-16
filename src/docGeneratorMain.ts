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
    (pattern) =>
      `${githubBaseUrl}/angular-eslint/angular-eslint/master/packages/eslint-plugin/docs/rules/${pattern}.md`,
    "@angular-eslint"
  )

  console.log("Generate @salesforce/aura description files")
  await docGenerator.downloadDocs(
    (pattern) =>
      `${githubBaseUrl}/forcedotcom/eslint-plugin-aura/master/docs/rules/${pattern}.md`,
    "@salesforce/aura"
  )

  console.log("Generate @salesforce/lightning description files")
  await docGenerator.downloadDocs(
    (pattern) =>
      `${githubBaseUrl}/salesforce/eslint-plugin-lightning/master/docs/rules/${pattern}.md`,
    "@salesforce/lightning"
  )

  console.log("Generate @shopify_eslint description files")
  await docGenerator.downloadDocs(
    (pattern) =>
      `${githubBaseUrl}/Shopify/web-configs/main/packages/eslint-plugin/docs/rules/${pattern}.md`,
    "@shopify/eslint-plugin",
    false
  )

  console.log("Generate @typescript-eslint description files")
  await docGenerator.downloadDocs(
    (pattern) =>
      `${githubBaseUrl}/typescript-eslint/typescript-eslint/master/packages/eslint-plugin/docs/rules/${pattern}.md`,
    "@typescript-eslint",
    false
  )

  console.log("Generate angular description files")
  await docGenerator.downloadDocs(
    (pattern) =>
      `${githubBaseUrl}/EmmanuelDemey/eslint-plugin-angular/master/docs/rules/${pattern}.md`,
    "angular"
  )

  console.log("Generate backbone description files")
  await docGenerator.downloadDocs(
    (pattern) =>
      `${githubBaseUrl}/ilyavolodin/eslint-plugin-backbone/master/docs/rules/${pattern}.md`,
    "backbone"
  )

  console.log("Generate better-styled-components description files")
  await docGenerator.downloadDocs(
    (pattern) =>
      // not the best way on how to deal with wrong name of rule ¯\_(ツ)_/¯
      `${githubBaseUrl}/tinloof/eslint-plugin-better-styled-components/master/docs/rules/sort-rules-alphabetically.md`,
    "better-styled-components"
  )

  console.log("Generate compat description files")
  await docGenerator.downloadDocs(
    (pattern) =>
      `${githubBaseUrl}/amilajack/eslint-plugin-compat/main/docs/rules/${pattern}.md`,
    "compat"
  )

  console.log("Generate cypress description files")
  await docGenerator.downloadDocs(
    (pattern) =>
      `${githubBaseUrl}/foretagsplatsen/eslint-plugin-cypress/master/docs/rules/${pattern}.md`,
    "cypress"
  )

  console.log("Generate ember description files")
  await docGenerator.downloadDocs(
    (pattern) =>
      `${githubBaseUrl}/ember-cli/eslint-plugin-ember/master/docs/rules/${pattern}.md`,
    "ember"
  )

  console.log("Generate ember-suave description files")
  await docGenerator.downloadDocs(
    (pattern) =>
      `${githubBaseUrl}/DockYard/eslint-plugin-ember-suave/master/docs/rules/${pattern}.md`,
    "ember-suave"
  )

  console.log("Generate es-x description files")
  await docGenerator.downloadDocs(
    (pattern) =>
      `${githubBaseUrl}/eslint-community/eslint-plugin-es-x/master/docs/rules/${pattern}.md`,
    "es-x"
  )

  console.log("Generate eslint description files")
  await docGenerator.downloadDocs(
    (pattern) =>
      `${githubBaseUrl}/eslint/eslint/main/docs/src/rules/${pattern}.md`
  )

  console.log("Generate eslint-plugin description files")
  await docGenerator.downloadDocs(
    (pattern) =>
      `${githubBaseUrl}/eslint-community/eslint-plugin-eslint-plugin/main/docs/rules/${pattern}.md`,
    "eslint-plugin"
  )

  console.log("Generate functional description files")
  await docGenerator.downloadDocs(
    (pattern) =>
      `${githubBaseUrl}/jonaskello/eslint-plugin-functional/master/docs/rules/${pattern}.md`,
    "functional",
    false
  )

  console.log("Generate i18next description files")
  await docGenerator.downloadDocs(
    (pattern) =>
      `${githubBaseUrl}/edvardchen/eslint-plugin-i18next/next/docs/rules/${pattern}.md`,
    "i18next",
    false
  )

  console.log("Generate import description files")
  await docGenerator.downloadDocs(
    (pattern) =>
      `${githubBaseUrl}/benmosher/eslint-plugin-import/master/docs/rules/${pattern}.md`,
    "import",
    false
  )

  console.log("Generate jasmine description files")
  await docGenerator.downloadDocs(
    (pattern) =>
      `${githubBaseUrl}/tlvince/eslint-plugin-jasmine/master/docs/rules/${pattern}.md`,
    "jasmine"
  )

  console.log("Generate jest description files")
  await docGenerator.downloadDocs(
    (pattern) =>
      `${githubBaseUrl}/jest-community/eslint-plugin-jest/master/docs/rules/${pattern}.md`,
    "jest"
  )

  console.log("Generate jest-extended description files")
  await docGenerator.downloadDocs(
    (pattern) =>
      `${githubBaseUrl}/jest-community/eslint-plugin-jest-extended/main/docs/rules/${pattern}.md`,
    "jest-extended"
  )

  console.log("Generate jest-formating description files")
  await docGenerator.downloadDocs(
    (pattern) =>
      `${githubBaseUrl}/dangreenisrael/eslint-plugin-jest-formatting/master/docs/rules/${pattern}.md`,
    "jest-formating"
  )

  console.log("Generate jsdoc description files")
  await docGenerator.downloadDocs(
    (pattern) =>
      `${githubBaseUrl}/gajus/eslint-plugin-jsdoc/main/docs/rules/${pattern}.md`,
    "jsdoc"
  )

  console.log("Generate jsonc description files")
  await docGenerator.downloadDocs(
    (pattern) =>
      `${githubBaseUrl}/ota-meshi/eslint-plugin-jsonc/master/docs/rules/${pattern}.md`,
    "jsonc"
  )

  console.log("Generate jsx-a11y description files")
  await docGenerator.downloadDocs(
    (pattern) =>
      `${githubBaseUrl}/jsx-eslint/eslint-plugin-jsx-a11y/main/docs/rules/${pattern}.md`,
    "jsx-a11y"
  )

  console.log("Generate lit description files")
  await docGenerator.downloadDocs(
    (pattern) =>
      `${githubBaseUrl}/43081j/eslint-plugin-lit/master/docs/rules/${pattern}.md`,
    "lit"
  )

  console.log("Generate lodash description files")
  await docGenerator.downloadDocs(
    (pattern) =>
      `${githubBaseUrl}/wix-incubator/eslint-plugin-lodash/master/docs/rules/${pattern}.md`,
    "lodash"
  )

  console.log("Generate lodash-fp description files")
  await docGenerator.downloadDocs(
    (pattern) =>
      `${githubBaseUrl}/jfmengels/eslint-plugin-lodash-fp/master/docs/rules/${pattern}.md`,
    "lodash-fp"
  )

  console.log("Generate meteor description files")
  await docGenerator.downloadDocs(
    (pattern) =>
      `${githubBaseUrl}/dferber90/eslint-plugin-meteor/master/docs/rules/${pattern}.md`,
    "meteor"
  )

  console.log("Generate mocha description files")
  await docGenerator.downloadDocs(
    (pattern) =>
      `${githubBaseUrl}/lo1tuma/eslint-plugin-mocha/master/docs/rules/${pattern}.md`,
    "mocha"
  )

  console.log("Generate no-unsanitized description files")
  await docGenerator.downloadDocs(
    (pattern) =>
      `${githubBaseUrl}/mozilla/eslint-plugin-no-unsanitized/master/docs/rules/${pattern}.md`,
    "no-unsanitized"
  )

  console.log("Generate node description files")
  await docGenerator.downloadDocs(
    (pattern) => {
      const patternFoldered = pattern.split("_").join("/")
      return `${githubBaseUrl}/mysticatea/eslint-plugin-node/master/docs/rules/${patternFoldered}.md`
    },
    "node"
  )

  console.log("Generate nuxt description files")
  await docGenerator.downloadDocs(
    (pattern) =>
      `${githubBaseUrl}/nuxt/eslint-plugin-nuxt/master/docs/rules/${pattern}.md`,
    "nuxt",
    false
  )

  console.log("Generate perfectionist description files")
  await docGenerator.downloadDocs(
      (pattern) =>
          `${githubBaseUrl}/azat-io/eslint-plugin-perfectionist/main/docs/rules/${pattern}.md`,
      "perfectionist"
  )

  console.log("Generate promise description files")
  await docGenerator.downloadDocs(
    (pattern) =>
      `${githubBaseUrl}/xjamundx/eslint-plugin-promise/master/docs/rules/${pattern}.md`,
    "promise"
  )

  console.log("Generate react description files")
  await docGenerator.downloadDocs(
    (pattern) =>
      `${githubBaseUrl}/jsx-eslint/eslint-plugin-react/master/docs/rules/${pattern}.md`,
    "react"
  )

  console.log("Generate react-native description files")
  await docGenerator.downloadDocs(
    (pattern) =>
      `${githubBaseUrl}/Intellicode/eslint-plugin-react-native/master/docs/rules/${pattern}.md`,
    "react-native"
  )

  console.log("Generate redux-saga description files")
  await docGenerator.downloadDocs(
    (pattern) =>
      `${githubBaseUrl}/pke/eslint-plugin-redux-saga/master/docs/rules/${pattern}.md`,
    "redux-saga"
  )

  console.log("Generate regexp description files")
  await docGenerator.downloadDocs(
    (pattern) =>
      `${githubBaseUrl}/ota-meshi/eslint-plugin-regexp/master/docs/rules/${pattern}.md`,
    "regexp"
  )

  console.log("Generate rxjs description files")
  await docGenerator.downloadDocs(
      (pattern) =>
          `${githubBaseUrl}/cartant/eslint-plugin-rxjs/main/docs/rules/${pattern}.md`,
      "rxjs"
  )

  console.log("Generate rxjs-angular description files")
  await docGenerator.downloadDocs(
      (pattern) =>
          `${githubBaseUrl}/cartant/eslint-plugin-rxjs-angular/main/docs/rules/${pattern}.md`,
      "rxjs-angular"
  )

  console.log("Generate sonarjs description files")
  await docGenerator.downloadDocs(
    (pattern) =>
      `${githubBaseUrl}/SonarSource/eslint-plugin-sonarjs/master/docs/rules/${pattern}.md`,
    "sonarjs"
  )

  console.log("Generate storybook description files")
  await docGenerator.downloadDocs(
    (pattern) =>
      `${githubBaseUrl}/storybookjs/eslint-plugin-storybook/master/docs/rules/${pattern}.md`,
    "storybook"
  )

  console.log("Generate tailwindcss description files")
  await docGenerator.downloadDocs(
    (pattern) =>
      `${githubBaseUrl}/francoismassart/eslint-plugin-tailwindcss/master/docs/rules/${pattern}.md`,
    "tailwindcss"
  )

  console.log("Generate typescript-sort-keys description files")
  await docGenerator.downloadDocs(
      (pattern) =>
          `${githubBaseUrl}/infctr/eslint-plugin-typescript-sort-keys/master/docs/rules/${pattern}.md`,
      "typescript-sort-keys"
  )

  console.log("Generate unicorn description files")
  await docGenerator.downloadDocs(
    (pattern) =>
      `${githubBaseUrl}/sindresorhus/eslint-plugin-unicorn/main/docs/rules/${pattern}.md`,
    "unicorn",
    false
  )

  console.log("Generate unused-imports description files")
  await docGenerator.downloadDocs(
    (pattern) =>
      `${githubBaseUrl}/sweepline/eslint-plugin-unused-imports/master/docs/rules/${pattern}.md`,
    "unused-imports",
    false
  )

  console.log("Generate vue description files")
  await docGenerator.downloadDocs(
    (pattern) =>
      `${githubBaseUrl}/vuejs/eslint-plugin-vue/master/docs/rules/${pattern}.md`,
    "vue"
  )

  console.log("Generate vuetify description files")
  await docGenerator.downloadDocs(
    (pattern) =>
      `${githubBaseUrl}/vuetifyjs/eslint-plugin-vuetify/master/docs/rules/${pattern}.md`,
    "vuetify"
  )

  console.log("Generate vue-scoped-css description files")
  await docGenerator.downloadDocs(
    (pattern) =>
      `${githubBaseUrl}/future-architect/eslint-plugin-vue-scoped-css/master/docs/rules/${pattern}.md`,
    "vue-scoped-css"
  )

  console.log("Generate wdio description files")
  await docGenerator.downloadDocs(
    (pattern) =>
      `${githubBaseUrl}/webdriverio/webdriverio/main/packages/eslint-plugin-wdio/docs/rules/${pattern}.md`,
    "wdio"
  )

  console.log("Generate xss description files")
  await docGenerator.downloadDocs(
    (pattern) =>
      `${githubBaseUrl}/Rantanen/eslint-plugin-xss/master/docs/rules/${pattern}.md`,
    "xss"
  )

  console.log("Generate yml description files")
  await docGenerator.downloadDocs(
    (pattern) =>
      `${githubBaseUrl}/ota-meshi/eslint-plugin-yml/master/docs/rules/${pattern}.md`,
    "yml"
  )

}

function writeJsonFile(file: string, json: any): Promise<void> {
  return writeFile(file, JSON.stringify(json, null, 2) + EOL)
}

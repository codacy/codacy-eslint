import { EOL } from "os"

import { DocGenerator } from "./docGenerator"
import { defaultEngine } from "./eslintDefaultOptions"
import { writeFile } from "./fileUtils"

main()

async function main() {
  const docGenerator = new DocGenerator(defaultEngine.getRules())

  console.log("Generate patterns.json")
  await writeJsonFile("docs/patterns.json", docGenerator.generatePatterns())

  console.log("Generate description.json")
  await writeJsonFile(
    "docs/description/description.json",
    docGenerator.generateDescriptionEntries()
  )

  const githubBaseUrl = "https://raw.githubusercontent.com"

  console.log("Generate angular description files")
  await docGenerator.downloadDocs(
    pattern =>
      `${githubBaseUrl}/EmmanuelDemey/eslint-plugin-angular/master/docs/rules/${pattern}.md`,
    "angular"
  )

  console.log("Generate backbone description files")
  await docGenerator.downloadDocs(
    pattern =>
      `${githubBaseUrl}/ilyavolodin/eslint-plugin-backbone/master/docs/rules/${pattern}.md`,
    "backbone"
  )

  console.log("Generate cypress description files")
  await docGenerator.downloadDocs(
    pattern =>
      `${githubBaseUrl}/cypress-io/eslint-plugin-cypress/master/docs/rules/${pattern}.md`,
    "cypress"
  )

  console.log("Generate drupal description files")
  await docGenerator.downloadDocs(
    pattern =>
      `${githubBaseUrl}/theodoreb/eslint-plugin-drupal/master/docs/rules/${pattern}.md`,
    "drupal"
  )

  console.log("Generate ember description files")
  await docGenerator.downloadDocs(
    pattern =>
      `${githubBaseUrl}/ember-cli/eslint-plugin-ember/master/docs/rules/${pattern}.md`,
    "ember"
  )

  console.log("Generate ember-suave description files")
  await docGenerator.downloadDocs(
    pattern =>
      `${githubBaseUrl}/DockYard/eslint-plugin-ember-suave/master/docs/rules/${pattern}.md`,
    "ember-suave"
  )

  console.log("Generate eslint description files")
  await docGenerator.downloadDocs(
    pattern => `${githubBaseUrl}/eslint/eslint/master/docs/rules/${pattern}.md`
  )

  console.log("Generate jasmine description files")
  await docGenerator.downloadDocs(
    pattern =>
      `${githubBaseUrl}/tlvince/eslint-plugin-jasmine/master/docs/rules/${pattern}.md`,
    "jasmine"
  )

  console.log("Generate jest description files")
  await docGenerator.downloadDocs(
    pattern =>
      `${githubBaseUrl}/jest-community/eslint-plugin-jest/master/docs/rules/${pattern}.md`,
    "jest"
  )

  console.log("Generate lodash description files")
  await docGenerator.downloadDocs(
    pattern =>
      `${githubBaseUrl}/wix/eslint-plugin-lodash/master/docs/rules/${pattern}.md`,
    "lodash"
  )

  console.log("Generate meteor description files")
  await docGenerator.downloadDocs(
    pattern =>
      `${githubBaseUrl}/dferber90/eslint-plugin-meteor/master/docs/rules/${pattern}.md`,
    "meteor"
  )

  console.log("Generate mocha description files")
  await docGenerator.downloadDocs(
    pattern =>
      `${githubBaseUrl}/lo1tuma/eslint-plugin-mocha/master/docs/rules/${pattern}.md`,
    "mocha"
  )

  console.log("Generate no-unsanitized description files")
  await docGenerator.downloadDocs(
    pattern =>
      `${githubBaseUrl}/mozilla/eslint-plugin-no-unsanitized/master/docs/rules/${pattern}.md`,
    "no-unsanitized"
  )

  console.log("Generate node description files")
  await docGenerator.downloadDocs(pattern => {
    const patternFoldered = pattern.split("_").join("/")
    return `${githubBaseUrl}/mysticatea/eslint-plugin-node/master/docs/rules/${patternFoldered}.md`
  }, "node")

  console.log("Generate promise description files")
  await docGenerator.downloadDocs(
    pattern =>
      `${githubBaseUrl}/xjamundx/eslint-plugin-promise/master/docs/rules/${pattern}.md`,
    "promise"
  )

  console.log("Generate react description files")
  await docGenerator.downloadDocs(
    pattern =>
      `${githubBaseUrl}/yannickcr/eslint-plugin-react/master/docs/rules/${pattern}.md`,
    "react"
  )

  console.log("Generate typescript-eslint description files")
  await docGenerator.downloadDocs(
    pattern =>
      `${githubBaseUrl}/typescript-eslint/typescript-eslint/master/packages/eslint-plugin/docs/rules/${pattern}.md`,
    "@typescript-eslint"
  )

  console.log("Generate vue description files")
  await docGenerator.downloadDocs(
    pattern =>
      `${githubBaseUrl}/vuejs/eslint-plugin-vue/master/docs/rules/${pattern}.md`,
    "vue"
  )

  console.log("Generate xss description files")
  await docGenerator.downloadDocs(
    pattern =>
      `${githubBaseUrl}/Rantanen/eslint-plugin-xss/master/docs/rules/${pattern}.md`,
    "xss"
  )
}

function writeJsonFile(file: string, json: any): Promise<void> {
  return writeFile(file, JSON.stringify(json, null, 2) + EOL)
}

import { DocGenerator } from "../DocGenerator"
import { writeFile } from "../fileUtils"
import { EOL } from "os"
import { defaultEngine } from "../eslintDefaultOptions"
import { DescriptionEntry } from "../model/Description"

const docGenerator = new DocGenerator(defaultEngine.getRules())

describe("DocGenerator", () => {
  it("should generate patterns.json", () => {
    const patterns = docGenerator.generatePatterns()

    return writeFile(
      "docs/patterns.json",
      JSON.stringify(patterns, null, 2) + EOL
    )
  })
  it("should generate description.json", () => {
    const patterns: DescriptionEntry[] = docGenerator.generateDescriptionEntries()

    return writeFile(
      "docs/description/description.json",
      JSON.stringify(patterns, null, 2) + EOL
    )
  })

  const githubBaseUrl = "https://raw.githubusercontent.com"

  it("should generate eslint description files", () => {
    return docGenerator.downloadDocs(
      pattern =>
        `${githubBaseUrl}/eslint/eslint/master/docs/rules/${pattern}.md`
    )
  })

  it("should generate vue description files", () => {
    return docGenerator.downloadDocs(
      pattern =>
        `${githubBaseUrl}/vuejs/eslint-plugin-vue/master/docs/rules/${pattern}.md`,
      "vue"
    )
  })

  it("should generate react description files", () => {
    return docGenerator.downloadDocs(
      pattern =>
        `${githubBaseUrl}/yannickcr/eslint-plugin-react/master/docs/rules/${pattern}.md`,
      "react"
    )
  })

  it("should generate lodash description files", () => {
    return docGenerator.downloadDocs(
      pattern =>
        `${githubBaseUrl}/wix/eslint-plugin-lodash/master/docs/rules/${pattern}.md`,
      "lodash"
    )
  })

  it("should generate node description files", () => {
    return docGenerator.downloadDocs(pattern => {
      const patternFoldered = pattern.split("_").join("/")
      return `${githubBaseUrl}/mysticatea/eslint-plugin-node/master/docs/rules/${patternFoldered}.md`
    }, "node")
  })

  it("should generate promise description files", () => {
    return docGenerator.downloadDocs(
      pattern =>
        `${githubBaseUrl}/xjamundx/eslint-plugin-promise/master/docs/rules/${pattern}.md`,
      "promise"
    )
  })

  it("should generate backbone description files", () => {
    return docGenerator.downloadDocs(
      pattern =>
        `${githubBaseUrl}/ilyavolodin/eslint-plugin-backbone/master/docs/rules/${pattern}.md`,
      "backbone"
    )
  })
})

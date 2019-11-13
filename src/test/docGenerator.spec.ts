import { downloadDocs, generateDescription, generatePatterns } from "../docGenerator"
import { writeFile } from "../promisified"

describe("docGenerator", () => {
  it("should generate patterns.json", () => {
    let patterns = generatePatterns()

    return writeFile("docs/patterns.json", JSON.stringify(patterns, null, 2))
  })
  it("should generate description.json", () => {
    let patterns = generateDescription()

    writeFile(
      "docs/description/description.json",
      JSON.stringify(patterns, null, 2)
    )
  })

  let githubBaseUrl = "https://raw.githubusercontent.com"

  it("should generate eslint description files", () => {
    return downloadDocs(
      pattern =>
        `${githubBaseUrl}/eslint/eslint/blob/master/docs/rules/${pattern}.md`
    )
  })

  it("should generate vue description files", () => {
    return downloadDocs(
      pattern =>
        `${githubBaseUrl}/vuejs/eslint-plugin-vue/master/docs/rules/${pattern}.md`,
      "vue"
    )
  })

  it("should generate react description files", () => {
    return downloadDocs(
      pattern =>
        `${githubBaseUrl}/yannickcr/eslint-plugin-react/master/docs/rules/${pattern}.md`,
      "react"
    )
  })

  it("should generate lodash description files", () => {
    return downloadDocs(
      pattern =>
        `${githubBaseUrl}/wix/eslint-plugin-lodash/master/docs/rules/${pattern}.md`,
      "lodash"
    )
  })

  it("should generate node description files", () => {
    return downloadDocs(pattern => {
      let patternFoldered = pattern.split("_").join("/")
      return `${githubBaseUrl}/mysticatea/eslint-plugin-node/master/docs/rules/${patternFoldered}.md`
    }, "node")
  })

  it("should generate promise description files", () => {
    return downloadDocs(
      pattern =>
        `${githubBaseUrl}/xjamundx/eslint-plugin-promise/master/docs/rules/${pattern}.md`,
      "promise"
    )
  })

  it("should generate backbone description files", () => {
    return downloadDocs(
      pattern =>
        `${githubBaseUrl}/ilyavolodin/eslint-plugin-backbone/master/docs/rules/${pattern}.md`,
      "backbone"
    )
  })
})

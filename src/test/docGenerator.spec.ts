import { equal } from "assert"
import { generatePatterns, generateDescription, downloadDocs} from "../docGenerator"
import { writeFileSync } from "fs"

describe("docGenerator", () => {
  it("should generate patterns", () => {
    let patterns = generatePatterns()

    writeFileSync('docs/patterns.json', JSON.stringify(patterns, null, 2))
  })
  it("should generate description.json", () => {
    let patterns = generateDescription()

    writeFileSync('docs/description/description.json', JSON.stringify(patterns, null, 2))
  })

  it("should generate vue description files", () => {
    return downloadDocs("vue", pattern => `https://raw.githubusercontent.com/vuejs/eslint-plugin-vue/master/docs/rules/${pattern}.md`)
  })

  it("should generate react description files", () => {
    return downloadDocs("react", pattern => `https://raw.githubusercontent.com/yannickcr/eslint-plugin-react/master/docs/rules/${pattern}.md`)
  })

  it("should generate lodash description files", () => {
    return downloadDocs("lodash", pattern => `https://raw.githubusercontent.com/wix/eslint-plugin-lodash/master/docs/rules/${pattern}.md`)
  })

})

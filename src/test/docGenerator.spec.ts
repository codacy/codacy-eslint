import { equal } from "assert"
import { generatePatterns, generateDescription} from "../docGenerator"
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
})

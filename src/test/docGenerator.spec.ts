import * as fs from "node:fs"
import path from "node:path"

import { equal } from "assert"

describe("DocGenerator", () => {
  describe("createdFiles", () => {
    it("should have docs/patterns.json file", () => {
      equal(fs.existsSync(path.join("docs", "patterns.json")), true)
    })
    it("should have docs/description/description.json file", () => {
      equal(fs.existsSync(path.join("docs", "description", "description.json")), true)
    })
  })
})

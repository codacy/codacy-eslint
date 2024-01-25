import * as fs from "node:fs"

import {equal} from "assert"

describe("DocGenerator", () => {
  describe("createdFiles", () => {
    it("should have patterns.json file", () => {
      equal(fs.existsSync("docs/patterns.json"), true)
    })
    it("should have description.json file", () => {
      equal(fs.existsSync("docs/description/description.json"), true)
    })
  })
})

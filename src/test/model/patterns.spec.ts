import { equal } from "assert"

import { patternIdToCodacy, patternIdToEslint } from "../../model/patterns"

describe("Patterns", () => {
  it("should convert patternId from Codacy to Eslint format", () => {
    equal(
      patternIdToEslint("family_subfamily_ruleId"),
      "family/subfamily/ruleId"
    )
  })
  it("should convert patternId from Eslint to Codacy format", () => {
    equal(
      patternIdToCodacy("family/subfamily/ruleId"),
      "family_subfamily_ruleId"
    )
  })
})

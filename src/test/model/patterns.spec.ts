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
  it("should convert escaped underscores in patternId from Codacy to Eslint format", () => {
    equal(
      patternIdToEslint("family_subfamily_ruleId__name"),
      "family/subfamily/ruleId_name"
    )
  })
  it("should convert patternId from Eslint to Codacy format escaping underscores", () => {
    equal(
      patternIdToCodacy("family/subfamily/ruleId_name"),
      "family_subfamily_ruleId__name"
    )
  })
  it("should convert patternId managing multiple underscores", () => {
    equal(
      patternIdToCodacy("family/subfamily/ruleId__name"),
      "family_subfamily_ruleId____name"
    )
  })
})

import { deepEqual } from "assert"
import { ParameterSpec } from "codacy-seed"
import { JSONSchema4 } from "json-schema"

import { fromSchemaArray } from "../namedParameters"

describe("namedParameters", () => {
  describe("fromSchemaArray", () => {
    it("should generate PatternParameters[]", () => {
      const schemaArray: JSONSchema4[] = [
        {
          type: "object",
          properties: {
            getWithoutSet: {
              type: "boolean",
              default: false
            },
            setWithoutGet: {
              type: "boolean",
              default: true
            },
            enforceForClassMembers: {
              type: "boolean",
              default: false
            }
          },
          additionalProperties: false
        }
      ]
      const expectedResult = [
        new ParameterSpec("getWithoutSet", false),
        new ParameterSpec("setWithoutGet", true),
        new ParameterSpec("enforceForClassMembers", false)
      ]
      deepEqual(fromSchemaArray("dummy", schemaArray), expectedResult)
    })
  })
})

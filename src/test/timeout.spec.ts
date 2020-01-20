import { equal } from "assert"

import { defaultTimeout, parseTimeoutSeconds } from "../parseTimeoutSeconds"

describe("parseTimeoutSeconds", () => {
  it("should parse timeout with seconds", () => {
    equal(parseTimeoutSeconds("60"), 60)
    equal(parseTimeoutSeconds("1"), 1)
  })
  it("should return defaultTimeout when timeout is not correct", () => {
    equal(parseTimeoutSeconds("blabla"), defaultTimeout)
  })
})

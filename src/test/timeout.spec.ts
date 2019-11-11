import { equal } from "assert"
import { parseTimeout, defaultTimeout } from "../parseTimeout"

describe("parseTimeout", () => {
  it("should parse timeout with seconds", () => {
    equal(parseTimeout(" 60    seconds"), 60)
    equal(parseTimeout(" 1 second "), 1)
  })
  it("should parse timeout with minutes", () => {
    equal(parseTimeout("1 minute"), 60)
    equal(parseTimeout(" 2 minutes"), 120)
  })
  it("should parse timeout with hours", () => {
    equal(parseTimeout("1 hour"), 60 * 60)
    equal(parseTimeout("1 hours"), 60 * 60)
  })
  it("should return defaultTimeout when timeout is not correct", () => {
    equal(parseTimeout("blabla"), defaultTimeout)
    equal(parseTimeout("blabla blabla"), defaultTimeout)
    equal(parseTimeout("10 blabla"), defaultTimeout)
  })
})

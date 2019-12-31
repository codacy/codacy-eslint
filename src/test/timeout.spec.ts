import { equal } from "assert"

import { defaultTimeout, parseTimeoutMilliseconds } from "../parseTimeoutMilliseconds"

describe("parseTimeoutSeconds", () => {
  it("should parse timeout with nanoseconds", () => {
    equal(parseTimeoutMilliseconds(" 60    nanoseconds"), 60 / 1000000)
    equal(parseTimeoutMilliseconds(" 1 nanosecond "), 1 / 1000000)
  })
  it("should parse timeout with microseconds", () => {
    equal(parseTimeoutMilliseconds(" 60    microseconds"), 60 / 1000)
    equal(parseTimeoutMilliseconds(" 1 microsecond "), 1 / 1000)
  })
  it("should parse timeout with milliseconds", () => {
    equal(parseTimeoutMilliseconds(" 60    milliseconds"), 60)
    equal(parseTimeoutMilliseconds(" 1 millisecond "), 1)
  })
  it("should parse timeout with seconds", () => {
    equal(parseTimeoutMilliseconds(" 60    seconds"), 60 * 1000)
    equal(parseTimeoutMilliseconds(" 1 second "), 1 * 1000)
  })
  it("should parse timeout with minutes", () => {
    equal(parseTimeoutMilliseconds("1 minute"), 60 * 1000)
    equal(parseTimeoutMilliseconds(" 2 minutes"), 120 * 1000)
  })
  it("should parse timeout with hours", () => {
    equal(parseTimeoutMilliseconds("1 hour"), 60 * 60 * 1000)
    equal(parseTimeoutMilliseconds(" 2 hours"), 120 * 60 * 1000)
  })
  it("should parse timeout with days", () => {
    equal(parseTimeoutMilliseconds("1 day"), 24 * 60 * 60 * 1000)
    equal(parseTimeoutMilliseconds(" 2 days"), 48 * 60 * 60 * 1000)
  })
  it("should parse timeout with dot", () => {
    equal(parseTimeoutMilliseconds("1.minutes"), 60 * 1000)
    equal(parseTimeoutMilliseconds("1 . second"), 1 * 1000)
  })
  it("should return defaultTimeout when timeout is not correct", () => {
    equal(parseTimeoutMilliseconds("blabla"), defaultTimeout)
    equal(parseTimeoutMilliseconds("blabla blabla"), defaultTimeout)
    equal(parseTimeoutMilliseconds("10 blabla"), defaultTimeout)
  })
})

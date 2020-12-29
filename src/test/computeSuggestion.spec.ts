import { deepStrictEqual } from "assert"
import { Linter, Rule } from "eslint"
import { computeSuggestion } from "../computeSuggestion"

describe("computeSuggestion", () => {
  const source =
    "var foo = '';\n\nif(foo  === \"bar\") {\n  console.log('hey')\n}\n"
  const line = 3
  it("should generate a suggestion using fix", () => {
    const fix: Rule.Fix = {
      range: [21, 23],
      text: " ",
    }

    const result = computeSuggestion(source, line, undefined, fix, undefined)
    const expectedResult = 'if(foo === "bar") {'

    deepStrictEqual(result, expectedResult)
  })
  it("should generate a suggestion using the first element of suggestions", () => {
    const suggestions: Linter.LintSuggestion[] = [
      {
        desc: "First suggestion",
        fix: {
          range: [21, 23],
          text: " ",
        },
      },
      {
        desc: "Second suggestion",
        fix: {
          range: [10, 12],
          text: "hello",
        },
      },
    ]

    const result = computeSuggestion(
      source,
      line,
      undefined,
      undefined,
      suggestions
    )
    const expectedResult = 'if(foo === "bar") {'

    deepStrictEqual(result, expectedResult)
  })
  it("should use fix when both fix and suggestions are defined", () => {
    const fix: Rule.Fix = {
      range: [21, 23],
      text: " ",
    }
    const suggestions: Linter.LintSuggestion[] = [
      {
        desc: "A suggestion",
        fix: {
          range: [10, 12],
          text: "hello",
        },
      },
    ]

    const result = computeSuggestion(source, line, undefined, fix, suggestions)
    const expectedResult = 'if(foo === "bar") {'

    deepStrictEqual(result, expectedResult)
  })
  it("should return undefined when both fix and suggestions are undefined", () => {
    const result = computeSuggestion(
      source,
      line,
      undefined,
      undefined,
      undefined
    )

    deepStrictEqual(result, undefined)
  })
  it("should return undefined when fix is undefined and suggestions is empty", () => {
    const result = computeSuggestion(source, line, undefined, undefined, [])

    deepStrictEqual(result, undefined)
  })
  it("should return undefined when the suggestion is multiline", () => {
    const fix: Rule.Fix = {
      range: [21, 23],
      text: " ",
    }
    const result = computeSuggestion(source, line, 4, fix, [])

    deepStrictEqual(result, undefined)
  })
  it("should return undefined when the suggestion has wrong range", () => {
    const fix: Rule.Fix = {
      range: [30, 21],
      text: " ",
    }
    const result = computeSuggestion(source, line, undefined, fix, [])

    deepStrictEqual(result, undefined)
  })
  it("should return undefined when the suggestion index is out of the string range", () => {
    {
      const fix: Rule.Fix = {
        range: [-1, 23],
        text: " ",
      }
      const result = computeSuggestion(source, line, undefined, fix, undefined)

      deepStrictEqual(result, undefined)
    }
    {
      const fix: Rule.Fix = {
        range: [21, source.length],
        text: " ",
      }
      const result = computeSuggestion(source, line, undefined, fix, undefined)
      deepStrictEqual(result, undefined)
    }
  })
})

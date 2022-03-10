import { deepEqual } from "assert"
import { Issue, ToolResult } from "codacy-seed"
import { ESLint } from "eslint"
import { convertResults } from "../convertResults"

describe("convertResults", () => {
  it("should convert a Eslint report into Codacy results", () => {
    const eslintResults: ESLint.LintResult[] = [
      {
        filePath: "file.js",
        messages: [
          {
            column: 0,
            line: 1,
            ruleId: "rule1",
            message: "Message 1",
            nodeType: "type",
            severity: 0,
            source: null,
          },
          {
            column: 0,
            line: 2,
            ruleId: "rule2",
            message: "Message 2",
            nodeType: "type",
            severity: 0,
            source: null,
          },
        ],
        fatalErrorCount: 0,
        errorCount: 2,
        warningCount: 0,
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        usedDeprecatedRules: [],
      },
    ]

    const results = convertResults(eslintResults)
    const expected: ToolResult[] = [
      new Issue("file.js", "Message 1", "rule1", 1),
      new Issue("file.js", "Message 2", "rule2", 2),
    ]

    deepEqual(results, expected)
  })
})

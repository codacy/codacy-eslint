import { FileError, Issue, ToolResult } from "codacy-seed"
import { CLIEngine, Linter } from "eslint"

import { blacklist } from "./blacklist"
import { patternIdToCodacy } from "./model/patterns"

export function convertResults(report: CLIEngine.LintReport): ToolResult[] {
  const results: ToolResult[] = []
  report.results.forEach((result) => {
    const filename = result.filePath
    const messages = result.messages
    const fatalErrors = messages
      .filter((m) => m.fatal)
      .map((m) => m.message)
    if (fatalErrors.length > 0) {
      results.push(new FileError(filename, fatalErrors.join("\\n")))
    } else {
      const pairs = messages
        .filter((r) => r.ruleId && !blacklist.includes(r.ruleId))
        .map((m) => [m.ruleId, m]) as [string, Linter.LintMessage][]
      pairs.forEach(([ruleId, m]) => {
        const line = m.line
        const message = m.message
        const patternId = patternIdToCodacy(ruleId)
        results.push(new Issue(filename, message, patternId, line))
      })
    }
  })
  return results
}

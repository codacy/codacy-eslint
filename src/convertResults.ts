import { CLIEngine, Linter } from "eslint"
import { CodacyResult } from "./model/CodacyResult"
import { flatMap } from "lodash"
import { patternIdToCodacy } from "./model/Patterns"

export function convertResults(report: CLIEngine.LintReport): CodacyResult[] {
  return flatMap(report.results, result => {
    const filename = result.filePath
    const pairs = result.messages
      .map(m => [m.ruleId, m])
      .filter(t => t[0] !== null) as [string, Linter.LintMessage][]
    return pairs.map(([ruleId, m]) => {
      const line = m.line
      const message = m.message
      const patternId = patternIdToCodacy(ruleId)
      return new CodacyResult(filename, message, patternId, line)
    })
  })
}

export function resultString(results: CodacyResult[]): string {
  const lines = results.map(result => JSON.stringify(result))
  return lines.join("\n")
}

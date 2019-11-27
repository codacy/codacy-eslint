import { CLIEngine, Linter } from "eslint"
import { CodacyResult } from "./model/CodacyResult"
import { flatMap } from "lodash"
import { patternIdToCodacy } from "./model/Patterns"

export function convertResults(report: CLIEngine.LintReport): CodacyResult[] {
  return flatMap(report.results, result => {
    let filename = result.filePath
    let pairs = result.messages
      .map<[string | null, Linter.LintMessage]>(m => [m.ruleId, m])
      .filter(t => t[0] !== null) as [string, Linter.LintMessage][]
    return pairs.map(([ruleId, m]) => {
      let line = m.line
      let message = m.message
      let patternId = patternIdToCodacy(ruleId)
      return new CodacyResult(filename, message, patternId, line)
    })
  })
}

export function resultString(results: CodacyResult[]): string {
  let lines = results.map(result => JSON.stringify(result))
  return lines.join("\n")
}

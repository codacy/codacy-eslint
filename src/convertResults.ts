import { CLIEngine } from "eslint"
import { CodacyResult } from "./model/CodacyResult"
import { flatMap } from "lodash"
import { patternIdToCodacy } from "./model/Patterns"

export function convertResults(report: CLIEngine.LintReport): CodacyResult[] {
  return flatMap(report.results, result => {
    let filename = result.filePath
    return result.messages.map(m => {
      let line = m.line
      let message = m.message
      let patternId = patternIdToCodacy(<string>m.ruleId) // TODO: Remove unsafe cast
      return new CodacyResult(filename, message, patternId, line)
    })
  })
}

export function resultString(results: CodacyResult[]): string {
  let lines = results.map(result => JSON.stringify(result))
  return lines.join("\n")
}

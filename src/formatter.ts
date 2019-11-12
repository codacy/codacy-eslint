import { CLIEngine } from "eslint"
import { CodacyResult } from "./model/CodacyResult"
import { flatten } from "lodash"

export function convertResults(report: CLIEngine.LintReport): CodacyResult[] {
  let results = report.results
  let resultsToFlatten = results.map(result => {
    let filename = result.filePath
    return result.messages.map(m => {
      let line = m.line
      let message = m.message
      let patternId = <string>m.ruleId // TODO: Remove unsafe cast
      return new CodacyResult(filename, message, patternId, line)
    })
  })
  return flatten(resultsToFlatten)
}

export function resultString(results: CodacyResult[]): string {
  let lines = results.map(result => JSON.stringify(result))
  return lines.join("\n")
}

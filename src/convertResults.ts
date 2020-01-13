import { CLIEngine, Linter } from "eslint"
import { flatMap } from "lodash"

import { blacklist } from "./blacklist"
import { CodacyResult } from "./model/codacyResult"
import { patternIdToCodacy } from "./model/patterns"

export function convertResults(report: CLIEngine.LintReport): CodacyResult[] {
  return flatMap(report.results, result => {
    const filename = result.filePath
    const pairs = result.messages
      .filter(r => r.ruleId && !blacklist.includes(r.ruleId))
      .map(m => [m.ruleId, m]) as [string, Linter.LintMessage][]
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

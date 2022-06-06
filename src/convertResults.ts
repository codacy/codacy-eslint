import { FileError, Issue, ToolResult } from "codacy-seed"
import { ESLint, Linter } from "eslint"

import { isBlacklisted } from "./blacklist"
import { computeSuggestion } from "./computeSuggestion"
import { patternIdToCodacy } from "./model/patterns"

export function convertResults(eslintResults: ESLint.LintResult[]): ToolResult[] {
  const results: ToolResult[] = []
  eslintResults.forEach((result) => {
    const filename = result.filePath
    const messages = result.messages
    const fatalErrors = messages.filter((m) => m.fatal).map((m) => m.message)
    if (fatalErrors.length > 0) {
      results.push(new FileError(filename, fatalErrors.join("\\n")))
    } else {
      const pairs = messages
        .filter((r) => r.ruleId && !isBlacklisted(r.ruleId))
        .map((m) => [m.ruleId, m]) as [string, Linter.LintMessage][]
      pairs.forEach(([ruleId, m]) => {
        const line = m.line
        const message = m.message
        const patternId = patternIdToCodacy(ruleId)
        const suggestion =
          process.env.SUGGESTIONS === "true" && result.source
            ? computeSuggestion(
                result.source,
                m.line,
                m.endLine,
                m.fix,
                m.suggestions
              )
            : undefined
        results.push(new Issue(filename, message, patternId, line, suggestion))
      })
    }
  })
  return results
}

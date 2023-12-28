import { FileError, Issue, ToolResult } from "codacy-seed"
import { ESLint } from "eslint"

import { isBlacklisted } from "./blacklist"
import { computeSuggestion } from "./computeSuggestion"
import { patternIdToCodacy } from "./model/patterns"

export function convertResults(eslintResults: ESLint.LintResult[]): ToolResult[] {
  const results: ToolResult[] = []
  eslintResults.forEach((result) => {
    const { filePath: filename, messages } = result

    if (result.fatalErrorCount > 0) {
      results.push(new FileError(filename, messages.filter((m) => m.fatal).map((m) => m.message).join("\\n")))
      return
    }

    const issues = messages
      .filter((r) => r.ruleId && !isBlacklisted(r.ruleId))
      .map((m) => {
        const { ruleId, line, endLine, message, fix, suggestions } = m
        const patternId = patternIdToCodacy(ruleId)
        const suggestion =
          process.env.SUGGESTIONS === "true" && result.source
            ? computeSuggestion(result.source, line, endLine, fix, suggestions)
            : undefined

        return new Issue(filename, message, patternId, line, suggestion)
      });

    results.push(...issues)
  })
  return results
}

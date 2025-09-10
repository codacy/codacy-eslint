import { FileError, Issue, ToolResult } from "codacy-seed"
import { ESLint } from "eslint"

import { isBlacklisted } from "./blacklist"
import { computeSuggestion } from "./computeSuggestion"
import { patternIdToCodacy } from "./model/patterns"

export function convertResults(eslintResults: ESLint.LintResult[]): ToolResult[] {
  const results: ToolResult[] = []

  for (const result of eslintResults) {
    const filename = result.filePath
    const { messages, fatalErrorCount, source } = result

    if (fatalErrorCount > 0) {
      const fatalMessages = messages
        .filter((m) => m.fatal)
        .map((m) => m.message)
        .join("\n")
      results.push(new FileError(filename, fatalMessages))
      continue
    }

    const hasSuggestions = process.env.SUGGESTIONS === "true" && typeof source === "string"

    for (const m of messages) {
      if (!m.ruleId || isBlacklisted(m.ruleId)) continue

      const patternId = patternIdToCodacy(m.ruleId)
      const suggestion
        = hasSuggestions
          ? computeSuggestion(source!, m.line, m.endLine, m.fix, m.suggestions)
          : undefined

      if (suggestion) console.log(`Suggestion for ${filename}:${m.line} - ${patternId}: ${suggestion}`)
      results.push(new Issue(filename, m.message, patternId, m.line, suggestion))
    }
  }

  return results
}

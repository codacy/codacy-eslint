import { Linter, Rule } from "eslint"

export function computeSuggestion(
  sourceCodeText: string,
  line: number,
  endLine: number | undefined,
  fix?: Rule.Fix,
  suggestions?: Linter.LintSuggestion[]
): string | undefined {
  function impl(edit: Rule.Fix) {
    const range = edit.range
    if (
      range[0] > range[1] ||
      range[0] < 0 ||
      range[0] >= sourceCodeText.length ||
      range[1] < 0 ||
      range[1] >= sourceCodeText.length
    ) {
      return undefined
    }

    const newSourceCodeText =
      sourceCodeText.slice(0, edit.range[0]) +
      edit.text +
      sourceCodeText.slice(edit.range[1])

    return newSourceCodeText.split("\n")[line - 1]
  }

  if (endLine && endLine != line) return undefined
  if (fix) return impl(fix)
  else if (suggestions && suggestions.length > 0)
    return impl(suggestions[0].fix)
  else return undefined
}

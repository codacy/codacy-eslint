import { defaultEngine } from "./eslintDefaultOptions"
import {
  fromEslintCategoryToLevel,
  Patterns,
  PatternsEntry,
  fromEslintCategoryToCategory,
  patternIdToCodacy,
  Category,
  Level
} from "./model/Patterns"
import { toolName, toolVersion } from "./toolMetadata"
import { DescriptionEntry } from "./model/Description"

export function generatePatterns(): Patterns {
  let rules = defaultEngine.getRules()
  let patterns = Array.from(rules.entries()).map(([patternId, ruleModule]) => {
    let eslintCategory =
      ruleModule && ruleModule.meta && ruleModule.meta.docs
        ? ruleModule.meta.docs.category
        : undefined
    let level: Level = fromEslintCategoryToLevel(eslintCategory)
    let category: Category = patternId.includes("security")
      ? "Security"
      : fromEslintCategoryToCategory(eslintCategory)
    return new PatternsEntry(patternIdToCodacy(patternId), level, category)
  })
  let entries = patterns.filter(x => x != null) as PatternsEntry[]
  return new Patterns(toolName, toolVersion, entries)
}

export function generateDescription(): DescriptionEntry[] {
  let rules = defaultEngine.getRules()
  let descriptionEntries = Array.from(rules.entries()).map(
    ([patternId, ruleModule]) => {
      let eslintDescription =
        ruleModule && ruleModule.meta && ruleModule.meta.docs
          ? ruleModule.meta.docs.description
          : undefined
      let capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
      let description = eslintDescription ? capitalize(eslintDescription) : ""
      let title = patternId
        .split("/")
        .map(s =>
          capitalize(s)
            .split("-")
            .join(" ")
        )
        .join(": ")
      let timeToFix = 5
      return new DescriptionEntry(
        patternIdToCodacy(patternId),
        title,
        description,
        timeToFix
      )
    }
  )
  return descriptionEntries.filter(x => x != null) as DescriptionEntry[]
}

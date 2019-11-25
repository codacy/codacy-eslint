import fs from "fs"
import fetch from "node-fetch"
import { promisify } from "util"
import { defaultEngine } from "./eslintDefaultOptions"
import { DescriptionEntry } from "./model/Description"
import {
  Category,
  fromEslintCategoryToCategory,
  fromEslintCategoryToLevel,
  Level,
  patternIdToCodacy,
  Patterns,
  PatternsEntry
} from "./model/Patterns"
import { toolName, toolVersion } from "./toolMetadata"

let writeFile = promisify(fs.writeFile)

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

function patternIdsWithoutPrefix(prefix: string): Array<string> {
  let longPrefix = prefix + "/"
  let rules = defaultEngine.getRules()
  let patternIds = Array.from(rules.entries()).map(e => e[0])
  let filteredPatternIds = patternIds.filter(patternId =>
    patternId.startsWith(longPrefix)
  )
  return filteredPatternIds.map(patternId =>
    patternId.substring(longPrefix.length)
  )
}

function eslintPatternIds(): Array<string> {
  let rules = defaultEngine.getRules()
  return Array.from(rules.keys()).filter(e => !e.includes("/"))
}

export function downloadDocs(
  urlFromPatternId: (patternId: string) => string,
  prefix: string | undefined = undefined
) {
  let patterns = prefix ? patternIdsWithoutPrefix(prefix) : eslintPatternIds()
  let promises: Promise<void>[] = patterns.map(async pattern => {
    let url: string = urlFromPatternId(pattern)
    let result = await fetch(url)
    if (result.ok) {
      let text = await result.text()
      let filename =
        "docs/description/" +
        (prefix ? prefix + "_" : "") +
        patternIdToCodacy(pattern) +
        ".md"
      return writeFile(filename, text)
    } else return Promise.resolve()
  })
  return Promise.all(promises)
}

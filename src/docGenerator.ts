import fs from "fs"
import { JSONSchema4 } from "json-schema"
import { flatMap, flatMapDeep, partition, toPairs } from "lodash"
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
  PatternsEntry,
  PatternsParameter
} from "./model/Patterns"
import { toolName, toolVersion } from "./toolMetadata"

let writeFile = promisify(fs.writeFile)

export function generatePatterns(): Patterns {
  let rules = defaultEngine.getRules()
  let patterns = Array.from(rules.entries()).map(([patternId, ruleModule]) => {
    let meta = ruleModule && ruleModule.meta ? ruleModule.meta : undefined
    let eslintCategory = meta && meta.docs ? meta.docs.category : undefined
    let level: Level = fromEslintCategoryToLevel(eslintCategory)
    let category: Category = patternId.includes("security")
      ? "Security"
      : fromEslintCategoryToCategory(eslintCategory)
    let parameters =
      meta && meta.schema
        ? fromEslintSchemaToParameters(meta.schema)
        : undefined
    return new PatternsEntry(
      patternIdToCodacy(patternId),
      level,
      category,
      parameters && parameters.length > 0 ? parameters : undefined
    )
  })
  let entries = patterns.filter(x => x !== null) as PatternsEntry[]
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
  return descriptionEntries.filter(x => x !== null) as DescriptionEntry[]
}

type WithDefault = { default: any }

function anyOfToArray(schema: JSONSchema4) {
  return schema.anyOf ? schema.anyOf : [schema]
}

function fromEslintSchemaToParameters(
  schema: JSONSchema4 | JSONSchema4[]
): PatternsParameter[] {
  let flattenSchema = <JSONSchema4[]>(
    (<unknown>flatMapDeep(schema, anyOfToArray))
  )

  console.log("schema: ")
  console.log(schema)
  console.log("flattenSchema: ")
  console.log(flattenSchema)

  if (Array.isArray(flattenSchema)) {
    let [objects, nonObject] = partition(
      flattenSchema,
      value => value && value.properties
    )
    let namedParameters = flatMap(objects, o => {
      let pairs = toPairs(o.properties)
      return pairs.map(([k, v]) => {
        let withDefault = v as WithDefault
        return new PatternsParameter(
          k,
          v && withDefault.default ? withDefault.default : undefined
        )
      })
    })
    let unnamedParameters =
      nonObject.length === 0 ? [] : [new PatternsParameter("unnamedParam")]
    return namedParameters.concat(unnamedParameters)
  } else {
    return [new PatternsParameter("unnamedParam")]
  }
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

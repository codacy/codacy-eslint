import { Rule } from "eslint"
import { JSONSchema4 } from "json-schema"
import { flatMap, flatMapDeep } from "lodash"
import fetch from "node-fetch"

import { capitalize, patternTitle } from "./docGeneratorStringUtils"
import { writeFile } from "./fileUtils"
import { DescriptionEntry } from "./model/description"
import {
  fromEslintCategoryToLevel,
  fromEslintPatternIdAndCategoryToCategory,
  Level,
  patternIdToCodacy,
  Patterns,
  PatternsEntry,
  PatternsParameter
} from "./model/patterns"
import { fromSchemaArray } from "./namedParameters"
import { rulesToUnnamedParametersDefaults } from "./rulesToUnnamedParametersDefaults"
import { toolName, toolVersion } from "./toolMetadata"
export class DocGenerator {
  private readonly rules: [string, Rule.RuleModule][]

  constructor(rules: [string, Rule.RuleModule][]) {
    this.rules = rules
  }

  private getPatternIds() {
    return this.rules.map(([patternId, _]) => patternId)
  }

  generatePatterns(): Patterns {
    const entries = flatMap(this.rules, ([patternId, ruleModule]) => {
      const meta = ruleModule && ruleModule.meta ? ruleModule.meta : undefined
      const eslintCategory = meta && meta.docs ? meta.docs.category : undefined
      const level: Level = fromEslintCategoryToLevel(eslintCategory)
      const [category, subcategory] = fromEslintPatternIdAndCategoryToCategory(
        patternId,
        eslintCategory
      )
      const namedParameters =
        meta && meta.schema
          ? this.fromEslintSchemaToParameters(patternId, meta.schema)
          : undefined
      const unnamedParameterValue = rulesToUnnamedParametersDefaults.get(
        patternId
      )
      const unnamedParameter = unnamedParameterValue
        ? new PatternsParameter("unnamedParam", unnamedParameterValue)
        : undefined
      function getParameters(): PatternsParameter[] | undefined {
        if (namedParameters && unnamedParameter)
          return [unnamedParameter, ...namedParameters]
        else if (namedParameters) return namedParameters
        else if (unnamedParameter) return [unnamedParameter]
        else return undefined
      }
      const parameters = getParameters()
      return new PatternsEntry(
        patternIdToCodacy(patternId),
        level,
        category,
        subcategory,
        parameters && parameters.length > 0 ? parameters : undefined
      )
    })
    return new Patterns(toolName, toolVersion, entries)
  }

  generateDescriptionEntries(): DescriptionEntry[] {
    return flatMap(this.rules, ([patternId, ruleModule]) => {
      const eslintDescription =
        ruleModule && ruleModule.meta && ruleModule.meta.docs
          ? ruleModule.meta.docs.description
          : undefined
      const description = eslintDescription ? capitalize(eslintDescription) : ""
      const title = patternTitle(patternId)
      const timeToFix = 5
      return new DescriptionEntry(
        patternIdToCodacy(patternId),
        title,
        description,
        timeToFix
      )
    })
  }

  private fromEslintSchemaToParameters(
    patternId: string,
    schema: JSONSchema4 | JSONSchema4[]
  ): PatternsParameter[] {
    const anyOfToArray = (schema: JSONSchema4) =>
      schema.anyOf ? schema.anyOf : [schema]

    const flattenSchema = <JSONSchema4[]>(
      (<unknown>flatMapDeep(schema, anyOfToArray))
    )

    if (Array.isArray(flattenSchema)) {
      const objects = flattenSchema.filter(value => value && value.properties)
      return fromSchemaArray(patternId, objects)
    } else return []
  }

  private patternIdsWithoutPrefix(prefix: string): Array<string> {
    const longPrefix = prefix + "/"
    const patternIds = this.getPatternIds()
    const filteredPatternIds = patternIds.filter(patternId =>
      patternId.startsWith(longPrefix)
    )
    return filteredPatternIds.map(patternId =>
      patternId.substring(longPrefix.length)
    )
  }

  private eslintPatternIds(): Array<string> {
    // We take all the patterns except those that have slashes because
    // they come from third party plugins
    return this.getPatternIds().filter(e => !e.includes("/"))
  }

  downloadDocs(
    urlFromPatternId: (patternId: string) => string,
    prefix: string = ""
  ) {
    const patterns =
      prefix.length > 0
        ? this.patternIdsWithoutPrefix(prefix)
        : this.eslintPatternIds()
    const promises: Promise<void>[] = patterns.map(async pattern => {
      const url: string = urlFromPatternId(pattern)
      const result = await fetch(url)
      if (result.ok) {
        const text = await result.text()
        const filename =
          "docs/description/" +
          (prefix.length > 0 ? prefix + "_" : "") +
          patternIdToCodacy(pattern) +
          ".md"
        return writeFile(filename, text)
      } else
        return Promise.reject(
          `Failed to retrieve docs for ${pattern} from ${url}`
        )
    })
    return Promise.all(promises)
  }
}

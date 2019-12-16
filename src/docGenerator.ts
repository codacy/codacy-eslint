import { JSONSchema4 } from "json-schema"
import { flatMap, flatMapDeep, toPairs } from "lodash"
import fetch from "node-fetch"
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
import { writeFile } from "./fileUtils"
import { capitalize, patternTitle } from "./DocGeneratorStringUtils"
import { Rule } from "eslint"

type WithDefault = { default: any }
export class DocGenerator {
  private readonly rules: Map<string, Rule.RuleModule>

  constructor(rules: Map<string, Rule.RuleModule>) {
    this.rules = rules
  }

  generatePatterns(): Patterns {
    const patterns = Array.from(this.rules.entries()).map(
      ([patternId, ruleModule]) => {
        const meta = ruleModule && ruleModule.meta ? ruleModule.meta : undefined
        const eslintCategory =
          meta && meta.docs ? meta.docs.category : undefined
        const level: Level = fromEslintCategoryToLevel(eslintCategory)
        const category: Category = patternId.includes("security")
          ? "Security"
          : fromEslintCategoryToCategory(eslintCategory)
        const parameters =
          meta && meta.schema
            ? this.fromEslintSchemaToParameters(meta.schema)
            : undefined
        return new PatternsEntry(
          patternIdToCodacy(patternId),
          level,
          category,
          parameters && parameters.length > 0 ? parameters : undefined
        )
      }
    )
    const entries = patterns.filter(x => x !== null) as PatternsEntry[]
    return new Patterns(toolName, toolVersion, entries)
  }

  generateDescription(): DescriptionEntry[] {
    const descriptionEntries = Array.from(this.rules.entries()).map(
      ([patternId, ruleModule]) => {
        const eslintDescription =
          ruleModule && ruleModule.meta && ruleModule.meta.docs
            ? ruleModule.meta.docs.description
            : undefined
        const description = eslintDescription
          ? capitalize(eslintDescription)
          : ""
        const title = patternTitle(patternId)
        const timeToFix = 5
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

  private fromEslintSchemaToParameters(
    schema: JSONSchema4 | JSONSchema4[]
  ): PatternsParameter[] {
    const anyOfToArray = (schema: JSONSchema4) => {
      return schema.anyOf ? schema.anyOf : [schema]
    }

    const flattenSchema = <JSONSchema4[]>(
      (<unknown>flatMapDeep(schema, anyOfToArray))
    )

    if (Array.isArray(flattenSchema)) {
      const objects = flattenSchema.filter(value => value && value.properties)
      const namedParameters = flatMap(objects, o => {
        const pairs = toPairs(o.properties)
        const haveDefault = pairs.filter(
          ([k, v]) => v && (v as WithDefault) && v.default
        ) as [string, WithDefault][]
        return haveDefault.map(([k, v]) => {
          return new PatternsParameter(k, v.default)
        })
      })
      return namedParameters
    }
    return []
  }

  private patternIdsWithoutPrefix(prefix: string): Array<string> {
    const longPrefix = prefix + "/"
    const patternIds = Array.from(this.rules.entries()).map(e => e[0])
    const filteredPatternIds = patternIds.filter(patternId =>
      patternId.startsWith(longPrefix)
    )
    return filteredPatternIds.map(patternId =>
      patternId.substring(longPrefix.length)
    )
  }

  private eslintPatternIds(): Array<string> {
    return Array.from(this.rules.keys()).filter(e => !e.includes("/"))
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
      } else return Promise.resolve()
    })
    return Promise.all(promises)
  }
}

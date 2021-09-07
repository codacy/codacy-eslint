import {
  DescriptionEntry,
  DescriptionParameter,
  Level,
  ParameterSpec,
  PatternSpec,
  Specification,
  writeFile,
} from "codacy-seed"
import { Rule } from "eslint"
import { JSONSchema4 } from "json-schema"
import { flatMap, flatMapDeep } from "lodash"
import fetch from "node-fetch"

import { capitalize, patternTitle } from "./docGeneratorStringUtils"
import {
  fromEslintCategoryToLevel,
  fromEslintPatternIdAndCategoryToCategory,
  patternIdToCodacy,
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

  private generateParameters(
    patternId: string,
    schema: JSONSchema4 | JSONSchema4[] | undefined
  ): ParameterSpec[] | undefined {
    const namedParameters = schema
      ? this.fromEslintSchemaToParameters(patternId, schema)
      : undefined
    const unnamedParameterValue = rulesToUnnamedParametersDefaults.get(
      patternId
    )
    const unnamedParameter = unnamedParameterValue
      ? new ParameterSpec("unnamedParam", unnamedParameterValue)
      : undefined
    function getParameters(): ParameterSpec[] | undefined {
      if (namedParameters && unnamedParameter)
        return [unnamedParameter, ...namedParameters]
      else if (namedParameters) return namedParameters
      else if (unnamedParameter) return [unnamedParameter]
      else return undefined
    }
    const result = getParameters()
    return result && result.length > 0 ? result : undefined
  }

  generatePatterns(): Specification {
    const patterns = flatMap(this.rules, ([patternId, ruleModule]) => {
      const meta = ruleModule?.meta
      const eslintCategory = meta?.docs?.category
      const level: Level = fromEslintCategoryToLevel(eslintCategory)
      const [category, subcategory] = fromEslintPatternIdAndCategoryToCategory(
        patternId,
        eslintCategory
      )
      const parameters = this.generateParameters(patternId, meta?.schema)
      const enabled = meta?.docs?.recommended === true
      return new PatternSpec(
        patternIdToCodacy(patternId),
        level,
        category,
        subcategory,
        parameters,
        enabled
      )
    })

    return new Specification(toolName, toolVersion, patterns)
  }

  generateDescriptionEntries(): DescriptionEntry[] {
    const descriptions = flatMap(this.rules, ([patternId, ruleModule]) => {
      const meta = ruleModule && ruleModule.meta
      const eslintDescription = meta?.docs?.description
      const description = eslintDescription
        ? capitalize(eslintDescription)
        : undefined
      const title = patternTitle(patternId)
      const timeToFix = 5
      const patternsParameters = this.generateParameters(
        patternId,
        meta?.schema
      )
      const descriptionParameters = patternsParameters?.map(
        (p) => new DescriptionParameter(p.name, p.name)
      )
      return new DescriptionEntry(
        patternIdToCodacy(patternId),
        title,
        description,
        timeToFix,
        descriptionParameters
      )
    })

    return descriptions
  }

  private fromEslintSchemaToParameters(
    patternId: string,
    schema: JSONSchema4 | JSONSchema4[]
  ): ParameterSpec[] {
    const anyOfToArray = (schema: JSONSchema4) =>
      schema.anyOf ? schema.anyOf : [schema]

    const flattenSchema = <JSONSchema4[]>(
      (<unknown>flatMapDeep(schema, anyOfToArray))
    )

    if (Array.isArray(flattenSchema)) {
      const objects = flattenSchema.filter((value) => value && value.properties)
      return fromSchemaArray(patternId, objects)
    } else return []
  }

  private patternIdsWithoutPrefix(prefix: string): Array<string> {
    const longPrefix = prefix + "/"
    const patternIds = this.getPatternIds()
    const filteredPatternIds = patternIds.filter((patternId) =>
      patternId.startsWith(longPrefix)
    )
    return filteredPatternIds.map((patternId) =>
      patternId.substring(longPrefix.length)
    )
  }

  private eslintPatternIds(): Array<string> {
    // We take all the patterns except those that have slashes because
    // they come from third party plugins
    return this.getPatternIds().filter((e) => !e.includes("/"))
  }

  downloadDocs(
    urlFromPatternId: (patternId: string) => string,
    prefix: string = "",
    rejectOnError: boolean = true
  ) {
    const patterns =
      prefix.length > 0
        ? this.patternIdsWithoutPrefix(prefix)
        : this.eslintPatternIds()
    const promises: Promise<void>[] = patterns.map(async (pattern) => {
      const url: string = urlFromPatternId(pattern)
      const result = await fetch(url)
      if (result.ok) {
        const text = await result.text()
        const filename =
          "docs/description/" +
          patternIdToCodacy((prefix.length > 0 ? prefix + "/" : "") + pattern) +
          ".md"
        return writeFile(filename, text)
      } else {
        const message = `Failed to retrieve docs for ${pattern} from ${url}`
        if (rejectOnError) return Promise.reject(message)
        else {
          console.log(`${message}. Skipping`)
          Promise.resolve()
        }
      }
    })
    return Promise.all(promises)
  }

  async generateAllPatternsMultipleTest() {
    const patternsFilename = "docs/multiple-tests/all-patterns/patterns.xml"
    const patternsTypescriptFilename = "docs/multiple-tests/all-patterns-typescript/patterns.xml"
    const patternsXml = `<!-- This file is generated by generateDocs. Do not edit. -->
<module name="root">
  <module name="BeforeExecutionExclusionFileFilter">
    <property name="fileNamePattern" value=".*\.json" />
  </module>
${this.rules.map(([patternId, _]) => `  <module name="${patternIdToCodacy(patternId)}" />`).join("\n")}
</module>
`
    await writeFile(patternsFilename, patternsXml)
    await writeFile(patternsTypescriptFilename, patternsXml)
  }
}

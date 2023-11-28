import {
  DescriptionEntry,
  DescriptionParameter,
  ParameterSpec,
  PatternSpec,
  Specification,
  writeFile
} from "codacy-seed"
import { Rule } from "eslint"
import { JSONSchema4 } from "json-schema"
import { flatMapDeep } from "lodash"
import fetch from "node-fetch"
import { capitalize, patternTitle } from "./docGeneratorStringUtils"
import { translateCategory, translateLevel, patternIdToCodacy } from "./model/patterns"
import { fromSchemaArray } from "./namedParameters"
import { rulesToUnnamedParametersDefaults } from "./rulesToUnnamedParametersDefaults"
import { toolName, toolVersion } from "./toolMetadata"

export class DocGenerator {
  private readonly rules: [string, Rule.RuleModule][]

  constructor(rules: [string, Rule.RuleModule][]) {
    // initialize rules without deprecated
    this.rules = rules.filter(([_, rule]) => !rule?.meta?.deprecated || rule.meta.deprecated !== true)
    
    /* console.log(this.rules.forEach(([name, rule]) => {
      if ((!rule.meta?.deprecated || rule.meta.deprecated !== true) && rule.meta?.type === undefined && rule.meta?.docs?.category !== undefined) {
        console.log(name)
        console.log(rule)
      }
    }))*/

  }

  private getPatternIds() {
    return this.rules.map(([patternId, _]) => patternId)
  }

  private generateParameters(
    patternId: string,
    schema: JSONSchema4 | JSONSchema4[] | undefined
  ): ParameterSpec[] | undefined {
    const unnamedParameterValue = rulesToUnnamedParametersDefaults.get(patternId)
    const unnamedParameter = unnamedParameterValue
      ? new ParameterSpec("unnamedParam", unnamedParameterValue)
      : undefined

    const namedParameters = schema
      ? this.fromEslintSchemaToParameters(patternId, schema)
      : undefined

    if (namedParameters && unnamedParameter)
      return [unnamedParameter, ...namedParameters]
    if (namedParameters)
      return namedParameters
    if (unnamedParameter)
      return [unnamedParameter]
    
    return undefined
  }

  generatePatterns(): Specification {
    const patterns = this.rules.flatMap(([patternId, ruleModule]) => {
      const meta = ruleModule?.meta
      const type = meta?.type ? meta.type : meta?.docs?.category
      const [category, subcategory] = translateCategory(
        patternId,
        type
      )

      return new PatternSpec(
        patternIdToCodacy(patternId),
        translateLevel(type),
        category,
        subcategory,
        this.generateParameters(patternId, meta?.schema),
        meta?.docs?.recommended === true
      )
    })

    return new Specification(toolName, toolVersion, patterns)
  }

  generateDescriptionEntries(): DescriptionEntry[] {
    const descriptions = this.rules.flatMap(([patternId, ruleModule]) => {
      const meta = ruleModule?.meta
      const description = meta?.docs?.description
        ? capitalize(meta.docs.description)
        : undefined
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
        patternTitle(patternId),
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
    const anyOfToArray = (schema: JSONSchema4) => (schema.anyOf ? schema.anyOf : [schema])
    const flattenSchema = flatMapDeep(schema, anyOfToArray) as JSONSchema4[]
    const objects = flattenSchema.filter((value) => value && value.properties)
  
    return Array.isArray(objects) ? fromSchemaArray(patternId, objects) : []
  }

  private patternIdsWithoutPrefix(prefix: string): Array<string> {
    const longPrefix = prefix + "/"
    const patternIds = this.getPatternIds()

    return patternIds
      .filter((patternId) => patternId.startsWith(longPrefix))
      .map((patternId) => patternId.substring(longPrefix.length))
  }

  private eslintPatternIds(): Array<string> {
    // We take all the patterns except those that have slashes because
    // they come from third party plugins
    return this.getPatternIds().filter((e) => !e.includes("/"))
  }

  private async inlineLinkedMarkdownFiles(text: string, baseUrl: string): Promise<string> {
    let newText = text
    const elements = text.match(/\[.*?\)/g)
  
    if (!elements) {
      return newText
    }
  
    await Promise.all(elements.map(async (elem) => {
      const urlMatch = elem.match(/\((\.\.\/.*?\.md)\)/)
  
      if (!urlMatch) {
        return
      }
  
      const fullUrl = `${baseUrl}${urlMatch[1]}`
  
      try {
        const response = await fetch(fullUrl)
  
        if (!response.ok) {
          console.error(`Failed to fetch ${fullUrl}. Status: ${response.status}`)
          return
        }
  
        const content = await response.text()
        newText = newText.replace(elem, `\n\n${content}`)
      } catch (error) {
        console.error(`Error fetching ${fullUrl}: ${error.message}`)
      }
    }))
  
    return newText
  }

  downloadDocs(
    baseUrl: string,
    prefix: string = "",
    rejectOnError: boolean = true,
    patternIdModifier: (patternId: string) => string = s => s
  ): Promise<void[]> {
    const patterns =
      prefix.length > 0
        ? this.patternIdsWithoutPrefix(prefix)
        : this.eslintPatternIds()
  
    const promises: Promise<void>[] = patterns.map(async (pattern) => {
      const url: string = `${baseUrl}${patternIdModifier(pattern)}.md`

      try {
        const message = `Failed to retrieve docs for ${pattern} from ${url}`
        const response = await fetch(url)
  
        if (!response.ok) {
          if (rejectOnError) {
            throw new Error(message)
          }
          console.log(`${message}. Skipping`)
          return
        }
  
        const content = await response.text()
        const text = await this.inlineLinkedMarkdownFiles(content, baseUrl)
        const filename =
          "docs/description/" +
          patternIdToCodacy((prefix.length > 0 ? prefix + "/" : "") + pattern) +
          ".md"
  
        await writeFile(filename, text)
      } catch (error) {
        if (rejectOnError) {
          return Promise.reject(`${error.message}`)
        }
        console.error(`${error.message}`)
      }
    })
  
    return Promise.all(promises)
  }

  async generateAllPatternsMultipleTest() {
    const patternsFilename = "docs/multiple-tests/all-patterns/patterns.xml"
    const patternsTypescriptFilename =
      "docs/multiple-tests/all-patterns-typescript/patterns.xml"
    const patternsXml = `<!-- This file is generated by generateDocs. Do not edit. -->
<module name="root">
  <module name="BeforeExecutionExclusionFileFilter">
    <property name="fileNamePattern" value=".*\\.json" />
  </module>
    ${this.rules
      .map(
        ([patternId, _]) => `  <module name="${patternIdToCodacy(patternId)}" />`
      )
      .join("\n")}
</module>
`
    await Promise.all([
      writeFile(patternsFilename, patternsXml),
      writeFile(patternsTypescriptFilename, patternsXml)
    ])
  }
}

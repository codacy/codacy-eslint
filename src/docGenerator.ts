import axios from "axios"
import {
  DescriptionEntry,
  DescriptionParameter,
  ParameterSpec,
  PatternSpec,
  Specification,
  writeFile
} from "codacy-seed"
import { Rule } from "eslint"
import { RuleInfo } from "@eslint-stylistic/metadata"
import fs from "fs-extra"
import { JSONSchema4 } from "json-schema"
import { flatMapDeep } from "lodash"

import { isBlacklistedOnlyFromDocumentation } from "./blacklist"
import { capitalize, patternTitle } from "./docGeneratorStringUtils"
import { translateLevelAndCategory, patternIdToCodacy } from "./model/patterns"
import { fromSchemaArray } from "./namedParameters"
import { rulesToUnnamedParametersDefaults } from "./rulesToUnnamedParametersDefaults"
import { toolName, toolVersion } from "./toolMetadata"

export class DocGenerator {
  private readonly rules: [string, Rule.RuleModule][]
  private githubBaseUrl = "https://raw.githubusercontent.com"
  private docsDirectory = "docs/description/"

  constructor(rules: [string, Rule.RuleModule][]) {
    // initialize rules without blacklisted and deprecated
    this.rules = rules.filter(
      ([patternId, rule]) =>
        !isBlacklistedOnlyFromDocumentation(patternId)
        && !(rule?.meta?.deprecated && rule.meta.deprecated === true)
    )
    this.emptyDocsFolder()
  }
 
  private async emptyDocsFolder(): Promise<void> {
    console.log("Empty docs folder")
    try {
      await fs.emptyDir(this.docsDirectory)
    } catch (err) {
      console.error(err)
    } 
  }

  private getPatternIds(): string[] {
    return this.rules.map(([patternId, ]) => patternId)
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
      const [level, category, subcategory] = translateLevelAndCategory(
        patternId,
        type
      )

      return new PatternSpec(
        patternIdToCodacy(patternId),
        level,
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

  private patternIdsWithoutPrefix(prefix: string): string[] {
    const longPrefix = prefix + "/"

    return this
      .getPatternIds()
      .filter((patternId) => patternId.startsWith(longPrefix))
      .map((patternId) => patternId.substring(longPrefix.length))
  }

  private eslintPatternIds(): string[] {
    // We take all the patterns except those that have slashes because
    // they come from third party plugins
    return this.getPatternIds().filter((e) => !e.includes("/"))
  }

  private convertFromGithubRawLink(url: string): string {
    const parsedUrl = new URL(url)
    parsedUrl.host = 'github.com'

    let parts = parsedUrl.pathname.split('/')
    parts.splice(3, 0, 'tree')
    parsedUrl.pathname = parts.join('/')
    
    return parsedUrl.toString()
  }

  private inlineLinkedMarkdownFiles(text: string, relativeUrl: string): string {
    const elements = text.match(/\[.+?\]\(\.{1,2}[^\)]+?\.md\)/g)
    if (!elements) return text
  
    let newText = text

    elements.map(async (elem) => {
      const urlMatch = elem.match(/\((.+?\.md)\)/)
      if (!urlMatch) return
  
      const fullUrl = this.convertFromGithubRawLink(relativeUrl + urlMatch[1])
      newText = newText.replace(urlMatch[1], fullUrl)
    })

    return newText
  }

  async createDescriptionFile(url: URL, relativeUrl: string, prefix: string, pattern: string) {
    const response = await axios.get(url.href)
    const text = this.inlineLinkedMarkdownFiles(response.data, relativeUrl)
    const filename =
      this.docsDirectory +
      patternIdToCodacy((prefix.length > 0 ? prefix + "/" : "") + pattern) +
      ".md"

    await writeFile(filename, text)
  }

  downloadDocs(
    relativeUrl: string,
    prefix: string,
    rejectOnError: boolean = false
  ): Promise<void[]> {
    console.log("Generate " + (prefix.length > 0? prefix : "eslint") + " description files")
    
    relativeUrl = (!relativeUrl.startsWith("https://") ? this.githubBaseUrl : "") + relativeUrl

    const patterns =
      prefix.length > 0
        ? this.patternIdsWithoutPrefix(prefix)
        : this.eslintPatternIds()


    if (prefix === "@stylistic") {
      const promises: Promise<void>[] = require("@eslint-stylistic/metadata").rules
        .filter((rule: RuleInfo) => rule.ruleId.match(/^\@stylistic\/[^\/]+$/) !== null)
        .map(async (rule: RuleInfo) => {
          const url = new URL(relativeUrl + rule.docsEntry)
          try {
            this.createDescriptionFile(url, relativeUrl, prefix, rule.name)
          } catch (error) {
            const message = `Failed to retrieve docs for ${rule.ruleId} from ${relativeUrl}${rule.docsEntry}`
            if (rejectOnError) {
              return Promise.reject(message)
            }
            console.error(message)
          }
      })
      return Promise.all(promises)
    }

    const promises: Promise<void>[] = patterns.map(async (pattern: string) => {
      const url = new URL(relativeUrl + pattern + ".md")
      try {
        this.createDescriptionFile(url, relativeUrl, prefix, pattern)
      } catch (error) {
        const message = `Failed to retrieve docs for ${pattern} from ${relativeUrl}${pattern}.md`
        if (rejectOnError) {
          return Promise.reject(message)
        }
        //console.error(message)
      }
    })
    return Promise.all(promises)
  }

  async generateAllPatternsMultipleTest() {
    console.log("Generate all-patterns multiple-test patterns.xml")

    const modules = this
      .getPatternIds()
      .map(patternId => `  <module name="${patternIdToCodacy(patternId)}" />`)
      .join("\n")

    const patternsFilename = "docs/multiple-tests/all-patterns/patterns.xml"
    const patternsTypescriptFilename =
      "docs/multiple-tests/all-patterns-typescript/patterns.xml"
    const patternsXml = `<!-- This file is generated by generateDocs. Do not edit. -->
<module name="root">
  <module name="BeforeExecutionExclusionFileFilter">
    <property name="fileNamePattern" value=".*\\.json" />
  </module>
${modules}
</module>
`
    await Promise.all([
      writeFile(patternsFilename, patternsXml),
      writeFile(patternsTypescriptFilename, patternsXml)
    ])
  }
}

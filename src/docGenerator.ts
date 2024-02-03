import {EOL} from "node:os"

import {RuleInfo, rules as rulesStylistic} from "@eslint-stylistic/metadata"
import axios from "axios"
import {
  DescriptionEntry,
  DescriptionParameter,
  ParameterSpec,
  PatternSpec,
  Specification,
  writeFile
} from "codacy-seed"
import {Rule} from "eslint"
import fs from "fs-extra"
import {JSONSchema4} from "json-schema"
import {flatMapDeep} from "lodash"
import path from "path"

import {isBlacklistedOnlyFromDocumentation} from "./blacklist"
import {capitalize, patternTitle} from "./docGeneratorStringUtils"
import {allRules} from "./eslintPlugins"
import {patternIdToCodacy, translateLevelAndCategory} from "./model/patterns"
import {fromSchemaArray} from "./namedParameters"
import {rulesToUnnamedParametersDefaults} from "./rulesToUnnamedParametersDefaults"
import {toolName, toolVersion} from "./toolMetadata"

export class DocGenerator {
  private rules: [string, Rule.RuleModule][]

  private githubBaseUrl = "https://raw.githubusercontent.com"

  private docsDirectory = "docs"

  private docsDescriptionDirectory = path.join(this.docsDirectory, "description")

  constructor () {
    this.initializeRules()
  }
 
  private initializeRules (): void {
    // initialize rules without blacklisted and deprecated
    this.rules = allRules
      .filter(([patternId, rule]) =>
        !isBlacklistedOnlyFromDocumentation(patternId)
        && !(rule?.meta?.deprecated && rule.meta.deprecated === true)
      )
    console.log("Number of rules: ", this.rules.length)
  }

  private getPatternIds (): string[] {
    return this.rules.map(([patternId ]) => patternId)
  }

  static generateParameters (
    patternId: string,
    schema: JSONSchema4 | JSONSchema4[] | undefined
  ): ParameterSpec[] {
    const unnamedParameterValue = rulesToUnnamedParametersDefaults.get(patternId)
    const unnamedParameter = unnamedParameterValue
      ? new ParameterSpec("unnamedParam", unnamedParameterValue)
      : undefined

    const namedParameters = schema
      ? DocGenerator.fromEslintSchemaToParameters(patternId, schema)
      : undefined

    if (namedParameters && unnamedParameter)
      return [unnamedParameter, ...namedParameters]
    if (namedParameters)
      return namedParameters
    if (unnamedParameter)
      return [unnamedParameter]

    return []
  }

  private generatePatterns (): Specification {
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
        DocGenerator.generateParameters(patternId, meta?.schema),
        this.enablePattern(patternId, meta)
      )
    })

    return new Specification(toolName, toolVersion, patterns)
  }

  private enablePattern (patternId: string, meta: Rule.RuleMetaData): boolean {
    const listPrefix = [
      "@typescript-eslint",
      "eslint-plugin",
      "security",
      "security-node"
    ]
    const prefix = patternId.split("/")[0]
    
    return meta?.docs?.recommended && (prefix === patternId || listPrefix.includes(prefix))
  }

  private generateDescriptionEntries (): DescriptionEntry[] {
    const descriptions: DescriptionEntry[] = []
    this.rules.forEach(([patternId, ruleModule]) => {
      const meta = ruleModule?.meta
      const description = meta?.docs?.description
        ? capitalize(meta.docs.description)
        : undefined
      const timeToFix = 5
      const descriptionParameters = DocGenerator
        .generateParameters(
          patternId,
          meta?.schema
        )
        .map((p) => new DescriptionParameter(p.name, p.name))

      descriptions.push(new DescriptionEntry(
        patternIdToCodacy(patternId),
        patternTitle(patternId),
        description,
        timeToFix,
        descriptionParameters
      ))
    })

    console.log("Number of descriptions: ", descriptions.length)
    return descriptions
  }

  static fromEslintSchemaToParameters (
    patternId: string,
    schema: JSONSchema4 | JSONSchema4[]
  ): ParameterSpec[] {
    const anyOfToArray = (schema: JSONSchema4) => schema.anyOf ? schema.anyOf : [schema]
    const flattenSchema = flatMapDeep(schema, anyOfToArray) as JSONSchema4[]
    const objects = flattenSchema.filter((value) => value && value.properties)
  
    return Array.isArray(objects) ? fromSchemaArray(patternId, objects) : []
  }

  async createPatternDescriptionFile (url: URL, relativeUrl: string, prefix: string, pattern: string, rejectOnError: boolean = false) {
    try {
      const response = await axios.get(url.href)
      const text = this.inlineLinkedMarkdownFiles(response.data, relativeUrl)
      const filename = path.resolve(
        this.docsDescriptionDirectory,
        `${patternIdToCodacy((prefix.length ? prefix + "/" : "") + pattern)}.md`
      )

      await writeFile(filename, text)
    } catch (error) {
      const message = `Failed to retrieve docs for ${pattern} from ${url.pathname}`
      if (rejectOnError) {
        return Promise.reject(message)
      }
      console.error(message)
    }
  }

  async downloadDocs (
    relativeUrl: string,
    prefix: string,
    rejectOnError: boolean = false
  ): Promise<void> {
    console.log(`Generate ${prefix.length ? prefix : "eslint"} description files`)
    
    relativeUrl = (!relativeUrl.startsWith("https://") ? this.githubBaseUrl : "") + relativeUrl

    const patterns = prefix.length
      ? this.patternIdsWithoutPrefix(prefix)
      : this.eslintPatternIds()

    const promises = prefix === "@stylistic"
      ? rulesStylistic
        .filter((rule: RuleInfo) => rule.ruleId.match(/^@stylistic\/[^/]+$/) !== null)
        .map((rule: RuleInfo) => {
          const url = new URL(relativeUrl + rule.docsEntry)
          return this.createPatternDescriptionFile(url, relativeUrl, prefix, rule.name, rejectOnError)
        })
      : patterns.map((pattern: string) => {
        const url = new URL(relativeUrl + pattern + ".md")
        return this.createPatternDescriptionFile(url, relativeUrl, prefix, pattern, rejectOnError)
      })
    await Promise.all(promises)
  }

  async createDescriptionFile (): Promise<void> {
    console.log("Generate description.json")
    const descriptions = this.generateDescriptionEntries()

    if (!descriptions.length) return
    
    await this.emptyDocsDescriptionFolder()
    await this.writeFileInJson(
      path.resolve(this.docsDescriptionDirectory, "description.json"),
      descriptions
    )
  }

  async createPatternsFile (): Promise<void> {
    console.log("Generate patterns.json")
    const patterns = this.generatePatterns()

    if (!patterns.patterns.length) return

    await this.writeFileInJson(
      path.resolve(this.docsDirectory, "patterns.json"),
      patterns
    )
  }

  async createAllPatternsMultipleTestFiles (): Promise<void> {
    console.log("Generate patterns.xml")

    const modules = this.getPatternIds()
      .map(patternId => `  <module name="${patternIdToCodacy(patternId)}" />`)
      .join("\n")

    const patternsJSFilename = path.resolve(this.docsDirectory, "multiple-tests", "all-patterns", "patterns.xml")
    const patternsTSFilename = path.resolve(this.docsDirectory, "multiple-tests", "all-patterns-typescript", "patterns.xml")
    const patternsXml = `<!-- This file is generated by generateDocs. Do not edit. -->
<module name="root">
  <module name="BeforeExecutionExclusionFileFilter">
    <property name="fileNamePattern" value=".*\\.json" />
  </module>
${modules}
</module>
`
    await Promise.all([
      writeFile(patternsJSFilename, patternsXml),
      writeFile(patternsTSFilename, patternsXml)
    ])
  }

  private patternIdsWithoutPrefix (prefix: string): string[] {
    const longPrefix = prefix + "/"

    return this
      .getPatternIds()
      .filter((patternId) => patternId.startsWith(longPrefix))
      .map((patternId) => patternId.substring(longPrefix.length))
  }

  private eslintPatternIds (): string[] {
    // We take all the patterns except those that have slashes because
    // they come from third party plugins
    return this.getPatternIds().filter((e) => !e.includes("/"))
  }

  private convertFromGithubRawLink (url: string): string {
    const parsedUrl = new URL(url)
    parsedUrl.host = "github.com"

    const parts = parsedUrl.pathname.split("/")
    parts.splice(3, 0, "tree")
    parsedUrl.pathname = parts.join("/")
    
    return parsedUrl.toString()
  }

  private inlineLinkedMarkdownFiles (text: string, relativeUrl: string): string {
    const elements = text.match(/\[.+?\]\(\.{1,2}[^)]+?\.md\)/g)
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

  private async emptyDocsDescriptionFolder (): Promise<void> {
    await fs.emptyDir(this.docsDescriptionDirectory)
  }

  private async writeFileInJson (file: string, json: Specification | DescriptionEntry[]): Promise<void> {
    await writeFile(file, JSON.stringify(json, null, 2) + EOL)
  }
}

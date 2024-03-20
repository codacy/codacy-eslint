import { EOL } from "node:os"

import { RuleInfo, rules as rulesStylistic } from "@eslint-stylistic/metadata"
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
import fs from "fs-extra"
import { JSONSchema4 } from "json-schema"
import { flatMapDeep } from "lodash"
import path from "path"

import { dependencies } from "../package.json"
import { isBlacklistedOnlyFromDocumentation } from "./blacklist"
import { capitalize, patternTitle } from "./docGeneratorStringUtils"
import { allRules, Plugin, pluginByPackageName } from "./eslintPlugins"
import { patternIdToCodacy, translateLevelAndCategory } from "./model/patterns"
import { fromSchemaArray } from "./namedParameters"
import { rulesToUnnamedParametersDefaults } from "./rulesToUnnamedParametersDefaults"
import { toolName, toolVersion } from "./toolMetadata"

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
      const meta = ruleModule.meta
      const type = meta?.type ?? meta?.docs?.category
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
        DocGenerator.isDefaultPattern(patternId, meta)
      )
    })

    return new Specification(toolName, toolVersion, patterns)
  }

  static isDefaultPattern (patternId: string, meta: Rule.RuleMetaData): boolean {
    function prefixSplit (patternId: string): string {
      const p = patternId.split("/")[0]
      return p !== patternId ? p : ""
    }

    // Structure of prefixes:
    // {"prefix": "recommended"} all recommended rules are included
    // {"prefix": "all"} all rules are included
    const defaultPrefixes = [
      { "": "recommended" }, // ESLint core rules don't have a prefix
      { "@stylistic": "recommended" },
      { "@typescript-eslint": "recommended" },
      { "eslint-plugin": "recommended" }
    ]
    const securityPrefixes = [
      { "no-unsanitized": "all" },
      { "security": "recommended" },
      { "security-node": "recommended" },
      { "xss": "all" }
    ]
    const prefixes = [...defaultPrefixes, ...securityPrefixes]
    const prefix = prefixSplit(patternId)

    return prefixes.some((p) => 
      p[prefix] === "all"
      || p[prefix] === "recommended" && meta.docs?.recommended
    )
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

  private convertMdxToMd (text: string): string {
    return text
      .replace(/import {?.*}? from ["'].*["'];?/g, "")
      .replace(/<(\/)?Tabs>/g, "<!--$1tabs-->\n")
      .replace(/<\/TabItem>/g, "")
      .replace(/<TabItem value="(.*)">/g, "#### $1")
      .replace(/{\/\* (.*) \*\/}/g, "<!-- $1 -->")
      .replace(/\n{2,}/g, "\n\n")
  }

  async createPatternDescriptionFile (
    plugin: Plugin,
    pattern: string,
    patternDocFilename: string,
    rejectOnError: boolean
  ) {
    const url = (plugin.versionPrefix !== false
      ? plugin.docsBaseUrl.href.replace(/main|master/, `${plugin.versionPrefix}${dependencies[plugin.packageName].replace("^", "")}`)
      : plugin.docsBaseUrl.href)
      + patternDocFilename
    try {
      const response = await axios.get(url)
      const text = this.inlineLinkedMarkdownFiles(response.data, plugin.docsBaseUrl.href)
      const filePath = `${this.docsDescriptionDirectory}/${patternIdToCodacy((plugin.name !== "eslint" ? plugin.name + "/" : "") + pattern)}.md`

      await writeFile(filePath, plugin.name === "@typescript-eslint" ? this.convertMdxToMd(text) : text)
    } catch (error) {
      const message = `Failed to retrieve docs for ${pattern} from ${url}`
      if (rejectOnError) {
        return Promise.reject(message)
      }
      console.error(message)
    }
  }

  async downloadDocs (
    packageName: string,
    relativeUrl: string,
    versionPrefix: string | boolean = "v",
    rejectOnError: boolean = false
  ): Promise<void> {
    const plugin: Plugin = pluginByPackageName(packageName)

    console.log(`Generate ${plugin.name} description files`)

    plugin.docsBaseUrl = new URL((!relativeUrl.startsWith("https://") ? this.githubBaseUrl : "") + relativeUrl)
    plugin.versionPrefix = versionPrefix

    const patterns = plugin.name !== "eslint"
      ? this.patternIdsWithoutPrefix(plugin.name)
      : this.eslintPatternIds()

    const promises = plugin.name === "@stylistic"
      ? rulesStylistic
        .filter((rule: RuleInfo) => rule.ruleId.match(/^@stylistic\/[^/]+$/) !== null)
        .map((rule: RuleInfo) => {
          return this.createPatternDescriptionFile(plugin, rule.name, rule.docsEntry, rejectOnError)
        })
      : patterns.map((pattern: string) => {
        const patternDocFilename = plugin.name === "@typescript-eslint"
          ? `${pattern}.mdx`
          : `${pattern}.md`
        return this.createPatternDescriptionFile(plugin, pattern, patternDocFilename, rejectOnError)
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

  private inlineLinkedMarkdownFiles (text: string, docsBaseUrl: string): string {
    const elements = text.match(/\[.+?\]\(\.{1,2}[^)]+?\.?[a-z]+\)/g)
    if (!elements) return text
  
    let newText = text

    elements.map(async (elem) => {
      const urlMatch = elem.match(/\((.+?\.?[a-z]+)\)/)
      if (!urlMatch) return
  
      const fullUrl = this.convertFromGithubRawLink(docsBaseUrl + urlMatch[1])
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

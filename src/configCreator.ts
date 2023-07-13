import { Codacyrc, Pattern } from "codacy-seed"
import { ESLint, Linter } from "eslint"
import { cloneDeep, fromPairs, isEmpty, partition } from "lodash"
import { defaultOptions } from "./eslintDefaultOptions"
import { debug, debugWhen, debugEach } from "./logging"
import { patternIdToEslint } from "./model/patterns"
import { toolName } from "./toolMetadata"

function patternsToRules(patterns: Pattern[]): {
  [name: string]: Linter.RuleLevel | Linter.RuleLevelAndOptions
} {
  const pairs = patterns.map((pattern) => {
    const patternId = patternIdToEslint(pattern.patternId)
    if (pattern.parameters) {
      const [unnamedParameters, namedParameters] = partition(
        pattern.parameters,
        (p) => p.name === "unnamedParam"
      )
      const namedOptions = fromPairs(
        namedParameters.map((p) => [p.name, p.value])
      )

      const unnamedOptions = unnamedParameters.map((p) => p.value)

      return [
        patternId,
        isEmpty(namedOptions)
          ? ["error", ...unnamedOptions]
          : ["error", ...unnamedOptions, namedOptions],
      ]
    } else {
      return [patternId, "error"]
    }
  })

  return fromPairs(pairs)
}

async function createOptions(
  codacyInput?: Codacyrc,
  tsConfigFile?: string
): Promise<ESLint.Options> {
  if (codacyInput && codacyInput.tools) {
    const eslintTool = codacyInput.tools.find((tool) => tool.name === toolName)
    if (eslintTool && eslintTool.patterns) {
      debug("[DEBUG] it appears we are going to use our own settings...")
      debug("[DEBUG] read the following " + eslintTool.patterns.length + " patterns to process from .codacyrc:")
      debugEach(eslintTool.patterns)

      const isTypescriptAnalysis =
        codacyInput.files &&
        codacyInput.files.every((f) => f.endsWith(".ts") || f.endsWith(".tsx"))

      debugWhen(<any>isTypescriptAnalysis, "[DEBUG] the project appears to be typescript")

      // typescript patterns require a typescript parser which will fail for different file types
      // so we are removing typescript patterns when analysing different file types
      const patterns = isTypescriptAnalysis
        ? eslintTool.patterns
        : eslintTool.patterns.filter(
            (p) => !p.patternId.startsWith("@typescript-eslint")
          )

      // There are some plugins that their rules should only apply for
      // some specific file types / files names. So when those are enabled
      // explicitly we need to apply them with a bit of customization.
      //
      //   example: a rule for the storybook should only apply to files with
      //            "story" or "stories" in the name. If enabled for all files it
      //            reports false positives on normal files.
      //            check: conf file @ eslint-plugin-storybook/configs/recommended.js
      const [storybookPatterns, otherPatterns] = partition(patterns, (p) =>
        p.patternId.startsWith("storybook")
      )

      debugWhen(storybookPatterns.length > 0, "[DEBUG] we have plugins to apply only to some file extensions")

      const result = cloneDeep(defaultOptions)
      if (result.baseConfig) {
        // remove extends and overrides from our default config.
        result.baseConfig.extends = []
        if (!result.baseConfig.overrides) {
          result.baseConfig.overrides = []
        } else {
          result.baseConfig.overrides?.forEach(
            (override: any) => (override.extends = [])
          )
        }

        // explicitly use only the rules being passed by codacyrc
        result.baseConfig.rules = patternsToRules(otherPatterns)

        // configure overrides in case of typescript code
        if (tsConfigFile) {
          if (!result.baseConfig.overrides[0].parserOptions) {
            result.baseConfig.overrides[0].parserOptions = []
          }

          if (!result.baseConfig.overrides[0].parserOptions.project) {
            result.baseConfig.overrides[0].parserOptions.project = tsConfigFile
          }
        }

        // configure override in case storybook plugin rules being turned on
        if (!isEmpty(storybookPatterns)) {
          result.baseConfig.overrides.push({
            files: [
              "*.stories.@(ts|tsx|js|jsx|mjs|cjs)",
              "*.story.@(ts|tsx|js|jsx|mjs|cjs)",
            ],
            rules: patternsToRules(storybookPatterns),
          })
        }
      }
      // TODO: review this flag
      result.useEslintrc = false
      return result
    }
  }
  return {}
}

export async function configCreator(
  codacyInput?: Codacyrc,
  tsConfigFile?: string
): Promise<[ESLint.Options, string[]]> {
  const options = createOptions(codacyInput, tsConfigFile)
  const files = codacyInput && codacyInput.files ? codacyInput.files : []
  return [await options, files]
}

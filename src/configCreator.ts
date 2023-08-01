import { Codacyrc, Pattern } from "codacy-seed"
import { ESLint, Linter } from "eslint"
import { cloneDeep, fromPairs, isEmpty, partition, toPairs } from "lodash"
import { defaultOptions } from "./eslintDefaultOptions"
import { debug, debugWhen } from "./logging"
import { patternIdToEslint } from "./model/patterns"
import { toolName } from "./toolMetadata"

function patternsToRules(patterns: Pattern[]): {
  [name: string]: Linter.RuleLevel | Linter.RuleLevelAndOptions
} {
  const pairs = patterns.map((pattern: Pattern) => {
    const patternId = patternIdToEslint(pattern.patternId)
    if (!pattern.parameters) {
      return [patternId, "error"]
    }

    const [unnamedParameters, namedParameters] = partition(
      pattern.parameters,
      (p) => p.name === "unnamedParam"
    )
    const namedOptions = fromPairs(namedParameters.map((p) => [p.name, p.value]))
    const unnamedOptions = unnamedParameters.map((p) => p.value)

    return [
      patternId,
      isEmpty(namedOptions)
        ? ["error", ...unnamedOptions]
        : ["error", ...unnamedOptions, namedOptions]
    ]
  })

  return fromPairs(pairs)
}

async function createOptions(
  codacyInput?: Codacyrc,
  tsConfigFile?: string
): Promise<ESLint.Options> {
  if (!process.env.DEBUG && !codacyInput?.tools) {
    return {}
  }

  const eslintTool = codacyInput?.tools?.find((tool) => tool.name === toolName)

  if (!process.env.DEBUG && !eslintTool?.patterns) {
    return {}
  }

  debugWhen(!codacyInput, "it appears we are going to use our own settings...")
    
  if (!isEmpty(eslintTool?.patterns)) {
    debug("read the following " + eslintTool?.patterns.length + " patterns to process:")
    eslintTool?.patterns.forEach((pattern: Pattern) => {
      debug(pattern.patternId)
    })
  }

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

    // configure overrides in case of typescript code
    if (tsConfigFile) {
      if (!result.baseConfig.overrides[0].parserOptions) {
        result.baseConfig.overrides[0].parserOptions = []
      }

      if (!result.baseConfig.overrides[0].parserOptions.project) {
        result.baseConfig.overrides[0].parserOptions.project = tsConfigFile
      }
    }

    // There are some plugins that their rules should only apply for
    // some specific file types / files names. So when those are enabled
    // explicitly we need to apply them with a bit of customization.
    //
    //   example: a rule for the storybook should only apply to files with
    //            "story" or "stories" in the name. If enabled for all files it
    //            reports false positives on normal files.
    //            check: conf file @ eslint-plugin-storybook/configs/recommended.js
    if (eslintTool?.patterns.length > 0) {
      const [storybookPatterns, otherPatterns] = partition(eslintTool.patterns, (p: Pattern) =>
        p.patternId.startsWith("storybook")
      )

      // configure override in case storybook plugin rules being turned on
      if (storybookPatterns.length > 0) {
        debug("we have plugins to apply only to some file extensions")
        result.baseConfig.overrides.push({
          files: [
            "*.stories.@(ts|tsx|js|jsx|mjs|cjs)",
            "*.story.@(ts|tsx|js|jsx|mjs|cjs)",
          ],
          rules: patternsToRules(storybookPatterns),
        })
      }
      // explicitly use only the rules being passed by codacyrc overriding any others
      result.overrideConfig = {
        rules: patternsToRules(otherPatterns)
      }
    }
  }
  result.useEslintrc = false
  result.errorOnUnmatchedPattern = false

  return result
}

export async function configCreator(
  codacyInput?: Codacyrc,
  tsConfigFile?: string
): Promise<[ESLint.Options, string[]]> {
  const options = createOptions(codacyInput, tsConfigFile)
  const files = codacyInput?.files
  return [await options, files]
}

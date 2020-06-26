import { Codacyrc, Pattern } from "codacy-seed"
import { CLIEngine, Linter } from "eslint"
import { cloneDeep, fromPairs, isEmpty, partition } from "lodash"

import { defaultOptions } from "./eslintDefaultOptions"
import { patternIdToEslint } from "./model/patterns"
import { rulesToUnnamedParametersDefaults } from "./rulesToUnnamedParametersDefaults"
import { toolName } from "./toolMetadata"

function patternsToRules(
  patterns: Pattern[]
): { [name: string]: Linter.RuleLevel | Linter.RuleLevelAndOptions } {
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

      // add default value if it is defined and not passed on the configuration
      const unnamedOptions =
        unnamedParameters.length === 0 &&
        rulesToUnnamedParametersDefaults.has(patternId)
          ? [rulesToUnnamedParametersDefaults.get(patternId)]
          : unnamedParameters.map((p) => p.value)

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
): Promise<CLIEngine.Options> {
  if (codacyInput && codacyInput.tools) {
    const eslintTool = codacyInput.tools.find((tool) => tool.name === toolName)
    if (eslintTool && eslintTool.patterns) {
      const isTypescriptAnalysis =
        codacyInput.files &&
        codacyInput.files.every((f) => f.endsWith(".ts") || f.endsWith(".tsx"))

      // typescript patterns require a typescript parser which will fail for different file types
      // so we are removing typescript patterns when analysing different file types
      const patterns = isTypescriptAnalysis
        ? eslintTool.patterns
        : eslintTool.patterns.filter(
            (p) => !p.patternId.startsWith("@typescript-eslint")
          )

      const result = cloneDeep(defaultOptions)
      if (result.baseConfig) {
        result.baseConfig.extends = []
        result.baseConfig.overrides.forEach(
          (override: any) => (override.extends = [])
        )
        result.baseConfig.rules = patternsToRules(patterns)
        if (tsConfigFile) {
          result.baseConfig.overrides[0].parserOptions = {
            project: tsConfigFile,
          }
        }
      }
      result.useEslintrc = false
      return result
    }
  }
  return {}
}

export async function configCreator(
  codacyInput?: Codacyrc,
  tsConfigFile?: string
): Promise<[CLIEngine.Options, string[]]> {
  const options = createOptions(codacyInput, tsConfigFile)
  const files = codacyInput && codacyInput.files ? codacyInput.files : []
  return [await options, files]
}

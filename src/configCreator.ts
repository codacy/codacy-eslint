import { CLIEngine, Linter } from "eslint"
import { defaultOptions } from "./eslintDefaultOptions"
import { Codacyrc, Pattern, ParameterValue } from "./model/CodacyInput"
import { toolName } from "./toolMetadata"
import { patternIdToEslint } from "./model/Patterns"
import { cloneDeep, isEmpty, partition, fromPairs } from "lodash"

function patternsToRules(
  patterns: Pattern[]
): { [name: string]: Linter.RuleLevel | Linter.RuleLevelAndOptions } {
  let pairs = patterns.map(pattern => {
    let patternId = patternIdToEslint(pattern.patternId)
    if (pattern.parameters) {
      let [unnamedParameters, namedParameters] = partition(
        pattern.parameters,
        p => p.name === "unnamedParam"
      )
      let namedOptions = fromPairs(namedParameters.map(p => [p.name, p.value]))
      let unnamedOptions = unnamedParameters.map(p => p.value)
      return [
        patternId,
        isEmpty(namedOptions)
          ? ["error", ...unnamedOptions]
          : ["error", ...unnamedOptions, namedOptions]
      ]
    } else {
      return [patternId, "error"]
    }
  })

  return fromPairs(pairs)
}

function createOptions(codacyInput?: Codacyrc): CLIEngine.Options {
  if (codacyInput && codacyInput.tools) {
    let eslintTool = codacyInput.tools.find(tool => tool.name === toolName)
    if (eslintTool) {
      let patterns = eslintTool.patterns
      let result = cloneDeep(defaultOptions)
      if (result.baseConfig) {
        result.baseConfig.extends = [] // TODO: Maintain base configurations without rules
        result.baseConfig.overrides.extends = []
        result.baseConfig.rules = patternsToRules(patterns)
      }
      result.useEslintrc = false
      return result
    }
  }
  return defaultOptions
}

export function configCreator(
  codacyInput?: Codacyrc
): [CLIEngine.Options, string[]?] {
  let options = createOptions(codacyInput)
  let files = codacyInput && codacyInput.files ? codacyInput.files : undefined
  return [options, files]
}

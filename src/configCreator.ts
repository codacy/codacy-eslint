import { CLIEngine, Linter } from "eslint"
import { defaultOptions } from "./eslintDefaultOptions"
import { Codacyrc, Pattern } from "./model/CodacyInput"
import { toolName } from "./toolMetadata"
import { patternIdToEslint } from "./model/Patterns"
import { cloneDeep, flatten } from "lodash"

function patternsToRules(
  patterns: Pattern[]
): { [name: string]: Linter.RuleLevel | Linter.RuleLevelAndOptions } {
  let result: {
    [name: string]: Linter.RuleLevel | Linter.RuleLevelAndOptions
  } = {}
  patterns.forEach(pattern => {
    let patternId = patternIdToEslint(pattern.patternId)
    if (pattern.parameters) {
      let options = pattern.parameters.map(p => p.value)
      result[patternId] = ["error", ...options]
    } else {
      result[patternId] = "error"
    }
  })
  return result
}

function createOptions(codacyInput?: Codacyrc): CLIEngine.Options {
  if (codacyInput && codacyInput.tools) {
    let eslintTool = codacyInput.tools.find(tool => tool.name === toolName)
    if (eslintTool) {
      let patterns = eslintTool.patterns
      let result = cloneDeep(defaultOptions)
      if(result.baseConfig) {
        result.baseConfig.extends = [] // TODO: Maintain base configurations without rules
        result.baseConfig.overrides.extends = []
        result.baseConfig.rules = patternsToRules(patterns)
      }
      result.useEslintrc = false
      // console.error(result)
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

import { CLIEngine, Linter } from "eslint"
import { defaultOptions } from "./eslintDefaultOptions"
import { Codacyrc, Pattern } from "./model/CodacyInput"
import { toolName } from "./toolMetadata"
import { patternIdToEslint } from "./model/Patterns"
import { cloneDeep, isEmpty, partition, fromPairs } from "lodash"
import { allFilesNames } from "./fileUtils"

function patternsToRules(
  patterns: Pattern[]
): { [name: string]: Linter.RuleLevel | Linter.RuleLevelAndOptions } {
  const pairs = patterns.map(pattern => {
    const patternId = patternIdToEslint(pattern.patternId)
    if (pattern.parameters) {
      const [unnamedParameters, namedParameters] = partition(
        pattern.parameters,
        p => p.name === "unnamedParam"
      )
      const namedOptions = fromPairs(
        namedParameters.map(p => [p.name, p.value])
      )
      const unnamedOptions = unnamedParameters.map(p => p.value)
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

async function createOptions(
  srcDirPath: string,
  codacyInput?: Codacyrc
): Promise<CLIEngine.Options> {
  if (codacyInput && codacyInput.tools) {
    const eslintTool = codacyInput.tools.find(tool => tool.name === toolName)
    if (eslintTool && eslintTool.patterns) {
      const patterns = eslintTool.patterns
      const result = cloneDeep(defaultOptions)
      if (result.baseConfig) {
        result.baseConfig.extends = [] // TODO: Maintain base configurations without rules
        result.baseConfig.overrides.extends = []
        result.baseConfig.rules = patternsToRules(patterns)
      }
      result.useEslintrc = false
      return result
    }
  }
  const fileNames = await allFilesNames(srcDirPath)
  if (fileNames.find(name => name.startsWith(".eslintrc")) !== undefined)
    return {}
  else return defaultOptions
}

export async function configCreator(
  srcDirPath: string,
  codacyInput?: Codacyrc
): Promise<[CLIEngine.Options, string[]?]> {
  const options = createOptions(srcDirPath, codacyInput)
  const files = codacyInput && codacyInput.files ? codacyInput.files : undefined
  return [await options, files]
}

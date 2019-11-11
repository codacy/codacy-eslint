import { Codacyrc, Pattern } from "./model/CodacyInput";
import { CLIEngine, Linter } from "eslint";

export function configCreator(codacyInput?: Codacyrc): [CLIEngine.Options, string[]?] {
  let options = createOptions(codacyInput)
  var files: string[] | undefined = undefined
  if(codacyInput && codacyInput.files) codacyInput.files
  return [options, files]
}

function createOptions(codacyInput?: Codacyrc): CLIEngine.Options {
  let defaultOptions = new CLIEngine.Options

  if (codacyInput && codacyInput.tools) {
    let eslintTool = codacyInput.tools.find(tool => tool.name === "ESLint")
    if (eslintTool) {
      let patterns = eslintTool.patterns
      return {
        rules: patternsToRules(patterns)
      }
    }
  }
  return defaultOptions
}

function patternsToRules(patterns: Pattern[]): { [name: string]: Linter.RuleLevel | Linter.RuleLevelAndOptions } {
  let result: { [name: string]: Linter.RuleLevel | Linter.RuleLevelAndOptions } = {}
  patterns.forEach(pattern => {
    if (pattern.parameters) {
      let options = pattern.parameters.map(p => p.value)
      result[pattern.patternId] = ['error', options]
    } else {
      result[pattern.patternId] = ['error']
    }
  });
  return result
}
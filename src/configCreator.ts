import { Codacyrc, Pattern } from "./model/CodacyInput";
import { CLIEngine, Linter } from "eslint";

export function configCreator(codacyInput?: Codacyrc): [CLIEngine.Options, string[]?] {
  let options = createOptions(codacyInput)
  var files: string[] | undefined = undefined
  if (codacyInput && codacyInput.files) codacyInput.files
  return [options, files]
}

function createOptions(codacyInput?: Codacyrc): CLIEngine.Options {
  let defaultOptions: CLIEngine.Options = {
    baseConfig: {
      plugins: [
        "angular",
        "babel",
        "backbone",
        "compat",
        "chai-friendly",
        "flowtype",
        "html",
        "import",
        "jsx-a11y",
        "lodash",
        "lodash-fp",
        "meteor",
        "mocha",
        "mongodb",
        "no-unsafe-innerhtml",
        "node",
        "promise",
        "react",
        "react-hooks",
        "security",
        "standard",
        "vue",
        "@typescript-eslint",
        "relay"],
      parser: "babel-eslint",
      parserOptions: {
        ecmaFeatures: { "jsx": true },
        ecmaVersion: 2018,
        sourceType: "module"
      },
      overrides: [
        {
          files: ["**/*.ts", "**/*.tsx"],
          env: { browser: true, es6: true, node: true },
          extends: [
            "eslint:recommended",
            "plugin:react/recommended",
            "plugin:@typescript-eslint/eslint-recommended",
            "plugin:@typescript-eslint/recommended"
          ],
          parser: "@typescript-eslint/parser",
          parserOptions: {
            ecmaFeatures: { jsx: true },
            ecmaVersion: 2018,
            sourceType: "module",
            project: "./tsconfig.json"
          },
          plugins: ["react", "@typescript-eslint"],
          settings: { react: { version: "detect" } }
        }
      ]
    }
  }

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
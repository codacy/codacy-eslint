import { Codacyrc, Parameter, ParameterValue, Pattern } from "codacy-seed"
import { ESLint, Linter } from "eslint"
import { existsSync } from "fs-extra"
import { cloneDeep, fromPairs, isEmpty, partition } from "lodash"

import { isBlacklisted } from "./blacklist"
import { defaultOptions } from "./eslintDefaultOptions"
import { debug, DEBUG } from "./logging"
import { patternIdToEslint } from "./model/patterns"
import { toolName } from "./toolMetadata"

export function createEslintConfig(
  srcDirPath: string,
  codacyrc?: Codacyrc
): [ESLint.Options, string[]] {
  debug("config: creating")

  const defaultFilesToAnalyze = [
    `${srcDirPath}/**/*.ts`,
    `${srcDirPath}/**/*.tsx`,
    `${srcDirPath}/**/*.js`,
    `${srcDirPath}/**/*.jsx`,
    `${srcDirPath}/**/*.json`
  ]

  const useGenerateEslintOptions = !isEslintrcConfigPresent(srcDirPath) && (codacyrc?.tools?.[0]?.patterns?.length !== 0 || DEBUG)
  const useDefaultFilesToAnalyze = !(codacyrc?.files?.length !== 0)

  const options = useGenerateEslintOptions ? generateEslintOptions(srcDirPath, codacyrc) : {}
  const files = useDefaultFilesToAnalyze ? defaultFilesToAnalyze : codacyrc.files

  debug("config: finished")
  return [options, files]
}

function generateEslintOptions(
  srcDirPath: string,
  codacyrc: Codacyrc,
): ESLint.Options {
  debug("options: creating")
  
  const tsconfigFile = "tsconfig.json"
  const eslintTool = codacyrc?.tools?.[0]

  if (DEBUG && eslintTool?.patterns) {
    debug("options: " + eslintTool.patterns.length + " patterns to process")
    for (const pattern of eslintTool.patterns) {
      debug("- " + pattern.patternId)
    }
  }

  let options = cloneDeep(defaultOptions)

  if (!existsSync(srcDirPath + "/" + tsconfigFile)) {
    debug("options: use tsconfig from tool")
    options.baseConfig.overrides[0].parserOptions.project = "/" + tsconfigFile
  }

  if (eslintTool?.patterns?.length) {
    //TODO: move this logic to a generic (or specific) plugin function

    // There are some plugins that their rules should only apply for
    // some specific file types / files names. So when those are enabled
    // explicitly we need to apply them with a bit of customization.
    //
    //   example: a rule for the storybook should only apply to files with
    //            "story" or "stories" in the name. If enabled for all files it
    //            reports false positives on normal files.
    //            check: conf file @ eslint-plugin-storybook/configs/recommended.js

    const [storybookPatterns, otherPatterns] = partition(eslintTool?.patterns, (p: Pattern) =>
      p.patternId.startsWith("storybook")
    )

    // configure override in case storybook plugin rules being turned on
    if (storybookPatterns.length) {
      debug("options: setting " + storybookPatterns.length + " storybook patterns")
      options.baseConfig.overrides.push({
        files: [
          "*.stories.@(ts|tsx|js|jsx|mjs|cjs)",
          "*.story.@(ts|tsx|js|jsx|mjs|cjs)",
        ],
        rules: convertPatternsToEslintRules(storybookPatterns),
      })
    }

    // explicitly use only the rules being passed by codacyrc
    if (otherPatterns.length) {
      debug("options: setting " + otherPatterns.length + " patterns")
      options.baseConfig.rules = convertPatternsToEslintRules(otherPatterns)
    }
  }
  else if (DEBUG) {
    options.baseConfig.rules = convertPatternsToEslintRules(retrieveAllCodacyPatterns())
  }
  options.cwd = srcDirPath
  options.errorOnUnmatchedPattern = false
  options.resolvePluginsRelativeTo = "/"
  options.useEslintrc = (eslintTool?.patterns?.length === 0)

  debug("options: finished")
  return options
}

function convertPatternsToEslintRules(patterns: Pattern[]): {
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

function isEslintrcConfigPresent(srcDirPath: string): boolean {
  debug("options: check if configuration file exists in " + srcDirPath)

  const confFilenames = [
    ".eslintrc",
    ".eslintrc.js",
    ".eslintrc.cjs",
    ".eslintrc.yaml",
    ".eslintrc.yml",
    ".eslintrc.json"
  ]

  for (const filename of confFilenames) {
    if (existsSync(srcDirPath + "/" + filename)) {
      debug("options: found - \"" + filename + "\"")
      return true
    }
  }

  debug("options: not found")
  return false
}

function retrieveAllCodacyPatterns(): Pattern[] {
  debug("options: getting all patterns")

  const patterns = []

  const allPatterns = require("../docs/patterns.json")

  if (!allPatterns.patterns) return patterns
  
  allPatterns.patterns
    .filter((pattern) =>
      !isBlacklisted(pattern.patternId)
      && (!DEBUG || pattern.patternId != "spellcheck_spell-checker")
    )
    .map((pattern: { patternId: string; parameters: any }) => {
      patterns.push(new Pattern(
        pattern.patternId,
        pattern.parameters.map((parameter: { name: string; default: ParameterValue }) => {
          return new Parameter(
            parameter.name,
            parameter.default
          )
        })
      ))
    })

  debug("options: returning " + patterns.length + " patterns")
  return patterns
}

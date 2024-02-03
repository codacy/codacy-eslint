import {Codacyrc, Parameter, ParameterSpec, Pattern} from "codacy-seed"
import {ESLint, Linter} from "eslint"
import {existsSync} from "fs-extra"
import {cloneDeep, fromPairs, isEmpty, partition} from "lodash"
import path from "path"

import {isBlacklisted} from "./blacklist"
import {DocGenerator} from "./docGenerator"
import {defaultOptions} from "./eslintDefaultOptions"
import {allRules} from "./eslintPlugins"
import {DEBUG, debug} from "./logging"
import {patternIdToEslint} from "./model/patterns"

export function createEslintConfig (
  srcDirPath: string,
  codacyrc?: Codacyrc
): [ESLint.Options, string[]] {
  debug("config: creating")

  const options = generateEslintOptions(srcDirPath, codacyrc)
  const files = generateFilesToAnalyze(codacyrc)
  
  debug("config: finished")
  return [options, files]
}

function generateFilesToAnalyze (
  codacyrc?: Codacyrc
): string[] {
  debug("files: creating")
  
  const defaultFilesToAnalyze = [
    "**/*.ts",
    "**/*.tsx",
    "**/*.js",
    "**/*.jsx",
    "**/*.json"
  ]
  const files = codacyrc?.files && codacyrc.files.length 
    ? codacyrc.files
    : defaultFilesToAnalyze

  debug("files: finished")
  return files
}

function generateEslintOptions (
  srcDirPath: string,
  codacyrc?: Codacyrc
): ESLint.Options {
  debug("options: creating")

  const codacyrcEslintTool = codacyrc?.tools?.[0]
  const patterns = codacyrcEslintTool?.patterns && codacyrcEslintTool.patterns.length
    ? codacyrcEslintTool.patterns
    : []
  const useGeneratedOptions = patterns.length || !existsEslintConfigInRepo(srcDirPath)

  debug(`options: ${patterns.length} total patterns in codacyrc`)

  const options = cloneDeep(defaultOptions)
  options.cwd = srcDirPath
  options.errorOnUnmatchedPattern = false
  options.resolvePluginsRelativeTo = "/"
  options.useEslintrc = !useGeneratedOptions

  if (!existsSync(path.resolve(srcDirPath, "tsconfig.json"))) {
    debug("options: use tsconfig from tool")
    options.baseConfig.overrides[0].parserOptions.project = "/tsconfig.json"
  }

  if (useGeneratedOptions && patterns.length) {
    //TODO: move this logic to a generic (or specific) plugin function

    // There are some plugins that their rules should only apply for
    // some specific file types / files names. So when those are enabled
    // explicitly we need to apply them with a bit of customization.
    //
    //   example: a rule for the storybook should only apply to files with
    //            "story" or "stories" in the name. If enabled for all files it
    //            reports false positives on normal files.
    //            check: conf file @ eslint-plugin-storybook/configs/recommended.js

    const [storybookPatterns, otherPatterns] = partition(patterns, (p: Pattern) =>
      p.patternId.startsWith("storybook")
    )

    // configure override in case storybook plugin rules being turned on
    if (storybookPatterns.length) {
      debug(`options: setting ${storybookPatterns.length} storybook patterns`)
      options.baseConfig.overrides.push({
        files: [
          "*.stories.@(ts|tsx|js|jsx|mjs|cjs)",
          "*.story.@(ts|tsx|js|jsx|mjs|cjs)"
        ],
        rules: convertPatternsToEslintRules(storybookPatterns)
      })
    }

    // explicitly use only the rules being passed by codacyrc
    if (otherPatterns.length) {
      debug(`options: setting ${otherPatterns.length} patterns`)
      options.baseConfig.rules = convertPatternsToEslintRules(otherPatterns)
    }
  } else if (DEBUG) {
    const allPatterns = retrieveAllCodacyPatterns()

    debug(`options: setting all ${allPatterns.length} patterns`)
    options.baseConfig.rules = convertPatternsToEslintRules(allPatterns)
  }

  debug("options: finished")
  return options
}

function convertPatternsToEslintRules (patterns: Pattern[]): {
  [name: string]: Linter.RuleLevel | Linter.RuleLevelAndOptions;
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

function existsEslintConfigInRepo (srcDirPath: string): boolean {
  const filenames = [
    ".eslintrc",
    ".eslintrc.js",
    ".eslintrc.cjs",
    ".eslintrc.yaml",
    ".eslintrc.yml",
    ".eslintrc.json"
  ]
  const found = filenames.some(filename => existsSync(path.resolve(srcDirPath, filename)))
  debug(`options: eslintrc config file ${found ? "" : "not "}found`)

  return found
}

function retrieveAllCodacyPatterns (): Pattern[] {
  const patterns = []
  allRules
    .filter(([patternId, rule]) =>
      !isBlacklisted(patternId)
      && !(rule?.meta?.deprecated && rule.meta.deprecated === true)
      // problems with the path generated (win vs nix) for this specific pattern
      && (!DEBUG || patternId != "spellcheck_spell-checker")
    )
    .forEach(([patternId, rule]) => {
      const pattern = new Pattern(
        patternId,
        DocGenerator.generateParameters(patternId, rule.meta?.schema)
          .map((parameterSpec: ParameterSpec): Parameter => {
            return new Parameter(
              parameterSpec.name,
              parameterSpec.default
            )
          })
      )
      patterns.push(pattern)
    })

  debug(`options: returning all (${patterns.length}) patterns`)
  return patterns
}

import { Codacyrc, Parameter, ParameterSpec, Pattern } from "codacy-seed"
import { ESLint, Linter } from "eslint"
import { existsSync } from "fs-extra"
import { cloneDeep, fromPairs, isEmpty, partition } from "lodash"
import path from "path"

import { isBlacklisted } from "./blacklist"
import { DocGenerator } from "./docGenerator"
import { defaultOptions } from "./eslintDefaultOptions"
import { getAllRules, getPluginsName } from "./eslintPlugins"
import { DEBUG, debug } from "./logging"
import { patternIdToEslint } from "./model/patterns"

export async function createEslintConfig (
  srcDirPath: string,
  codacyrc: Codacyrc
): Promise<[ESLint.Options, string[]]> {
  debug("config: creating")

  const options = await generateEslintOptions(srcDirPath, codacyrc)
  const files = generateFilesToAnalyze(codacyrc)

  debug("config: finished")
  return [options, files]
}

function generateFilesToAnalyze (
  codacyrc: Codacyrc
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

async function generateEslintOptions (
  srcDirPath: string,
  codacyrc: Codacyrc
): Promise<ESLint.Options> {
  debug("options: creating")

  let patterns = codacyrc.tools[0].patterns || []
  debug(`options: ${patterns.length} patterns in codacyrc`)

  const existsEslintConfig = existsEslintConfigInRepoRoot(srcDirPath)
  const useCodacyPatterns = patterns.length
  const useRepoPatterns = !useCodacyPatterns
  const baseOptions: ESLint.Options = {
    "cwd": srcDirPath,
    "errorOnUnmatchedPattern": false,
    "useEslintrc": useRepoPatterns
  }

  if (!DEBUG && useRepoPatterns) {
    debug("options: using eslintrc from repo root")
    return baseOptions
  }

  const options: ESLint.Options = Object.assign({}, baseOptions, cloneDeep(defaultOptions))

  if (DEBUG && useRepoPatterns && !existsEslintConfig) {
    const patternsSet = "recommended"
    patterns = await retrieveCodacyPatterns(patternsSet)
    options.baseConfig.rules = convertPatternsToEslintRules(patterns)
    debug(`options: setting ${patternsSet} (${patterns.length}) patterns`)
  } else if (useCodacyPatterns) {
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
        "files": [
          "*.stories.@(ts|tsx|js|jsx|mjs|cjs)",
          "*.story.@(ts|tsx|js|jsx|mjs|cjs)"
        ],
        "rules": convertPatternsToEslintRules(storybookPatterns)
      })
    }

    // explicitly use only the rules being passed by codacyrc
    if (otherPatterns.length) {
      debug(`options: setting ${otherPatterns.length} patterns`)
      options.baseConfig.rules = convertPatternsToEslintRules(otherPatterns)
    }
  }

  // load only the plugins that are being used in loaded rules
  const prefixes = getPatternsUniquePrefixes(patterns)
  prefixes
    .filter((prefix) => prefix !== "")
    .forEach(async (prefix) => {
      (await getPluginsName()).includes(prefix)
        ? options.baseConfig.plugins.push(prefix)
        : debug(`options: plugin ${prefix} not found`)
    })

  debug("options: finished")

  return options
}

function getPatternsUniquePrefixes (patterns: Pattern[]) {
  const prefixes = patterns.map(item => {
    const patternId = patternIdToEslint(item.patternId)
    return patternId.substring(0, patternId.lastIndexOf("/"))
  })
  return [...new Set(prefixes)]
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

function existsEslintConfigInRepoRoot (srcDirPath: string): boolean {
  const filenames = [
    ".eslintrc",
    ".eslintrc.js",
    ".eslintrc.cjs",
    ".eslintrc.yaml",
    ".eslintrc.yml",
    ".eslintrc.json"
  ]
  const found = filenames.some(filename => existsSync(srcDirPath + path.sep + filename))
  debug(`options: eslintrc config file ${found ? "" : "not "}found`)

  return found
}

async function retrieveCodacyPatterns (set: "recommended" | "all" = "recommended"): Promise<Pattern[]> {
  const patterns: Pattern[] = [];
  (await getAllRules())
    .filter(([patternId, rule]) =>
      !isBlacklisted(patternId)
      && !(rule?.meta?.deprecated && rule.meta.deprecated === true)
      // problems with the path generated (win vs nix) for this specific pattern
      && (!DEBUG || patternId != "spellcheck_spell-checker")
      && (set !== "recommended" || DocGenerator.isDefaultPattern(patternIdToEslint(patternId), rule.meta))
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

  debug(`options: returning ${set} (${patterns.length}) patterns`)
  return patterns
}
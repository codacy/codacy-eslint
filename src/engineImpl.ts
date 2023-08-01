import { Codacyrc, Engine, ToolResult } from "codacy-seed"
import { ESLint, Linter } from "eslint"
import { pathExists } from "fs-extra"
import { glob } from "glob"

import { configCreator } from "./configCreator"
import { convertResults } from "./convertResults"
import { debug, debugJson, debugWhen, debugEither } from "./logging"
import { isEmpty } from "lodash"


export const engineImpl: Engine = async function (
  codacyrc?: Codacyrc
): Promise<ToolResult[]> {
  const srcDirPath = "/src"
  const tsconfigFile = "./tsconfig.json"
  const defaultPatterns = [
    srcDirPath + "/**/*.ts",
    srcDirPath + "/**/*.tsx",
    srcDirPath + "/**/*.js",
    srcDirPath + "/**/*.jsx",
    srcDirPath + "/**/*.json"
  ]

  const [options, files] = await configCreator(
    codacyrc,
    (await pathExists(tsconfigFile)) ? tsconfigFile : undefined
  )
  
  const filesToAnalyze = (!isEmpty(files)) ? files : defaultPatterns
  debugWhen(isEmpty(files), "decided to run tool for all files under " + srcDirPath)

  debug("calculated the following eslint config:")
  debugJson(options)
  debug(filesToAnalyze.length + " files (or patterns) to process")

  options.cwd = srcDirPath
  const eslint = new ESLint(options)
  const linter = new Linter(options)

  const eslintResults = await eslint.lintFiles(filesToAnalyze)
  
  //if (process.env.DEBUG) {
    let nIssues = 0
    for (let lintResult of eslintResults) {
      nIssues += lintResult.errorCount + lintResult.warningCount
      debug("config for \"" + lintResult.filePath + "\":\n" + JSON.stringify(await eslint.calculateConfigForFile(lintResult.filePath)))
    }
    debugEither((nIssues > 0), "presenting the results", "no issues found")
  //}

  return convertResults(eslintResults).map((r) => r.relativeTo(srcDirPath))
}

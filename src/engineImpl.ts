import { Codacyrc, Engine, ToolResult } from "codacy-seed"
import { ESLint, Linter } from "eslint"
import { pathExists } from "fs-extra"

import { configCreator } from "./configCreator"
import { convertResults } from "./convertResults"
import {debug, debugEach, debugJson, debugRun, debugWhen} from "./logging"

export const engineImpl: Engine = async function (
  codacyrc?: Codacyrc
): Promise<ToolResult[]> {
  const srcDirPath = "/src"
  const tsconfigFile = "./tsconfig.json"

  const [options, files] = await configCreator(
    codacyrc,
    (await pathExists(tsconfigFile)) ? tsconfigFile : undefined
  )

  debug("codacy: calculated the following eslint config:")
  debugJson(options)
  debug("codacy: read the following " + files.length + " files to process from .codacyrc:")
  debugEach(files)

  options.resolvePluginsRelativeTo = "/"
  options.cwd = srcDirPath

  const filesToAnalyze = files.length > 0 ? files : ["/src/**"]
  debugWhen(!(files.length > 0), `[codacy]: decided to run tool for all files under /src`)

  const eslint = new ESLint(options)
  const linter = new Linter(options)
  const eslintResults = await eslint.lintFiles(filesToAnalyze)

  debugRun(() => {
    files.forEach(file => {
      const configUsedOnSpecificFile = eslint.calculateConfigForFile(file)
      debug("config file: " + file)
      debugJson(configUsedOnSpecificFile)
    })
  })

  const issues = convertResults(eslintResults)
  return issues.map((r) => r.relativeTo(srcDirPath))
}

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

  debug("[DEBUG] calculated the following eslint config:")
  debugJson(options)
  debug("[DEBUG] read the following " + files.length + " files to process from .codacyrc:")
  debugEach(files)

  options.resolvePluginsRelativeTo = "/"
  options.cwd = srcDirPath

  const filesToAnalyze = files.length > 0 ? files : ["/src/**"]
  debugWhen(!(files.length > 0), "[DEBUG] decided to run tool for all files under /src")

  const eslint = new ESLint(options)

  debugRun(() => {
    files.forEach(file => {
      debug("[DEBUG] config for file: " + file)
      debugJson(eslint.calculateConfigForFile(file))
    })
  })

  const eslintResults = await eslint.lintFiles(filesToAnalyze)
  return convertResults(eslintResults).map((r) => r.relativeTo(srcDirPath))
}

import { Codacyrc, Engine, ToolResult } from "codacy-seed"
import { CLIEngine, Linter } from "eslint"
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

  debug("[codacy]: calculated the following eslint config:")
  debugJson(options, o => `[codacy]: ${o}`)
  debug("[codacy]: read the following files to process from .codacyrc:")
  debug(`[codacy]: # files to process: ${files.length}`)
  debugEach(files, file => `[codacy]  |- filename: ${file}`)

  options.resolvePluginsRelativeTo = "/"
  options.cwd = srcDirPath

  const filesToAnalyze = files.length > 0 ? files : ["/src/**"]
  debugWhen(!(files.length > 0), `[codacy]: decided to run tool for all files under /src`)

  const engine = new CLIEngine(options)
  const eslintResults = engine.executeOnFiles(filesToAnalyze)

  debugRun(() => {
    files.forEach(file => {
      const configUsedOnSpecificFile = engine.getConfigForFile(file)

      debugJson(configUsedOnSpecificFile, v => `[codacy] eslint config used for file="${file}":\n${v}`)
    })
  })

  const issues = convertResults(eslintResults)
  return issues.map((r) => r.relativeTo(srcDirPath))
}

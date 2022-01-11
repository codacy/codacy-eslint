import { Codacyrc, Engine, ToolResult } from "codacy-seed"
import { CLIEngine, Linter } from "eslint"
import { pathExists } from "fs-extra"

import { configCreator } from "./configCreator"
import { convertResults } from "./convertResults"

export const engineImpl: Engine = async function (
  codacyrc?: Codacyrc
): Promise<ToolResult[]> {
  const srcDirPath = "/src"
  const tsconfigFile = "./tsconfig.json"

  const [options, files] = await configCreator(
    codacyrc,
    (await pathExists(tsconfigFile)) ? tsconfigFile : undefined
  )

  options.resolvePluginsRelativeTo = "/"
  options.cwd = srcDirPath

  const filesToAnalyze = files.length > 0 ? files : ["/src/**"]

  const engine = new CLIEngine(options)

  const eslintResults = engine.executeOnFiles(filesToAnalyze)

  const issues = convertResults(eslintResults)

  return issues.map((r) => r.relativeTo(srcDirPath))
}

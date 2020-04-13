import { Codacyrc, CodacyResult, Engine } from "codacy-seed"
import { CLIEngine } from "eslint"

import { configCreator } from "./configCreator"
import { convertResults } from "./convertResults"

export const engineImpl: Engine = async function(
  codacyrc?: Codacyrc
): Promise<CodacyResult[]> {
  const srcDirPath = "/src"

  const [options, files] = await configCreator(codacyrc)

  options.resolvePluginsRelativeTo = "/"

  options.cwd = srcDirPath

  const filesToAnalyze = files.length > 0 ? files : ["/src/**"]

  const engine = new CLIEngine(options)

  const eslintResults = engine.executeOnFiles(filesToAnalyze)

  const codacyResults = convertResults(eslintResults)

  return codacyResults.map(r => r.relativeTo(srcDirPath))
}

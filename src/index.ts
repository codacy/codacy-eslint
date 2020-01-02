import { CLIEngine } from "eslint"

import { configCreator } from "./configCreator"
import { convertResults, resultString } from "./convertResults"
import { parseCodacyrcFile, readJsonFile } from "./fileUtils"
import { parseTimeoutMilliseconds } from "./parseTimeoutMilliseconds"

const timeoutHandle = setTimeout(() => {
  console.error("Timeout occurred. Exiting.")
  process.exit(2)
}, parseTimeoutMilliseconds(process.env.TIMEOUT))

async function run() {
  const jsonFile = await readJsonFile("/.codacyrc")

  const codacyrc = jsonFile ? parseCodacyrcFile(jsonFile) : undefined

  const srcDirPath = "/src"

  const [options, files] = await configCreator(codacyrc)

  options.resolvePluginsRelativeTo = "."

  options.cwd = srcDirPath

  const filesToAnalyze = files.length > 0 ? files : ["/src/**"]

  const engine = new CLIEngine(options)

  const eslintResults = engine.executeOnFiles(filesToAnalyze)

  const codacyResults = convertResults(eslintResults)

  const relativeCodacyResults = codacyResults.map(r => r.relativeTo(srcDirPath))

  const lines = resultString(relativeCodacyResults)

  console.log(lines)
}

run()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => clearTimeout(timeoutHandle))

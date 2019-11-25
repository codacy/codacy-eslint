import { CLIEngine } from "eslint"
import { configCreator } from "./configCreator"
import { convertResults, resultString } from "./convertResults"
import { parseCodacyrcFile, readJsonFile } from "./fileUtils"
import { parseTimeoutSeconds } from "./parseTimeoutSeconds"

let timeoutHandle = setTimeout(() => {
  console.error("Timeout occurred. Exiting.")
  process.exit(2)
}, parseTimeoutSeconds(process.env.TIMEOUT) * 1000)

async function run() {
  let jsonFile = await readJsonFile("/.codacyrc")

  let codacyrc = jsonFile ? parseCodacyrcFile(jsonFile) : undefined

  let srcDirPath = "/src"

  let [options, files] = await configCreator(srcDirPath, codacyrc)

  options.resolvePluginsRelativeTo = "."

  options.cwd = srcDirPath

  let filesToAnalyze = files ? files : ["/src/**"]

  let engine = new CLIEngine(options)

  let eslintResults = engine.executeOnFiles(filesToAnalyze)

  let codacyResults = convertResults(eslintResults)

  let relativeCodacyResults = codacyResults.map(r => r.relativeTo(srcDirPath))

  let lines = resultString(relativeCodacyResults)

  console.log(lines)
}

run()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => clearTimeout(timeoutHandle))

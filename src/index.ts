import { configCreator } from "./configCreator"
import { parseCodacyrcFile, readJsonFile } from "./fileUtils"
import { convertResults, resultString } from "./formatter"
import { parseTimeoutSeconds } from "./parseTimeoutSeconds"
import { CLIEngine } from "eslint"

let timeoutHandle = setTimeout(() => {
  console.error("Timeout occurred. Exiting.")
  process.exit(2)
}, parseTimeoutSeconds(process.env.TIMEOUT) * 1000)

async function run() {
  let jsonFile = await readJsonFile("/.codacyrc")

  let codacyrc = jsonFile ? parseCodacyrcFile(jsonFile) : undefined

  let [options, files] = configCreator(codacyrc)

  let fileToAnalyze = files ? files : ["/src/**"]

  let engine = new CLIEngine(options)
  
  let eslintResults = engine.executeOnFiles(fileToAnalyze)

  let codacyResults = convertResults(eslintResults)

  let relativeCodacyResults = codacyResults.map(r => r.relativeTo("/src"))

  let lines = resultString(relativeCodacyResults)

  console.log(lines)
}

run()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => clearTimeout(timeoutHandle))

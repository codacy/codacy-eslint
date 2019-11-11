export { }

import { CLIEngine } from 'eslint'
import { configCreator } from './configCreator'
import { parseCodacyrcFile, readJsonFile } from './fileUtils'
import { convertResults, resultString } from './formatter'
import { parseTimeout } from './parseTimeout'

async function run() {
  setTimeout(() => {
    console.error("Timeout occurred. Exiting.")
    process.exit(2)
  }, parseTimeout(process.env.TIMEOUT));

  let jsonFile = await readJsonFile('/.codacyrc')

  let codacyrc = parseCodacyrcFile(jsonFile)
  
  let [options, files] = configCreator(codacyrc)
  
  let engine = new CLIEngine(options)

  let fileToAnalyze = files ? files : ['/src']
  
  let eslintResults = engine.executeOnFiles(fileToAnalyze)

  let codacyResults = convertResults(eslintResults)

  let lines = resultString(codacyResults)

  console.log(lines)
}

run()

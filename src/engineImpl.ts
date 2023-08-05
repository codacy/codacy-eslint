import { Codacyrc, Engine, ToolResult } from "codacy-seed"
import { ESLint } from "eslint"

import { configCreator } from "./configCreator"
import { convertResults } from "./convertResults"
import { DEBUG, debug, debugJson } from "./logging"


export const engineImpl: Engine = async function (
  codacyrc?: Codacyrc
): Promise<ToolResult[]> {
  debug("engine: starting")
  const srcDirPath = "/src"
  const tsconfigFile = "tsconfig.json"

  const [options, files] = await configCreator(
    srcDirPath,
    tsconfigFile,
    codacyrc
  )
  
  if (DEBUG) {
    debug("engine: " + files.length + " files (or patterns) to process in \"" + srcDirPath + "\" with below config")
    debugJson(options)
  }

  //TODO: create file eslintrc options if it doesn't exist in root /src
  const eslint = new ESLint(options)
  
  //TODO: check why should this be instantiated or if it should be used instead for performance sake...
  // const linter = new Linter(options)

  debug("engine: linting")
  //TODO: RFC intercept results - try-catch - and check if there is some missing module
  // then maybe try to install it on demand...? have to think about ui implications...
  
  //TODO: try linting smaller batches (maybe 20?) of files here to solve heap memory errors
    
  const lintResults = await eslint.lintFiles(files)
  
  if (DEBUG) {
    let nIssues = 0
    for (let lintResult of lintResults) {
      debug("engine: below specific config for \"" + lintResult.filePath + "\"\n" + JSON.stringify(await eslint.calculateConfigForFile(lintResult.filePath)))
      nIssues += lintResult.messages.length
    }
    debug("engine: " + lintResults.length + " files linted and " + nIssues + " issues found")
  }

  return convertResults(lintResults).map((r) => r.relativeTo(srcDirPath))
}

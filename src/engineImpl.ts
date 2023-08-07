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
  const nFilesPerChunk = 20
  //const nPatternsPerChunk = 100

  const [options, files] = await configCreator(
    srcDirPath,
    tsconfigFile,
    codacyrc
  )

  if (DEBUG) {
    debug("engine: " + files.length + " files (or globs) to process in \"" + srcDirPath + "\" with below config")
    debugJson(options)
  }

  //TODO: create file eslintrc options if it doesn't exist in root /src
  //TODO: chunk number of rules
  const eslint = new ESLint(options)

  //TODO: check why should this be instantiated or if it should be used instead for performance sake...
  // const linter = new Linter(options)

  debug("engine: linting")
  //TODO: RFC intercept results - try-catch - and check if there is some missing module
  // then maybe try to install it on demand...? have to think about ui implications...

  //TODO: validate code to lint smaller batches of files here
  // to solve heap memory errors and increase performance
  let chunksOfFiles = chunk(files, nFilesPerChunk)
  let lintResults: ESLint.LintResult[] = [];
  for (let chunkOfFiles of chunksOfFiles) {
    lintResults.concat(await eslint.lintFiles(chunkOfFiles))
  }

  if (DEBUG) {
    let nIssues = 0
    for (let lintResult of lintResults) {
      debug(
        "engine: below specific config for \"" +
        lintResult.filePath +
        "\"\n" +
        JSON.stringify(
          await eslint.calculateConfigForFile(lintResult.filePath)
        )
      )
      nIssues += lintResult.messages.length
    }
    debug("engine: " + lintResults.length + " files linted and " + nIssues + " issues found")
  }

  return convertResults(lintResults).map((r) => r.relativeTo(srcDirPath))
}

const chunk = (arr: any[], size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_: any, i: number) =>
    arr.slice(i * size, i * size + size)
  );

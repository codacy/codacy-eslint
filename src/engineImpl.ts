import { Codacyrc, Engine, ToolResult } from "codacy-seed"
import { ESLint } from "eslint"

import { configCreator } from "./configCreator"
import { convertResults } from "./convertResults"
import { DEBUG, debug, debugJson } from "./logging"


export const engineImpl: Engine = async function (
  codacyrc?: Codacyrc
): Promise<ToolResult[]> {
  debug("engine: starting")
  //TODO: check .codacy.yaml for different sub_folder config
  // dealt with codacy-analysis maybe?
  const srcDirPath = "/src"
  const tsconfigFile = "tsconfig.json"
  const nFilesPerChunk = 10

  //TODO: create file eslintrc options if it doesn't exist in root /src
  const [options, files] = await configCreator(
    srcDirPath,
    tsconfigFile,
    codacyrc
  )

  if (DEBUG) {
    debug("engine: list of " + files.length + " files (or globs) to process in \"" + srcDirPath + "\" and options used")
    debug(files.toString())
    debugJson(options)
    
  }

  //TODO: chunk number of rules
  // have to check if this is actually throwing an error or not
  const eslint = new ESLint(options)

  //TODO: check why should this be instantiated or if it should be used instead for performance sake...
  // const linter = new Linter(options)
 
  //TODO: RFC intercept results - try-catch - and check if there is some missing module
  // then maybe try to install it on demand...? have to think about ui implications...
  // Kendrick replied it opens a Pandora box for users to insert malicious code
  const lintResults = await lintChunksOfFiles(
      eslint,
      chunk(files, nFilesPerChunk)
    )

  await debugLintResults(eslint, lintResults)

  return convertResults(lintResults).map((r) => r.relativeTo(srcDirPath))
}

async function lintChunksOfFiles(eslint: ESLint, chunksOfFiles: string[][]): Promise<ESLint.LintResult[]> {
  debug("engine: linting chunks started")
  const results = [];
  for (const chunkOfFiles of chunksOfFiles) {
    results.push(...(await eslint.lintFiles(chunkOfFiles)))
  }
  debug("engine: linting chunks finished")
  return results;
}

async function debugLintResults(eslint: ESLint, lintResults: ESLint.LintResult[]): Promise<void> {
  if (!DEBUG) {
    return
  }

  let nIssues = 0
  for await (const lintResult of lintResults) {
    debug("engine: specific config for \"" + lintResult.filePath + "\"")
    debugJson(await eslint.calculateConfigForFile(lintResult.filePath))
    nIssues += lintResult.messages.length
  }
  debug("engine: " + lintResults.length + " files linted and " + nIssues + " issues found")
}

const chunk = (arr: any[], size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_: any, i: number) =>
    arr.slice(i * size, i * size + size)
  );

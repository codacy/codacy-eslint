import { Codacyrc, Engine, ToolResult } from "codacy-seed"
import { ESLint } from "eslint"
import fs from "fs"

import { configCreator } from "./configCreator"
import { convertResults } from "./convertResults"
import { DEBUG, debug, debugJson } from "./logging"

export const engineImpl: Engine = async function (
  codacyrc?: Codacyrc
): Promise<ToolResult[]> {
  debug("engine: starting")

  const srcDirPath = "/src"
  const tsconfigFile = "tsconfig.json"
  //const nFilesPerChunk = 10
  const maxTotalSizeOfFilesPerChunk = 1048576 // size in bytes

  const [options, files] = configCreator(
    srcDirPath,
    tsconfigFile,
    codacyrc
  )

  if (DEBUG) {
    debug("engine: list of " + files.length + " files (or globs) to process in \"" + srcDirPath + "\" and options used")
    debug(files.toString())
    debugJson(options)
  }

  const eslint = new ESLint(options)

  //const chunksOfFiles = chunk(files, nFilesPerChunk)
  const chunksOfFiles = chunkFilesBySize(files, maxTotalSizeOfFilesPerChunk)

  const lintResults = await lintChunksOfFiles(
      eslint,
      chunksOfFiles
    )

  await debugLintResults(eslint, lintResults)

  return convertResults(lintResults).map((r) => r.relativeTo(srcDirPath))
}

async function lintChunksOfFiles(eslint: ESLint, chunksOfFiles: string[][]): Promise<ESLint.LintResult[]> {
  debug("engine: linting chunks started")
  const lintResults = []
  for (const chunkOfFiles of chunksOfFiles) {
    lintResults.push(...(await eslint.lintFiles(chunkOfFiles)))
  }
  debug("engine: linting chunks finished")
  return lintResults
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
  )



function chunkFilesBySize(files: string[], maxChunkSize: number): string[][] {
  const chunks: string[][] = [];
  let currentChunk: string[] = [];
  let currentChunkSize = 0;

  for (const file of files) {
    const size = fs.statSync(file).size
    if (currentChunk.length === 0 || currentChunkSize + size <= maxChunkSize) {
      currentChunk.push(file);
      currentChunkSize += size;
    } else {
      chunks.push(currentChunk);
      currentChunk = [file];
      currentChunkSize = size;
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  return chunks;
}
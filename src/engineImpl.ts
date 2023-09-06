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
  const [options, files] = configCreator(
    srcDirPath,
    codacyrc
  )

  if (DEBUG) {
    debug("engine: list of " + files.length + " files (or globs) to process in \"" + srcDirPath + "\" and options used")
    debug(files.toString())
    debugJson(options)
  }

  const eslint = new ESLint(options)
  const lintResults = await lintFiles(eslint, files)

  debug("engine: finished")
  return convertResults(lintResults).map((r) => r.relativeTo(srcDirPath))
}

async function lintFiles(eslint: ESLint, files: string[]): Promise<ESLint.LintResult[]> {
  //-- without chunks
  //return await eslint.lintFiles(files)

  //const nFilesPerChunk = 10
  //const chunksOfFiles = chunkFilesByQuantity(files, nFilesPerChunk)

  const maxSumSizeFilesPerChunk = 65536 // size in bytes (64KB)
  const chunksOfFiles = chunkFilesBySize(files, maxSumSizeFilesPerChunk)

  return lintChunksOfFiles(eslint, chunksOfFiles)
}

async function lintChunksOfFiles(eslint: ESLint, chunksOfFiles: string[][]): Promise<ESLint.LintResult[]> {
  debug("engine: linting chunks started")
  const lintResults = []
  for (const chunkOfFiles of chunksOfFiles) {
    lintResults.push(...(await eslint.lintFiles(chunkOfFiles)))
  }
  debug("engine: linting chunks finished")
  await debugLintResults(eslint, lintResults)

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

const chunkFilesByQuantity = (files: string[], size: number) =>
  Array.from({ length: Math.ceil(files.length / size) }, (_: any, i: number) =>
  files.slice(i * size, i * size + size)
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
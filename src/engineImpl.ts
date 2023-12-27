import { Codacyrc, Engine, ToolResult } from "codacy-seed"
import { ESLint } from "eslint"
import fs from "fs"

import { createEslintConfig } from "./configCreator"
import { convertResults } from "./convertResults"
import { DEBUG, debug, debugJson } from "./logging"

export const engineImpl: Engine = async function (
  codacyrc?: Codacyrc
): Promise<ToolResult[]> {
  debug("engine: starting")

  const srcDirPath = "/src"
  const [options, files] = createEslintConfig(
    srcDirPath,
    codacyrc
  )

  if (DEBUG) {
    debug("engine: list of " + files.length + " files (or globs) to process in \"" + srcDirPath + "\" and options used")
    debug(files.toString())
    debugJson(options)
  }

  const eslint = new ESLint(options)

  // Check if there are any glob patterns in the files array
  const lintResults = files.some(file => /\*|\?|\[/.test(file))
    ? await eslint.lintFiles(files)
    : await lintFilesInChunks(eslint, files)

  debug("engine: finished")
  return convertResults(lintResults).map((r) => r.relativeTo(srcDirPath))
}

async function lintFilesInChunks(eslint: ESLint, files: string[]): Promise<ESLint.LintResult[]> {
  //-- without chunks
  //return await eslint.lintFiles(files)

  //const nFilesPerChunk = 10
  //const chunksOfFiles = chunkFilesByCount(files, nFilesPerChunk)

  const maxTotalSizePerChunk = 8167 // size in bytes (8KB)
  const chunksOfFiles = chunkFilesByTotalSize(files, maxTotalSizePerChunk)

  return lintFilesChunkByChunk(eslint, chunksOfFiles)
}

async function lintFilesChunkByChunk(eslint: ESLint, chunksOfFiles: string[][]): Promise<ESLint.LintResult[]> {
  debug("engine: linting chunks started")
  const lintResults = []
  for (const chunkOfFiles of chunksOfFiles) {
    lintResults.push(...(await eslint.lintFiles(chunkOfFiles)))
  }
  debug("engine: linting chunks finished")
  await debugAndCountLintIssues(eslint, lintResults)

  return lintResults
}

async function debugAndCountLintIssues(eslint: ESLint, lintResults: ESLint.LintResult[]): Promise<void> {
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

const chunkFilesByCount = (files: string[], size: number) =>
  Array.from({ length: Math.ceil(files.length / size) }, (_: any, i: number) =>
  files.slice(i * size, i * size + size)
  )

function chunkFilesByTotalSize(files: string[], maxChunkSize: number): string[][] {
  const chunks: string[][] = []
  let currentChunk: string[] = []
  let currentChunkSize = 0

  for (const file of files) {
    try {
      const size = fs.statSync(file).size
      if (currentChunk.length === 0 || currentChunkSize + size <= maxChunkSize) {
        currentChunk.push(file)
        currentChunkSize += size
      } else {
        chunks.push(currentChunk)
        currentChunk = [file]
        currentChunkSize = size
      }
    } catch (error) {
      console.error("engine: error while getting file size for " + file + ": " + error.message)
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk)
  }

  return chunks
}
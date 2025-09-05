import { Codacyrc, Engine, ToolResult } from "codacy-seed"
import { ESLint } from "eslint"
import fs from "fs"

import { createEslintConfig } from "./configCreator"
import { convertResults } from "./convertResults"
import { DEBUG, debug } from "./logging"
import { toolName } from "./toolMetadata"
import fsPromises from "fs/promises";

export const engineImpl: Engine = async function (
  codacyrc?: Codacyrc
): Promise<ToolResult[]> {
  debug("engine: starting")

  if (!codacyrc || codacyrc.tools?.[0]?.name !== toolName) {
    throw new Error("codacyrc is not defined")
  }

  const srcDirPath = "/src"
  const [options, files] = await createEslintConfig(
    srcDirPath,
    codacyrc
  )

  debug(`engine: list of ${files.length} files (or globs) to process in "${srcDirPath}" and options used`)
  debug(files)
  debug(options)

  const eslint = new ESLint(options)

  // Check if there are any glob patterns in the files array
  const lintResults = files.some((file: string) => /\*|\?|\[/.test(file))
    ? await eslint.lintFiles(files)
    : await lintFilesInChunks(eslint, files)

  await debugAndCountLintIssues(eslint, lintResults)

  debug("engine: finished")
  return convertResults(lintResults).map((r) => r.relativeTo(srcDirPath))
}

async function lintFilesInChunks (eslint: ESLint, files: string[]): Promise<ESLint.LintResult[]> {
  const maxTotalSizePerChunk = 8167 // size in bytes (8KB)
  const chunksOfFiles = await chunkFilesByTotalSize(files, maxTotalSizePerChunk)

  return lintFilesChunkByChunk(eslint, chunksOfFiles)
}

async function lintFilesChunkByChunk (eslint: ESLint, chunksOfFiles: string[][]): Promise<ESLint.LintResult[]> {
  debug("engine: linting chunks started")
  const lintResults = []
  for (const chunkOfFiles of chunksOfFiles) {
    lintResults.push(...await eslint.lintFiles(chunkOfFiles))
  }
  debug("engine: linting chunks finished")

  return lintResults
}

async function debugAndCountLintIssues (eslint: ESLint, lintResults: ESLint.LintResult[]): Promise<void> {
  if (!DEBUG) return

  let nIssues = 0
  for await (const lintResult of lintResults) {
    nIssues += lintResult.messages.length
  }
  debug(`engine: ${lintResults.length} files linted and ${nIssues} issues found`)
}

async function chunkFilesByTotalSize(files: string[], maxChunkSize: number): Promise<string[][]> {
  const chunks: string[][] = [];
  let currentChunk: string[] = [];
  let currentChunkSize = 0;

  for (const file of files) {
    try {
      // nosemgrep
      const stats = await fsPromises.stat(file);
      const size = stats.size;
      if (currentChunkSize + size <= maxChunkSize || currentChunk.length === 0) {
        currentChunk.push(file);
        currentChunkSize += size;
      } else {
        chunks.push(currentChunk);
        currentChunk = [file];
        currentChunkSize = size;
      }
    } catch (err: any) {
      console.error(`engine: failed to stat "${file}": ${err.message}`);
    }
  }

  if (currentChunk.length > 0) chunks.push(currentChunk);
  return chunks;
}

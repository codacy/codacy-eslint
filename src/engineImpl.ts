import { Codacyrc, Engine, ToolResult } from "codacy-seed"
import { ESLint } from "eslint"
import fs from "fs"
import { glob } from "glob"

import { createEslintConfig } from "./configCreator"
import { convertResults } from "./convertResults"
import { DEBUG, debug } from "./logging"
import { toolName } from "./toolMetadata"
import fsPromises from "fs/promises";

const GLOB_EXPANSION_IGNORE = [
  "**/node_modules/**",
  "**/dist/**",
  "**/build/**",
  "**/.git/**"
]

export const engineImpl: Engine = async function (
  codacyrc?: Codacyrc
): Promise<ToolResult[]> {
  debug("engine: starting")

  if (!codacyrc || codacyrc.tools?.[0]?.name !== toolName) {
    throw new Error("codacyrc is not defined")
  }

  const srcDirPath = "/src"
  const [options, filesOrGlobs] = await createEslintConfig(
    srcDirPath,
    codacyrc
  )

  debug(`engine: list of ${filesOrGlobs.length} files (or globs) to process in "${srcDirPath}" and options used`)
  debug(filesOrGlobs)
  debug(options)

  const eslint = new ESLint(options)

  // Expand any glob patterns up front so every run (default full-repo globs
  // included) goes through the same chunked, memory-bounded lint path.
  const files = await expandFiles(srcDirPath, filesOrGlobs)
  const results = await lintFilesInChunks(eslint, files)

  debug(`engine: ${results.length} issues/errors found`)

  debug("engine: finished")
  return results.map((r) => r.relativeTo(srcDirPath))
}

async function expandFiles (srcDirPath: string, filesOrGlobs: string[]): Promise<string[]> {
  const hasGlobs = filesOrGlobs.some((file: string) => /\*|\?|\[/.test(file))
  if (!hasGlobs) return filesOrGlobs

  const expanded = await glob(filesOrGlobs, {
    cwd: srcDirPath,
    nodir: true,
    dot: true,
    ignore: GLOB_EXPANSION_IGNORE
  })

  debug(`engine: expanded globs to ${expanded.length} files`)
  return expanded
}

async function lintFilesInChunks (eslint: ESLint, files: string[]): Promise<ToolResult[]> {
  const maxTotalSizePerChunk = 5 * 1024 * 1024; // size in bytes (5MB)
  const chunksOfFiles = await chunkFilesByTotalSize(files, maxTotalSizePerChunk)

  return lintFilesChunkByChunk(eslint, chunksOfFiles)
}

async function lintFilesChunkByChunk (eslint: ESLint, chunksOfFiles: string[][]): Promise<ToolResult[]> {
  debug("engine: linting chunks started")
  const results: ToolResult[] = []
  let filesLinted = 0
  for (const chunkOfFiles of chunksOfFiles) {
    const chunkResults = await eslint.lintFiles(chunkOfFiles)
    filesLinted += chunkResults.length
    results.push(...convertResults(chunkResults))
  }
  debug(`engine: linting chunks finished, ${filesLinted} files linted`)

  return results
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

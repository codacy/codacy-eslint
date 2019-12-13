import fs from "fs"
import { promisify } from "util"
import { walk as fsWalk } from "@nodelib/fs.walk"
import { Codacyrc } from "./model/CodacyInput"

export const readFile = promisify(fs.readFile)
export const writeFile = promisify(fs.writeFile)
export const walk = promisify(fsWalk)

export async function readJsonFile(file: string): Promise<string | undefined> {
  try {
    return await readFile(file, "utf8")
  } catch (e) {
    console.error("Error reading .codacyrc file")
    return undefined
  }
}

export function parseCodacyrcFile(content: string): Codacyrc {
  return JSON.parse(content)
}

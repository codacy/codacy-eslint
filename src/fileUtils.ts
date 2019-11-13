import { Codacyrc } from "./model/CodacyInput"
import { readFile } from "./promisified"

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

import fs  from 'fs'
import util from 'util'
import { Codacyrc } from "./model/CodacyInput"

let readFile = util.promisify(fs.readFile)

export async function readJsonFile(file: string): Promise<string | undefined> {
  try {
    return await readFile(file, 'utf8')
  } catch(e) {
    console.error("Error reading .codacyrc file")
    return undefined
  }
    
}

export function parseCodacyrcFile(content: string): Codacyrc {
  return JSON.parse(content)
}
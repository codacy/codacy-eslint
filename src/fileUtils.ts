import fs  from 'fs'
import util from 'util'
import { Codacyrc } from "./model/CodacyInput"

let readFile = util.promisify(fs.readFile)

export async function readJsonFile(file: string) {
  return readFile(file, 'utf8')
}

export function parseCodacyrcFile(content: string): Codacyrc {
  return JSON.parse(content)
}
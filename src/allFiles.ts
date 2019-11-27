import { walk } from "./promisified"

export async function allFilesNames(dir: string): Promise<string[]> {
  const entries = await walk(dir, { followSymbolicLinks: true })
  return entries.map(entry => entry.name)
}

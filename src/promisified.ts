import fs from "fs"
import { promisify } from "util"

export let readFile = promisify(fs.readFile)
export let writeFile = promisify(fs.writeFile)

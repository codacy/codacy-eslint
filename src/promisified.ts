import fs from "fs"
import { promisify } from "util"
import { walk as fsWalk } from "@nodelib/fs.walk"

export const readFile = promisify(fs.readFile)
export const writeFile = promisify(fs.writeFile)
export const walk = promisify(fsWalk)

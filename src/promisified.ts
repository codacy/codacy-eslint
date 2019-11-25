import fs from "fs"
import { promisify } from "util"
import { walk as fsWalk } from "@nodelib/fs.walk"

export let readFile = promisify(fs.readFile)
export let writeFile = promisify(fs.writeFile)
export let walk = promisify(fsWalk)

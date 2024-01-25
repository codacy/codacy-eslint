
import {readFileSync} from "node:fs"

export const toolName = "eslint-8"

const packageJson = JSON.parse(readFileSync("package.json", "utf8"))
export const toolVersion = packageJson.dependencies.eslint.replace("^", "")

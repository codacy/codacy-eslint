import packageJson from "../package.json"

export const toolName = "eslint"

export const toolVersion = packageJson.dependencies.eslint.replace("^", "")

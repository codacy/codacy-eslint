import packageJson from "../package.json"

export const toolName = "eslint-8"

export const toolVersion = packageJson.dependencies.eslint.replace("^", "")

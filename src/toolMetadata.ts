import packageJson from '../package.json'

export let toolName = "ESLint"

export let toolVersion = packageJson.dependencies.eslint.replace('^', '')

export type Level = 'Error' | 'Info' | 'Warning'

export function fromEslintCategory(category: string): Level {
  switch(category){
    case 'Possible Errors': return 'Error'
    case 'Best Practices': return 'Info'
    case 'Strict Mode': return 'Error'
    case 'Variables': return 'Info'
    case 'Node.js and CommonJS': return 'Warning'
    case 'Stylistic Issues': return 'Info'
    case 'ECMAScript 6': return 'Warning'
    case 'Deprecated': return 'Info'
    case 'Removed': return 'Info'
    default: return 'Info'
  }
}

export class PatternsParameter {
  name: string
  default: string

  constructor(name: string, d: string) {
    this.name = name
    this.default = d
  }
}
export class PatternsEntry {
  patternId: string
  level: Level
  description: string
  parameters?: PatternsParameter[]

  constructor(patternId: string, level: Level, description: string, parameters?: PatternsParameter[]) {
    this.patternId = patternId
    this.level = level
    this.description = description
    this.parameters = parameters
  }
}

export class Patterns {
  name: string
  version: string
  patterns: PatternsEntry[]
  constructor(name: string, version: string, patterns: PatternsEntry[]) {
    this.name = name
    this.version = version
    this.patterns = patterns
  }
}

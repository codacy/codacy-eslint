export type Level = "Error" | "Info" | "Warning"

export type Category =
  | "ErrorProne"
  | "CodeStyle"
  | "Complexity"
  | "UnusedCode"
  | "Security"
  | "Compatibility"
  | "Performance"
  | "Documentation"
  | "BestPractice"

export type SecuritySubcategory =
  | "Injection"
  | "BrokenAuth"
  | "SensitiveData"
  | "XXE"
  | "BrokenAccess"
  | "Misconfiguration"
  | "XSS"
  | "BadDeserialization"
  | "VulnerableComponent"
  | "NoLogging"

export function fromEslintPatternIdAndCategoryToCategory(patternId: string, category?: string): [Category, SecuritySubcategory | undefined] {
  if(patternId.includes("xss")) return ["Security", "XSS"]
  if(patternId.includes("injection")) return ["Security", "Injection"]
  if(patternId.includes("security")) return ["Security", undefined]
  switch (category) {
    case "Possible Errors":
      return ["ErrorProne", undefined]
    case "Best Practices":
      return ["BestPractice", undefined]
    case "Strict Mode":
      return ["BestPractice", undefined]
    case "Variables":
      return ["CodeStyle", undefined]
    case "Node.js and CommonJS":
      return ["BestPractice", undefined]
    case "Stylistic Issues":
      return ["CodeStyle", undefined]
    case "ECMAScript 6":
      return ["BestPractice", undefined]
    case "Deprecated":
      return ["Compatibility", undefined]
    case "Removed":
      return ["Compatibility", undefined]
    default:
      return ["CodeStyle", undefined]
  }
}

export function fromEslintCategoryToLevel(category?: string): Level {
  switch (category) {
    case "Possible Errors":
      return "Error"
    case "Best Practices":
      return "Info"
    case "Strict Mode":
      return "Error"
    case "Variables":
      return "Info"
    case "Node.js and CommonJS":
      return "Warning"
    case "Stylistic Issues":
      return "Info"
    case "ECMAScript 6":
      return "Warning"
    case "Deprecated":
      return "Info"
    case "Removed":
      return "Info"
    default:
      return "Info"
  }
}

export function patternIdToCodacy(patternId: string): string {
  return patternId.replace(/\//g, "_")
}

export function patternIdToEslint(patternId: string): string {
  return patternId.replace(/_/g, "/")
}

export class PatternsParameter {
  name: string
  default?: any

  constructor(name: string, d?: any) {
    this.name = name
    this.default = d
  }
}
export class PatternsEntry {
  patternId: string
  level: Level
  category: Category
  subcategory?: SecuritySubcategory
  parameters?: PatternsParameter[]

  constructor(
    patternId: string,
    level: Level,
    category: Category,
    subcategory?: SecuritySubcategory,
    parameters?: PatternsParameter[]
  ) {
    this.patternId = patternId
    this.level = level
    this.category = category
    this.subcategory = subcategory
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

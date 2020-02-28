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
  | "XSS"
  | "InputValidation"
  | "FileAccess"
  | "HTTP"
  | "Cookies"
  | "UnexpectedBehaviour"
  | "MassAssignment"
  | "InsecureStorage"
  | "InsecureModulesLibraries"
  | "Visibility"
  | "CSRF"
  | "Android"
  | "MaliciousCode"
  | "Cryptography"
  | "CommandInjection"
  | "FirefoxOS"
  | "Auth"
  | "DoS"
  | "SQLInjection"
  | "Routes"
  | "Regex"
  | "SSL"

export function fromEslintPatternIdAndCategoryToCategory(
  patternId: string,
  category?: string
): [Category, SecuritySubcategory?] {
  if (patternId.includes("xss")) return ["Security", "XSS"]
  if (patternId.includes("injection")) return ["Security", "CommandInjection"]
  if (patternId.includes("crypto")) return ["Security", "Cryptography"]
  if (patternId.includes("Storage")) return ["Security", "InsecureStorage"]
  if (patternId.startsWith("scanjs-rules/call_")) return ["Security", "CommandInjection"]
  if (patternId.startsWith("scanjs-rules/assign_to_")) return ["Security", "MaliciousCode"]
  if (patternId.startsWith("scanjs-rules") || patternId.includes("security"))
    return ["Security", patternId.includes("regex") ? "Regex" : undefined]

  switch (category) {
    case "Possible Errors":
      return ["ErrorProne"]
    case "Best Practices":
      return ["BestPractice"]
    case "Strict Mode":
      return ["BestPractice"]
    case "Variables":
      return ["CodeStyle"]
    case "Node.js and CommonJS":
      return ["BestPractice"]
    case "Stylistic Issues":
      return ["CodeStyle"]
    case "ECMAScript 6":
      return ["BestPractice"]
    case "Deprecated":
      return ["Compatibility"]
    case "Removed":
      return ["Compatibility"]
    default:
      return ["CodeStyle"]
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
  return patternId.replace(/_/g, "__").replace(/\//g, "_")
}

export function patternIdToEslint(patternId: string): string {
  return patternId.replace(/([^_])_([^_])/g, "$1/$2").replace(/__/g, "_")
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

import { Category, Level, SecuritySubcategory } from "codacy-seed"

export function fromEslintPatternIdAndCategoryToCategory(
  patternId: string,
  category?: string
): [Category, SecuritySubcategory?] {
  if (patternId.includes("xss")) return ["Security", "XSS"]
  if (patternId.includes("injection")) return ["Security", "CommandInjection"]
  if (patternId.includes("crypto")) return ["Security", "Cryptography"]
  if (patternId.includes("Storage")) return ["Security", "InsecureStorage"]
  if (patternId.startsWith("scanjs-rules/call_"))
    return ["Security", "CommandInjection"]
  if (patternId.startsWith("scanjs-rules/assign_to_"))
    return ["Security", "MaliciousCode"]
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

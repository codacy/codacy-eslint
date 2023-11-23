import { Category, Level, SecuritySubcategory } from "codacy-seed"

export function fromEslintPatternIdAndCategoryToCategory(
  patternId: string,
  category?: string
): [Category, SecuritySubcategory?] {
  if (patternId.includes("csrf")) return ["Security", "CSRF"]
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
  if (patternId.startsWith("no-unsanitized")) return ["Security", "XSS"]
  switch (category) {
    case "problem":
      return ["ErrorProne"]
    case "suggestion":
      return ["BestPractice"]
    case "layout":
    default:
      return ["CodeStyle"]
  }
}

export function fromEslintTypeAndCategoryToLevel(
  type?: string
): Level {
  switch (type) {
    case "problem":
      return "Error"
    case "suggestion":
      return "Warning"
    case "layout":
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

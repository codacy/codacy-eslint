import { Category, Level, SecuritySubcategory } from "codacy-seed"

export function translateCategory(
  patternId: string,
  type?: string
): [Category, SecuritySubcategory?] {
  const securitySubcategory = getSecuritySubcategory(patternId)
  if (securitySubcategory) {
    return securitySubcategory
  }

  switch (type) {
    case "problem":
      return ["ErrorProne"]
    case "suggestion":
      return ["BestPractice"]
    case "layout":
      return ["CodeStyle"]
    default:
      return [translateCategoryLegacy(type)]
  }
}

function getSecuritySubcategory(patternId: string): [Category, SecuritySubcategory?] | undefined {
  if (patternId.includes("csrf")) return ["Security", "CSRF"];
  if (patternId.includes("xss")) return ["Security", "XSS"];
  if (patternId.includes("injection")) return ["Security", "CommandInjection"];
  if (patternId.includes("crypto")) return ["Security", "Cryptography"];
  if (patternId.includes("Storage")) return ["Security", "InsecureStorage"];
  if (patternId.startsWith("no-unsanitized")) return ["Security", "XSS"];
  if (patternId.startsWith("scanjs-rules/call_")) return ["Security", "CommandInjection"];
  if (patternId.startsWith("scanjs-rules/assign_to_")) return ["Security", "MaliciousCode"];
  if (patternId.startsWith("scanjs-rules") || patternId.includes("security"))
    return ["Security", patternId.includes("regex") ? "Regex" : undefined];

  return undefined;
}

function translateCategoryLegacy(
  category?: string
): Category {
  switch (category) {
    case "Possible Errors":
      return "ErrorProne"
    case "Deprecated":
    case "Removed":
      return "Compatibility"
    case "Best Practices":
    case "ECMAScript 6":
    case "Node.js and CommonJS":
    case "Strict Mode":
    case "Stylistic Issues":
    case "Variables":
    default:
      return "CodeStyle"
  }
}

export function translateLevel(
  type?: string
): Level {
  switch (type) {
    case "problem":
      return "Error"
    case "suggestion":
      return "Warning"
    case "layout":
      return "Info"
    default:
      return translateLevelLegacy(type)
  }
}

function translateLevelLegacy(category?: string): Level {
  switch (category) {
    case "Possible Errors":
    case "Strict Mode":
      return "Error"
    case "Node.js and CommonJS":
    case "ECMAScript 6":
      return "Warning"
    case "Best Practices":
    case "Deprecated":
    case "Removed":
    case "Stylistic Issues":
    case "Variables":
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

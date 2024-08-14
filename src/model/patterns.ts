import { Category, Level, ScanType, SecuritySubcategory  } from "codacy-seed"

const securityPlugins = [
  "scanjs-rules",
  "security",
  "security-node",
  "no-unsanitized",
  "xss"
]

export function translateLevelAndCategory (
  patternId: string,
  type?: string
): [Level, Category, SecuritySubcategory?, ScanType?] {
  if (securityPlugins.some(plugin => patternId.startsWith(plugin + "/"))) {
    return ["Warning", "Security", getSecuritySubcategory(patternId),"SCA"]
  }

  return [translateLevel(type), translateCategory(type), undefined]
}

function translateCategory (
  type?: string
): Category {
  switch (type) {
    case "problem":
      return "ErrorProne"
    case "suggestion":
      return "BestPractice"
    case "layout":
      return "CodeStyle"
    default:
      return translateCategoryLegacy(type)
  }
}

function getSecuritySubcategory (patternId: string): SecuritySubcategory | undefined {
  if (patternId.includes("csrf")) return "CSRF"
  if (patternId.includes("injection")) return "CommandInjection"
  if (patternId.includes("crypto")) return "Cryptography"
  if (patternId.includes("call_")) return "CommandInjection"
  if (patternId.includes("assign_to_")) return "MaliciousCode"
  if (patternId.includes("storage") || patternId.includes("-fs-") || patternId.includes("filename"))
    return "InsecureStorage"
  if (patternId.startsWith("no-unsanitized") || patternId.includes("xss"))
    return "XSS"
  if (patternId.includes("regex") && (patternId.startsWith("scanjs-rules") || patternId.startsWith("security")))
    return "Regex"

  return undefined
}

function translateCategoryLegacy (
  category?: string
): Category {
  switch (category) {
    case "Possible Errors":
      return "ErrorProne"
    case "Deprecated":
    case "Removed":
      return "Compatibility"
    case "Best Practices":
      return "BestPractice"
    case "ECMAScript 6":
    case "Node.js and CommonJS":
    case "Strict Mode":
    case "Stylistic Issues":
    case "Variables":
    default:
      return "CodeStyle"
  }
}

function translateLevel (
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

function translateLevelLegacy (category?: string): Level {
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

export function patternIdToCodacy (patternId: string): string {
  return patternId.replace(/_/g, "__").replace(/\//g, "_")
}

export function patternIdToEslint (patternId: string): string {
  return patternId.replace(/([^_])_([^_])/g, "$1/$2").replace(/__/g, "_")
}

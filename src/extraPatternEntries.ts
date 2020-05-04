import { PatternsEntry } from "codacy-seed"

// plugins' rules not included by Engine.getRules()
// this might happen if plugins do not export their rules
export const extraPatternEntries: Array<PatternsEntry> = [
  {
    patternId: "JSON format",
    category: "ErrorProne",
    level: "Warning",
  },
  {
    patternId: "JSON sorting",
    category: "ErrorProne",
    level: "Warning",
  },
]

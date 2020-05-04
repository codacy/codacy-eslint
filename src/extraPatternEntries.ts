import { PatternsEntry } from "codacy-seed"

// plugins' rules not included by Engine.getRules()
// this might happen if plugins do not export their rules
const extraPluginsDocs: Array<PatternsEntry> = [
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

export default extraPluginsDocs

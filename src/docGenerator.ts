import { PatternsEntry, Level, fromEslintCategory } from "./model/PatternsEntry"
import { engine } from "./eslintEngine"

export function generatePatterns(): PatternsEntry[] {
  let rules = engine.getRules()
  let patterns = Array.from(rules.entries()).map(([patternId, ruleModule]) => {
      let meta = ruleModule.meta
      if(meta) {
        let docs = meta.docs
        if (docs && docs.description && docs.category) {
          let level = docs.category ? fromEslintCategory(docs.category) : 'Info';
          return new PatternsEntry(patternId, level, docs.description)
        }
      }
    }
  )
  return patterns.filter((x): x is PatternsEntry => x !== null)
}

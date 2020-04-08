import { PatternsParameter } from "codacy-seed"
import { JSONSchema4 } from "json-schema"
import { flatMap, toPairs } from "lodash"

import { rulesNamedParametersAndDefaults } from "./rulesToUnnamedParametersDefaults"

export function fromSchemaArray(
  patternId: string,
  objects: JSONSchema4[]
): PatternsParameter[] {
  return flatMap(objects, o => {
    const pairs = toPairs(o.properties)
    const haveDefault = pairs.filter(
      ([k, v]) => v && v.hasOwnProperty("default")
    )
    const manual = pairs.filter(
      ([k, v]) =>
        v &&
        !v.hasOwnProperty("default") &&
        rulesNamedParametersAndDefaults.has(patternId, k)
    )
    const a = pairs
      .filter(([k, v]) => v && !v.hasOwnProperty("default"))
      .map(e => [patternId, e])
    const automaticParameters: PatternsParameter[] = haveDefault.map(
      ([k, v]) => new PatternsParameter(k, v.default)
    )
    const manualParameters: PatternsParameter[] = manual
      .map(([k, v]) => rulesNamedParametersAndDefaults.parameter(patternId, k))
      .filter(e => e) as PatternsParameter[]
    return automaticParameters.concat(manualParameters)
  })
}

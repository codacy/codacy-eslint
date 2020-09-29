import { ParameterSpec } from "codacy-seed"
import { JSONSchema4 } from "json-schema"
import { flatMap, toPairs } from "lodash"

import { rulesNamedParametersAndDefaults } from "./rulesToUnnamedParametersDefaults"

export function fromSchemaArray(
  patternId: string,
  objects: JSONSchema4[]
): ParameterSpec[] {
  return flatMap(objects, (o) => {
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
      .map((e) => [patternId, e])
    const automaticParameters: ParameterSpec[] = haveDefault.map(
      ([k, v]) => new ParameterSpec(k, v.default)
    )
    const manualParameters: ParameterSpec[] = manual
      .map(([k, v]) => rulesNamedParametersAndDefaults.parameter(patternId, k))
      .filter((e) => e) as ParameterSpec[]
    return automaticParameters.concat(manualParameters)
  })
}

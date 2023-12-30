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
    const haveDefault = pairs.filter(([_, v]) => v && v.default !== undefined)
    const manual = pairs.filter(
      ([k, v]) => v && rulesNamedParametersAndDefaults.has(patternId, k)
    )
    const automaticParameters: [string, any][] = haveDefault.map(([k, v]) => [
      k,
      v.default,
    ])
    const manualParameters: [string, any][] = manual
      .map(([k, _]) => rulesNamedParametersAndDefaults.parameter(patternId, k))
      .filter((e) => e) as [string, any][]
    const allParametersMap = new Map([
      ...automaticParameters,
      ...manualParameters,
    ])
    return Array.from(allParametersMap.entries()).map(
      ([k, v]) => new ParameterSpec(k, v)
    )
  })
}

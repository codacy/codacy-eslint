import { ParameterSpec } from "codacy-seed"
import { JSONSchema4, JSONSchema4Type } from "json-schema"
import { flatMap, toPairs } from "lodash"

import { rulesNamedParametersAndDefaults } from "./rulesToUnnamedParametersDefaults"

export function fromSchemaArray (
  patternId: string,
  objects: JSONSchema4[]
): ParameterSpec[] {
  return flatMap(objects, (o) => {
    const pairs = toPairs(o.properties)
    const haveDefault = pairs.filter(([, v]) => v && v.default !== undefined)
    const manual = pairs.filter(
      ([k, v]) => v && rulesNamedParametersAndDefaults.has(patternId, k)
    )
    const automaticParameters: [string, JSONSchema4Type][] = haveDefault.map(([k, v]) => [
      k,
      v.default
    ])
    const manualParameters: [string, JSONSchema4Type][] = manual
      .map(([k ]) => rulesNamedParametersAndDefaults.parameter(patternId, k))
      .filter((e) => e) as [string, JSONSchema4Type][]
    const allParametersMap = new Map([
      ...automaticParameters,
      ...manualParameters
    ])

    return Array.from(allParametersMap.entries()).map(
      ([k, v]) => new ParameterSpec(k, v)
    )
  })
}

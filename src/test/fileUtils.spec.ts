import { parseCodacyrcFile } from '../fileUtils'
import { deepEqual } from 'assert'
import { Codacyrc } from '../model/CodacyInput'

describe("main", () => {
  it("should parse a codacyrc file", () => {
    let codacyrcFileContent = `{
      "files" : ["foo/bar/baz.js", "foo2/bar/baz.php"],
      "tools":[
        {
          "name":"jshint",
          "patterns":[
            {
              "patternId":"latedef",
              "parameters":[
                {
                  "name":"latedef",
                  "value":"vars"
                }
              ]
            }
          ]
        }
      ]
    }`
    let parsed = parseCodacyrcFile(codacyrcFileContent)
    let expected: Codacyrc = {
      "files": ["foo/bar/baz.js", "foo2/bar/baz.php"],
      "tools": [
        {
          "name": "jshint",
          "patterns": [
            {
              "patternId": "latedef",
              "parameters": [
                {
                  "name": "latedef",
                  "value": "vars"
                }
              ]
            }
          ]
        }
      ]
    }
    deepEqual(parsed, expected)
  })
})

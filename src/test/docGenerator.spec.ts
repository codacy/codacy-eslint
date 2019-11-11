import { equal } from "assert"
import { generatePatterns} from "../docGenerator"

describe("docGenerator", () => {
  it("should generate patterns", () => {
    let patterns = generatePatterns()
    console.log(patterns)
  })
})

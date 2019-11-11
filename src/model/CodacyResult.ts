export class CodacyResult {
  readonly filename: string
  readonly message: string
  readonly patternId: string
  readonly line: number

  constructor(filename: string, message: string, patternId: string, line: number) {
    this.filename = filename
    this.message = message
    this.patternId = patternId
    this.line = line
  }
}

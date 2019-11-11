export class DescriptionParameter {
  readonly name: string
  readonly description: string

  constructor(name: string, description: string) {
    this.name = name
    this.description = description
  }
}

export class DescriptionEntry {
  readonly patternId: string
  readonly title: string
  readonly description: string
  readonly parameters: DescriptionParameter[]
  readonly line: number

  constructor(patternId: string, title: string, description: string, parameters: DescriptionParameter[], line: number) {
    this.patternId = patternId
    this.title = title
    this.description = description
    this.parameters = parameters
    this.patternId = patternId
    this.line = line
  }
}

import { expect } from "chai"
import fs from "fs"
import os from "os"
import path from "path"

import { chunkFilesByTotalSize, expandFiles } from "../engineImpl"

describe("expandFiles", () => {
  it("returns explicit file lists untouched", async () => {
    const files = ["src/foo.ts", "src/bar.ts"]
    const result = await expandFiles("/src", files)
    expect(result).to.deep.equal(files)
  })

  it("expands glob patterns into real files, excluding node_modules", async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "engineImpl-"))
    try {
      fs.mkdirSync(path.join(tmpDir, "node_modules"), { recursive: true })
      fs.writeFileSync(path.join(tmpDir, "a.ts"), "")
      fs.writeFileSync(path.join(tmpDir, "b.ts"), "")
      fs.writeFileSync(path.join(tmpDir, "node_modules", "ignored.ts"), "")

      const result = await expandFiles(tmpDir, ["**/*.ts"])

      expect(result.sort()).to.deep.equal(["a.ts", "b.ts"])
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true })
    }
  })
})

describe("chunkFilesByTotalSize", () => {
  it("groups files into chunks not exceeding the max chunk size", async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "engineImpl-"))
    try {
      const fileA = path.join(tmpDir, "a.ts")
      const fileB = path.join(tmpDir, "b.ts")
      const fileC = path.join(tmpDir, "c.ts")
      fs.writeFileSync(fileA, "a".repeat(3))
      fs.writeFileSync(fileB, "b".repeat(3))
      fs.writeFileSync(fileC, "c".repeat(3))

      const chunks = await chunkFilesByTotalSize([fileA, fileB, fileC], 5)

      expect(chunks).to.deep.equal([[fileA], [fileB], [fileC]])
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true })
    }
  })

  it("always puts at least one file in a chunk even if it alone exceeds the max size", async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "engineImpl-"))
    try {
      const bigFile = path.join(tmpDir, "big.ts")
      fs.writeFileSync(bigFile, "x".repeat(10))

      const chunks = await chunkFilesByTotalSize([bigFile], 5)

      expect(chunks).to.deep.equal([[bigFile]])
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true })
    }
  })
})

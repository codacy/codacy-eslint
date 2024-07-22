import cp from "child_process"
import path from "path"

function parseTimeoutMilliseconds(timeoutSecondsString?: string): number | undefined {
  if (timeoutSecondsString === undefined) return undefined
  const number = parseInt(timeoutSecondsString)
  if (isNaN(number) || number < 0) return undefined
  return number * 1000
}

const timeoutMilliseconds = parseTimeoutMilliseconds(process.env.TIMEOUT_SECONDS)

// Create the child process
const child = cp.fork(path.join(__dirname, './runEngine.js'), [], { stdio: "inherit" })

if (timeoutMilliseconds !== undefined) {
  setTimeout(() => {
    process.exit(2)
  }, timeoutMilliseconds);
}

child.on('exit', (code) => {
  process.exit(code)
})

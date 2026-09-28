import os from "node:os";

const constrained =
  typeof process.constrainedMemory === "function"
    ? process.constrainedMemory()
    : 0;
const limitBytes = constrained || os.totalmem();
const limitMB = Math.floor(limitBytes / 1024 / 1024);
const heapMB = Math.floor(limitMB * 0.75);

process.stdout.write(String(heapMB));

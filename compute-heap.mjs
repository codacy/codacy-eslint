import os from "node:os";

const constrained =
  typeof process.constrainedMemory === "function"
    ? process.constrainedMemory()
    : 0;
const limitBytes = constrained || os.totalmem();
const limitMB = Math.floor(limitBytes / 1024 / 1024);

// Reserve 25% headroom for non-V8-heap usage (native buffers, stack, code space, RSS overhead).
const budgetMB = Math.floor(limitMB * 0.75);

// V8's new-space is TWO semi-spaces (from-space + to-space), so its worst-case
// footprint is 2x --max-semi-space-size. Size it as a fraction of the budget,
// clamped to V8's own sane range, then subtract it before sizing old-space so
// old-space + new-space never exceeds the budget.
const semiSpaceMB = Math.min(128, Math.max(16, Math.floor(budgetMB * 0.05)));
const newSpaceMB = semiSpaceMB * 2;
const oldSpaceMB = Math.max(1, budgetMB - newSpaceMB);

process.stdout.write(`${oldSpaceMB} ${semiSpaceMB}`);

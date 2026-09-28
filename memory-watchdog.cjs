"use strict";

// --max-old-space-size only bounds V8's JS heap. Native/external memory
// (source buffers, ASTs, regex engines used by lint parsers) is NOT counted
// against it, so RSS can exceed the cgroup limit while V8 heap is still
// "fine" — no FATAL ERROR ever fires, the kernel just throttles/swaps the
// container into an apparent hang. This watchdog checks real RSS against
// the actual cgroup limit and self-exits before that happens.

const CHECK_INTERVAL_MS = 5000;
const THRESHOLD = 0.9;

const limitBytes =
  typeof process.constrainedMemory === "function"
    ? process.constrainedMemory()
    : require("node:os").totalmem();

const timer = setInterval(() => {
  const { rss } = process.memoryUsage();
  if (rss > limitBytes * THRESHOLD) {
    process.stderr.write(
      `memory-watchdog: RSS ${Math.floor(rss / 1024 / 1024)}MB exceeded ${Math.floor(
        THRESHOLD * 100
      )}% of cgroup limit ${Math.floor(limitBytes / 1024 / 1024)}MB, exiting\n`
    );
    process.exit(137);
  }
}, CHECK_INTERVAL_MS);

timer.unref();

#!/bin/sh

HEAP_MB=$(node /compute-heap.mjs)

exec node \
  --max-old-space-size="${HEAP_MB}" \
  --max-semi-space-size=128 \
  /dist/src/index.js

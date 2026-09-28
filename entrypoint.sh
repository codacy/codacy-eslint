#!/bin/sh

read -r HEAP_MB SEMI_MB <<EOF
$(node /compute-heap.mjs)
EOF

exec node \
  --max-old-space-size="${HEAP_MB}" \
  --max-semi-space-size="${SEMI_MB}" \
  /dist/src/index.js

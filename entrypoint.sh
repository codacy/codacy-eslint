#!/bin/sh

exec node \
  --max-old-space-size=2048 \
  --max-semi-space-size=128 \
  --optimize_for_size \
  /dist/src/index.js
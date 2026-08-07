#!/bin/sh

exec node \
  --max-old-space-size=4608 \
  --max-semi-space-size=64 \
  /dist/src/index.js

#!/bin/sh

exec node \
  --max-old-space-size=4608 \
  --max-semi-space-size=128 \
  /dist/src/index.js

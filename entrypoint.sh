#!/bin/sh
max_ram=2000 #mb
old_space_size=$((max_ram - 356))

exec node --max-old-space-size="$old_space_size" --max-semi-space-size=32 --optimize_for_size /dist/src/index.js 
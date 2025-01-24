#!/bin/sh
#max_ram=$(cat /sys/fs/cgroup/memory/memory.limit_in_bytes)
max_ram = 1000000000
max_ram=$((max_ram / 1024 / 1024))
old_space_size=$((max_ram - 356))

exec node --max-old-space-size="$old_space_size" --max-semi-space-size=32 --optimize_for_size --gc_interval=100 --v8-pool-size=0 --use-largepages=silent /dist/src/index.js 
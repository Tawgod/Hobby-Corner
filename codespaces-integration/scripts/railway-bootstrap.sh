#!/bin/sh
set -eu
# Railway volumes are mounted as root. Only the bootstrap runs privileged;
# the tunnel, GitHub CLI and MCP process run as the unprivileged node account.
install -d -m 0700 -o node -g node /data/audit
exec gosu node node /app/scripts/railway-entrypoint.mjs

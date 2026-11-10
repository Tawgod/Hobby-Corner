#!/usr/bin/env bash
# Read-only recovery drill: restores the encrypted archive into disposable PG18.
# Production Railway data is never modified; temporary container exposes no port.
set -euo pipefail
if [[ ! -t 0 || ! -t 1 ]]; then
  echo 'Run only in a private interactive Codespaces terminal.' >&2; exit 2
fi
if [[ $# != 1 || ! -f "$1" || "$1" != *.age ]]; then
  echo 'Usage: bash scripts/verify-production-postgres-backup-codespaces.sh /path/to/file.dump.age' >&2
  exit 2
fi
for program in docker age; do
  command -v "$program" >/dev/null 2>&1 || { echo "Missing $program" >&2; exit 2; }
done
archive="$1"
container="hc-backup-verify-$$"
cleanup() { docker rm -f "$container" >/dev/null 2>&1 || true; }
trap cleanup EXIT
echo 'Starting disposable PostgreSQL 18, no public ports or persistent volume.'
docker run -d --name "$container" --network none \
  -e POSTGRES_PASSWORD=temporary-restore-check-only \
  -e POSTGRES_DB=hc_restore_verify \
  postgres:18 >/dev/null
ready=false
for _ in $(seq 1 40); do
  if docker exec "$container" pg_isready -U postgres -d hc_restore_verify >/dev/null 2>&1; then
    ready=true; break
  fi
  sleep 1
done
if [[ "$ready" != true ]]; then
  echo 'Restore-test database failed to start.' >&2; exit 1
fi
echo 'Enter PRIVATE archive passphrase. Decrypted data streams directly into test database.'
if age --decrypt "$archive" | docker exec -i -u postgres "$container" \
    pg_restore --no-owner --no-privileges --exit-on-error \
    -U postgres -d hc_restore_verify; then
  table_count="$(docker exec -u postgres "$container" \
    psql -U postgres -d hc_restore_verify -Atc \
    "SELECT COUNT(*) FROM pg_class WHERE relkind IN ('r','p') AND relnamespace IN (SELECT oid FROM pg_namespace WHERE nspname='public')")"
  if [[ ! "$table_count" =~ ^[0-9]+$ ]] || (( table_count < 1 )); then
    echo 'No public user tables restored. NOT a verified recovery copy.' >&2; exit 1
  fi
  printf 'Restore drill PASS: %s public tables in disposable PostgreSQL 18.\n' "$table_count"
  echo 'The temporary database will be deleted at exit.'
else
  echo 'Restore drill FAILED. Do not proceed to database migration.' >&2; exit 1
fi

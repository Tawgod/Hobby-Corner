#!/usr/bin/env bash
# Interactive, read-only logical backup via a Railway CLI SSH tunnel.
# Creates only an encrypted file OUTSIDE the checkout, never a plaintext dump.
set -euo pipefail
umask 077
if [[ ! -t 0 || ! -t 1 ]]; then
  echo 'Use a private interactive Codespaces terminal.' >&2; exit 2
fi
for program in pg_dump pg_restore age sha256sum; do
  command -v "$program" >/dev/null 2>&1 || { echo "Missing $program (requires pg_dump 18+ and age)." >&2; exit 2; }
done
major="$(pg_dump --version | sed -nE 's/.* ([0-9]+)(\.[0-9]+)?.*/\1/p')"
if [[ ! "$major" =~ ^[0-9]+$ ]] || (( major < 18 )); then
  echo 'PostgreSQL 18+ client is required for the Railway PostgreSQL 18 server.' >&2; exit 2
fi
echo 'In another terminal: railway connect Postgres --environment production --tunnel-only'
echo 'Keep that SSH tunnel open and use ONLY its forwarded local connection details.'
read -r -p 'Local forwarded port: ' db_port
if [[ ! "$db_port" =~ ^[0-9]{1,5}$ ]] || (( 10#$db_port < 1 || 10#$db_port > 65535 )); then
  echo 'Invalid port.' >&2; exit 2
fi
read -r -p 'Database user from tunnel: ' db_user
read -r -p 'Database name from tunnel: ' db_name
if [[ ! "$db_user" =~ ^[A-Za-z_][A-Za-z0-9_]*$ ]] || [[ ! "$db_name" =~ ^[A-Za-z_][A-Za-z0-9_]*$ ]]; then
  echo 'Unexpected database/user name. Check tunnel.' >&2; exit 2
fi
read -r -s -p 'Database password (not echoed): ' PGPASSWORD
printf '\n'
[[ -n "$PGPASSWORD" ]] || { echo 'Password required.' >&2; exit 2; }
export PGPASSWORD
trap 'unset PGPASSWORD' EXIT
backup_dir="$HOME/hc-private-db-backups"
mkdir -p -- "$backup_dir"
chmod 700 -- "$backup_dir"
archive="$backup_dir/hc-production-$(date -u +%Y%m%dT%H%M%SZ).dump.age"
partial="$archive.partial"
if [[ -e "$archive" || -e "$partial" ]]; then
  echo 'Refusing to overwrite an existing backup.' >&2; exit 2
fi
echo 'Running read-only pg_dump, streaming directly into age encryption.'
echo 'Choose a strong PRIVATE passphrase, store it in your password manager, and never send it in chat.'
if ! (pg_dump -h 127.0.0.1 -p "$db_port" -U "$db_user" -d "$db_name" \
    --format=custom --no-owner --no-privileges --lock-wait-timeout=10s |
    age --passphrase -o "$partial"); then
  rm -f -- "$partial"
  echo 'Backup failed, no verified archive created.' >&2; exit 1
fi
mv -- "$partial" "$archive"
unset PGPASSWORD
printf 'Encrypted archive: %s\n' "$archive"
echo 'Verify FULL decryption. Enter your private encryption passphrase.'
if ! age --decrypt --output /dev/null "$archive"; then
  echo 'Full decryption FAILED: do not trust this backup.' >&2
  exit 1
fi
echo 'Full decryption PASS.'
echo 'Verify PostgreSQL archive format. Enter the same passphrase once more.'
# pg_restore --list reads only the archive directory, then closes stdin.
# age may consequently get SIGPIPE (exit 141). Its full decryption was
# checked above, so here only pg_restore's status determines format validity.
if (set +o pipefail; age --decrypt "$archive" | pg_restore --list >/dev/null); then
  echo 'Archive format PASS (full restore not yet verified).'
  sha256sum -- "$archive"
  echo 'Next: run scripts/verify-production-postgres-backup-codespaces.sh with the file path above.'
  echo 'Download/store encrypted archive OUTSIDE Codespaces and GitHub.'
else
  echo 'Archive format verification FAILED: do not trust this backup.' >&2
  exit 1
fi

# Hobby Corner — production PostgreSQL backup without Railway volume backups

**Status (2026-11-11): one operator-reported production export and isolated restore drill PASSED; external custody still pending.** The operator reported the encrypted archive `hc-production-20261110T213753Z.dump.age`, full decryption exit 0, `pg_restore --list` exit 0, and `Restore drill PASS: 54 public tables in disposable PostgreSQL 18.` The backup remains **Codespaces-only until an external encrypted copy and independently stored passphrase are confirmed**. This evidence is from the operator's terminal output, not independently inspected Railway database rows. No production release/migration is authorized by this result.

**Verification-script correction (2026-11-11):** The initial archive-list check reported FAILED even though a separate full decrypt and `pg_restore --list` succeeded. A `pg_restore --list` stream can close its input early and trigger SIGPIPE in `age` under `pipefail`. The export helper now separately checks complete decryption to `/dev/null` and archive format status without misclassifying this normal upstream SIGPIPE. No need to recreate the existing successfully restored archive on account of the old check.

This is a controlled alternative to Railway's plan-gated volume backup feature. It uses PostgreSQL's read-only logical export through Railway CLI's SSH tunnel, encrypts the stream in a **private GitHub Codespace**, and restores the archive into a disposable, network-isolated PostgreSQL 18 container for a recovery drill.

**Source of truth:** Railway production project `Hobby Corner`, environment `production`, existing service `Postgres`. The main production PostgreSQL service is shared by Timeclock and other Hobby Corner systems; no schema writes, updates, migrations, restarts, deployment or credential rotation are authorized by this runbook. Do not confuse the source-derived GitHub SQL archive with a live data backup.

## Requirements and safety

- Use a private Codespace under your own GitHub account. CPU/storage use happens remotely, not on your Windows PC. Codespaces may have usage charges. Have enough space for the *encrypted* dump and temporary restore; the scripts do not place a plaintext dump file in the repository.
- Do **not** paste a database URL, password, tunnel connection information, backup passphrase, raw backup, OTP, or customer records into GitHub issues, PRs, this chat, or Actions logs.
- Install `railway` CLI, `age`, and PostgreSQL **18 or later** client tools (`pg_dump` and `pg_restore`). Production Railway database source currently uses PostgreSQL 18. Verify `pg_dump --version` before backing up.
- Save the decryption passphrase in a private password manager. When age offers a generated passphrase, record it securely **before** finishing the backup. Anyone who has both the passphrase and encrypted archive can recover data.
- Stop immediately if the Railway project selection is not **Hobby Corner / production / Postgres**. Never use the separate Owner staging DB or any production write command in this process.

## Step 1 — open a remote Codespace and install clients

Open https://github.com/Tawgod/Hobby-Corner and choose **Code → Codespaces → Create codespace on main** (or use an existing trusted Codespace). In its terminal, run:

```bash
npm install -g @railway/cli
railway login --browserless
sudo apt-get update
sudo apt-get install -y age postgresql-common ca-certificates
sudo /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh
sudo apt-get update
sudo apt-get install -y postgresql-client-18
pg_dump --version
age --version
```

Approve the official PostgreSQL Apt repository prompt only if its URL is `apt.postgresql.org`. Use your browser to complete Railway's device login. Do not share its code or CLI credentials in chat. The Codespace image should provide Node, npm and Docker; if not, stop and report which dependency is missing.

Railway CLI guidance: https://docs.railway.com/cli and https://docs.railway.com/cli/connect
PostgreSQL client repository: https://www.postgresql.org/download/linux/ubuntu/

## Step 2 — open read-only SSH tunnel

In **terminal A**, from a directory outside the repository (so local Railway link metadata cannot be accidentally committed):

```bash
cd ~
railway link
# Select the existing project: Hobby Corner
# Select environment: production
railway status
railway connect Postgres --environment production --tunnel-only
```

Keep terminal A open. The tunnel command prints the local forwarded host/port, database user, name and password **privately**. It does not expose a public PostgreSQL TCP proxy. Do not paste those details anywhere. This step does not back up or modify the database.

## Step 3 — create encrypted data backup

Open **terminal B** in the same Codespace and, from the checked-out `Hobby-Corner` repo directory, run:

```bash
bash scripts/backup-production-postgres-codespaces.sh
```

The helper asks for the *local tunnel* port/user/database and hides the database password while you type. `pg_dump` performs a read-only full logical export, streaming the compressed custom archive directly through `age` encryption. The encrypted result goes to `$HOME/hc-private-db-backups/`; no plaintext database dump is written to disk.

Enter or generate a strong `age` passphrase interactively and store it privately. The updated script prompts again to verify **full decryption** without writing plaintext, then again to check PostgreSQL archive structure. An archive-format check alone does **not** prove full restore recovery.

## Step 4 — restore drill without touching production

From terminal B run the command below, replacing the path with the actual encrypted file printed by Step 3:

```bash
bash scripts/verify-production-postgres-backup-codespaces.sh \
  "$HOME/hc-private-db-backups/<actual-archive-name>.dump.age"
```

This starts an **unpublished, network-disabled disposable PostgreSQL 18** Docker container and streams decrypted contents into it using `pg_restore --exit-on-error`. It counts the restored public tables without printing rows and deletes the container at exit. Any failure blocks the production release; do not use the archive as proof of recovery unless the restore drill succeeds.

The backup contains sensitive business/employee/customer information; keep all outputs private. After a successful restore drill, download the encrypted `.age` archive into independently controlled storage **outside GitHub/Codespaces** and retain the separate decryption passphrase securely. A Codespace is not long-term backup storage.

## Evidence to record (safe to share)

- UTC timestamp of the completed encrypted export;
- `pg_dump` major version and encrypted archive byte size;
- successful decrypt/archive check and full disposable PG18 restore result (number of public tables; no row contents);
- SHA-256 checksum of the encrypted archive;
- confirmation an encrypted copy is saved outside Codespaces and the passphrase is independently stored.

Do not attach the encrypted archive or credentials to an issue or chat.

## Owner release gate

The production Timeclock [PR #59](https://github.com/Tawgod/Lightspeed/pull/59) release remains **on hold** until the backup and restore verification above is completed and deployment scope (multiple services share the integration branch) is reviewed. This process does not authorize merging, live database migrations, staging deployment or Owner role commissioning.

**Limitations:** `pg_dump` creates a consistent logical snapshot, not continuous point-in-time recovery. It may impose workload/egress costs, and a dump may not capture instance-wide roles, settings, or extension packages. Test the actual restore in a disposable environment and retain a secure external copy before relying on it.

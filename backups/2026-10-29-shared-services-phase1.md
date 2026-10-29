# Pre-Phase-1 recovery checkpoints — 2026-10-29

**Purpose:** Preserve recoverable Git refs and non-secret deployment topology before Shared Lightspeed Services Phase 1 development.

**Status:** Git branch snapshots created; NOT a complete disaster-recovery backup. Railway database contents, persistent volumes, live service secrets, GitHub issue/PR metadata, and Google Drive/Sheets contents were not exported. Do not represent this checkpoint as a verified full/offsite backup.

## GitHub snapshots

For every listed repository and every branch that was present during the inventory, a matching branch was created using this prefix:

`backup/pre-shared-services-phase1-20261029/<original-branch-name>`

| Repository | Branches snapshotted | Verified main/deployed source snapshot SHA |
| --- | ---: | --- |
| `Tawgod/Lightspeed` | 39 | `integration/hobby-corner-consolidation` = `f50c3309824986633c3ba37a95e6eb43aae15a3c` |
| `Tawgod/Hobby-Corner` | 5 | `main` = `f174a862406a80a2b4641b120659f309245b4bc3` |
| `Tawgod/Hobby-Corner-Discord-Bot` | 6 | `main` = `ce54862f67d678f8a1cb77302e520c59fb0c7118` |
| `Tawgod/Lightspeed-Importer` | 2 | `main` = `190c7a7d2bf9ebb119e98c00d625b70a6fa3869a` |
| `Tawgod/ai-integration-gateway` | 3 | `main` = `bf173104d963d7c617abbf2bf07044e695b45ec9` |
| `Tawgod/HobbyCon` | 2 | `main` = `ff4923caeacdda7100c29052a107a763c85576dc` |

**Total:** 57 source branches preserved as 57 separate GitHub recovery branches. Main/deployed sources above were compared to the corresponding backup refs with zero ahead/behind. Additional existing feature refs have not been exhaustively SHA-compared individually. These refs preserve Git commits in the same GitHub repositories; they are not independent physical, offsite, or downloadable backups. Keep them until full migration acceptance and an independent backup are complete. Do not merge backup branches into development branches.

## Railway deployment topology snapshot (read-only inventory)

- **Hobby Corner / production:** `lightspeed-api`, `timeclock`, `special-orders-test` (all sourced from `Tawgod/Lightspeed:integration/hobby-corner-consolidation`); `Hobby-Corner-Discord-Bot`, `Hobby-Corner-Rewards` (both sourced from `Tawgod/Hobby-Corner-Discord-Bot:main`); `migration-test-bsi117`; `Postgres`.
- Production Postgres uses a 5,000 MB Railway volume named `postgres-volume`, mounted at `/var/lib/postgresql/data`. This volume's **data was not backed up** by these Git refs.
- **Hobby Corner Integration Test / test:** `consignment-beta`, sourced from `Tawgod/Lightspeed:feature/consignment-layout-foundation`.
- **AI Integration Gateway / test:** `gemini-gateway-test` and `gemini-postgres-test` were staged but not deployed when inspected.
- No Railway configurations, databases, volumes, variables, deployments or credentials were modified or exported during this checkpoint. Secret *values* are deliberately omitted.

## Recovering source code

1. Locate the original repository and branch listed above.
2. Find its matching `backup/pre-shared-services-phase1-20261029/<original-branch>` recovery ref.
3. Compare against the affected branch and **restore through a reviewed PR or new branch**, rather than force-resetting production branches.
4. Verify Railway environment/source and application health separately; Git refs do **not** restore deployment configuration, credentials, Postgres data or external platform state.

## Remaining backup requirements for a genuine full disaster recovery copy

- Export and independently store a verified encrypted Postgres backup, with a test restore.
- Snapshot or export other persistent Railway data, if present; inventory here found the primary Postgres volume.
- Export relevant Railway configuration and keep credentials in an approved secret manager (not in source control).
- Export and independently archive business-critical Google Drive/Sheets data, if in scope.
- Mirror or bundle source repositories to independent storage and verify retrieval/restore.
- Record retention policy, recovery owner, and restore drill results.

## Development boundary

Phase 1 is restricted to isolated development branch changes, test files and documentation. Do not alter production Lightspeed data, Railway service configuration, production database or live Chrome extension. No production deployment approval is implied by this backup checkpoint.

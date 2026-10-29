# Shared Lightspeed Services — Current Handoff

**Last verified:** 2026-10-29
**Status:** In Development (Phase 1 development branch and CI ready; not deployed)

## Source

- Management repository: `Tawgod/Hobby-Corner:main`
- Architecture: `LIGHTSPEED_SHARED_SERVICES.md`
- Runtime repository: `Tawgod/Lightspeed`
- Authoritative integration branch: `integration/hobby-corner-consolidation`
- Pre-Phase-1 runtime baseline and backup source: `f50c3309824986633c3ba37a95e6eb43aae15a3c`
- Phase 1 branch: `feature/shared-lightspeed-services-phase1-20261029`
- Draft PR: https://github.com/Tawgod/Lightspeed/pull/32
- Candidate head: `c46e5a710bcacdf6a294ccbeece3baacee95ae1b`
- Git recovery record: `backups/2026-10-29-shared-services-phase1.md`

## Implemented

- Canonical transport `services/lightspeed/client.js`: server-only validated domain, local API-only path, timeout, read-only retry, correlation IDs, bounded errors and uncertain-write flag.
- Shared policy `services/lightspeed/policy.js`: explicit verified employee/service adapters, permission adapter, fail-closed behavior and server-construction-only write gates.
- Append-only audit contract `services/lightspeed/audit.js` requiring durable persistence.
- Idempotency contract `services/lightspeed/idempotency.js` requiring an atomic durable store, canonical SHA-256 payload fingerprinting, verified-only replay, and unknown-write handling.
- Read-only customer get/search contract `services/lightspeed/customers.js`, preserving existing Special Orders remote search query shape.
- Catalog read contract `services/lightspeed/catalog.js`, with category hierarchy parsing extracted from Special Orders plus supplier/brand/tag reads.
- Product identity candidate `services/lightspeed/productIdentity.js`: matching/token/scoring functions extracted verbatim from existing Special Orders; legacy route retains its copy pending full migration.
- Source inventory/new-direct-access check `scripts/audit-lightspeed-consumers.mjs` and new GitHub CI workflow.
- Contract tests `tests/shared-lightspeed-foundation.test.mjs`, plus developer contract document `docs/SHARED_LIGHTSPEED_PHASE1.md`.
- Recovery branches created for all 57 inventoried branches of six relevant GitHub repos before code work. Exact primary source SHAs and Railway topology captured in backup note.
- Supplemental source-derived PostgreSQL schema archive saved to private `Tawgod/Lightspeed-Importer:backup/hobby-corner-postgres-source-schema-20261029/backups/2026-10-29/`; 52 code-defined tables, no records, live catalog or data dump. See `backups/2026-10-29-shared-services-phase1.md`.

## Tested

- Automated foundation, customer, catalog, and product-scoring contract tests **passed** on the final candidate: GitHub Actions push `40902082758` and PR `40902093964`.
- Source inventory and added-direct-access CI check **passed** in those runs.
- Existing Scanner integration regression and Core Operations navigation/auth regression **passed** in the same PR run. Backend syntax check passed.
- Earlier failing CI on intermediate commits was corrected: the direct-access guard initially flagged its own test fixture, and policy tests were updated after write gates moved to server construction.
- Live employee/browser end-to-end regressions were not run, because no routes were switched.
- No browser, employee acceptance, Railway runtime or production API write tests performed.

## Deployed

- **No.** Draft PR #32 is unmerged.
- Railway production still references `Tawgod/Lightspeed:integration/hobby-corner-consolidation`.
- No production DB/schema, credentials, Railway service, Lightspeed records or extension release modified.

## Shared dependencies

- Existing staff-auth/Timeclock employee verification adapters.
- Existing Special Orders and split/recall clients and matching logic.
- Product Scanner isolated test tenant writer, which must remain separate.
- Product Manager, PO Companion, Consignment, Avery, Rewards, and RMS migration consumers.
- Durable Postgres-compatible audit/idempotency adapters must be designed and explicitly reviewed before any production write conversion.

## Shared files / integration surfaces affected

- `services/lightspeed/client.js`, `policy.js`, `audit.js`, `idempotency.js`, `customers.js`, `catalog.js`, `productIdentity.js` (new only).
- `tests/shared-lightspeed-foundation.test.mjs`; `scripts/audit-lightspeed-consumers.mjs`.
- `.github/workflows/shared-lightspeed-foundation.yml`; `docs/SHARED_LIGHTSPEED_PHASE1.md`.
- No changes to current `services/lightspeedApi.js`, `special-orders.js`, routes or extension.

## Remaining blockers

1. Backup is **not a complete offsite/project disaster recovery export**. Production Postgres volume data, secret/config backups and external business files still need a verified secure export and restore test. The new source-derived table schema archive is not a live database snapshot.
2. Audit and idempotency are interface contracts only; durable database adapters and safe recovery workflow are not implemented.
3. New transport/read contracts are not wired into the legacy compatibility wrapper or feature routes; backwards compatibility and live read endpoint/version/pagination tests must pass before switchover.
4. Source inventory is static/best-effort, not a guarantee of complete detection of all indirect/raw clients.
5. Feature-by-feature browser and runtime acceptance remain separate future gates.
6. PR #32 is draft; do not merge until coordinated review and explicit approval.

## Decisions needed

- Approve a secure verified backup/export of production Postgres and external business data through an appropriate mechanism.
- Approve production merges/deployments separately after completing CI and acceptance.
- Select durable audit/idempotency database tables/migrations and key retention/reconciliation policy before mutation conversion.

## Recommended next action

- Review draft PR #32. Next implement tested durable audit/idempotency adapters and compatibility migration for existing read-only Lightspeed calls; verify live read endpoint versions first. Preserve all existing current operations until parity checks succeed.
- Use the latest architecture and this handoff as the authoritative setup for new feature chats.

## Restrictions / safety

- No live Lightspeed mutation, production Railway deployment, credential migration, schema migration or Chrome extension publication authorized.
- No independent duplicate production writers; maintain Scanner isolated test and RMS migration exceptions.
- Don't delete old route paths until proven parity and regression tests pass.

## Documentation

- `LIGHTSPEED_SHARED_SERVICES.md`
- `backups/2026-10-29-shared-services-phase1.md`
- `prompts/lightspeed-shared-services/README.md`
- `Tawgod/Lightspeed:feature/shared-lightspeed-services-phase1-20261029/docs/SHARED_LIGHTSPEED_PHASE1.md`

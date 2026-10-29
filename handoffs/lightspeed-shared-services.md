# Shared Lightspeed Services — Current Handoff

**Last verified:** 2026-10-29  
**Status:** Testing — Phase 1 implementation completed; PR ready for review, not merged/deployed.

## Source

- Architecture: `Tawgod/Hobby-Corner:main/LIGHTSPEED_SHARED_SERVICES.md`
- Runtime repository: `Tawgod/Lightspeed`
- Current authoritative application branch: `integration/hobby-corner-consolidation`
- Phase 1 PR: https://github.com/Tawgod/Lightspeed/pull/32 (**ready for review**, not merged)
- Phase 1 branch: `feature/shared-lightspeed-services-phase1-20261029`
- Phase 1 candidate head: `7c20b3d9f90382b6fafeb5dc3d9a92108f4c14e1`
- Pre-change base/recovery checkpoint: `f50c3309824986633c3ba37a95e6eb43aae15a3c`
- Project source backup record: `backups/2026-10-29-shared-services-phase1.md`
- Private source schema reference: `Tawgod/Lightspeed-Importer:backup/hobby-corner-postgres-source-schema-20261029`

## Implemented

**Foundation modules completed on PR #32:**

- `services/lightspeed/client.js`: validated server-side transport, versioned local API paths, timeouts, safe GET/HEAD retries, normalized failures, correlation IDs.
- `services/lightspeed/policy.js`: verified employee/service permissions, fail-closed read/write control and construction-only write authorization.
- `services/lightspeed/staffAdapter.js`: adapter for existing Timeclock-backed `verifyEmployee(req)`; no parallel login.
- `services/lightspeed/audit.js`: append-only audit contract requiring a durable receipt.
- `services/lightspeed/idempotency.js`: stable request fingerprints, atomic lease, verified replay and blocked unknown writes.
- `services/lightspeed/postgres.js`: durable PostgreSQL Pool-backed audit and idempotency stores.
- `db/lightspeed_shared_foundation.sql`: additive, **unapplied** schema for audit and idempotency with append-only audit trigger.
- `services/lightspeed/mutations.js`: audited/authorized mutation pipeline with environment/tenant bound from trusted server configuration.
- `services/lightspeed/customers.js`: shared customer search/get read contracts.
- `services/lightspeed/catalog.js`: shared category/supplier/brand/tag read contracts and category hierarchy parser.
- `services/lightspeed/productIdentity.js`: extracted Special Orders product matching/scoring helpers.
- `services/lightspeed/legacyReadAdapter.js`: read-only compatibility adapter for the eight current shared-client read operations.
- Direct-client source inventory/guard and full Phase 1 CI suites.
- Documentation: `docs/SHARED_LIGHTSPEED_PHASE1.md` and `docs/LIGHTSPEED_DIRECT_ACCESS_INVENTORY.md`.

**Existing feature routes untouched.** There is no production code path using the new modules yet. Customer/catalog read interfaces and matching extraction are prepared for consumer conversion in Phase 2.

## Tested

- Contract/unit tests for new transport, policy, audit, idempotency, customer/catalog reads, product matching and staff authentication adapter: **passed**.
- Real PostgreSQL 16 test-container exercises atomic multi-claim concurrency, verified replay, unknown writes, tamper-blocking on append-only audit, and duplicate prevention: **passed**.
- Legacy read-client path/envelope fixture tests: **passed**.
- Scanner integration regression, Core Operations navigation/auth/session regression and backend syntax check: **passed**.
- Direct/raw Lightspeed access source audit: **passed**.
- Final PR CI: **SUCCESS**, https://github.com/Tawgod/Lightspeed/actions/runs/40911078591
- No live Lightspeed tenant or Railway database tests; current upstream API versions, pagination, production roles and browser behavior still require acceptance when feature consumers are migrated.

## Deployed

- **No.** PR #32 is unmerged and ready for review.
- Current Railway production services remain attached to the authoritative consolidated integration branch.
- No production DB migration, employee-table change, credential movement, Lightspeed write, or Chrome extension release occurred.

## Shared dependencies

- Existing staff-auth/Timeclock gateway and server-validated service identity.
- Core Special Orders customer/product matching, sales/split/recall, Scanner, Product Manager, PO Companion, Consignment, Avery, Rewards and migration flows.
- PostgreSQL schema migration is required **before** enabling any persistent shared mutation consumer, but is **not approved for Railway** yet.

## Remaining blockers / next gates

1. Merge/deployment is restricted until explicit coordinated approval. Railway production automatically tracks the consolidation branch.
2. Live test-store API read/permission/version/pagination contract verification has not happened and is a Phase 2 consumer-conversion gate.
3. Database migration is verified in disposable CI only; real Railway application needs release planning before deployment.
4. Production PostgreSQL full data backup unavailable; Git recovery branches and private source-derived schema reference do not include table rows. The user stated employee/timeclock data are not live and replaceable, but no existing data was removed.
5. Existing legacy write paths must remain until all consumers migrate and their own regressions pass.
6. Architecture source scanner is best-effort; manual pull-request review still required.

## Decisions needed

- Explicit approval before merging PR #32 to production-connected integration branch and allowing resulting automatic Railway deployments.
- Release coordination for shared PostgreSQL schema migration, if/when a production mutation consumer is introduced.
- Phase 2 priorities: customers and product identity first, then catalog/inventory/PO/sales/fulfillment reads.

## Recommended next action

**Phase 1 code complete; do not restart the foundation.** Review PR #32 and begin Phase 2 as a distinct read-service/consumer migration PR when authorized. Read current `LIGHTSPEED_SHARED_SERVICES.md` and `docs/SHARED_LIGHTSPEED_PHASE1.md` first. Update this handoff after each milestone.

## Restrictions / safety

- Do not merge, deploy production, run Railway schema migrations, move credentials, publish a Chrome extension, delete old clients or run live Lightspeed mutations without explicit approval.
- Preserve Scanner's isolated test-tenant writer and RMS bulk migration as documented exceptions.
- Validate data before any Lightspeed mutation. No automatic retry of ambiguous writes.

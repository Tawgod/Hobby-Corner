# Shared Lightspeed Services — Current Handoff

**Last verified:** 2026-10-29  
**Status:** In Development (Phase 2 read services); Phase 1 code complete/automated tests passed; neither PR deployed.

## Authoritative references

- Architecture: `Tawgod/Hobby-Corner:main/LIGHTSPEED_SHARED_SERVICES.md`
- Application integration base: `Tawgod/Lightspeed:integration/hobby-corner-consolidation`
- Phase 1 PR #32: https://github.com/Tawgod/Lightspeed/pull/32
  - Branch `feature/shared-lightspeed-services-phase1-20261029`
  - Head `7c20b3d9f90382b6fafeb5dc3d9a92108f4c14e1`
  - **Ready for review; unmerged; un-deployed**
- Phase 2 PR #33: https://github.com/Tawgod/Lightspeed/pull/33
  - Branch `feature/shared-lightspeed-services-phase2-reads-20261029`
  - Head `baef5f654df994e8e1ec23ad950b7d335b345817`
  - **Draft, stacked onto Phase 1 branch** (NOT the Railway-connected production branch)
- Recovery record: `backups/2026-10-29-shared-services-phase1.md`
- Private source-only Postgres schema archive: `Tawgod/Lightspeed-Importer:backup/hobby-corner-postgres-source-schema-20261029` (not a live database dump)

## Implemented

**Phase 1 — code implemented, reviewed by automated CI**

- Validated shared transport, Timeclock-backed employee/service policy and staff adapter, Postgres audit/idempotency durable adapters, guarded mutation orchestration and additive **unapplied** migration.
- Initial customer/catalog/product scoring reads and legacy read compatibility adapter.
- Source-level direct-access checker, contract tests and disposable Postgres/Scanner/Core Operations regressions.
- Final Phase 1 CI successful: `40911078591`.

**Phase 2 — read-service candidate implemented in development PR #33**

- Strict X-Series pagination module: version cursors for collection endpoints; offset-based `/search`; bounded pages/rows and fail-closed error behavior.
- `services/lightspeed/products.js`: exact remote SKU/product-code match, leading-zero fidelity, ambiguity and incomplete-verification safeguards.
- `services/lightspeed/inventory.js`: currently used product inventory GET read, no quantity fabrication.
- `services/lightspeed/sales.js`: read-only sale get/invoice/customer/state paths.
- `services/lightspeed/fulfillments.js`: read-only sale fulfillment list contract.
- `services/lightspeed/purchaseOrders.js`: complete PO list+line reads, supplier and SKU/UPC fidelity; no PO writes. PO Companion PR #31 mapping remains feature-owned.
- `services/lightspeed/storeCredit.js`: read-only customer credit balance contract.
- Phase 1 customer search and supplier/brand/tag reads updated to enforce complete pagination.
- `routes/sharedLightspeedRead.js`: **unmounted** read-only authenticated gateway factory, calling existing Timeclock-backed policy for each operation, with no-store and role checks. No `server.js` modification.
- `tests/shared-lightspeed-reads.test.mjs` for pagination, exact product IDs, missing data, PO fidelity and forbidden browser access.
 - Phase 2 now also includes `services/lightspeed/permissions.js`: explicit operation registry, Timeclock-backed employee read gate, independently verified service grants, and separate fail-closed write grants; no current route permissions changed.
- New centralized policy/behavior reference: `Tawgod/Hobby-Corner:main/SHARED_STAFF_AUTH_PERMISSIONS.md`.

- Full contract and migration plan in `Tawgod/Lightspeed:feature/shared-lightspeed-services-phase2-reads-20261029/docs/SHARED_LIGHTSPEED_PHASE2_READS.md`.

## Testing

- Phase 1 foundation + disposable Postgres 16 + Scanner and Core Operations tests passed: `40911078591`.
- Phase 2 read contracts, authenticated HTTP denial/permission checks, and inherited foundation/Scanner/Core Operations tests passed on PR commit `6879bc89447be537bb8f8caa1f9dd3d8d9b829e2`: CI `40913405875`.
- Current Phase 2 PR head `baef5f654df994e8e1ec23ad950b7d335b345817` CI **PASSED**: pull-request workflow `40919331215`, push workflow `40919318966`. Foundation, disposable PostgreSQL, strict read, staff permission matrix and identity-spoof tests, Scanner/Core Operations regressions, source audit and backend parse checks green.
- Current Lightspeed docs confirm version-based PO cursor, offset-based search, SKU filter semantics and 2026-04 inventory API POST read behavior; see Phase 2 docs for URLs. **No actual Lightspeed tenant API calls** and no browser/employee acceptance tests.
- Active PR #22/#24/#26/#28/#30/#31 changes were examined for shared service overlaps; current new shared paths are separate. Recheck at merge time.

## Deployed

- **No Phase 1 or Phase 2 changes deployed or merged.**
- Railway `lightspeed-api`, `timeclock`, `special-orders-test` remain sourced from `integration/hobby-corner-consolidation`; no staged Railway changes.
- No production database/schema change, Lightspeed record write, employee record deletion, credential relocation or Chrome extension release.

## Shared dependencies

- Phase 2 branch contains Phase 1 code and MUST be reconciled/retargeted when PR #32 merges.
- `SHARED_STAFF_AUTH_PERMISSIONS.md` is authoritative for new shared-service operation IDs and staff identity handling; the existing Timeclock Scanner path presently grants `canLookup` and `canApprove` to all active employees, irrespective of persisted flags. New shared production writes are denied by default. No existing feature access changed.
- PO Companion PR #31, Product Manager PR #28, Scanner PR #26, Core Ops PR #24, and Timeclock/Consignment candidate PRs remain independent feature workstreams.
- PO Companion and Ordering should consume the shared PO reader when the gateway is stable; preserve existing supplier-ID mapping, supplier SKUs/UPC leading zeros, review/draft state and Timeclock auth.
- Browser-facing gateway must not be mounted before live test-store read-contract and role authorization acceptance.
- Preserve Scanner's isolated test-store writer and RMS authorized migration boundary.

## Remaining tasks and blockers

1. Phase 1 PR #32 unmerged and production-connected. Requires explicit merge/deployment approval.
2. Phase 2 PR #33 is stacked/draft, with final-head CI passed. Require code review and controlled integration; **not yet a completed migration of consumers**.
3. Current PO/customer/product/inventory read API versions and response/pagination envelopes must be validated against read-only Lightspeed test tenant access before enabling gateway routes.
4. Inventory's documented bulk POST reads must be modeled separately; a POST for a read must not imply write authorization.
5. Feature-level consumer conversions, UI/browser acceptance, and write-service Phase 3 remain ahead.
6. Actual Railway Postgres table data was never dumped; backup consists of Git source refs and source-derived schema reference, not live employee/order rows.
7. The chat-transition inventory `HOBBY_CORNER_CHAT_TRANSITION.md` found only four existing stable handoffs. Most tool-specific development handoffs still need verification before older chats can be archived.

## Recommended next action

- Keep PR #32 ready for coordinated review and PR #33 draft stacked on it; do not merge production-connected branches automatically.
- Once authorization permits, test the read contracts against the test Lightspeed tenant and convert **one read-only consumer** (prefer PO Companion) with parity tests. Then stage other readers.
- If a current feature changes the relevant API contract, update this central handoff and `LIGHTSPEED_SHARED_SERVICES.md`.
- Prepare missing feature handoffs and fresh chat startup prompts using `HOBBY_CORNER_CHAT_TRANSITION.md` and `prompts/NEW_TOOL_CHAT_STARTUP.md`.

## Safety

Do not deploy production, apply the shared Postgres schema, move credentials, delete records, alter Chrome extension releases, or enable new production writes without explicit approval.

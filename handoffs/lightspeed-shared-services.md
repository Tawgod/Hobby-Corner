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
  - Head `bbfe24fd1d87f1b9dfa29b69df563a7dcf5e1e9a`
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

## Phase 1 foundation reliability hardening — 2026-10-29 (code/test verified)

- **PR #32** `Tawgod/Lightspeed:feature/shared-lightspeed-services-phase1-20261029@527d764c1331500a7f43b3874d62e146223eec1f`, still open/unmerged. Final-head CI [40954269174](https://github.com/Tawgod/Lightspeed/actions/runs/40954269174) **PASS** with new safety tests, disposable PostgreSQL 16, Scanner and Core Operations regressions and source guard.
- **PR #33** `feature/shared-lightspeed-services-phase2-reads-20261029@48d3258e37ea749a6541163ba70658577b90a8ad`, still draft/stacked on the older Phase 1 base. Phase 2 hardening was synchronized into the stacked branch; code/test-head CI [40954212260](https://github.com/Tawgod/Lightspeed/actions/runs/40954212260) **PASS**. Later documentation-only head has no new code. Before integration, explicitly reconcile its ancestry with finalized PR #32 and preserve Phase 2 read/permission tests.
- **Writes:** HTTP error responses on a write are now conservatively flagged `mayHaveWritten` (including 4xx/409/429/5xx), without automatic retry; read failures retain bounded safe-read retries.
- **Transport:** strict local API target validation (encoded dot/fragment/control rejection), streamed response byte bounds (2 MiB default), valid UTF-8 and JSON requirements; no raw invalid upstream response exposed.
- **Idempotency:** canonical plain-JSON mutation payloads with depth/node/size limits; reject dates/classes/getters/`toJSON`/undefined/BigInt/sparse or cyclic objects; writer receives a detached approved JSON snapshot, and payload changes before/after execution fail closed.
- **Recovery:** PostgreSQL idempotency now has a backend-only **read-only** `inspect(scope,key)` for fingerprint/state/timestamps, excluding lease, stored receipt and customer payloads. No automatic pending/unknown release/retry/reconciliation was added; manual vendor-side verification and separately approved recovery procedure remain required.
- **Tests additionally prove** the append-only audit blocks UPDATE/DELETE/TRUNCATE; lost terminal audit after a verified operation does not cause a second vendor write; and real PostgreSQL idempotency concurrency/replay remains intact.
- **Implemented:** candidate branch only. **Tested:** new CI passed, no real tenant/browser acceptance. **Deployed:** NO. No Railway DB migration, Lightspeed write, service route, Chrome release or production branch merge.

### Remaining release-quality gates after hardening

1. Code/security review and independent database schema/backup decision before PR #32 integration.
2. Explicit manager + Deployment Coordination authorization before any merge to the Railway-tracked integration branch, production DB migration or deployment.
3. Controlled test-tenant API version/response/employee permission validation; no production write trials.
4. Future mutation consumers must use the detached approved payload, store only minimal non-sensitive verified receipts, and implement a formal reviewed manual-unknown reconciliation runbook before writes can be enabled.
5. Coordinate PR #33 branch ancestry and consumer contract changes after PR #32 reaches approved integration state; never silently rebase onto production or alter live permissions.

## Testing

- Phase 1 foundation + disposable Postgres 16 + Scanner and Core Operations tests passed: `40911078591`.
- Phase 2 read contracts, authenticated HTTP denial/permission checks, and inherited foundation/Scanner/Core Operations tests passed on PR commit `6879bc89447be537bb8f8caa1f9dd3d8d9b829e2`: CI `40913405875`.
- Current Phase 2 PR head `bbfe24fd1d87f1b9dfa29b69df563a7dcf5e1e9a` CI **PASSED**: pull-request workflow `40920253500`, push workflow `40920241898`. Foundation, disposable PostgreSQL, strict read, staff permission matrix and identity-spoof tests, Scanner/Core Operations regressions, source audit and backend parse checks green.
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
7. The central transition inventory now contains stable handoffs for all currently tracked active workstreams, including the Hobby Corner Manager. Individual feature chats may still have manual acceptance or owner-signoff blockers before archival, but missing handoff files are no longer the blocker.

## Recommended next action

- Keep PR #32 ready for coordinated review and PR #33 draft stacked on it; do not merge production-connected branches automatically.
- Once authorization permits, test the read contracts against the test Lightspeed tenant and convert **one read-only consumer** (prefer PO Companion) with parity tests. Then stage other readers.
- If a current feature changes the relevant API contract, update this central handoff and `LIGHTSPEED_SHARED_SERVICES.md`.
- Keep existing feature handoffs current and start replacement chats from `HOBBY_CORNER_CHAT_TRANSITION.md` and `prompts/NEW_TOOL_CHAT_STARTUP.md`; do not recreate already-established handoff files.

## Safety

Do not deploy production, apply the shared Postgres schema, move credentials, delete records, alter Chrome extension releases, or enable new production writes without explicit approval.

## Planned cross-tool feature — Invoice Reconciliation (intake 2026-10-29)

- `FEATURE_INVOICE_RECONCILIATION.md` is the authoritative plan. No feature PR or implementation exists; **not part of Phase 1 #32 or Phase 2 #33 code scope**.
- Supplier mail + PDF invoice extraction → verified supplier/sender alias and tracking/PO evidence → **match existing PO or stage creation of new OPEN supplier PO** → invoice line/product matching and secondary supplier proposals → shared Railway PostgreSQL review → Product Manager invoice-specific review and Scanner supplier-cost matching → final separate approval → guarded Lightspeed PO create/update. **No physical receiving or stock-on-hand changes.**
- The new Invoice Updates Product Manager dropdown is shared across all logged-in employees, independent of employee-private layout profiles. Final PO write approval is a distinct permission, not inferred from read access or Scanner canApprove.
- 90%+ candidate identity match auto-stages only; cost/MSRP/quantity exceptions and new secondary supplier mappings remain reviewable. Supplier invoice quantity is **not** receiving quantity. Sender aliases from shipping firms/warehouses require verified supplier linking; Special Orders displays **On the way** tracking, never stock receipt.
- Official X-Series PO creation uses `POST /api/2026-07/consignments` with type SUPPLIER/OPEN; existing PO mutation APIs operate on SUPPLIER consignments. Generic bulk count/received operations have accumulation/status transition risks and must not be used to receive in this feature. Test an explicit safe status-aware apply contract and readback before any live write.
- Future Scanner bridge entry is QUEUED in extension release queue; no extension packaging or production deployment was performed.

## Post-archive operating agreement — owner-confirmed 2026-10-29

- This **Shared Lightspeed Services conversation remains open and active**, alongside Hobby Corner Manager, Shared UI/UX Coordination, Deployment Coordination and the separate RMS Item Migration chat. Archived tool-chat handoffs remain authoritative when feature work resumes.
- Maintain canonical Timeclock-backed identity, Lightspeed client/policy, read services and durable audit/idempotency/write gates for future tool consumers; do not create new tool-specific production Lightspeed clients.
- **Migration code reuse:** inspect the current `Tawgod/Hobby-Corner-Discord-Bot` RMS branch/source and `handoffs/rms-migration.md` before adapting any SKU/UPC identity, supplier mapping, category/brand normalization, collision detection, staged extraction or validation utility. Prefer pure shared helpers with fixtures and regression tests; coordinate any extraction with the ongoing RMS chat.
- Never import migration-only writers, RMS historical on-hand inventory values, source credentials or temporary schemas into the shared production adapter. Do not assume migration branch code is merged, deployed or safe for writes.
- Feature-specific development may be restarted in targeted chats from handoffs when approved/prioritized; existing PRs #32/#33 still need their own verification/acceptance/deployment decisions.


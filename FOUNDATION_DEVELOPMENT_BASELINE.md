# Shared business foundation — approved development baseline

**Last verified:** 2026-11-24  
**Owner:** Foundation Manager  
**Status:** ACCEPTED for isolated development and offline tests only. NOT approved for merge, deployment, production API traffic or database migration.

## Canonical source pin
- Repository: Tawgod/Lightspeed
- Development branch: feature/hc-foundation-reconcile-20261124
- Exact approved commit: 71a1cd6e312ed52efc1e9af9da85db6b02e3756c
- Draft [PR #78](https://github.com/Tawgod/Lightspeed/pull/78)
- Production-connected integration baseline remains integration/hobby-corner-consolidation @ 014a7a949fe570b756b48d8f59995c1b0a434859.
- Verified GitHub compare: three commits ahead, zero behind, 26 added files, no modified/deleted baseline files, mergeable draft.
- [CI run 45414393938](https://github.com/Tawgod/Lightspeed/actions/runs/45414393938): SUCCESS, exact approved commit, shared foundation 40/40 and Core Operations regression 11/11, no skipped or failed tests. Real disposable PostgreSQL concurrency/audit/idempotency test passed. Syntax and unmounted gateway checks passed. No live vendor calls, browser acceptance or production runtime changes.
- One branch-scoped workflow added for validation; no production deployment. npm dependencies installed from existing manifest without lockfile, so future acceptance must re-run tests and consider reproducible dependency locking.

## Rules for all five development workstreams
1. Read this file, SHARED_TOOL_DEPENDENCIES.md and your own handoff first. Use the approved SHA above as the common starting point for new independent branches. Existing work must be compared and selectively carried forward; never reset/delete an existing branch or overwrite another workstream's changes.
2. Do not separately merge, reimplement or cherry-pick the original PR #32/#33/#51 service candidates. Preserve original PRs pending eventual disposition.
3. Only the Foundation Manager coordinates changes to the common branch. New domain branches use the pinned commit as parent, with PRs targeting the reconciliation branch for manager review, not the production integration branch. No PR merge without explicit authorization.
4. Use existing injected readers/transport for offline fixtures. No routes mounted; no vendor writes, production data reads or database migration as part of this baseline approval.
5. Work in your assigned files, and coordinate any shared contract changes before implementation. Every meaningful milestone updates its own canonical handoff with exact commit, test results, deployment state, blockers and next recommended action.
6. Foundational Security exclusively owns identity, authentication, grants and permission decisions. The legacy staffAdapter and unmounted router are retained for compatibility testing only; no implicit permissions, no independent auth system.

## M1 assignments and protected surfaces
| Owner | Next scope | Files / handoff |
|---|---|---|
| Core API | Finalize versioned read/error envelope, explicit authorization integration seam, pagination/transport contract; evaluate strictly scoped POST-for-read separately | client.js, readCollection.js, audit/idempotency/postgres/mutations and integration lock files; handoffs/core-api-foundation.md |
| Product & Catalog | Exact match/collision/inactive coverage and catalog read parity; preserve existing matcher and identifier strings | productIdentity.js, products.js, catalog.js; handoffs/product-catalog-foundation.md |
| Inventory | Outlet stock snapshot contract and event coverage feasibility, timestamp and variance fixtures; do not assume available historical events | inventory.js and additive inventory modules; handoffs/inventory-foundation.md |
| Customer & Sales | Customer, sales, fulfillment and credit read parity and explicit coverage/PII projections | customers.js, sales.js, fulfillments.js, storeCredit.js; handoffs/customer-sales-foundation.md |
| Purchasing & Suppliers | PO reader/line identity and supplier references, review PO Companion PR #37; invoice contracts never imply receiving | purchaseOrders.js and additive supplier/invoice modules; handoffs/purchasing-supplier-foundation.md |

All JS files above refer to services/lightspeed/ unless otherwise specified. Core API and manager coordinate server.js, routes/sharedLightspeedRead.js, permissions seam, common schema and shared tests. No gateway mounting in M1. Supplier product mappings require Catalog/Purchasing review; receiving stock effects require Inventory/Purchasing review. Security-owned files off limits without coordination.

## Milestone exit and restrictions
- Reconciliation/isolated baseline acceptance: PASS. Core public contract freeze, domain parity, Security grant acceptance and live tenant evidence remain pending.
- No claim of production readiness, full feature completion, vendor API completeness, or permission acceptance.
- No production source branch changes, deployment, live writes, or DB migrations. PR #78 remains draft.
- Management PR #4 remains unmerged and needs reconciliation with the canonical manager handoff before any eventual authorized merge.
- Manager handoff: handoffs/foundation-manager.md.

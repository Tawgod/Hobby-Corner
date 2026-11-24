# Shared Inventory Foundation — Current Handoff

**Last verified:** 2026-11-24  
**Status:** M2 offline reconciliation safeguards PASS; live event verification blocked; draft PR #80; no deployment or inventory mutation  
**Owner:** Shared Inventory Foundation workstream; coordinate with Foundation Manager, Core API, Product & Catalog, Purchasing & Suppliers and Foundational Security.

## M2 checkpoint — 2026-11-24: event feasibility and reversal safeguards

**Status:** Offline reconciliation hardening PASS; live event source acceptance BLOCKED. Same independent draft [PR #80](https://github.com/Tawgod/Lightspeed/pull/80), branch `feature/inventory-foundation-m1-20261124`, approved parent `71a1cd6e312ed52efc1e9af9da85db6b02e3756c`, latest code/test commit `6f19473bbd48913c839ff75fc14a559a95aaf05f`. Only the two existing inventory-owned additive files changed. No shared transport, router, security, schema, or other owner files touched.

### Source feasibility matrix (public docs + repository source; no tenant traffic)
- Sales/returns: existing sales.js GET /api/2.0/sales/{id} and search by invoice/customer/state; single-page search does not establish complete history. Customer & Sales PR #81 evidence explicitly leaves physical pickup quantities, partial/return events and coverage unknown. [Sale webhook docs](https://x-series-api.lightspeedhq.com/v2026.07/docs/webhooks) show repeated payment/state/cost changes; none automatically establishes an inventory delta. Need physical event time, line ID, outlet and void/return relationship, pagination and watermark.
- Supplier receipt/transfer/stocktake: [stock order guide](https://x-series-api.lightspeedhq.com/v2026.04/docs/inventory_creating_stock_orders) provides consignment type/status, source/destination outlet and received_at; [webhook docs](https://x-series-api.lightspeedhq.com/v2026.07/docs/webhooks) describe consignment.receive as stock-affecting, and transfer send as source-outlet effect. [Scope reference](https://x-series-api.lightspeedhq.com/v2026.07/docs/scopes) lists consignments:read for historical consignments. Need per-line effective timestamps/partial receipts, both transfer legs, reversals, replay and complete historical window. Existing purchaseOrders.js exposes ordered quantities, not verified receipts. Purchasing handoff explicitly separates invoice/tracking from physical receipt. No PO/invoice/tracking automatically counts as receipt.
- Adjustment: [2026-07 GET stock_adjustments](https://x-series-api.lightspeedhq.com/v2026.07/reference/liststockadjustments) is version-paginated but explicitly requires inventory:write. Do not request or activate this scope; manager/Security must decide least-privilege alternative.
- Snapshot: [2026-04 release notes](https://x-series-api.lightspeedhq.com/docs/2026-04-release-notes) distinguish current_inventory_level and quantity_to_procure, product and variant filters. Snapshot versions are not a historical event timeline; inventory.update explicitly omits stock changes. Core owns POST-as-read allowlist. No source class has verified full tenant coverage; all six must remain unknown until actual evidence exists.

### Implementation / tests
- Added explicit linked full reversal validation to existing inventoryEvidence.js: exact original ID, strictly later event time, equal-and-opposite decimal delta, no reversal chain or repeated reversal; duplicate fingerprint includes reversal target. Sort physical effects chronologically and reject negative intermediate stock even if later receiving masks it. Equal-time effects grouped; boundary events remain review-only. No executable results.
- Four additional fixture tests: out-of-order duplicate return, pre-scan original with post-scan reversal, invalid/missing/partial/double reversal links, negative intermediate stock. Full local Node suite **11/11 PASS, zero failed/skipped**. Reconstructed local files match exact Git blobs: inventoryEvidence.js `743d2a29107bb1190c9ffb52bf8e8407bef58b9e`, tests/inventory-foundation-m1.test.mjs `3730c018852b166087f9b8c896652a1e5b639536`, original inventory.js `105a96f5451f10f38af6ec7c0588d795eb706653`. Command: node --test tests/inventory-foundation-m1.test.mjs. No full integration CI, browser, or tenant acceptance.
- Conservative choice: only full linked reversals supported; partial linked returns, reversal chains and corrections need explicit source semantics and review. Unlinked positive physical returns still require trusted source evidence; source adapters must establish when links are mandatory. Same-millisecond interior effects net together; no claim of their internal order. Negative expected physical stock flags review rather than proving source error. No new authority, event persistence, stock mutation or grant.

### Next recommended action
- Foundation Manager coordinate separately authorized read-only evidence capture (inventory records/levels, sales/returns, historical consignments, transfer/stocktake), adjustment scope decision, and source adapter contract with Core, Customer/Sales and Purchasing. Read-only evidence must exclude unrelated customer data. Establish trustworthy effective time and canonical event identity, complete window, late-arrival handling before accepting any event feed.
- In parallel, proceed with pure physical shelf/backroom observation and multi-item restock validation fixtures, pending Store Map/label location contract review. No shared location IDs invented in production. No merge/deploy/live API traffic or inventory adjustments authorized.

---

## M1 checkpoint — 2026-11-24 (approved baseline)

**Status: implemented and offline tested; draft review only.** [Lightspeed PR #80](https://github.com/Tawgod/Lightspeed/pull/80) targets `feature/hc-foundation-reconcile-20261124`, NOT production. Independent branch `feature/inventory-foundation-m1-20261124` starts at the exact approved PR #78 SHA `71a1cd6e312ed52efc1e9af9da85db6b02e3756c`; current head `9b6decef6c26af909c8c3f30f9af2066d9bce566`. PR metadata confirms two additive files, two commits, no deletions. Mergeability not independently established; draft remains open. Original PRs #32/#33 remain untouched.

### Implemented
- `services/lightspeed/inventoryEvidence.js`: additive, unmounted domain helper, consuming the existing injected `createLightspeedInventoryRead().byProduct` reader without altering it. Candidate synthetic projection requires exact product/outlet, unique row, decimal strings, separates on-hand from quantity-to-procure, leaves availability/committed and effective timestamp unknown. Observation time is NOT effective stock time. Projection always unverified and cannot itself authorize reconciliation.
- Pure `reconcileInventoryCount`: full-outlet count only, exact product/outlet/variant, canonical UTC millisecond instants, explicit maximum snapshot age, signed fixed-point arithmetic (up to 6 decimal input places; 12-place exact extended cost before currency rounding), full trusted coverage per sale/return/supplier receipt/transfer/adjustment/count, late-arrival and pagination checks, source linkage, deduplication by canonical event ID, rejects conflicting duplicates, invalid time, equal-boundary ambiguity, nonphysical/pending events, unknown cost. Positive/negative quantity and cost results. Every result is non-executable; no writer, persistence, auth or routes.
- `tests/inventory-foundation-m1.test.mjs`: dedicated fixture tests. No shared test files or transport changes. No duplicate inventory authority.

### Automated verification
- Local Node `node --test tests/inventory-foundation-m1.test.mjs`: **7 passed / 7 total, zero failures/skips**. Exact Git blob readback matched all three local tested files: unchanged baseline inventory.js `105a96f5451f10f38af6ec7c0588d795eb706653`, inventoryEvidence.js `484838c097ee9821960254527dd00fd0574934b8`, test `7774910d579852f4ff0b0bb4051a00362ccddae1`.
- Coverage: existing injected reader, zero vs unknown and ambiguous outlets, exact identifiers, sale/receipt after scan, out-of-order and duplicate events, other outlet, signed fractional variance, stale/unverified snapshot, missing event class, late arrivals, wrong sign, pending receipt, unknown source, invalid date, same-time boundary, shelf-only count and unverified cost.
- No new full integration CI run or browser/tenant test was performed; manager baseline CI is prior evidence only. Use focused local tests to conserve Actions minutes. No production API reads, writes, schema migrations, permission changes, deployment or merge.

### Event-source feasibility and limits
- Rechecked vendor docs: [2026-04 release notes](https://x-series-api.lightspeedhq.com/docs/2026-04-release-notes) distinguish inventory records/levels and current level vs quantity to procure; real payload shape/pagination still not verified. M1 projection recognizes a synthetic compatibility shape, NOT a validated inventory-level adapter; numeric wire values deliberately remain unknown.
- [Webhooks](https://x-series-api.lightspeedhq.com/docs/webhooks) explicitly omit some stock-changing events. [Sales 101](https://x-series-api.lightspeedhq.com/v2026.04/docs/sales_101) documents sale date, not proof of physical-effect instant. [Stock orders](https://x-series-api.lightspeedhq.com/v2026.04/docs/inventory_creating_stock_orders) distinguish supplier/transfer lifecycle, so open PO or invoice is never receipt evidence. [2026-07 fulfillment history](https://x-series-api.lightspeedhq.com/v2026.07/docs/2026-07-release-notes) records state changes but is not proven as physical inventory history. Adjustment read scope remains unverified for approved read-only tenant. All six physical event classes currently lack verified complete tenant coverage.
- Trusted coverage assertions are synthetic fixture inputs, NOT security grants, and cannot be supplied by browser clients. Future source adapters must prove canonical cross-source event IDs, reversal/correction semantics, completeness and time watermarks; do not use this calculation as proof of historical coverage.
- M1 deliberately does not normalize timezone offsets (adapters must do so), infer variant families, combine additive/shelf counts, implement count persistence or restock batches, choose a cost policy, or round to currency minor units. These remain review gates rather than assumptions.

### Next action / dependencies
- Foundation Manager review PR #80 and coordinate full integration tests; Core API owns allowlisted POST-for-read and common envelopes. Product/Catalog owns product/variant identity and cost basis. Customer/Sales and Purchasing must supply verified physical-effect event mappings, especially partial fulfillment and actual receipt timestamps. Store Map and labels own location references; Inventory owns later confirmed restock batch semantics. HC Secure owns all authorization.
- Obtain separately approved read-only tenant evidence before any production API traffic. Verify inventory-level payloads, actual event times, adjustment scope, complete history and late/corrected records. Extend synthetic reversal and multi-scan/physical location tests after those contracts are agreed. No native stocktake or adjustment execution.
- M1 isolated implementation checkpoint complete; domain parity and live event feasibility remain **blocked**. No production acceptance.

---

## Original audit and proposed contract (2026-11-23)

## Source
- Management repository: `Tawgod/Hobby-Corner:main`; this document is the handoff.
- Authoritative app: `Tawgod/Lightspeed:integration/hobby-corner-consolidation` (production-connected baseline).
- Candidate shared readers: `Tawgod/Lightspeed:feature/shared-lightspeed-services-phase2-reads-20261029`, PR #33 (draft, stacked on open PR #32).
- Candidate inventory module: `services/lightspeed/inventory.js` blob SHA `105a96f5451f10f38af6ec7c0588d795eb706653`. It implements `byProduct(productId)` via `GET /api/2026-04/inventory/{productId}` and returns vendor representations without synthesizing missing stock. This module was not found on the production integration branch.
- Related records: `SHARED_TOOL_DEPENDENCIES.md` F10–F15, F26–F29, F31–F33; `LIGHTSPEED_SHARED_SERVICES.md`; `handoffs/lightspeed-shared-services.md`, `handoffs/core-operations.md`, `handoffs/rms-migration.md`; candidate Phase 2 `docs/SHARED_LIGHTSPEED_PHASE2_READS.md`.
- PRs: https://github.com/Tawgod/Lightspeed/pull/32 and https://github.com/Tawgod/Lightspeed/pull/33 .

## Verified existing versus missing
| Capability | Evidence / boundary | Status |
|---|---|---|
| Outlet/product inventory read | PR #33 GET-by-product only, untouched vendor shape; not integrated into production | Candidate, read-only |
| Shared pagination, API version, transport and operation policy | PR #32/#33 candidate; shared read router unmounted, phase-2 not deployed | Candidate |
| Orders/receiving/fulfillment stock context | Existing Special Orders/Ordering workflows; Phase 2 PO, sales, fulfillment readers | Existing workflow / candidate readers; not a complete stock-event feed |
| Committed customer allocations | Existing Special Orders/Preorder workflow | Existing workflow, common normalized contract not verified |
| Event-by-event stock history with reliable event time and full completeness | No verified common reader or live tenant fixtures | Blocked pending source study |
| Inventory counts/scan timestamps/variance proposals | Not supplied by PR #33 | Planned |
| Shelf vs backroom records and confirmed multi-item movement | Store Map standalone; no common item/location/quantity ledger verified | Planned |
| Stock adjustment writer | No new authorized, audited, readback-verified shared writer | Out of scope for current milestone |
| Migration inventory baseline | RMS migration explicitly does **not** import RMS stock on-hand | Safeguard to preserve |

## Official X-Series reference findings (documentation, NOT tenant validation)
- 2026-04 inventory API documents `POST /api/2026-04/inventory` and `POST /api/2026-04/inventory_levels` as **read** operations with JSON filter bodies, plus GET per-product variants. Unlike mutations, these POST reads need an explicitly allowlisted read-only transport operation; do not globally turn on `mutationsAllowed`.
- Version 2026-04 distinguishes `current_inventory_level` from positive `quantity_to_procure`; never treat the latter as on-hand or blindly subtract it to obtain available quantity.
- `inventory.update` webhooks are useful invalidation signals but webhooks do **not** cover every stock-changing event; a webhook-only timeline cannot prove a sale/receipt did not occur after a scan.
- Lightspeed stocktakes are `STOCKTAKE` consignment workflows; creating an unfiltered, completed stocktake can reset products to zero. No stocktake creation or completion is permitted in this phase.
- The stock-adjustment list API documentation marks an `inventory:write` scope requirement; a read-only rollout must not request broad write scope simply to obtain history.
- Official documentation: https://x-series-api.lightspeedhq.com/v2026.04/docs/2026-04-release-notes , https://x-series-api.lightspeedhq.com/v2026.04/docs/webhooks , https://x-series-api.lightspeedhq.com/v2026.04/docs/inventory_creating_inventory_counts , https://x-series-api.lightspeedhq.com/v2026.07/reference/liststockadjustments .

## Proposed shared read contract v0 (design only, NOT implemented)
All identifiers are exact strings (including SKU/GTIN/UPC leading zeros). Every quantity is an explicit nullable decimal-compatible representation, never an inferred zero. All dates are timezone-aware UTC instants with source, precision and observed-at provenance. Every read includes `sourceSystem: "lightspeed-x"`, `outletId`, `productId`, `variantId` when applicable, `apiVersion`, `fetchedAt`, `sourceUpdatedAt: null | ISO8601`, `freshnessStatus: "fresh" | "stale" | "unknown"`, and `coverageStatus: "complete" | "partial" | "unknown"`. No automatic snapshot-as-history claims.

### A. StockSnapshot
```json
{
  "schemaVersion": "inventory.v0",
  "productId": "exact-string",
  "variantId": null,
  "outletId": "exact-string",
  "onHand": null,
  "available": null,
  "committed": null,
  "quantityToProcure": null,
  "quantityDefinitions": {"onHand": "vendor-current-level", "available": "unverified", "committed": "unverified"},
  "sourceUpdatedAt": null,
  "fetchedAt": "2026-11-23T00:00:00Z",
  "freshnessStatus": "unknown",
  "coverageStatus": "unknown",
  "sourceSystem": "lightspeed-x",
  "apiVersion": "2026-04"
}
```
`available` and `committed` must remain null until the Lightspeed and Special Orders allocation semantics have been proven together. Store locally derived committed allocations with `sourceSystem: "hobby-corner-orders"` separately, never mislabel as vendor-native.

### B. StockEvent / coverage
Fields: `eventId`, `sourceEventId`, `eventType` (sale, return, supplier_receipt, transfer, adjustment, count, allocation, release, unknown), `quantityDelta` (signed), `outletId`, `productId`, `variantId`, `occurredAt` (actual effective inventory change time, null if unknown), `sourceUpdatedAt`, `observedAt`, `sourceType`, `sourceRecordId`, `reversalOfEventId`, `confidence`, `coverageStatus`. Event records are evidence and must be deduplicated by source identity/version; an observed webhook time is NOT proof of effective stock-change time. Provide a separate `StockEventCoverage` for event type, outlet, time window, pagination complete, late-arrival lag, unavailable sources and watermarks. Do not assert exhaustive reconciliation without coverage.

### C. Inventory count scan, reconciliation and proposal
Persist immutable `countSessionId`, `countLineId`, `scanId`, exact identifier, outlet/location, `scannedAt`, `recordedAt`, `countedQuantity`, employee reference, count mode (incremental/additive versus replace), snapshot reference and valuation reference. Multiple scans must have unambiguous accumulation/deduplication policy.

Reconciliation uses stock events *after each line's scan timestamp*, not merely after session opening, and re-fetches authoritative vendor on-hand before proposing. For a complete trusted event feed:
`expectedNow = countedQuantity + sum(postScanSignedPhysicalDeltas)`;
`varianceQuantity = expectedNow - authoritativeOnHandNow`;
`varianceCost = varianceQuantity * verifiedUnitCost`.
Positive variance means count-implied stock exceeds Lightspeed; negative means shortage. Retain signed quantity and signed extended cost, currency and cost basis. If event coverage, actual effective timestamp, cost, or snapshot freshness is insufficient: `needsReview` with no executable proposal. Customer reservations are not physical deltas unless proven to affect stock. Count workflow never silently adjusts Lightspeed.

### D. Physical location/restock
`PhysicalLocation`: stable `locationId`, `storeId/outletId`, `area`, `kind` (floor, backroom, storage, other), shelf/bin code, Store Map pointer, label format, printable description, active flag; coordinate with Store Map and labels.
`ShelfStockObservation`: `productId`, `outletId`, `locationId`, `shelfCount`, `countedAt`, `observer`, `sourceSnapshotRef`, `confidence`.
`RestockBatch`: immutable batch with 1+ `RestockLine` entries; each contains planned quantity, **employee-confirmed moved quantity**, floor origin/destination/storage shelf IDs, confirmation timestamp and worker ID. Support partial/zero movement and atomic multi-item submission with per-line validation. Shelf/backroom location quantities are operational observations, NOT a separate canonical Lightspeed total. Proposed backroom availability is `max(0, onHand - observedFloorShelfTotal)` **only if** all floor shelves, commits/holds and reconciliation gaps have been checked; otherwise mark estimated/unverified. Movement from backroom to shelf does not modify total Lightspeed on-hand.

### E. AdjustmentProposal (no execute in v0)
Fields: `proposalId`, `countSessionId`, `snapshotBefore`, `completeEventCoverageRef`, `signedQuantityDelta`, `signedCostImpact`, `unitCostBasis`, `reason`, `employeeActor`, `approvalStatus`, `expiresAt`, `expectedSourceVersion`; eventual execution requires HC Secure approved exact operation grant plus Core API audited idempotency, approved detached payload, no unsafe retry, source freshness revalidation and post-write readback. No grant or writer implemented here.

## Audit questions / acceptance gates
1. Verify actual tenant endpoint permissions, outlet mapping, `2026-04` response shapes, timestamp fields/version semantics, read-only POST inventory support and at least 3 product/variant/outlet fixtures using read-only credentials. Never infer completeness from one sample.
2. Establish sales, returns, supplier deliveries, transfers, stocktakes and adjustments event-source matrix: endpoints, scope, effective timestamp, status transitions, pagination, historical depth, corrections/deletions, latency, readback and gaps. Determine if adjustments history can be inspected without `inventory:write` scope; if not, explicitly leave uncovered.
3. Inspect exact production `server.js`/Special Orders allocation and Ordering receiving code paths, DB persistence and time semantics with their owners; do not duplicate/replace existing business writers.
4. Agree with Product Foundation on canonical `productId/variantId/outletId` identity; with Core API on POST-as-read allowlisting, error/freshness/coverage envelopes; with Purchasing on delivery/PO event mapping; with Store Map on shelf IDs and label metadata; with Foundational Security on grant IDs.
5. Design and run synthetic fixture tests covering per-scan sale and receipt after scan, out-of-order events, return reversal, duplicate webhook, time-zone conversion, partial/pending receipt, stale snapshot, missing history, two outlets, two floor shelves, signed cost variance, batch partial confirmation and idempotency. Then read-only tenant acceptance. No prod writes/deployment.

## Implemented
- Read-only audit of management dependency register, phase-2 inventory reader and documented API capabilities.
- This shared interface **proposal/documentation**, no new source code or vendor API calls.
- No competing total-inventory ledger or migrated RMS on-hand.

## Tested
- Automated: not run for a new inventory implementation; no new runtime implementation exists.
- Browser/employee: not run.
- Real tenant event data/timestamps: **not verified**. Existing PR #33 CI is not inventory event-coverage evidence.
- Initial handoff readback verified on 2026-11-23.

## Deployed
- New Inventory Foundation: **NOT deployed**; no Railway configuration, migration, stock adjustment or count completion.
- Preexisting live Core Operations/Ordering and Store Map are independent and should remain unchanged.

## Shared dependencies
- Core API F01/F27/F28/F29; Product & Catalog F02/F03/F08; Customer/Sales F13/F19/F22; Purchasing F15/F20; labels F25/F26; Store Map F31; RMS migration F33.
- Foundation Manager owns sequencing and interface signoff. HC Secure owns identity/grants.

## Shared files / integration surfaces affected
- Documentation only: `Tawgod/Hobby-Corner:main/handoffs/inventory-foundation.md`.
- No production app file edited.

## Remaining blockers
- Real tenant stock-event coverage/timestamps and outlet-specific semantics.
- Data source access for adjustments without privileged write scope.
- Actual shelf/location schema and confirmed receiving/allocation event mapping.
- Read-only POST support in Core shared transport.
- Explicitly accepted count/reconciliation valuation and stale-data policy.

## Decisions needed
- Count sessions entirely local staged records vs future native Lightspeed STOCKTAKE conversion; do **not** initiate native count until reviewed.
- Cost valuation priority (vendor average cost vs confirmed landed/latest purchase cost), currency and rounding.
- Coverage freshness tolerance and treatment of simultaneous scans/sales.
- Whether shelf observations may be operationally estimated when some floor shelves are not measured.

## Recommended next action
- Foundation Manager and Core API agree on `inventory.v0` read envelope and allowlisted POST-as-read policy.
- Coordinate with Customer/Sales and Purchasing owners for full stock-event source matrix, and Store Map owner for location identifiers.
- Implement **isolated synthetic read-only contract tests** on an Inventory-only branch after source-level acceptance, then validate real tenant reads with separately approved read access. Do not merge/deploy.

## Restrictions / safety
- No production inventory changes, physical stocktake completion, vendor write scopes, migrations, Railway deployment, or bypass of existing Special Orders/Ordering production workflows without explicit approval.

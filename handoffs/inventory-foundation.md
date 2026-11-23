# Shared Inventory Foundation — Current Handoff

**Last verified:** 2026-11-23  
**Status:** Read-only source audit / proposed contract; no new runtime, deployment or inventory mutation  
**Owner:** Shared Inventory Foundation workstream; coordinate with Foundation Manager, Core API, Product & Catalog, Purchasing & Suppliers and Foundational Security.

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
- Readback of this GitHub handoff after creation: pending.

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

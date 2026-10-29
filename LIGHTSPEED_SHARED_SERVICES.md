# Hobby Corner Shared Lightspeed Services Architecture

**Status:** In Development / Coordination  
**Last verified:** 2026-10-29  
**Authoritative application base:** `Tawgod/Lightspeed:integration/hobby-corner-consolidation`  
**Verified consolidated head 2026-10-29:** `f50c3309824986633c3ba37a95e6eb43aae15a3c`

## Purpose

Hobby Corner currently has a mixture of shared Lightspeed code and feature-specific Lightspeed API calls. This document defines the target architecture so customer, product, inventory, sales, purchase-order and other Lightspeed operations are implemented once and reused by all Hobby Corner tools.

The goal is not to force every feature into one application. Feature workflows remain modular. The shared Lightspeed layer owns the common interaction rules, while each feature owns its business workflow.

## Implementation checkpoint — 2026-10-29

**Phase 1 code implemented and tested, not deployed.** Shared transport, policy/Timeclock adapter, durable PostgreSQL audit/idempotency, guarded mutation orchestration, read-only legacy adapter, customer/catalog reads, and candidate Special Orders matching extraction are implemented on `Tawgod/Lightspeed:feature/shared-lightspeed-services-phase1-20261029` in PR #32. Final CI `40911078591` passed including a disposable PostgreSQL integration run, Scanner regression and Core Operations auth/navigation regression.

The code has **not been merged into** `integration/hobby-corner-consolidation`; existing production feature clients are still active. The additive SQL migration has **not been applied to Railway**. Phase 2 is consumer conversion, not a reason to rewrite the foundation. See `handoffs/lightspeed-shared-services.md` for current verified status and PR release gates. Recovery refs and the limitations of the source-derived Postgres schema archive are recorded in `backups/2026-10-29-shared-services-phase1.md`.

## Phase 2 implementation checkpoint — 2026-10-29

**In Development / Testing, not merged or deployed.** Stacked draft PR #33 (`Tawgod/Lightspeed:feature/shared-lightspeed-services-phase2-reads-20261029`) is based on Phase 1 PR #32, not the production-connected integration branch. Its candidate includes shared read-only modules for Products, Inventory, Sales, Fulfillments, Purchase Orders and Store Credit; hardened Customer and Catalog pagination; and an **unmounted** Timeclock-authorized read-gateway router.

Current X-Series documentation confirms version cursors for PO/collection pagination and offset pagination for `/search`; these distinct contracts are unit-tested. Initial Phase 2 CI `40913405875` passed. No feature workflow has yet been switched to the shared gateway, no new production write is enabled, and live vendor API/role validation is a remaining gate. See `handoffs/lightspeed-shared-services.md` and `Tawgod/Lightspeed:feature/shared-lightspeed-services-phase2-reads-20261029/docs/SHARED_LIGHTSPEED_PHASE2_READS.md`.

Phase 2 includes an **unmounted and non-deployed** shared operation permission matrix under `services/lightspeed/permissions.js` (PR #33). New shared reads use current Timeclock verified active employee lookup permission; new production writes remain disabled by default even when Scanner review approval is true. The central current/pending permission distinction is recorded in `SHARED_STAFF_AUTH_PERMISSIONS.md`.

## Future shared feature — Invoice Reconciliation (planned, not a new tool)

Reference: `FEATURE_INVOICE_RECONCILIATION.md`. This is planned functionality across **existing Product Manager, Product Scanner, Special Orders, Ordering and PO Companion**, not another independently owned application or unapproved production writer.

The future invoice ingest worker will classify supplier invoice, preorder, shipping/tracking and credit-note emails; securely extract PDF line items; and stage each invoice in shared Railway PostgreSQL with a uniquely verified PO association. Product Manager's employee-independent **Invoice Updates** selector displays only one invoice's unresolved product/price/supplier proposals at a time; Scanner submits verified UPC/SKU/supplier-cost matching proposals via backend APIs. Any authenticated employee may discover the shared invoice list, but final PO application requires a separate authorized role and complete invoice approval.

90%+ match confidence **auto-stages a candidate**, never silently creates a product or updates Lightspeed before approval. Secondary suppliers must not replace primary supplier mappings. Quantities `ordered`, `invoiced` and `received` are separate: a supplier invoice alone must never mark stock physically received.

X-Series PO mutations currently run through SUPPLIER `consignments`, not the new PO read API. Field `count` can have accumulation semantics and `received` may change PO status to DISPATCHED; the future write adapter must implement status-specific, nonduplicating application and readback rather than assuming safe generic bulk updates. Use the existing Phase 1 audit/idempotency/write policy and Phase 2 PO/product/catalog reads (PR #32/#33), and keep any browser/extension mutation disabled.

No new feature source or live email/PO changes have been made. The future Scanner extension bridge is recorded as QUEUED in `CHROME_EXTENSION_RELEASE_QUEUE.md`; it is not part of the current release candidate.

## Current state

The current consolidated repository already contains useful shared pieces:

- `services/lightspeedApi.js` provides a reusable Lightspeed client for several sale, fulfillment, customer/product read and store-credit operations.
- Order Split / Recall routes already reuse that shared client in several places.
- Special Orders contains mature product matching, duplicate prevention and controlled product-create behavior in `routes/specialOrderProducts.js`.
- Product Scanner intentionally reuses Special Orders matching contracts instead of owning an independent production product creator.
- Special Orders currently owns customer creation/update logic directly in `special-orders.js`.
- Special Orders also contains direct/versioned Lightspeed fetch helpers and several direct inventory, sales, fulfillment and purchase-order calls.
- `services/scannerIsolatedTestWriter.js` is intentionally isolated to a separate Lightspeed test tenant and must not become a production write path.
- Rewards currently has its own Python Lightspeed HTTP client in `Tawgod/Hobby-Corner-Discord-Bot:main/rewards_service.py`.
- RMS/product migration has separate bulk-write logic and should remain a controlled migration path, not an ordinary staff write path.

This means some behavior is already shared, but there is not yet one canonical service contract that every current and future tool consumes.

## Target architecture

Cross-service consumers should use the Hobby Corner `lightspeed-api` backend as the canonical Lightspeed gateway rather than independently holding Lightspeed credentials and implementing their own API rules.

Inside `Tawgod/Lightspeed`, the gateway should use modular domain services under a shared namespace such as:

```
services/lightspeed/
  client.js
  policy.js
  audit.js
  idempotency.js
  customers.js
  productIdentity.js
  products.js
  catalog.js
  inventory.js
  sales.js
  fulfillments.js
  purchaseOrders.js
  storeCredit.js
  customFields.js
  media.js
```

The exact filenames may change during implementation, but the ownership boundaries below should remain stable.

Feature workflows such as Special Orders, Scanner, Consignment, Product Manager, Repairs, Back Room Inventory, Split/Recall and Reservations should call these shared modules or their authenticated backend API contracts rather than creating parallel raw Lightspeed clients.

## Modules to synchronize

### 1. Transport / raw Lightspeed client

**Proposed owner:** `services/lightspeed/client.js`

Responsibilities:
- base URL and authentication headers
- API version selection
- request serialization and response parsing
- normalized Lightspeed errors
- request timeouts
- safe retry rules for read/idempotent operations
- correlation/request IDs for audit tracing
- pagination helpers

Migration target:
- merge the useful behavior of current `services/lightspeedApi.js`, `special-orders.js` versioned/raw fetch helpers and other feature-specific raw HTTP wrappers.
- feature code should not call `*.retail.lightspeed.app` directly after conversion unless explicitly documented as an exception.

### 2. Employee/service authorization and write policy

**Proposed owner:** `services/lightspeed/policy.js`

Responsibilities:
- Timeclock-backed employee identity for employee-initiated operations
- service-to-service authorization for background jobs
- per-operation permissions
- read-only vs write-capable policy
- production/test environment gates
- feature flags for dangerous writes
- fail-closed behavior when authorization cannot be verified

This should complement, not replace, the existing shared staff-auth gateway.

### 3. Idempotency and mutation audit

**Proposed owners:** `services/lightspeed/idempotency.js`, `services/lightspeed/audit.js`

Responsibilities:
- idempotency key for create/update operations
- source tool and employee/service identity
- target Lightspeed entity and operation
- request fingerprint
- result ID/status
- read-back verification
- partial/unknown-write state when a request may have succeeded before failure
- retry safety
- immutable audit history

Every production-capable create/update/delete/credit mutation should pass through this layer.

### 4. Customers

**Proposed owner:** `services/lightspeed/customers.js`

Canonical operations:
- search/match customer
- get customer
- create customer
- update customer
- normalize name/contact/address fields
- duplicate checks before creation
- return a stable normalized customer model

Current implementation to reconcile:
- `special-orders.js` `/customers/search`
- `special-orders.js` `/customers/create-lightspeed`
- customer profile update/sync logic
- Rewards/customer identity consumers
- future Service Requests and Reservations customer workflows

Local Hobby Corner customer-profile synchronization may remain a separate repository/service responsibility, but the Lightspeed operation itself should be canonical.

### 5. Product identity and duplicate matching

**Proposed owner:** `services/lightspeed/productIdentity.js`

Canonical operations:
- normalize SKU/UPC/EAN/other product codes
- match exact Lightspeed SKU/product code
- match supplier SKU
- local product-registry match
- remote Lightspeed match
- fuzzy/advisory match where appropriate
- fail closed when remote verification is required but unavailable
- return match confidence/reasons in one shared shape

Current implementation to preserve:
- mature Special Orders product matching in `routes/specialOrderProducts.js`
- Scanner's existing Special Orders match adapter/contracts

This is a high-value shared module and should be extracted rather than rewritten.

### 6. Products / catalog writes

**Proposed owner:** `services/lightspeed/products.js`

Canonical operations:
- get/search product
- create product
- update product
- controlled activation/status changes
- validate required fields
- apply Hobby Corner tax/price normalization
- supplier/category/brand/tag resolution
- require product-identity duplicate verification before create
- invoke audit/idempotency/write policy
- read back and verify successful mutation

Current production-capable logic to preserve:
- `routes/specialOrderProducts.js` `/products/create-lightspeed`
- required-field validation
- duplicate protection
- supplier resolution
- tax-exclusive normalization
- `Added by SO` audit tag behavior or its successor policy
- local product synchronization hooks

Product Manager, Scanner, Consignment and Repairs must not create independent production product writers.

### 7. Catalog reference data

**Proposed owner:** `services/lightspeed/catalog.js`

Canonical operations:
- suppliers
- brands
- product categories
- tags
- exact-name/ID resolution
- cache/read-through rules where safe

Current scattered category/brand/supplier/tag logic should converge here.

### 8. Product media

**Proposed owner:** `services/lightspeed/media.js`

Canonical operations:
- validate allowed source URL/content type/size
- upload product image
- safe image read-back/verification

Current Special Orders image-upload behavior should be extracted rather than duplicated by Product Manager or migration-facing staff tools.

Bulk migration image handling may remain a migration adapter but should share validation rules where practical.

### 9. Inventory

**Proposed owner:** `services/lightspeed/inventory.js`

Canonical operations:
- read inventory by product/outlet
- normalize on-hand/available quantities
- future controlled inventory adjustments only after explicit design/authorization
- outlet resolution

Consumers:
- Back Room Inventory
- Product Manager
- Special Orders/receiving
- Product Scanner
- Consignment matching/read-only review

Back Room Inventory must remain a Hobby Corner location/capacity overlay and must not become a second source of truth for total Lightspeed inventory.

### 10. Sales / work orders

**Proposed owner:** `services/lightspeed/sales.js`

Canonical operations:
- get/search sales
- create sale/work order
- update sale
- customer/sale lookup
- line normalization
- safe readback
- controlled write policy

Higher-level workflows such as deposit conversion, work-order combine and future repair checkout remain feature orchestration modules, but should use the canonical sales service.

### 11. Fulfillment / pickup

**Proposed owner:** `services/lightspeed/fulfillments.js`

Canonical operations:
- list fulfillments for sale
- read fulfillment state
- normalize pickup/fulfillment data

Split / Recall / Partial Pickup remains its own workflow but should consume this module rather than raw API calls.

### 12. Purchase Orders

**Proposed owner:** `services/lightspeed/purchaseOrders.js`

Canonical operations:
- list/read current purchase orders
- retrieve line items
- normalize supplier/product/quantity/status data
- controlled PO create/update operations if later approved
- read-back verification

Consumers:
- Ordering
- PO Companion
- Avery PO Label Maker
- Special Orders supplier purchasing/receiving
- future Repairs parts-ordering workflows

PO Companion should be a consumer of this shared read contract, not the owner of an independent Lightspeed PO client.

### 13. Store credit

**Proposed owner:** `services/lightspeed/storeCredit.js`

Canonical operations:
- get store credit
- post store-credit transaction
- idempotency
- exact delayed-credit policy hooks
- audit/readback

Primary future consumer:
- Consignment

No Consignment branch should own its own raw production store-credit writer.

### 14. Customer custom fields

**Proposed owner:** `services/lightspeed/customFields.js`

Canonical operations:
- list/ensure approved Hobby Corner custom fields
- set field values
- type/value normalization
- audit/write policy

Primary current consumer:
- Rewards service

Rewards currently has its own Python Lightspeed HTTP implementation for customer custom fields. The long-term target is for Rewards to call the canonical Hobby Corner backend contract instead of storing a second production Lightspeed access implementation.

## Feature orchestration that should remain feature-owned

Centralization should not turn feature business logic into one giant service.

These remain separate orchestration domains:
- Special Orders workflow/status/receiving/notifications
- Scanner supplier-page capture/review/proposal UX
- Product Manager editing/review UX
- Consignment intake/aging/credit eligibility workflow
- Split / Recall / Partial Pickup workflow
- Repair/service-ticket lifecycle
- Back Room shelf-capacity/restock workflow
- Game Room reservation/calendar/resource logic
- Rewards tier calculation
- RMS migration batch selection/review/cutover logic

They should consume shared Lightspeed domain contracts.

## Explicit exceptions

### Scanner isolated test-tenant writer

`services/scannerIsolatedTestWriter.js` should remain a separate, test-only writer with:
- a domain different from production
- explicit isolated-tenant confirmation
- separate credentials
- disabled-by-default behavior

It may reuse shared payload validation/identity helpers, but must never silently fall through to production credentials.

### RMS / bulk migration

Bulk migration should remain a separately authorized migration path with:
- bounded/controlled writes
- migration-specific review gates
- dry-run support
- cutover-specific readback
- separate audit context

Where practical, it should reuse shared identity normalization and payload validation, but should not become an ordinary employee-facing product-create endpoint.

## API boundary for other repositories/services

Cross-repository services such as Rewards should prefer authenticated Hobby Corner internal API endpoints on `lightspeed-api` over direct Lightspeed credentials.

Suggested route family:

```
/api/hc-lightspeed/customers/...
/api/hc-lightspeed/products/...
/api/hc-lightspeed/inventory/...
/api/hc-lightspeed/sales/...
/api/hc-lightspeed/fulfillments/...
/api/hc-lightspeed/purchase-orders/...
/api/hc-lightspeed/store-credit/...
/api/hc-lightspeed/custom-fields/...
```

Exact route names may change, but one canonical contract should serve all consumers.

## Conversion rules

1. Do not rewrite working behavior merely to centralize it. Extract tested logic with small changes.
2. Read paths should generally move first, followed by controlled write paths.
3. Preserve current request/response behavior until consumers are migrated and tested.
4. No feature may introduce a new raw production Lightspeed API writer when an equivalent shared service exists.
5. New production mutations require Timeclock/service authorization, write policy, idempotency, audit and readback.
6. New cross-service consumers should not receive production Lightspeed credentials merely for convenience.
7. Keep test tenant, beta and migration credentials isolated.
8. Preserve existing fail-closed behavior.
9. Update the central handoff and relevant feature handoffs after each conversion.
10. Do not remove an old code path until all known consumers have moved and regression tests pass.

## Recommended conversion order

### Phase 1 — foundation
1. Normalize/replace the raw transport client.
2. Add policy, audit and idempotency contracts.
3. Add source/consumer inventory tests that identify direct raw Lightspeed access.

### Phase 2 — identity/read services
4. Extract customer read/search.
5. Extract product identity/matching.
6. Extract catalog reference data.
7. Extract inventory reads.
8. Extract PO reads.
9. Extract sales/fulfillment reads.

### Phase 3 — writes
10. Extract customer create/update.
11. Extract product create/update and image upload.
12. Extract sales mutations.
13. Extract store-credit transactions.
14. Extract custom-field writes.

### Phase 4 — consumer conversion
15. Core Operations / Special Orders.
16. Scanner / Toolkit.
17. Product Manager.
18. PO Companion.
19. Consignment.
20. Timeclock / Split Recall.
21. Avery Labels.
22. Rewards/customer sync.
23. RMS migration adapters where appropriate.
24. Planned Back Room Inventory, Repairs and Reservations start directly on the new contracts.

## Required testing

Each migrated domain module should have:
- unit tests
- request/response contract tests
- auth/write-policy tests
- duplicate/idempotency tests for mutations
- error/partial-write behavior tests
- representative read-back tests
- feature regressions for every migrated consumer

Do not claim a consumer converted until its old raw call path is no longer used in normal operation and the consumer's own acceptance tests pass.

## Coordination files

- This document: `Tawgod/Hobby-Corner:main/LIGHTSPEED_SHARED_SERVICES.md`
- Conversion prompts/index: `Tawgod/Hobby-Corner:main/prompts/lightspeed-shared-services/`
- Current feature snapshots: `Tawgod/Hobby-Corner:main/handoffs/`
- Chrome integration: `CHROME_EXTENSION_INTEGRATION.md`
- Chrome release state: `CHROME_EXTENSION_RELEASE_QUEUE.md`
- Project registry: `HOBBY_CORNER_PROJECT.md`

## Release / deployment restriction

This architecture note authorizes coordination and refactoring planning only. It does not authorize production Lightspeed writes, Railway deployment, credential movement, database migrations, Chrome packaging, or deletion of old implementations.

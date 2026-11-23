# Hobby Corner — Foundation Manager Coordination Register

**Audit date:** 2026-11-23  
**Owner:** Foundation Manager conversation  
**Source of truth:** Tawgod/Hobby-Corner:main for management; Tawgod/Lightspeed:integration/hobby-corner-consolidation for production-connected app  
**Status:** Coordination milestone M0 audited; all five workstreams unassigned to separate conversations until explicitly started; no shared-runtime release authorized.

## Baseline and evidence
- SHARED_TOOL_DEPENDENCIES.md has F01–F36 capability catalog and consumer matrix. Do not create another parallel dependency numbering scheme.
- LIGHTSPEED_SHARED_SERVICES.md defines common service architecture.
- Existing candidate [Lightspeed PR #32](https://github.com/Tawgod/Lightspeed/pull/32) (Phase 1) is **open, unmerged**, based on the production-connected integration branch. It contains transport, product identity, customer/catalog reads, policy/audit/idempotency/mutation infrastructure and tests. Its candidate security files are **not** authority to duplicate Foundational Security.
- Existing [Lightspeed PR #33](https://github.com/Tawgod/Lightspeed/pull/33) (Phase 2) is **open, unmerged**, stacked on #32. It has candidate read-only products, inventory, sales, fulfillments, PO, store credit, shared read router and permissions. Not a mounted or deployed shared gateway.
- Railway Hobby Corner/production: lightspeed-api, special-orders-test (despite name a production environment Core Operations app), timeclock, store-map, Hobby-Corner-Discord-Bot, Hobby-Corner-Rewards, Postgres. Latest deployments SUCCESS; feature acceptance not implied. Railway Hobby Corner Integration Test/test has an independent staged patch; avoid applying it for shared API work.
- Railway HC Secure/staging: auth service, PG18 and volume are **staged-create** only; no deployed universal identity. HC Employee Read Pilot/test is live synthetic-only with separate PG.
- Existing feature handoffs: handoffs/core-operations.md, product-manager.md, product-scanner.md, po-companion.md, consignment.md, rms-migration.md, lightspeed-shared-services.md, shared-tool-dependencies.md.
- No production data, deployed service, branch merge, or permissions altered by this audit.

## Ownership matrix (exclusive business-contract owner; feature UI/workflow owners remain separate)

| Workstream | Exclusive foundation authority | F IDs primarily owned | Must not own |
|---|---|---|---|
| Core API | Lightspeed transport, normalize/errors, backend API schema/versioning, observability, transaction/outbox, mutation audit/idempotency, shared gateway integration | F01, F27, F29, F30, F32; integration seam F28 only | Identity verification, grants, passkeys, staff auth implementation (Foundational Security); feature UIs |
| Product & Catalog | Product identity, exact SKU/GTIN/UPC matching, catalog reads, controlled product writes, categories/brands/media/prices/reference mappings | F02–F09, product facet F26 | Inventory quantities, supplier PO orchestration, independently implemented product writer |
| Inventory | Outlet snapshots, evidence-backed event history, count/variance, reservation semantics, store/shelf location, receiving inventory effect orchestration | F10–F16, F31, inventory facet F26 | Customer/sales master, invoice-email receiving, unapproved quantity adjustments |
| Customer & Sales | Customer identity mapping (business IDs only), customer/sales/fulfillment/store-credit business reads and controlled transactions, notification business events | F17–F19, F22–F24 | Staff identity/permissions, supplier PO writer, retail product identity |
| Purchasing & Suppliers | Supplier-product association, PO readers/proposals, invoice/credit-note ingestion and reconciliation, vendor adapters, purchasing workflow contracts | F07 supplier facet, F20–F21, F34–F35 | Inventory receiving/stock writes; Product Catalog master writer |

Cross-cutting F25 labels/printing belongs existing labels feature owner; foundation only standardizes inputs. F33 remains RMS Migration owned; shared adapters expose documented mapping only. F36 belongs future Reservations feature owner, not part of M1. F28 belongs Foundational Security for actual authentication and authorization; Core API consumes only approved signed context/exact-operation grants.

## Contract registry — first version (proposed, not promised live endpoints)

| Registry ID | Owner | Contract / model | Mode | State | Initial consumers |
|---|---|---|---|---|---|
| HC-CORE-01 | Core API | transport request, normalized errors, pagination and rate handling | read; writes gated | #32 candidate | all |
| HC-CORE-02 | Core API + Security seam | verified actor/tenant/outlet context + exact operation decision supplied by Security | trust-boundary | contract pending Security | all |
| HC-CORE-03 | Core API | mutation envelope: operation ID, approval, immutable request fingerprint, audit, idempotency, readback, unknown-state recovery | mutation | #32 candidate / not live | all writers |
| HC-PROD-01 | Product & Catalog | exact identifier match with provenance/collision outcome | read | production matching + #32 candidate | Scanner, Special Orders, Product Manager |
| HC-PROD-02 | Product & Catalog | catalog product/variant/reference snapshot, source/as-of | read | #33 candidate | all catalog consumers |
| HC-PROD-03 | Product & Catalog | reviewed product create/update command | mutation | planned / no integrated writer | Product Manager, Scanner, Special Orders |
| HC-INV-01 | Inventory | outlet-aware stock snapshot: onHand, available, committed, asOf, outlet, source/definitions | read | #33 by-product read candidate, incomplete | counts, restock, special orders |
| HC-INV-02 | Inventory | event ledger: product/outlet, eventId, source, occurredAt vs observedAt, quantity delta, coverage/gaps | read | source feasibility unverified | count reconciliation |
| HC-INV-03 | Inventory | count session/scans with timestamps, expected adjustments, review/readback | proposal/mutation gated | planned | Inventory Count |
| HC-INV-04 | Inventory | shelf and backroom locations, targets, employee-confirmed movement | workflow | planned | Restock, Store Map, Labels |
| HC-CUST-01 | Customer & Sales | customer search, duplicate-safe association, business identifier | read | production legacy + #32 candidate | Special Orders, Rewards, Consignment |
| HC-SALE-01 | Customer & Sales | sales/orders/fulfillment/return and store-credit readers | read | production legacy + #33 candidate | Special Orders, Rewards, Consignment |
| HC-SALE-02 | Customer & Sales | approved credit posting with transaction-level dedupe/readback | mutation gated | planned | Consignment |
| HC-PO-01 | Purchasing & Suppliers | suppliers, supplier SKU/aliases, PO and lines/status | read | production legacy + #33 PO reader candidate | Ordering, PO Companion, Labels |
| HC-PO-02 | Purchasing & Suppliers | reviewed OPEN PO create/edit proposal; explicit no receiving | mutation gated | planned | Invoice Updates, Ordering |
| HC-PO-03 | Purchasing & Suppliers | invoice provenance, matching, shipping evidence and staged price updates | proposal | planned | Invoice Updates, Scanner, Special Orders |

**Required common read fields (proposed):** schemaVersion, sourceSystem, sourceId, outletId where meaningful, asOf/sourceUpdatedAt where available, completeness/coverage indicator, observedAt, and stable errors. Preserve identifier strings including leading zeroes. Do not invent stock-event completeness. Proposed external route paths and exact JSON schemas require review against #32/#33 before freeze. A UI link, session cookie or employee PIN is not a grant.

## Shared-file collision policy
- Core API is **integration owner** of `services/lightspeed/client.js`, `readCollection.js`, `mutations.js`, `audit.js`, `idempotency.js`, `postgres.js`, the shared gateway router, and business-contract version docs. No other workstream writes these concurrently.
- Product & Catalog owns `services/lightspeed/productIdentity.js`, `products.js`, `catalog.js`; supplier mapping changes in catalog require a Purchasing contract review.
- Inventory owns `services/lightspeed/inventory.js` and new inventory-only files.
- Customer & Sales owns `services/lightspeed/customers.js`, `sales.js`, `fulfillments.js`, `storeCredit.js`.
- Purchasing & Suppliers owns `services/lightspeed/purchaseOrders.js` and additive supplier/invoice modules.
- Security owns its `services/security/**`, authentication-related routes and tables. Foundation workstreams DO NOT modify these absent explicit coordination.
- `server.js`, `routes/sharedLightspeedRead.js`, common migration SQL and `services/lightspeed/permissions.js` are **integration lock files**. Only Core API, after coordination and review by affected owners/Security, changes them. Do not independently mount endpoints in five branches.
- Preserve live `services/lightspeedApi.js`, `routes/specialOrderProducts.js`, Special Orders/Ordering and label endpoints until parity is proven.
- Every change on independent `feature/hc-foundation-<domain>-<date>` branch, based on reconciled integration target. No direct writes to production-tracking branch without approval.

## Central work queue and critical path

| Priority | Item | Owner | Dependency | Implementation | Tests | Deployment | Exit gate |
|---|---|---|---|---|---|---|---|
| P0 / M0 | Audit PR #32/#33 & current production clients, identify stacked/security overlap | Manager + Core | existing code | audit complete, line-level reconciliation pending | none newly run | none | documented file ownership + branch graph |
| P0 / M1-A | Freeze stable read-envelope and auth/grant seam using actual #32/#33 exports | Core API | Security contract review | pending | contract tests required | none | versioned schemas, negative auth, legacy parity |
| P0 / M1-B | Product identity/catalog read parity | Product & Catalog | M1-A envelope | candidate exists | synthetic/contract regression required | none | exact identifier collision and pagination coverage |
| P0 / M1-C | Inventory outlet snapshot and stock-event source feasibility | Inventory | M1-A; Lightspeed read-only capability | snapshot candidate, event gap | source-coverage/edge tests required | none | documented holes and event-time evidence |
| P1 / M1-D | Customer/sales/fulfillment read parity | Customer & Sales | M1-A; Security | candidate exists | legacy-parity and redaction tests required | none | no live behavior regression |
| P1 / M1-E | Supplier/PO and invoice data contract | Purchasing & Suppliers | M1-A, catalog references | PO reader candidate; invoices planned | API version, PO semantics, source tests | none | read-only PO contract, invoice vs receiving boundary |
| P1 / M2 | Integrate one read-only consumer, scoped pilot | Core with selected owner | M1 read contracts + Security approved test grant | pending | automated + browser + Railway test | test only with explicit approval | reproducible read parity and rollback |
| P2 / M3 | Audit-backed product, PO, count, credit commands individually | respective owners; Core orchestrates | M2 and Security approvals | pending | Postgres concurrency + readback + fail-closed | none | separate authorization per operation |
| P2 / M4 | Convert more consumers without breaking existing routes | manager sequences | M2/M3 | pending | regression/acceptance | none | owner-signed verified handoffs |

## M1 integration sequence
1. Core examines #32/#33 stacks, direct legacy callers, current X-Series API versions; publishes draft frozen read schemas and owner review requests.
2. Product, Inventory, Customer/Sales, Purchasing may develop **nonoverlapping library-level adapters/tests** against M1-A contract; no gateway mounting until Core owns integration.
3. Inventory investigates X-Series stock events with read-only/synthetic evidence: no invented sale-time stock history. Count scans require timestamps and postscan sale/receipt reconciliation before any adjusted quantity.
4. Core chooses one low-risk read-only consumer (prefer PO Companion or Product Manager read preview, depending on working authentication), measures parity and error behavior in test; no production switch.
5. Only after sign-offs: explicitly request separate permission for migrations, deployment and each live mutation class.

## Mandatory development handoff for each workstream
Write `handoffs/foundation-core-api.md`, `handoffs/foundation-product-catalog.md`, `handoffs/foundation-inventory.md`, `handoffs/foundation-customer-sales.md`, or `handoffs/foundation-purchasing-suppliers.md` using `handoffs/TEMPLATE.md`. Include exact repo, branch, commit SHA, PR URL, file changes, interface schema changes, test command/results and CI URL, synthetic vs live evidence, Railway service/environment state, security grants consumed, cross-workstream conflicts/dependencies, blockers and next action. Never mark milestone accepted from code-only completion.

## Manager acceptance protocol
Handoff exists and matches GitHub branch/commit; PR diff inspected for protected-file collisions; automated test evidence inspected; deployment reported independently; Security boundary reviewed for auth-dependent behavior; downstream interfaces versioned or backward compatible; manager records acceptance/blocked status and **next foundation** assignment. No merge or production deploy without explicit owner approval.

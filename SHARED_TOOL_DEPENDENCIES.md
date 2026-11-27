# Owner-defined January priority overlay — 2026-11-27

[Owner P0–P3 register](JANUARY_2027_GO_LIVE_PLAN.md) supersedes provisional priorities, not F01–F36 architecture. Scope each dependency to demonstrated P0 consumer needs; escalate lower-priority prerequisites explicitly (e.g. bulk preview/approval, receiving PO linkage, existing Rewards job, GW publication, minimal Chrome release). No automatic full P1/P2 implementation or V11. Unified order lifecycle and portable domain configuration required. Prior security gates unchanged pending explicit owner decision.

---

# January 2027 launch priority overlay — 2026-11-27

[January go-live plan](JANUARY_2027_GO_LIVE_PLAN.md) classifies dependencies by actual launch consumers; the F01–F36 catalog below remains intact as long-term architecture, not a mandatory prelaunch implementation checklist. P0 scope and temporary legacy retention require owner and Operations/Admin confirmation with actual security, integrity, audit and recovery controls. V10 accepted/frozen; no automatic V11 or new executable allocation. No weakening of prior security requirements.

---

# Current foundation allocation and dependency status — 2026-11-27

This dated update supersedes older status/ownership statements below; original dependency matrix and feature requirements retained. Manager coordinates seven foundation workstreams, with Security exclusively owning identity, authorization and Timeclock identity integration; Security Operations owns administration consumer/UI. Production-connected application base remains integration/hobby-corner-consolidation; approved isolated development baseline is V10 ee45019a9408bdf91483ff03e94f1ac8f8982784, 606/606, see [canonical baseline](FOUNDATION_DEVELOPMENT_BASELINE.md). Core M10 #131, Catalog M12 #134, Inventory M12 #135, Purchasing P-12 #136, Customer M12 #137 frozen. Existing shared #32/#33/#51 and feature clients preserved. No consumer convergence or live vendor authorization implied.

Critical dependency chain: verified Timeclock identity source and independent selected active employee/PIN contract -> Security operational authentication and current policy/source/assurance integration -> reviewed privilege/authority and read interface -> separately approved HC Secure commissioning -> separately allocated minimal Catalog read (productId, verified nullable variantId, name) -> later disposable mutation -> business tools. S2.5N #139 d502f4463ff2bff09d38d3d8e513c617d80000fc, 251/251 disposable only; HC-SECURE-READ/0.1 blob 353ecb6a42137ea2bd02f4ab040ca13750d355ab logical direction accepted by Core and Catalog, operational HOLD. #121 business fixture unchanged. SO-02 #132 86/86 mock only; actual admin API not released. Existing HC Secure staging is deployed private readiness, not staged-only and not general login; one pre-live environment, separate hosted testing before significant post-live updates. No direct protected database access by tools. D0 drafts and optional customer own-record connector remain design gated. Detailed current assignments, unresolved requirements, exact handoffs and rollout gates: [Manager handoff](handoffs/foundation-manager.md). No new implementation or deployment authorized by this register update.

---

# Hobby Corner — Shared Tool Dependencies and API Foundation Register

**Owner:** Shared Tool Dependencies Foundation development conversation  
**Last reviewed:** 2026-11-23  
**Status:** Architecture / Planned; source audit complete, **no new shared runtime deployed**  
**Canonical management repo:** `Tawgod/Hobby-Corner:main`  
**Canonical production application baseline:** `Tawgod/Lightspeed:integration/hobby-corner-consolidation`  
**Security ownership:** Separate HC Secure / Foundational Security workstream. This document defines business capabilities and the interface to security, not a second identity or permissions system.

## Rules for interpreting the matrix

- **Existing** = a relevant workflow/module exists on the production-connected application branch or live service; does not imply this shared foundation is already consumed or end-to-end accepted.
- **Candidate** = implemented in a branch, prototype, draft PR or isolated synthetic testing; not proven as live production use.
- **Planned** = requirement/design, no verified operational integration.
- The **Currently used by** column records known pre-foundation consumers. **Needs shared access** records all justified future consumers, including tools not yet deployed.
- Read and write are distinct capabilities; neither a UI link nor a valid employee login grants a Lightspeed mutation.
- `consignment` has two very different meanings: Lightspeed supplier-PO API resources and Hobby Corner customer-owned used-item Consignment. Never conflate them.

## Verified implementation / deployment boundary

- Existing production services in Railway **Hobby Corner/production** (2026-11-23): `lightspeed-api`, `special-orders-test` (actually a production-environment Core Operations app), `timeclock`, `store-map`, `Hobby-Corner-Discord-Bot`, `Hobby-Corner-Rewards`, and PostgreSQL. Latest deployments reported SUCCESS. Successful deployments are not proof of every feature's business functionality.
- On the production integration branch, `services/lightspeedApi.js` provides reusable legacy sales/fulfillment/customer/product/store-credit calls; `routes/specialOrderProducts.js` contains live customer/product/catalog matching and creation-adjacent workflows; `server.js` serves Special Orders/Ordering/Preorders/GW and existing PO/Avery label endpoints with direct older Lightspeed HTTP fetches. Existing consumers **have not all converged**.
- Shared Lightspeed Phase 1 PR #32 and stacked Phase 2 PR #33 provide nonproduction candidate transport, policy, audit/idempotency and readers. `services/lightspeed/inventory.js` on PR #33 currently implements **by-product inventory read only**; it does not implement event timelines, outlet reconciliation or controlled adjustments. `purchaseOrders.js` is read-only. The candidate shared gateway remains unmounted/unmerged/undeployed.
- Product Manager PR #28, PO Companion PR #31 and Consignment PR #30 are development candidates, not completed production consumers. Consignment's existing Railway beta is synthetic/isolation-scoped. Scanner has existing product-match/review foundations, while further extension integration is not released.
- The separate `HC Secure/staging` Railway configuration is STAGED ONLY, not a deployed general identity service; existing Owner staging and production Timeclock must not be silently replaced.

References: [Shared Lightspeed architecture](LIGHTSPEED_SHARED_SERVICES.md), [Roadmap](ROADMAP.md), [Core Operations handoff](handoffs/core-operations.md), [Product Manager](handoffs/product-manager.md), [Scanner](handoffs/product-scanner.md), [Consignment](handoffs/consignment.md), [PO Companion](handoffs/po-companion.md), [RMS migration](handoffs/rms-migration.md), [Invoice Reconciliation](FEATURE_INVOICE_RECONCILIATION.md).

## Shared dependency catalog

The **foundation owner** should expose common business contracts from a trusted backend, preferably by extending the in-progress `services/lightspeed/` modules. Tool owners retain their workflow state, screens, and tool-specific business policy.

### Product and supplier capabilities

| ID | Dependency / shared capability | Currently used by / existing implementation | Needs shared access (includes future) |
|---|---|---|---|
| F01 | Lightspeed API transport, error handling, pagination, normalized models and vendor-API version selection | Shared `lightspeedApi.js`, direct Special Orders and label readers, Rewards' separate Python client | Every Lightspeed-connected tool and worker, with backend-only credentials |
| F02 | Product identity: exact SKU/UPC/GTIN/supplier SKU, active and inactive matches, collision/alias checks, provenance | Special Orders matcher; Scanner adapter; migration has separately reviewed collision checks | Product Manager, Special Orders, Scanner, Ordering, Preorders/GW, PO Companion, Consignment, Inventory Count, Backroom, labels, Returns/Repairs, Back-in-Stock |
| F03 | Product catalog read/search and product/variant metadata | Special Orders, Scanner, Ordering, label PO lookup | Product Manager, Special Orders, Scanner, Consignment, Preorders, PO Companion, labels, Inventory Count, Backroom, Repairs, Waitlist, Store Map overlays |
| F04 | Controlled **new item creation** (one duplicate-safe approved writer) | Special Orders production-capable product route; Scanner currently reuses matching, isolated test-only writer separate | Product Manager, Special Orders, Consignment used-item creation, Preorders, Scanner, Repairs; migration remains special safeguarded bulk path |
| F05 | Controlled existing-item edits, bulk proposals and verification | Existing Special Orders edits; Product Manager PR #28 previews only | Product Manager, Scanner, Special Orders, Consignment approved metadata, Preorders, Invoice Updates, migration-specific reconciliation |
| F06 | Catalog reference data: suppliers, brands/manufacturers, tags, categories, hierarchical departments, UUID mappings | Special Orders catalog APIs, RMS migration's source UUID/name mappings; Phase 2 catalog reader candidate | Product Manager, Special Orders, Scanner, Ordering, Preorders, PO Companion, Consignment, Invoice Updates, RMS migration, Labels |
| F07 | Supplier-product relationships: primary/secondary supplier, exact supplier SKUs, normalized supplier aliases and manufacturer/sender identity | Special Orders, Ordering, Scanner, PO lookups; RMS mapping separate | Product Manager, Scanner, Special Orders, Preorders/GW, PO Companion, Invoice Updates, Consignment product matching, RMS migration, external supplier connectors |
| F08 | Cost, retail price, MSRP, tax handling, vendor cost history and price-change proposals | Special Orders, Ordering/PO labels, Scanner proposals; Product Manager preview | Product Manager, Scanner, Special Orders, Ordering, PO Companion, Invoice Updates, Consignment, Inventory Count variance valuation, labels, Repairs |
| F09 | Product media, safe uploads, documents/manuals and optional Drive asset matching | Special Orders product/image paths; Product Manager prototypes | Product Manager, Scanner, Special Orders, Consignment, Repairs, Preorders; invoice attachments remain separate provenance objects |

### Inventory and stock operations

| ID | Dependency / shared capability | Currently used by / existing implementation | Needs shared access (includes future) |
|---|---|---|---|
| F10 | Outlet-aware stock snapshot: on-hand, available, committed/reserved and as-of timestamp, with explicit differing definitions | Direct Special Orders/Ordering reads; Phase 2 read-only inventory candidate | Product Manager, Special Orders, Ordering, Preorders/GW, Scanner, Consignment, Inventory Count, Backroom, Waitlist, Repairs, label displays where relevant |
| F11 | Stock-event history and transaction reconciliation (sales, returns, receiving, adjustments, transfers), indexed by transaction time and outlet; verified data-source coverage | No verified common service; must determine actual X-Series availability and audit/log fallback | **Inventory Count first**, Special Orders receiving, Ordering, Returns/Split, Product Manager stock diagnostics, Backroom restock/recheck, migration initial count |
| F12 | Inventory counts, count sessions, per-scan timestamps, variance, authorized final count adjustment and readback | Planned; not provided by existing Phase 2 inventory reader | **Inventory Count**, initial post-RMS cutover stock establishment, Product Manager review, operational Priority Review |
| F13 | Stock reservations/allocations/committed orders and exception checks | Special Orders/Preorders allocation workflow; Split/Recall reads | Special Orders, Preorders/GW, Ordering, Inventory Count, Backroom, Waitlist, Repairs parts allocation, Consignment availability where applicable |
| F14 | Physical shelf/backroom location, capacity/target, restock tasks, batch confirmed movements | Store Map separately exists; Backroom tool planned | **Backroom Restock**, Inventory Count, Product Manager, Product Scanner, Store Map, two-location shelf labels, Priority Review |
| F15 | Controlled receiving and inventory movement write orchestration with audit and replay protection | Special Orders/Ordering receiving-specific workflows; NOT invoice-email approvals | Special Orders, Ordering, Preorders, PO Companion contextual status, Inventory Count reconciliation, Backroom post-receipt queue, Labels after confirmed receipt |
| F16 | Customer-visible back-in-stock eligibility (not a reservation) | Planned waitlist | Back-in-Stock Notifications, Product Manager, Scanner, Special Orders, Preorders; depends on F10 + F02 + consent |

### Customer, sales and purchasing operations

| ID | Dependency / shared capability | Currently used by / existing implementation | Needs shared access (includes future) |
|---|---|---|---|
| F17 | Customer search, duplicate-safe match, read/create/update and optional postal validation | Special Orders customer routes; Rewards/customer sync; existing USPS address verification | Special Orders, Preorders/GW, Consignment, Repairs, Reservations, Back-in-Stock, Split/Recall; Product Manager generally not a customer editor |
| F18 | Customer identity linkage (Lightspeed, Discord, Rewards, future customer portal) plus consent/contact preferences | Special Orders Discord linkage; Discord Bot and Rewards sync | Special Orders, Preorders/GW, Consignment, Rewards, Back-in-Stock, Repairs, Reservations, notifications |
| F19 | Sales, work orders, order lines, deposits, returns/voids and customer-sale relations | Shared `lightspeedApi.js`; Special Orders; Split/Recall | Special Orders, Preorders/GW, Split/Recall, Consignment sale verification, Repairs, Rewards spending, Inventory Count transaction reconciliation |
| F20 | Supplier purchase order reads/lines, status, safe proposal for creating/updating **OPEN** POs | Existing Ordering and Avery label backend; Phase 2 read-only PO service; PO Companion candidate | **Product Manager, Special Orders, Preorders/GW, Ordering, PO Companion, Product Scanner, Consignment only if product sourcing relevant, Labels, Invoice Updates, Repairs** |
| F21 | Supplier invoice/credit-note ingest, per-line reconciliation and multi-shipment/tracking evidence | Planned across existing tools; no live ingest/PO-write service | Product Manager Invoice Updates, Product Scanner, Ordering, Special Orders, Preorders/GW, PO Companion, PO/receiving context |
| F22 | Fulfillments, pickups, partial pickup, receiving-to-ready transitions and returns | Shared fulfillment reader; Special Orders; Split/Recall | Special Orders, Preorders/GW, Split/Recall, Consignment sold/returned lifecycle, Repairs pickup, customer notifications |
| F23 | Store credit balance, posting and reversal with precise transaction idempotency | `lightspeedApi.js` contains credit calls; Consignment eligibility candidate, no verified production posting | Consignment primarily; Special Orders/Split/Recall where credit policy applies, Rewards read-only context; customer portal balance |
| F24 | Transactional notifications (Discord, email, SMS), delivery results, dedupe and channel preferences | Special Orders/Discord bot some live components; production ready-notification acceptance incomplete | Special Orders, Preorders/GW, Consignment, Back-in-Stock, Repairs, Reservations, Rewards, Priority Review |
| F25 | Shared label/print service (PO, special-order, shelf, storage and item labels) | Existing Avery 5960 backend and Toolkit launcher | Avery label tool, Ordering/PO Companion, Special Orders, Product Manager, Scanner, Consignment, Backroom floor & storage, Inventory Count if useful |
| F26 | Identifier scanning/Code128/UPC and scan normalization preserving leading zeroes | Scanner/Toolkit capture; labels generate Code128 | Scanner, Inventory Count, Backroom, Product Manager, PO Companion, Consignment, Ordering, Avery labels |

### Cross-tool platform capabilities and operational overlays

| ID | Dependency / shared capability | Currently used by / existing implementation | Needs shared access (includes future) |
|---|---|---|---|
| F27 | PostgreSQL durable operations, atomic transactions, outbox/queue, source-independent audit, idempotency, uncertain-write recovery | Special Orders durable workflow; Phase 1 audited mutation candidate; multiple independent DBs | All persistent business workflow tools, including inventory count, restock, customer mutations, invoice work, consignment credit, notifications |
| F28 | Staff identity and operation-level authorization **integration seam**, customer auth audience kept separate | Timeclock signed staff gateway; HC Secure under separately owned development | Every staff-facing business API, workers, Admin and customer portal; actual identity and policy owned by Foundational Security chat |
| F29 | Work queues, drafts, approvals, reviewed diffs, assignment and activity trail | Special Orders status and Priority Review; Scanner proposals; Product Manager draft candidate | Product Manager, Scanner, Special Orders, Preorders, Ordering, PO Companion, Consignment, Inventory Count, Backroom, Invoice Updates, Repairs |
| F30 | Shared background jobs, schedules, event dispatch, sync health and error monitoring | Discord and Rewards workers; Special Orders jobs; independent Railway processes | Notifications, Consignment 72-hour credit, Preorder watches, Invoice Updates, stock change detection, Backroom daily queue, count reconciliation, dashboard |
| F31 | Physical store map and item-location reference, distinct from room-booking resource maps | `store-map` live standalone service; no shared item/location record proven | Backroom, Inventory Count, Product Manager, Scanner, Labels; room Reservations only for compatible venue/resource layout |
| F32 | Store Operations dashboard, priority issues, workflow links and consistent navigation | Core operations/Special Orders Priority Review; unified home candidate | Every tool should publish actionable errors, stale work and appropriate authorized destination links |
| F33 | Safe legacy import/export mappings, reference reconciliation, source-time validation and controlled migration adapter | RMS migration v68 development, Apps Script legacy importer | RMS migration primary; Product Manager CSV import, Supplier/Catalog reference foundation, Inventory Count initial-stock cutover |
| F34 | External supplier integrations and verified vendor portals/APIs | Supplier-site Scanner + Ordering; MarketTime only researched | Ordering, Preorders/GW, Scanner, PO Companion, Product Manager, Invoice Updates; no auto-order before review |
| F35 | Secure file attachment/provenance and audit of extracted data | Some product/image utilities; invoice process planned | Product Manager manuals/images, Scanner source capture, Consignment photos, Repairs, supplier Invoice Updates |
| F36 | Reusable calendar/resource availability and booking notification contract | Not implemented as general shared service | Game Room Reservations/Events primarily; special-order pickup appointments or service scheduling only if approved later |

## Tool-by-tool dependency map and unique responsibilities

| Tool / workstream | Shared dependencies required | Unique logic that should remain tool-owned | Status |
|---|---|---|---|
| Product Manager | F01–F10, F13, F17 context only when needed, F20–F21, F25–F29, F32–F35 | Large catalog grid, employee layouts, batch staged edits, SEO/media, discount aging, CSV mapping and Invoice Updates selector | Candidate / not deployed |
| Special Orders dashboard | F01–F08, F10–F11, F13, F15, F17–F22, F24–F29, F32 | Customer order lifecycle, deposits, customer status/priority review, order allocation, pickup and exception handling | Existing core workflow; shared conversion pending |
| Ordering / Purchasing | F01–F08, F10–F11, F13, F15, F19–F22, F25–F30, F34 | Vendor ordering workflow, vendor routing, PO review and actual receiving | Existing core workflow |
| Preorder Campaigns | F01–F08, F10, F13, F15, F17–F22, F24, F27–F30, F32, F34 | Campaign rules, preorder commitment, allocation and transitions to customer orders | Existing core workflow |
| GW Preorders | Preorder set above plus F18, F24, F30 | Games Workshop-specific weekly campaign, Discord reaction watch and approved supplier form workflow | Existing app; some integration features not verified |
| Product Scanner / Toolkit | F01–F10, F17 context, F20–F21, F25–F29, F34–F35 | Chrome/supplier-page capture, barcode lookup, completeness checks, product review proposal and preorder staging | Existing foundations; unreleased improvements |
| PO Companion | F02–F08, F17 context, F20–F21, F25–F29, F34 | Supplier-site overlay, per-PO/per-supplier drafts, exact identifier copy, line compare | Candidate; not released |
| Consignment | F01–F10, F13, F17–F19, F22–F24, F25–F30, F35 | Multi-item consignor intake, condition disclosure, unique used-item SKU, approvals, per-item aging, 72h hold / 80% credit policy, customer portal | Synthetic beta only |
| Avery / labels | F02–F03, F08, F14, F17 context, F20, F25–F28 | Printable geometry, barcode format and templates; print-only, not receiving | Existing deployed backend |
| Inventory Count (new) | F02–F03, F08, F10–F13, F26–F29, F31–F33 | Timestamped scan sessions, variance and cost impact, post-scan sale/receipt reconciliation, reviewed adjustments, initial LS quantity setup | Planned; priority post-migration |
| Backroom Restock (new) | F02–F03, F08, F10–F11, F13–F14, F25–F29, F31–F32 | `backroom = on-hand - shelf` operational assumption, shelf targets, employee-confirmed multi-item restock, two shelf label formats | Planned |
| Back-in-Stock Notifications | F02–F03, F10, F16–F18, F24, F27–F30 | Customer waitlist, consent, trigger/dedupe, no implicit reservation | Planned |
| Repairs / Service Requests | F02–F03, F08, F10, F13, F17–F20, F22, F24–F29, F32, F35 | Technician work tickets, warranty, labor, estimates, parts and commission | Planned |
| Game Room Reservations / Events | F17–F18, F24, F27–F30, F32, F36; F19 if paid | Venue resources, capacity/blackout/recurrence and booking conflicts | Planned |
| Split / Recall | F01, F17, F19, F22–F23, F27–F29 | POS split/recall, partial pickup, work-order combining, deposit conversions | Existing backend |
| Timeclock / employee administration | F27–F28, F30, F32 | Timeclock roster, PIN, attendance, payroll, Owner/admin authority; security ownership elsewhere | Live Timeclock; wider security in development |
| Rewards / customer sync | F01, F17–F19, F23 context, F24, F27–F30 | Reward tier, rolling spend, historical RMS account mapping and custom-field writing | Live service with separate Python Lightspeed client |
| Discord Bot / customer messaging | F18, F24, F27–F30 | Discord identity, role/bot commands, watches and delivery adapter | Live bot; specific worker acceptance varies |
| Store Map | F14, F27–F28, F31–F32 | Building/floor geometry and item-location UX; not a stock authority | Live standalone service |
| Store Operations Dashboard / Admin | F27–F32 and aggregate read results | Priority triage, navigation, permitted admin settings, incidents | Partial current + candidate shared UI |
| RMS Migration / Legacy Importer | F02–F08, F10–F12 **for controlled initial stock workflow only**, F27–F28, F33 | RMS exporter, manifest/freshness/UUID mapping, bulk collision review, exceptional migration writes | v68 source safeguards in testing |
| Ring camera research | F27–F28/F30 **only if ever integrated** | Cameras, privacy/control policy and events; no dependency on Lightspeed business records | Research; no approved integration |

## Required contracts and safeguards

1. **Inventory must be an explicit shared domain**, not merely a cached on-hand number. `getStock(productId, outletId)` must label `onHand`, `available`, `committed`, `asOf`, stale status and source. Values must not be substituted for each other. Reconcile same-outlet sales, receiving, returns and adjustments before count finalization. Need verify vendor event coverage and timestamp semantics rather than assuming X-Series exposes complete history.
2. **Inventory Counting:** Record one timestamp per scan or batch and durable session snapshots. Compare expected at relevant scan time against counted values, then reconcile later changes before any final adjustment. Quantity variance = counted − expected-at-count; signed cost impact = quantity variance × verified unit cost (positive excess, negative shortage); retain value provenance and unknown-cost exceptions. Produce approval/readback and duplicate-proof adjustment handling. This is the intended initial on-hand establishing tool after migration, NOT the RMS importer copying legacy stock counts.
3. **Backroom:** Treat `backroom = Lightspeed onHand − verified shelfQty` as the **operational assumption**, with exception for unknown shelf count, negative result, unverified scan or post-count sales/receiving. Task issuance is not proof of stocking. Store who confirmed each item, `quantityMoved`, timestamp, and optional bulk confirmation. Shelf-floor and storage-room tags should both show product, price and respective target/location quantity. An internal shelf-to-backroom move **must not change Lightspeed total on-hand**.
4. **Product create:** Shared product creation must check exact identifiers, aliases, existing/inactive records and remote Lightspeed before writing; require reviewed supplier/brand/category mappings and preserve leading zeroes. Consignment generates unique per-physical-item used SKU through this writer. RMS bulk migration has an exceptional, separately authorized path.
5. **POs:** Read via tested canonical versioned PO service when accepted. Invoice matching may stage a **new OPEN PO** or changes to existing OPEN supplier PO after approval, but invoice/tracking events must **never** perform stock receiving, increase on-hand, allocate customer-ready orders or print received labels automatically. Receiving stays an independently authorized operation.
6. **Customers:** Consignment, Special Orders, Preorders, Rewards and future reservations must resolve one canonical customer identity with explicit ambiguity review; customers and employees are separate identity audiences. Consent/Discord linkage must not be inferred from typed handles.
7. **Identity/permissions:** Calls into the shared business foundation should carry validated staff/service/customer principals and exact operation grants established by **separate** HC Secure/security owners. Do not reimplement PIN verification, Owner MFA, employee roster or permission authority in these business modules.
8. **Mutations:** Require durable request fingerprint/idempotency key, employee/service actor, before/after preview, unique operation ID, audit records, safe retries and readback; handle unknown vendor outcome. Do not expose production Lightspeed tokens to Chrome, supplier-page DOM, customer browser or other independent clients.
9. **Reusable not monolithic:** Domain operations live in shared modules; employee workflows, consignment intake, supplier-site UX, count-session algorithm, shelf restock task management and other unique business behavior stay in their respective tool modules. UI and Chrome navigation have separate shared owners.

## Recommended implementation sequence

1. Reconcile live code and candidate shared Phase 1/2 PRs, document their interfaces; no broad rewrite.
2. Convert read-only **Product + product identity + catalog** to consistent types/IDs, then **Inventory snapshot by outlet** with timestamp/source and explicit staleness contract; ensure this covers all high-use consumers.
3. Convert **Customer** and **Purchase Order** read consumers incrementally, starting with contained PO Companion/labels where feature parity is testable. Keep live direct reads until validated switch.
4. Add inventory **event timeline**, **count sessions**, and **shelf/backroom location ledger** as extensions around inventory reads; prove event completeness before final adjustment functionality.
5. Converge **new item create** (preserve current Special Orders matcher), supplier reference reconciliation, and controlled product edits; writes remain independently authorized.
6. Add audited PO proposal/update, invoice reconciliation and fulfillment/notification events only after shared policy, customer/PO data consistency, and receiving separation are validated.
7. Integrate the 72-hour Consignment credit worker, Rewards direct client retirement, and additional tools behind the same shared gateway after acceptance; coordinate Chrome releases via the release queue.

## Open design/verification questions

- Which exact X-Series endpoints, webhooks, local order/receiving ledgers and timestamps can establish a complete outlet-level stock change timeline? Do not assume historical sale or receipt events are complete. Define reconciliation when an event is missing.
- Whether all inventory quantities, costs, supplier associations, and current UUIDs are reliable for every RMS-migrated product and every outlet. Negative or stale values must be surfaced.
- Which existing Special Orders/Ordering endpoints need to be wrapped versus extracted to retain working reservations/receiving behavior.
- Which current and future operation grants each tool requires; defer security implementation to HC Secure.
- Whether label metadata and Store Map locations can be canonical across both floor and storage without adding a second inventory authority.
- Real customer/account linkage and notification provider acceptance, including Consignment portal and Rewards.
- Separate production deployment, DB backups, Chrome release and live write permissions still require explicit owner authorization.

**No source merge, production/test deployment, Lightspeed/customer/employee mutation, database migration, Chrome package or permission activation performed to produce this register.**

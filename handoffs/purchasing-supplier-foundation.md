# Purchasing & Supplier Foundation — Current Handoff

**Last verified:** 2026-11-24  
**Status:** V2 / P-05 implementation; targeted CI pending; no deployment

## 2026-11-24 — V2 / P-05 provider-neutral document evidence

**Status:** implemented; targeted CI pending; no deployment.
- Approved V2 parent `2365de8af4e8d69b162f6909d1f78be246e74fdf`, branch `feature/hc-purchasing-p5-v2-20261124`, exact head `f2666ca31b053f4fd5c8864ccbacd7db95d7d60c`, draft [PR #84](https://github.com/Tawgod/Lightspeed/pull/84) targets test/hc-foundation-combined-20261124. Compare four ahead, zero behind, three additive files. Old branch identical to V2 included PR #82 pin a2096345709ac1a4a1113362d6bf8123a71227ad; no carry-forward or duplicate changes; old PR preserved. Read V2 baseline, manager handoff, dependency register, own handoff and source manifest.
- Added services/lightspeed/supplierDocumentEvidence.js: offline normalized Gmail/Graph/vendor/manual PDF document contract, source/account/message/attachment key, content hash, scan receipt metadata, bounded attachment and extraction sizes, page references, decimal text and exact identifiers, replay/conflicting source detection. Invoice, credit note, preorder confirmation, shipping notice and unknown documents remain evidence only. Reuses V2 Catalog resolveSupplierIdentity and inspectSupplierProductLinks with scoped exact sender and product/variant/SKU evidence; candidate only, no promotion or automatic verified P-02 match. No existing module edited.
- Seven new fixture tests plus existing 42 Purchasing and ten Catalog M3 tests targeted by one branch-scoped three-minute workflow (59 expected tests). No npm install or full integrated rerun; initial workflow lookup empty. Previous V2 combined CI 187/187 is historical baseline evidence only.
- Decisions/limitations: PDF metadata only, 20 MiB maximum, 500 lines and 100 references per document; actual bytes, malware scan, parser provenance, trusted account/tenant scope, completeness and identity evidence are not independently verified. No actual provider adapter, cursor/checkpoint persistence, private object storage, attachment fetching/parsing, email-body-only support, confidence calibration, durable replay reservation, shipment event extraction or credit processing. No automatic conversion to P-02 approved proposal; Catalog target selection and exact field mapping need coordination. No raw document text/body or credentials exposed; internal metadata/costs require future field permission projection. No production data, vendor/mail calls, grants, DB writes/migrations, routes, merges or deployment.
- Next gate: Manager/Catalog/Core/Security review source scope, evidence provenance, supplier alias mapping, trusted provider ingestion and durable replay/storage interfaces. P-06 offline cross-tool workflow scenarios may proceed after coordination; actual provider activation and live/durable mutation require separate authorization. Preserve P-04 synthetic harness and Inventory exclusive receipt boundary.

## 2026-11-24 — P-04 synthetic controlled PO mutation harness

**Status:** user authorized isolated development and synthetic testing; implementation committed, combined synthetic CI PASS; NOT deployed.
- Approved parent `71a1cd6e312ed52efc1e9af9da85db6b02e3756c`; branch `feature/hc-purchasing-foundation-m1-20261124`; head `a2096345709ac1a4a1113362d6bf8123a71227ad`; draft [PR #82](https://github.com/Tawgod/Lightspeed/pull/82). Compare: 15 ahead, 0 behind, nine added files only.
- Added syntheticPurchaseOrderMutation.js using existing Core audited mutation, audit and idempotency contracts, default disabled and fixture-only test environment. Recomputes association/proposal and approval binding; stable invoice key, injected exclusive scope and duplicate guard; OPEN SUPPLIER create or cost-only update, explicit full snapshot precondition and readback; no receive/dispatch/stock/allocation commands. Secondary supplier writes rejected and deferred to Catalog. Unknown results require quarantine; verified same-mode replay via Core. Existing receipt-bearing PO blocked conservatively.
- Added ten P-04 tests; combined suite defines 42 tests; [CI 45422471649](https://github.com/Tawgod/Lightspeed/actions/runs/45422471649), job 138545415456, exact queried head SUCCESS; independently inspected logs: 42/42 pass, zero failures/skips/cancelled. Full integrated baseline suite not run. No live calls.
- Limitations: fixture marker, policy, lock, expected snapshot, duplicate assertion and state persistence are trusted synthetic adapters, NOT production enforcement or actual durable concurrency. Snapshot is normalized PO fields only, no actual stock/event evidence. Approval expiry and evidence versions are fixture supplied; no live atomic vendor version preconditions, cross-mode durable exclusion, receipt/stock verification, catalog grants, or unknown-write recovery adapter. Audit and idempotency use existing Core implementation, but in-memory store is strictly test-only. No production execution eligibility, no routes, transport, credentials, migrations, grants, merges or deployments.
- Manager reconciliation requests: coordinate approved Core mutation outcome contract and Security exact operations, Product Catalog supplier mapping and cost scope, Inventory physical receipt boundary. Review before any actual storage or vendor adapter integration; verify provider version and conditional update semantics, full integrated tests and independent test-tenant authorization. P-05 provider-neutral mail/vendor evidence adapters can be planned offline after reconciliation. Stop here for user's planned manager review.

## 2026-11-24 — P-03 review revision and cumulative quantity contract

**Status: implementation committed, combined offline CI PASS, NOT deployed.**
- Approved baseline unchanged `71a1cd6e312ed52efc1e9af9da85db6b02e3756c`; independent branch `feature/hc-purchasing-foundation-m1-20261124`; exact head `581aa7c437d84b68debdfbeb61193f53aa691708`; draft [PR #82](https://github.com/Tawgod/Lightspeed/pull/82). Compared to approved baseline: 11 ahead, 0 behind, seven added files only.
- Added `services/lightspeed/invoiceReviewContract.js`: pure cumulative partial-invoice quantity inspection, duplicate prior line/supplier/outlet/PO scope validation, integer overflow and overbilling rejection, review revision candidate with expected prior revision/fingerprint, stale revision rejection, new revision clears approval, non-review/unknown/pending/applied states blocked, approval content binding and expiry checks. Reuses Core's existing fingerprintLightspeedPayload; binds complete proposal, prior invoice evidence, PO/history/catalog versions and cumulative totals. Matching receipt is NOT an authorization or execution grant.
- Reviewed Core API PR #83 handoff, Catalog PR #79 M3 handoff (canonical supplier identity/links/prices), Inventory PR #80 M2 handoff (physical stock effects separate). No changes to their files or interfaces. Product/Inventory adapter mapping and Manager contract freeze remain pending.
- Added ten fixtures in tests/purchasing-foundation-m3.test.mjs; combined workflow now defines 32 tests. [Combined CI run 45418513842](https://github.com/Tawgod/Lightspeed/actions/runs/45418513842), job 138531265644, exact queried head, SUCCESS; independently inspected Node logs: 32 tests, 32 pass, 0 fail/cancel/skip. No full integration suite. Historical P-02 CI success remains distinct.
- Decisions: strict positive safe integer quantities, trusted current prior invoice lines only, exact UTC millisecond times and caller-provided max approval age, all changes conservatively invalidate binding. No credit/fractional/reversal quantity support. Prior history completeness, current revision, evidence versions and approval authority must be established by trusted adapters; pure functions do not implement durable CAS, audit append, replay claims, authentication, or actual database concurrency. No vendor mutation or execution eligibility.
- Next gate: Manager/Core/Security review of durable transactional storage, atomic revision check and append-only audit, scoped idempotency and exact grants, trusted version/readback semantics, supplier/catalog integration. P-04 controlled PO mutation service requires explicit scope authorization and approved dependency contracts; no live writer, migration, routes, production reads/writes, merge or deployment performed.

## 2026-11-24 — P-02 invoice reconciliation candidate

**Status: Implementation committed; combined offline CI SUCCESS; NOT deployed.**
- Approved baseline unchanged: `71a1cd6e312ed52efc1e9af9da85db6b02e3756c`. Existing purchasing branch `feature/hc-purchasing-foundation-m1-20261124`, head `c8e41d6918891bc9034671d8c85bdb466edb1bbe`, draft [PR #82](https://github.com/Tawgod/Lightspeed/pull/82). Compare to approved SHA: 7 ahead, 0 behind, five added files only.
- Added `services/lightspeed/invoiceReconciliation.js`: pure offline association and review proposals, complete unfiltered PO and prior invoice history gates, exact supplier/outlet/reference matching, duplicate/corrected invoice detection, OPEN supplier PO update only, conservative new OPEN PO candidate only if no plausible existing PO and no unresolved explicit reference. No fuzzy auto-link. Exact verified sender aliases only. Catalog evidence supplied by caller; no duplicate matcher or catalog writes. Secondary supplier proposal preserves primary. Quantity/cost/currency kept as evidence (integer quantities, decimal cost strings, no conversion). Partial invoice quantity never overwrites ordered quantity; shipment evidence can associate multiple shipments to invoice lines, never establish receipt.
- Added 12 fixture tests in `tests/purchasing-foundation-m2.test.mjs`; workflow now executes both P-01 and P-02 suites (22 tests defined). [Combined GitHub Actions run 45417671220](https://github.com/Tawgod/Lightspeed/actions/runs/45417671220) returned completed/SUCCESS for exact queried head; detailed job logs not independently inspected. P-01 previous CI remains historical PASS.
- No gateway, authorization, production vendor read/write, database, mailbox, inventory, allocation, notification or deployment changes. Every returned candidate/proposal is explicitly non-executable; full approval is a requirement, not implemented authority.
- Decisions: require exact reviewed catalog evidence; block duplicate products/ambiguous PO lines, credit notes, fractional quantities, mixed currencies and unresolved explicit references for manual review. Caller completeness/verification evidence is not independently authenticated; these are offline DTOs only. Supplier alias normalization, durable duplicate/revision handling, cumulative partial invoice totals, version/freshness checks, price variance, multi-invoice shipment mapping, and real supplier/cost/PO schema parity remain outstanding. No assumption of execution eligibility from these results.
- Next: manager review and detailed CI logs, then P-03 durable review/approval contract design and concurrency/replay fixtures with Core API, Product and Inventory. No writer or DB migration until separately approved. Need manager contract acceptance before production integration.

## 2026-11-24 — P-01 implementation and validation submission

**Status: Testing / offline CI SUCCESS; NOT deployed.**
- Approved baseline: `71a1cd6e312ed52efc1e9af9da85db6b02e3756c` (PR #78).
- Branch `feature/hc-purchasing-foundation-m1-20261124`, head `8bd1ae252e6c51f5e27af18367cd8cc7d1ca537e`, draft [PR #82](https://github.com/Tawgod/Lightspeed/pull/82) targets reconciliation branch, not production. PR creation reported mergeable=false; recheck before integration.
- Added `services/lightspeed/purchaseOrderProjection.js` over unchanged shared PO reader: exact identifiers, duplicate/conflict rejection, missing identity null, no inferred supplier SKU, five quantity aliases with conflicts unknown, supplier/outlet/status filters, unresolved reference count, non-atomic read timestamp, receiving always UNKNOWN. Invoice and tracking projections are evidence only. Cost/currency mapping pending.
- Source review: special-orders.js 2822–2834 uses versioned PO list/lines but catches line errors as empty; 3689–3744 separates preview and receiving allocation. server.js 308/441 uses legacy 2.0 consignment products for Avery/PO data. PR #37 injection reviewed; legacy shape unchanged, full HTTP/browser parity not executed.
- Ten offline fixture tests in tests/purchasing-foundation-m1.test.mjs cover pagination, malformed responses, exact IDs, missing/conflicting fields, filtering, receipt isolation, evidence-only projections and legacy shape. Branch-scoped workflow .github/workflows/purchasing-foundation-m1.yml added; [GitHub Actions run 45416914717](https://github.com/Tawgod/Lightspeed/actions/runs/45416914717) subsequently returned completed/SUCCESS for the queried head. Detailed job logs not independently inspected.
- Three additive files; no changes to existing PO reader, shared transport, routes, security, catalog or receiving. No live reads/writes, DB migration, merge, deployment or grants.
- Decisions: vendor status descriptive only; ambiguous identifiers rejected; unknown supplier/outlet references counted separately; strict projection opt-in; public envelope not frozen.
- Next: recheck mergeability and detailed CI logs; coordinate manager/Core/Catalog/Inventory review; P-02 offline invoice-to-PO association and supplier evidence proposals only. Ambiguous matches require review; no writer. Real tenant parity, cost mapping, alias ownership and receipt evidence remain gates.

Earlier audit below is historical; this checkpoint supersedes its implementation/test status.

## Source
- Management repository: `Tawgod/Hobby-Corner:main`; handoff path `handoffs/purchasing-supplier-foundation.md`.
- Authoritative production-connected application: `Tawgod/Lightspeed:integration/hobby-corner-consolidation` (current head not independently read in this audit).
- Existing shared service candidates: PR #32 (`feature/shared-lightspeed-services-phase1-20261029`); stacked PR #33 (`feature/shared-lightspeed-services-phase2-reads-20261029`), both not merged/deployed per current management register.
- Existing PO Companion PR #31; optional shared-reader compatibility PR #37 stacked on #31, tested but not mounted. Review before editing `routes/poCompanionRead.js`.
- Source references read: `SHARED_TOOL_DEPENDENCIES.md`, `LIGHTSPEED_SHARED_SERVICES.md`, `FEATURE_INVOICE_RECONCILIATION.md`, `handoffs/po-companion.md`, `handoffs/product-scanner.md`, `handoffs/TEMPLATE.md`; `services/lightspeed/purchaseOrders.js` and `docs/SHARED_LIGHTSPEED_PHASE2_READS.md` on PR #33 branch. PR #32/#33 changed-file inventories inspected.

## Current-source audit / existing versus missing
| Surface | Existing / verified in source or documented handoff | Gap / boundary |
| --- | --- | --- |
| Ordering and Avery 5960 PO labels | Existing production-connected `server.js` PO and label reads; direct older Lightspeed GETs per dependency register | Shared conversion and paginated tenant parity not verified; do not rewrite label rendering |
| Shared PO reader | PR #33 `services/lightspeed/purchaseOrders.js`: complete `2026-04/purchase_orders` list, unique ID match, `/line_items`, normalized supplier/lines, raw vendor payload | Candidate only, unmounted; read-only; real tenant response/scope and pagination still need acceptance |
| PO Companion | PR #31 has read-only Timeclock-checked `GET /api/scanner/purchase-orders/:id`, local supplier SKU/product mappings and per-PO/supplier draft review; PR #37 adds optional shared-reader injection with fail-closed parity tests | PR #31/#37 not production-integrated; real Chrome PO and signed-session acceptance incomplete |
| Product Scanner | Existing match/review foundations; supplier identifiers preserved exactly, invoice proposal bridge planned | Do not duplicate matcher or add its own invoice PO writer |
| Suppliers/catalog | Shared PR #32/#33 catalog references and existing Special Orders supplier/product mappings | Product Foundation owns canonical catalog supplier/product relationships, exact supplier SKU/cost/primary preference; Purchasing consumes and contributes evidence |
| Invoice reconciliation | `FEATURE_INVOICE_RECONCILIATION.md` approved architecture: invoice staging, full-invoice human review, match existing PO or propose new OPEN PO, sender aliases, tracking and provenance | No live invoice ingest, shared approval writer, or independently authorized vendor mutation |
| Receiving and stock | Special Orders/Ordering receiving business workflows already exist; Inventory owns canonical physical receiving and stock events | No invoice/tracking-to-receiving coupling whatsoever |

## Safe shared PO contract v0 (proposal only, NOT a deployed endpoint)
- `listPurchaseOrders({supplierId?, outletId?, status?, cursor?})` -> `{items, page, source:{system,apiVersion,readAt,complete}}`. A collection must not claim complete if pagination fails. Maintain underlying PR #33 pagination behavior rather than implementing another transport.
- `getPurchaseOrder(poId)` -> `{id, poType:'SUPPLIER', supplier:{id,name}, outletId, purchasingStatus, lines:[{id,productId,productName,orderedQty,supplierSku,sku,upc,unitCost,currency,raw}], source:{...}, raw}`. All IDs and supplier/product codes **strings**; preserve leading zeroes. Absent values `null`, not 0. An unverified field is absent/null, never invented from a vendor response.
- `purchasingStatus` represents vendor PO state only, e.g. `OPEN` if positively sourced; unknown mapped to `UNKNOWN`. Separate `receiving:{state,receivedQty,source,verifiedAt}` supplied **only** by Inventory's accepted physical receiving reader, never derived from invoice/tracking/PO text.
- Product Foundation owns `resolveSupplierIdentity({source,alias})`, `findSupplierProductLink(productId,supplierId)` and catalog write decisions. Purchasing owns evidence-backed shipping-sender aliases, supplier order references, invoice/PO/shipment associations; ambiguous aliases fail closed. Supplier SKU and historical unit cost retain provenance, timestamp, and source.
- Invoice `{id,supplierId,invoiceNumber,invoiceDate,documentHash,lines,associationStatus,approvalState,sourceEvidence}`; line `{orderedQty,invoicedQty,receivedQty,unitCostInvoice,currency,matchState,evidence}` keeps all three quantities distinct. `receivedQty` only sourced from Inventory and must remain unknown when unverified. Store invoice quantities in Hobby Corner PostgreSQL if Lightspeed PO fields cannot represent them safely.
- Shipment/tracking is many-to-many across invoice, PO and PO lines, with carrier, exact tracking reference, evidence, confidence, event timestamp, last verified time, tentative ETA, and `needs_review` state when ambiguous. Informational `on_the_way` projection never means received, ready, allocated, or notification-worthy without an independent workflow.
- Proposed write workflow for *future separately authorized milestone*: `proposePOChange({invoiceId,mode:'update_open'|'create_open',targetPoId?,supplierId,outletId,expectedPoVersion,reviewedLines,sourceEvidence})` -> durable non-mutating diff; final fully resolved invoice approval + exact operation grant + source recheck + duplicate PO check + audited idempotency + vendor readback. No live writer is authorized by this contract. If existing PO is incompatible/closed, reject and require separate review; never silently change received/dispatched states.
- Vendor adapters return normalized **evidence**, not inventory commands. Exact identifiers, source message IDs, document hashes, supplier alias provenance and uncertain associations must survive normalization.
- Security: consume Core API transport/audit/idempotency and independently approved Foundational Security identity/grants. Read permission never implies write approval. Avoid direct browser credentials.

## Invariants / non-negotiable safety
1. **Invoice, credit memo, preorder confirmation and tracking evidence NEVER receive products, increase inventory, allocate customer-ready items, mark a PO received, or mark Special Orders READY.**
2. Approved invoice may only propose authorized `OPEN` supplier PO creation or compatible existing PO update, and must never directly receive stock.
3. Physical receiving and inventory movements are separately owned, authorized and evidenced by Inventory's accepted workflow.
4. Do not equate Lightspeed `SUPPLIER` consignments with Hobby Corner customer-owned used-item Consignment.
5. No inferred supplier alias, no ambiguous PO matches, no primary-supplier overwrite, no numeric conversion of SKU/UPC, no duplicate PO creation.
6. Mutations must be explicit, operation-specific, replay-safe, audited and readback-verified, with uncertain writes quarantined.

## Implemented
- This **management handoff and interface proposal only**; no application code changed.

## Tested
- Automated: **not run for this handoff**. Historical PR #37 PO read regression GitHub Actions `42698964439` SUCCESS; historical PR #33 read/permission tests reported passed in its source documentation, **not rerun here**.
- Browser / employee acceptance: not performed; real tenant PO and supplier mapping parity unverified.
- Runtime / deployment verification: current management register reviewed; no independent Railway recheck in this milestone.

## Deployed
- Environment: **none for this foundation**.
- Service / extension version: none.
- Deployment reference: none.
- Production status: unchanged. Existing production-connected Ordering and labels remain owned by their current services.

## Shared dependencies / ownership
- Foundation Manager: contract registry F20/F21 and sequencing, conflict approval.
- Core API: `readCollection.js` pagination, `client.js` transport, audit/idempotency, versioning, gateway orchestration.
- Product & Catalog: canonical supplier identities/catalog aliases, product-supplier mappings, exact supplier SKU, cost/primary status; review proposal interfaces rather than duplicate writes.
- Inventory: received quantities, receiving events, stock mutations and stock timestamp validity.
- Purchasing (this workstream): PO projection, purchase-facing status, invoice/PO matching and proposals, shipping alias *evidence*, invoice/tracking association contracts and vendor adapters.
- PO Companion / Ordering / Scanner / Labels: keep their own UI, review, barcode and print workflows; consume shared read projections.
- Foundational Security: trusted staff identity and exact operation authorization; do not build a parallel system.

## Shared files / integration surfaces affected
- This handoff only. Proposed later code changes isolated to a named Purchasing branch, with changes to existing `services/lightspeed/purchaseOrders.js` only after coordinating PR #33/Core API ownership.
- Do not modify `server.js`, `routes/poCompanionRead.js`, `extension/manifest.json`, `extension/popup.js`, Scanner/PO Companion UI, or labels in the audit milestone.

## Remaining blockers
1. Obtain Foundation Manager's reviewed F20/F21 schema/operation IDs and Product/Inventory interface ownership agreement.
2. Verify current authoritative integration branch head and actual Ordering/Avery endpoint code; compare field/source shapes with PR #33 and PO Companion PR #37.
3. Read-only test-tenant validation of PO list/cursor completeness, PO lines, supplier IDs, outlet, status, exact codes, monetary fields and API version. Avoid undocumented direct GET assumptions.
4. Verify supplier alias, invoice numbering and PO reference uniqueness across multiple documents/shipments; design fixture dataset with ambiguous matches.
5. Define compatibility preconditions for OPEN PO updates and approved invoice proposal replay recovery; no writer until separately authorized.
6. Validate real browser/employee identity and PO Companion shared-reader adapter later with owning workstream.

## Decisions needed
- Canonical supplier ID versus shipping-sender alias registry ownership and approved provenance format with Product.
- Whether all PO reads stay `2026-04` until tenant validation; `2026-07` supplier-consignment create semantics must be independently scoped before any writes.
- Version 0 DTO fields and an explicit source for receiving status from Inventory.
- Approved account/service role for later invoice *approval* (distinct from any employee's ability to view invoices).

## Recommended next action
- Ask Foundation Manager to register this v0 read-only contract and resolve F07/F20/F21 ownership. On an independent Purchasing branch, add a **pure, read-only PO projection adapter and fixtures** built on PR #33's existing reader, prove complete pagination, exact string identity, missing/ambiguous fields, status separation and no receiving side effects. Wire one low-risk Ordering/PO Companion read consumer only after gated parity and review. No production PO writes or deployments.

## Restrictions / safety
- No production PO edits, receiving, inventory adjustments, product mutations, deployment, merge, live invoice auto-application or mailbox ingestion enabled by this milestone.

## Documentation
- `SHARED_TOOL_DEPENDENCIES.md` (F07, F08, F20, F21, F15, F25, F27), `LIGHTSPEED_SHARED_SERVICES.md`, `FEATURE_INVOICE_RECONCILIATION.md`, `handoffs/po-companion.md`, `handoffs/product-scanner.md`.

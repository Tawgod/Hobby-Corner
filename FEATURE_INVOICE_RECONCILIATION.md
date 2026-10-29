# Invoice Reconciliation — Cross-Tool Feature Specification

**Proposed feature name:** Invoice Reconciliation (also referred to as Invoice Update)  
**Status:** Planned — requirements and architecture only; no new tool or deployed code  
**Recorded:** 2026-10-29  
**Owner:** Shared Lightspeed API / reconciliation backend, integrated into Product Manager, Product Scanner, Special Orders and PO Companion/Ordering.  
**Source of truth:** `Tawgod/Hobby-Corner:main`; implementation will follow current `Tawgod/Lightspeed:integration/hobby-corner-consolidation` and the PR #32/#33 shared-services dependency.  
**Launch window:** Designed before the January 2027 store Lightspeed migration; not represented as required for that cutover without a separate priority decision.

## User-requested behavior

1. Pull supplier emails that contain invoices, supplier preorder confirmations, tracking and shipping data.
2. Extract PDF invoice details, match each invoice to the correct existing Lightspeed purchase order, and reconcile invoice line items to existing product/PO lines.
3. High-confidence (90%+) existing-product matches should be prepared automatically for invoice quantity and unit cost reconciliation. They must remain **staged until the complete invoice is reviewed and approved** to honor the final-approval requirement.
4. If a product exists but this supplier is not yet linked, propose a **secondary** product–supplier association, keeping the current first/primary supplier unchanged.
5. Suspected new products, missing matches and anomalies (MSRP difference, significant cost movement, quantity discrepancy) go into durable **Railway PostgreSQL staging**, not into live Lightspeed as incomplete/ghost products.
6. Product Manager gains a global **Invoice Updates** dropdown available to any currently authenticated employee, independent of their personal profile/layout. Choosing an invoice filters the grid and review actions to that invoice's products and unresolved lines only.
7. Product Scanner participates in invoice reconciliation: scan/reuse product matching and collect/verify supplier-specific code and supplier price, sending a proposed line resolution to the shared queue and Product Manager.
8. Once all invoice items have been resolved, the invoice is approved and the current PO is rechecked, update applicable Lightspeed PO lines and supplier relationships automatically through the shared backend with audit, idempotency and readback.
9. Keep preorder/shipping/tracking events discoverable in the linked PO and Special Orders workflow; do not automatically change customer promises or send messages from unverified emails.

## Required distinction: invoiced vs ordered vs received

A supplier invoice is evidence of billed quantity/cost. **It is not automatically proof of physical receipt.**

Store at least:
- `ordered_qty`: current PO's ordered quantity as read from Lightspeed.
- `invoiced_qty`: quantity invoiced per document; may include partial shipments or multiple invoices per PO.
- `received_qty`: actually checked in, only after a separate physical receiving action.
- `unit_cost_invoice`, `unit_cost_previous`, currency, discount, freight/tax totals, and effective/landed-cost policy.
- PO/supplier identifiers, invoice number/date, line numbers, document/page evidence, manufacturer UPC/SKU and supplier SKU, MSRP and current retail price.

**Invoice approval must never imply receiving stock or dispatching a PO**. Where the Lightspeed endpoint cannot represent invoiced quantity separately, preserve it in the Hobby Corner reconciliation database and update only supported, explicitly approved PO fields. Do not fake it by writing `received`.

## Mail ingestion and security

- Provider-agnostic read-only mail connector (Gmail API or Microsoft Graph/Mail.Read) using a dedicated store mailbox, approved sender/domain filters and/or mailbox labels/folders. Connector choice and mailbox are undecided.
- Ingest incrementally with stable provider message ID, attachment ID, SHA-256 content hash and idempotent processing state. Reforwarded/resent invoice, corrected invoice, credit note and duplicate attachment must not trigger duplicate PO updates.
- Detect classification: supplier invoice, preorder/acknowledgment, shipping/tracking, credit memo, unsupported/unknown. Allow multiple documents and multiple POs in one email; flag ambiguous associations.
- Treat PDF text and all email content as **untrusted data**, never instructions to run code, authorize actions or alter credentials. Do not follow untrusted tracking/PDF URLs or download remote assets without policy checks.
- MIME allowlist, file count/size limits, antivirus scanning, PDF parsing in an isolated bounded worker; use text extraction first and page-level OCR only when needed. Log extraction confidence and original page citations; never invent missing cost, code, or quantity.
- Store original attachments in private access-controlled object storage with limited retention and checksums; store only structured extracted fields, relationships and immutable review events in Railway PostgreSQL. No public GitHub attachment storage.
- Protect mailbox OAuth credentials and retailer/customer information. Preserve source links, timestamps, duplicate suppression, retry counters and dead-letter reconciliation.
- Classified shipping messages can add tracking/carrier/ETA annotations to a linked PO or Special Orders only after verified association; do not auto-send customer notifications.

## Proposed matching and validation stages

**A. PO identification**
- Supplier exact ID/alias, invoice PO reference, existing PO number, shipment/order reference, invoice date, destination/outlet and line fingerprint.
- Require unique verified PO association before a write is eligible. Multiple close POs, mismatched supplier, canceled/received PO or multiple-document invoice must block and request review.
- One PO can have several invoices/shipments; each invoice gets its own immutable document ID and version. Matching should not aggregate unrelated receipts.

**B. Line/product matching**
- Prefer exact stable Lightspeed product ID when present and verified.
- Then exact UPC/EAN/GTIN with leading zeros preserved and check-digit validation where applicable, then exact supplier+supplier-SKU association.
- Then existing local supplier/product registry and Special Orders/Scanner matcher, then title/brand/size/pack-aware advisory matches.
- Numeric suffixes from prefixed SKUs are **not** equivalent; packs, bundles and product variants require manual confirmation.
- A 90% confidence threshold is a **candidate auto-stage threshold**; never auto-stage ambiguously tied items or high-confidence matches with conflicting product IDs, pack sizes or categories. Require source evidence for score and calibrated thresholds; it is not a probability guarantee.
- Deterministic business rules (PO/SKU/quantity/price conflict) override the confidence score. Every mismatch remains visible; lower-confidence items become `needs_review`.

**C. Price and quantity review**
- Compare invoiced unit cost vs current **supplier-specific** price, not necessarily the product's primary supplier price. Compare MSRP separately from current store retail price.
- Significant price/quantity change thresholds are configurable and **not yet decided**; show absolute and percentage variance. Flag negative/zero quantities, currency conversions, tax/discount/freight allocation, case-pack unit conversions, duplicate invoice lines and credit memos.
- An employee may correct extraction fields or choose products; every correction and author is audited. Corrections invalidate stale candidate matches and approval signatures.

**D. Product and supplier proposals**
- Existing item + new supplier: prepare an add-secondary-supplier proposal. Preserve the primary/default supplier and existing supplier-specific codes/prices, especially for product variant families. Avoid replacing the entire supplier list.
- New item: stage a provisional Product Manager product proposal with available name, supplier SKU, UPC, cost, MSRP, brand/category and invoice evidence; product creation remains separate, gated and duplicate-verified.
- Suspected match: offer candidate links, Scanner lookup and Special Orders matching. Never silently create a Lightspeed product because no match was returned.

## UI / cross-tool ownership

### Product Manager
- Add a global, shared **Invoice Updates** dropdown alongside existing product-data modes; accessible to any verified, logged-in employee, irrespective of their saved custom profile.
- Dropdown lists invoice number, supplier, PO reference, received date, unresolved count and status. Choosing one displays **only** the relevant invoice lines, matched products and proposals.
- Column set for invoice view: invoice line/evidence, supplier SKU, UPC, matched product, match confidence, PO ordered quantity, invoiced quantity, current supplier cost, invoice cost, MSRP/current retail, price variance, resolution, employee notes and approval state.
- Rows open matches, propose new products, add a non-primary supplier, or request a Scanner lookup. Autosave and cross-employee review use the shared invoice ID plus optimistic versioning; do not save shared invoice data under employee-specific profile or five-minute work draft.
- Show whether each change is staged, resolved, approved, applied, failed, unknown or requiring reconciliation. No implied successful Lightspeed write from a UI draft.

### Product Scanner
- Reuse current Scanner/Special Orders matching code and backend Timeclock session; no second product identity engine.
- Allow scan UPC/SKU or supplier label against a chosen invoice line; fetch authoritative product and supplier-specific price, compare with invoice; submit a reviewed match/price proposal to the same shared staging row.
- Preserve scanned identifiers, supplier ID, source evidence and author; reject cross-invoice or stale-version submissions.
- Any Chrome extension review/link UI is a **future queued addition**, not part of an existing extension release.

### Special Orders / Ordering / PO Companion
- Link invoice and shipment/tracking status to the correct PO and supplier; PO Companion may open the invoice-specific review context.
- Preserve Special Orders customer-preorder allocation/notifications; do not infer an item is physically available from a supplier invoice or tracking email.
- PO Companion remains the PO read and supplier code mapping consumer; do not create a second PO writer inside extension code.
- Shared backend owns real Lightspeed read/write, not browser extension or Product Manager client.

## Proposed persistence (additive, names for planning only)

- `supplier_mail_messages`: provider/mailbox/message identity, metadata, classification and processing status.
- `supplier_documents`: message/attachment ID, content hash, secure object reference, doc type, supplier/invoice number/date, extraction version and provenance.
- `invoice_batches`: supplier, invoice number, linked PO, currency, version, shared review status, approval and sync receipts; uniqueness appropriate for supplier/year/document revision.
- `invoice_lines`: immutable extracted source fields plus corrected structured values, page/line references, pack/currency details.
- `invoice_line_matches`: product/PO line candidate, score, reasons, verified codes, staff resolution, conflict reason and current review version.
- `invoice_change_proposals`: proposed supplier link, new product, PO cost/quantity or annotation, before/after snapshots, audit metadata, approval state.
- `invoice_sync_attempts`: idempotency scope/key, audited per-write receipts, readback and partial/unknown manual reconciliation.
- `invoice_shipments`: tracking, supplier promised ETA, PO association and email provenance, separate from physical receiving.
- Invoice-specific events/versions support multiple simultaneous employees and draft restoration without overriding each other's changes.

**Initial state machine:** `discovered` -> `extracted` -> `po_match_pending` -> `matching` -> `needs_review` -> `ready_for_approval` -> `approved` -> `applying` -> `applied`. Include explicit `blocked`, `partial_failure`, `reconcile_required`, `superseded` and `cancelled`. No duplicate auto-apply for a previously approved source version.

## Critical Lightspeed API findings (verified against current official documentation)

1. X-Series now offers an **AI-powered supplier-document draft import** for JPG/PNG/PDF in its stock receiving UI, where plan and rollout permit. Evaluate capability against requirements; our custom work is still needed for email ingest, cross-tool review, SKU/supplier proposals, audit and final gated application. See:
   https://x-series-support.lightspeedhq.com/hc/en-us/articles/25534168876187-Receiving-purchase-orders
   https://x-series-support.lightspeedhq.com/hc/en-us/articles/25533748112923-Creating-a-purchase-order
2. X-Series purchase-order read endpoints `/api/2026-04/purchase_orders` and `.../{id}/line_items` (version cursor, `consignments:read`, cost visibility may require `products:read:costs`). PR #33 read services are **development candidates**, not yet live.
   https://x-series-api.lightspeedhq.com/v2026.04/reference/listpurchaseorders
3. **PO mutations use SUPPLIER consignments** in the API. Per-item update `PUT /api/2026-04/consignments/{consignment_id}/products/{product_id}` behaves differently by PO status. In OPEN/SENT it updates `count`; in DISPATCHED it updates `received`; `cost` can update OPEN/SENT/DISPATCHED. Received/cancelled cannot be edited through the endpoint.
   https://x-series-api.lightspeedhq.com/v2026.04/reference/updateproductinconsignment
4. **Never write `received` as a surrogate for invoiced quantity.** Bulk `POST /api/2026-07/consignments/{id}/bulk` accumulates `count` in OPEN/SENT and `received` in DISPATCHED; supplying `received` on OPEN/SENT may advance status to DISPATCHED. Not safe as a general idempotent set operation; favor read/review and explicit status-aware, read-back-verified approved writes.
   https://x-series-api.lightspeedhq.com/v2026.07/reference/createorupdateconsignmentproducts
5. X-Series supports multiple suppliers per product. Product 2.1 update `common.product_suppliers` plus `details.product_suppliers` requires careful preservation of existing associations/variant family values; test with a dedicated tenant before enabling add-secondary-supplier.
   https://x-series-api.lightspeedhq.com/v2026.04/docs/products_variants_update
   https://x-series-support.lightspeedhq.com/hc/en-us/articles/25534088679835-Managing-suppliers
6. All Lightspeed writes must run through the existing planned Phase 1 durable audit/idempotency, shared policy with explicit invoice application permissions and fresh readback. The user has not authorized live PO mutation as part of this planning feature.

## Suggested development phases (future PRs)

1. **Discover and ingest (read-only):** mailbox provider contract, safe attachment storage, PDF text extraction on representative redacted invoices, document dedupe, supplier classification, email/tracking links.
2. **PO match and staging:** shared PO reads, immutable invoice lines, existing Scanner/Special Orders identity matcher, 90%+ scoring calibration, staged supplier/new-product/price/qty proposals, initial test fixtures.
3. **Cross-tool UI:** Product Manager Invoice Updates shared dropdown and invoice-scoped grid; Scanner lookup/price proposal; PO Companion/Ordering/Special Orders PO-linked views. Multi-employee concurrency, restore and review.
4. **Approval and dry run:** explicit final invoice approval, complete line resolution, PO version/status guard, preview of *exact* intended differences and side effects; supplier link review, no stock received.
5. **Controlled test-tenant apply:** only after approved write contract and endpoint/scopes confirmed. Use atomic per-op persistence, readback and manual intervention for partial/ambiguous outcomes; establish recovery and retry policy.
6. **Coordinated production release:** employee acceptance and permissions, secure mail integration, test tenant parity and release approval. No future extension packaging without release queue reconciliation.

## Decisions still open

- Which business mailbox/provider(s) and supplier sender filters; whether dedicated mailbox/label/folder.
- Which supplier invoice formats can be used as early test fixtures (prefer redacted PDFs).
- Whether 90% applies only to product identity or also requires invoice-to-PO confidence; default proposal is product confidence plus mandatory strict PO association.
- Cost/MSRP/quantity variance approval thresholds and whether some anomalies always require managerial review.
- Who can approve application (recommended distinct role/permission) versus who can use the shared Invoice Updates dropdown (requested: any logged-in employee).
- Whether approval can be per invoice line or always full invoice final review (proposed: full invoice approval required).
- When supplier invoice costs should update the product's supplier price versus only PO cost, and how landed costs/freight should be allocated.
- Product creation timing relative to final PO apply and partial shipment/backorder handling.
- Tracking update/cross-feature notification policy; no customer notification without explicit separate approval.

## Handoff and safety

- This is one **planned cross-tool feature**, not a standalone new application, web route, deployed service or separate feature owner team.
- No mailbox read, PDF upload, Railway database migration, Lightspeed product/PO change or Chrome extension modification has been performed.
- Relevant owner handoffs: `handoffs/product-manager.md`, `handoffs/lightspeed-shared-services.md`; missing Scanner/PO Companion handoffs must be created during project transition.
- Browser UI additions must use existing shared navigation and Timeclock authentication. New shared invoice queue is global (not tied to employee profile); edits/approval still require server identity/audit.

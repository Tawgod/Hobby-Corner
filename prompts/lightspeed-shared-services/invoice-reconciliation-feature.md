# Shared Feature Intake — Invoice Reconciliation (not a standalone tool)

Before making changes, read `Tawgod/Hobby-Corner:main/FEATURE_INVOICE_RECONCILIATION.md`, `LIGHTSPEED_SHARED_SERVICES.md`, `SHARED_STAFF_AUTH_PERMISSIONS.md`, `HOBBY_CORNER_PROJECT.md`, `HOBBY_CORNER_CHAT_TRANSITION.md` and the owning tool's current handoff.

**This is a future shared feature integrated into existing Product Manager, Product Scanner, Special Orders/Ordering, PO Companion and the shared Lightspeed backend.** Do not create a new competing Product Manager or Scanner application.

## Workstream responsibilities

- **Shared Lightspeed backend:** authorized supplier email ingestion and PDF processing, durable invoice/line/approval records, complete PO association, shared matching and product-supplier price lookup, audit/idempotency/write guard. Verify actual PO consignment API semantics.
- **Product Manager:** add **Invoice Updates** global authenticated selector independent from employee layout/profile slots; invoice-scoped review/approval UI and draft safety. It must not silently change current Product Manager layout preferences or immediately write Lightspeed.
- **Scanner/Toolkit:** submit verified supplier SKU/UPC/supplier-specific price and candidate match to a selected invoice line; reuse existing Special Orders/Scanner matcher. If extension source changes, first read `CHROME_EXTENSION_INTEGRATION.md` and update `CHROME_EXTENSION_RELEASE_QUEUE.md`.
- **Special Orders/Ordering:** display supplier invoice/tracking/PO associations; distinguish supplier invoiced goods from physically received stock and customer-preorder availability.
- **PO Companion:** read verified PO/line data and optional links to invoice-specific review; preserve supplier SKU, UPC, leading zeros, local mapping, drafts and auth.

## Required staged milestone order

1. Approve mailbox/provider/sender filter and gather **redacted** representative invoices; no blanket live mailbox scan without authorization.
2. Implement secure read-only document/attachment extraction and idempotent metadata ingest. Test multiple invoice revisions/POs/shipments.
3. Implement source-evidenced exact product matching, calibration and conflict flagging. 90%+ means automatically staged candidate; not permission to write live PO.
4. Add shared per-invoice Product Manager dropdown/grid and Scanner bridge, with cross-employee optimistic locking/versioning and audit.
5. Introduce separate final invoice approval and preview, then a test-tenant-only status-safe PO write adapter using the already established durable mutation gate. Do not confuse invoiced and received quantities.
6. Validate real staff/browser acceptance and gain explicit deployment/production-write approval.

## Existing API discovery

- Official X-Series PO read: `/api/2026-04/purchase_orders`.
- PO product updates: SUPPLIER consignment endpoints. Bulk `count` accumulation and `received` dispatch/status side effects make naive retry unsafe; use status-aware reviewed changes and readback.
- Existing supplier association product family updates must preserve the first/primary supplier; do not create replacing supplier lists from a single invoice.
- Lightspeed has an AI supplier document import UI in eligible plans; evaluate whether it can assist employee workflow rather than duplicate a built-in feature.

**Status as of 2026-10-29: Planned, no code PR, no CI, no deployment.** The requirements are registered only. Future feature work must not stall unrelated chat transition, and old tool chats should not be archived before their handoffs cover this dependency.

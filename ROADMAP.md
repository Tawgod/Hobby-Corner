# Hobby Corner Development Roadmap

Last verified: 2026-10-09

## Critical fixes and operational risks

1. Rotate the exposed Discord bot credential found in an operational Google Sheet and remove the plaintext value from the sheet.
2. Rotate/remove the source-controlled Lightspeed credential in `Tawgod/Lightspeed-Importer`; move configuration to Apps Script Properties or another secret store.
3. Document and test the shared PostgreSQL schema ownership before more services add tables or migrations.
4. Stabilize deployment branching: identify a production branch/release process for `lightspeed-api` and `timeclock` instead of indefinite deployment from `feature/order-split-poc`.

## High-priority improvements

### Importer hardening
- Configurable batch size.
- Resumable execution.
- Processed and Errors queues/tabs.
- Idempotency and duplicate safeguards.
- Repair category-resolution behavior.
- Verify backup/reconciliation jobs.

### Order split / recall
- Complete eligible-order/customer list.
- Test recall flow from Sell and partial-pickup flow from fulfillment.
- Verify add-to-previously-split-order scenario.
- Remove test/API debug presentation.
- Finalize Avery button contrast.

### Special orders
- Validate legacy workbook migration against current sheets.
- Confirm complete status transitions and audit trail.
- Complete supplier ordering and receiving workflow.
- Integrate held/parked sale creation.
- Add Discord notification after receipt/hold.
- Define cutover criteria before retiring spreadsheet workflow.

## Current development

### Supplier product scanner
Develop on `feature/product-scanner-foundation`.
Target workflow:
- Physical barcode scan.
- Capture one current supplier product webpage, not whole-catalog crawling.
- Search Lightspeed before creation.
- Warn when an existing item is missing required data.
- Preview extracted product data for staff approval.
- Reuse the existing special-order product creation / matching logic where practical.

### Timeclock
- Validate 14-hour auto-clock-out.
- Employee weekly history.
- Pay-period reporting.
- Adjustment notes / audit trail.
- Overtime flags.
- Payroll-ready summary.

### Image workflow
- Resume-safe batch processing.
- Valid/fixed -> Lightspeed Ready.
- Unsalvageable -> Attention.
- Generate progress/error report.
- Keep originals unchanged.

## Planned integrations

- Shared customer identity across Lightspeed, Discord, preorder sheets, rewards and special orders.
- Supplier purchasing queue fed by special orders and eventually stock replenishment.
- Inventory-count/reconciliation workflow once migration is stable.
- Discord special-order notifications.

## Longer-term ideas

- Consolidated purchasing dashboard.
- Automated supplier availability ingestion where allowed.
- Better operational reporting across sales, rewards, special orders and staff time.
- Retirement plan for legacy RMS/migration bridge after data parity is proven.

## Work that should be developed together

- Special orders + supplier cross-reference + supplier purchasing.
- Customer identity + Discord notifications + rewards customer mapping.
- Extension UI + Lightspeed API endpoints for the same workflow.
- Importer reconciliation + inventory cutover planning.

## Work that should remain separate

- Timeclock data/business rules should use shared infrastructure but remain a distinct domain from customer/order data.
- Image normalization should remain an offline/batch workflow rather than be tightly coupled to store transaction services.
- Legacy migration tooling should remain isolated and removable after cutover.

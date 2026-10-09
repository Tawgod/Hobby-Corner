# Hobby Corner Project Registry

Last verified: 2026-10-09

This repository is the project-wide management index for Hobby Corner systems. Runtime code remains in the owning repositories. Statuses are: Planned, In Development, Testing, Deployed, Blocked, Maintenance.

## Source-of-truth order

1. GitHub — current source, branches, history, documentation
2. Railway — actually deployed services and environment state
3. Google Drive / Sheets — business data and operational workflows
4. This registry — ownership, status, dependencies, decisions, next steps
5. Project conversations — historical requirements and decisions

## System inventory

### Lightspeed Chrome Extension and Toolkit
Status: Testing

Purpose: Staff-facing enhancements embedded into Lightspeed Retail X-Series.

Repository: `Tawgod/Lightspeed`

Relevant branches:
- `LivBranch` — repository default branch; older minimal toolkit baseline.
- `feature/order-split-poc` — deployed source for the production Railway `lightspeed-api` service and `timeclock` service as of 2026-10-09.
- `feature/product-scanner-foundation` — product-scanner development branch.
- `special-orders-foundation-livebase-2026-10-02` — special-order test application branch.

Verified features in `feature/order-split-poc`:
- Avery label launcher on purchase-order pages.
- Recall / Split Order launcher on Sell / webregister.
- Split / Partial Pickup launcher on fulfillment pages.
- Embedded order-split overlay.
- Auto-close message path after successful split.
- Employee timeclock UI embedded in the extension.

Known development items:
- Improve Avery button visibility in both light and dark mode.
- Continue staff-facing polish of order recall / split workflow.
- Eligible-order list and customer-oriented recall flow.
- Supplier page capture / physical barcode product scanner.
- Product duplicate checking and missing-data warnings before product creation.

Dependencies:
- Railway `lightspeed-api`
- Railway `timeclock`
- Lightspeed Retail X-Series APIs

Deployment note:
The deployed services do not currently track `LivBranch`; they deploy from `feature/order-split-poc`. Treat branch merges carefully.

### Lightspeed API / Order Split Backend
Status: Testing

Purpose: Backend for Lightspeed extension functions including order split, partial pickup, recall-related operations and other store workflows.

Repository: `Tawgod/Lightspeed`
Deployed branch: `feature/order-split-poc`
Railway service: `lightspeed-api`
Environment: production
Last verified deployment: SUCCESS, 2026-10-06

Verified backend areas include order split execution, deposit conversion, work-order combine, and Lightspeed API helpers.

Next:
- Complete end-to-end staff testing.
- Remove testing/debug output before calling the workflow production-ready.
- Establish a stable production branch/release process instead of long-term deployment from a feature branch.

### Product Importer and Catalog Migration
Status: In Development

Purpose: Migrate and reconcile catalog, suppliers, brands, categories, customers, images, gift cards and related data into Lightspeed.

Repository: `Tawgod/Lightspeed-Importer`
Branch: `main`
Related operational sheet: `LS: importer`

Verified importer modules:
- Products
- Product updates
- Suppliers
- Brands and duplicate-brand cleanup
- Categories
- Customer import/update
- Item image upload
- Gift card export
- Customer/item backup
- Product UUID database and reconciliation
- Reorder-point batch updates

Known problems:
- Current product-export loop processes the complete input set and can exceed Apps Script execution limits.
- Category creation/fallback has produced HTTP 404 errors.
- Batch completion / Processed / Errors queue design discussed but not yet verified in repository code.
- A credential is stored in source configuration and must be migrated to safer secret storage.

Next:
- Implement configurable batch size, resumable queue, Processed and Errors handling.
- Make operations idempotent so retries cannot create duplicate products.
- Repair category resolution.
- Remove source-controlled credentials and rotate affected credentials.

### Inventory Counting and Reconciliation
Status: Planned

Purpose: Full physical inventory after catalog migration and ongoing reconciliation.

Current scope:
- Multi-person count strategy.
- Prevent duplicate/conflicting counts.
- Reconcile final physical quantities to Lightspeed.
- Use existing UUID mapping/reconciliation assets where possible.

Dependency:
Catalog migration must be substantially complete before final inventory cutover.

### Special Orders and Supplier Tracking
Status: Testing

Purpose: Replace fragmented special-order/preorder tracking with an integrated database-backed workflow tied to Lightspeed.

Repository: `Tawgod/Lightspeed`
Branch: `special-orders-foundation-livebase-2026-10-02`
Railway service: `special-orders-test`
Database: shared Railway PostgreSQL
Last verified deployment: SUCCESS, 2026-10-08

Verified implementation:
- PostgreSQL special-order schema.
- Supplier and supplier-product relationships.
- Multiple suppliers per item.
- Product identifier mapping.
- Product reconciliation tracking.
- Customer search and new Lightspeed customer creation UI.
- Special-order item search / quick add.
- Statuses including OOS, PREORDER, READY_TO_ORDER, ORDERED and BACKORDERED.
- Ordered-over-seven-days dashboard metric.
- New Lightspeed item creation workflow with duplicate-match checking.
- Supplier/source URL, category, cost, retail, dimensions, weight and reorder-setup data.
- Legacy workbook import UI.
- Existing Google Sheets preorder/customer workflows remain operational data sources and must be preserved during migration.

Planned / not yet fully verified:
- Customer Discord notification when received/held.
- Complete supplier-order workflow.
- Production migration from legacy preorder/special-order sheets.
- Full receive -> held/parked sale -> pickup lifecycle.

### Employee Timeclock
Status: Testing

Purpose: Editable long-term staff time records, reporting, adjustment tracking and employee visibility beyond Lightspeed's built-in clock.

Repository: `Tawgod/Lightspeed`
Branch deployed: `feature/order-split-poc`
Railway service: `timeclock`
Database: shared Railway PostgreSQL
Last verified deployment: SUCCESS, 2026-10-06

Requirements established:
- Sunday-Saturday weeks.
- Pay periods 1-15 and 16-end of month.
- Recent daily history and weekly totals for employees.
- Administrative corrections with notes.
- Automatic clock-out after 14 hours.
- Overtime review and pay-period summary.
- Multi-year data retention.

Verified:
A substantial timeclock backend exists and the extension contains a timeclock UI. Production readiness and complete reporting coverage still require validation.

### Discord Bot and Customer Identity
Status: Deployed

Purpose: Customer/Discord identity integration and store communication workflows.

Repository: `Tawgod/Hobby-Corner-Discord-Bot`
Branch: `main`
Railway service: `Hobby-Corner-Discord-Bot`
Last verified deployment: SUCCESS, 2026-10-01

Verified:
- Bot service is deployed.
- Master Customer List is the curated customer/Discord identity source.
- Discord user ID is treated as a durable identity key.
- HC Preorders, GW Preorders and Master Preorder Sheet are documented as related operational data sources.
- Bot reconciles curated customer data on a schedule.

Planned integration:
- Special-order receipt / held-order notifications.
- Continued consolidation with Lightspeed customer identity.

Security:
An operational preorder sheet was found containing a plaintext Discord bot credential. Rotate it and remove it from the sheet.

### Customer Rewards
Status: Deployed

Purpose: Calculate rolling customer rewards tiers and synchronize rewards-related fields into Lightspeed.

Repository: `Tawgod/Hobby-Corner-Discord-Bot`
File: `rewards_service.py`
Railway service: `Hobby-Corner-Rewards`
Database: shared Railway PostgreSQL
Last verified deployment: SUCCESS, 2026-10-02

Verified implementation:
- Rolling-sales tier calculation.
- Legacy transaction support.
- Exclusions, manual overrides and special discounts.
- Rewards snapshots and run history.
- Lightspeed customer custom-field synchronization.
- RMS / legacy data bridge tables.

Follow-up:
Verify whether the deployed service is intentionally in dry-run or live-write mode before changing reward rules.

### Image Processing and Product Photos
Status: In Development

Purpose: Validate and normalize product images for Lightspeed while preserving originals.

Drive workflow:
- Source/original images.
- `Lightspeed Ready` folder for valid or repaired copies.
- `Attention` folder for files requiring manual replacement.

Related existing importer capability:
`Item Images.gs` uploads images to Lightspeed.

Planned:
- Resumable batch processing.
- Skip previously completed files.
- Progress/report output.
- Quality threshold for images needing manual replacement.
- Long-running execution outside an interactive ChatGPT session.

### Legacy RMS / Migration Bridge
Status: Maintenance

Purpose: Preserve required legacy customer and transaction data while Lightspeed becomes the primary platform.

Evidence:
- Rewards service contains RMS staging, customer identity mapping, transaction staging and migration-job tables.
- Discord repository contains an `rms_bridge` area and migration assets.

Next:
Document exactly which RMS processes are still authoritative, which are migration-only, and the retirement criteria.

## Railway production map

Verified 2026-10-09 in project `Hobby Corner`:
- `Hobby-Corner-Discord-Bot` -> `Tawgod/Hobby-Corner-Discord-Bot:main`
- `Hobby-Corner-Rewards` -> `Tawgod/Hobby-Corner-Discord-Bot:main`
- `lightspeed-api` -> `Tawgod/Lightspeed:feature/order-split-poc`
- `timeclock` -> `Tawgod/Lightspeed:feature/order-split-poc` with root directory `/timeclock`
- `special-orders-test` -> `Tawgod/Lightspeed:special-orders-foundation-livebase-2026-10-02`
- `Postgres` -> persistent shared database volume
- `migration-test-bsi117` -> temporary Railway function used for migration testing

No staged Railway changes were present when audited.

## Important architecture decisions

- PostgreSQL should remain the authoritative datastore for durable operational records such as timeclock, rewards and special orders; Chrome/Discord are interfaces, not primary stores.
- Preserve existing Google Sheets preorder/customer workflows during migration until replacement parity is verified.
- New special-order, purchasing and supplier functions should build on the existing special-order schema rather than creating a parallel system.
- Do not assume default GitHub branches are production. Railway deployment source is authoritative for what is live.
- Keep development/test services distinct from staff-facing production workflows.

## Highest-risk issues

1. Plaintext Discord bot credential in an operational Google Sheet.
2. Source-controlled Lightspeed credential in the private importer repository.
3. Production-facing Railway services deployed directly from feature branches.
4. Multiple systems share the same PostgreSQL database; schema ownership and migrations need explicit coordination.
5. Legacy sheets, new special-order database, Discord identity and rewards identity all touch customer records and require one documented identity strategy.

## Manager workflow

For project updates:
1. Read this registry.
2. Verify relevant GitHub branch and Railway deployment.
3. Verify relevant Drive/Sheet data source when operational state matters.
4. Report implementation, testing and deployment separately.
5. Record blockers and cross-system effects.
6. Update this file, `CHANGELOG.md`, and `ROADMAP.md` after meaningful verified changes.

# Hobby Corner Project Registry

Last verified: 2026-10-12

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

Authoritative branch:
- `integration/hobby-corner-consolidation` — current unified development and deployed Railway source for Lightspeed API, Timeclock, Special Orders, Split / Recall, ZIP/USPS tools, extension work, and Product Scanner foundation.

Retired branches (SAFE TO DELETE; do not use for new work):
- `feature/order-split-poc`
- `feature/product-scanner-foundation`
- `special-orders-foundation-2026-10-02`
- `special-orders-foundation-livebase-2026-10-02`

Verified features in `integration/hobby-corner-consolidation`:
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
Deployed branch: `integration/hobby-corner-consolidation`
Railway service: `lightspeed-api`
Environment: production
Last verified deployment: SUCCESS, 2026-10-06

Verified backend areas include order split execution, deposit conversion, work-order combine, and Lightspeed API helpers.

Next:
- Complete end-to-end staff testing.
- Remove testing/debug output before calling the workflow production-ready.
- Establish a stable production branch/release process instead of long-term deployment from a feature branch.

### Legacy Product Importer and Category Mapping
Status: Maintenance

Purpose: Preserve legacy migration tooling and support category mapping while newer direct-connection workflows replace most importer functions.

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

Current management decision:\n- Most importer functions are now legacy because the project is moving toward direct Lightspeed connections.\n- Category mappings remain active work and are still being finalized.\n- Do not invest in broad importer hardening unless a remaining migration task specifically requires it.\n\nKnown issues:\n- Category creation/fallback has produced HTTP 404 errors.\n- A credential remains in legacy source configuration and should be retired/rotated when that legacy path is no longer needed.\n\nNext:\n- Finalize category mappings.\n- Identify the minimum legacy importer functions still required for cutover.\n- Prefer direct-connection implementations for new functionality.\n- Retire and secure legacy credentials when the remaining importer dependency is removed.

### RMS Product Migration
Status: Testing

Purpose: Migrate the RMS product catalog into Lightspeed with validated category, brand, supplier, pricing, identifiers, descriptions, images, and reorder configuration while deliberately not importing RMS on-hand inventory.

Repository: `Tawgod/Hobby-Corner-Discord-Bot`
Branch: `product-migration-colab`
Notebook version: `2026-10-16-v42`
Operational sheet: `LS: importer`
Dedicated review sheet: `Flagged Migration Items`
Authoritative source: `My Drive/Hobby Corner Migration/HCDB Test Items.csv`
Last verification: 2026-10-16

Verified migration behavior:
- Product-family creation with SKU/product codes, brand, category, supplier, supplier item code, cost, retail, weight, long description, and family image.
- Product name uses RMS Web Description only when corroborated against RMS item text; otherwise it safely falls back to RMS Description and records a non-blocking warning.
- Strong barcode identity conflicts and source-internal product-code collisions are forced to review.
- RMS on-hand inventory is never sent; physical inventory will establish opening stock.
- Lightspeed reorder configuration uses `MIN_MAX`: RMS proposed reorder point -> minimum, proposed restock level -> target maximum.
- Controlled reorder testing has verified requested values by read-back with on-hand unchanged.
- Controlled product writes read the family/product back and verify name, long description, category, brand, codes, supplier ID/code/price, retail price, weight/unit, active flags, and requested image.
- Product and reorder controlled-write helpers enforce an absolute 20-write cap.
- Exact SKU duplicate checking uses the current Lightspeed 2026-10 product endpoint before create.

Fresh RMS source audit — 2026-10-16:
- Verified the new `HCDB Test Items.csv` in the expected Hobby Corner Migration folder.
- File contains 54,255 product rows and the complete 38-column current RMS bridge schema.
- No blank RMS Item ID, SKU, or Description rows were found.
- The source audit found one duplicate SKU and six colliding product-code values among migration candidates; the notebook now sends affected rows to review.
- Supplier-cost analysis showed thousands of rows where a zero SupplierList cost would otherwise hide a positive item cost. Cost selection now uses the first positive SupplierList/LastCost/Cost/ReplacementCost value instead of treating zero as authoritative.

Verified mapping audit — 2026-10-16:
- All 151 nonblank RMS category mappings resolve to a `Cat ID` path; no conflicting RMS department/category keys and no duplicate category UUID paths were found.
- The duplicate visible `LS Level3` columns in `Mapping` do not currently create ambiguous paths: no populated mapping row has more than one Level3 target.
- The 15 blank category mappings correspond to intentional non-migrating legacy/system categories, including HomeBrew, Gift Cards, Rentals, Videos, Discounts, Online Only, Store Credit Voucher and Special Orders.
- `Supplier ID Map` has no missing UUIDs or duplicate supplier names.
- The retained `Supplier` list has five names not yet present in `Supplier ID Map`: Heart Puzzles, Hornby America, JR Americas, Salvino JR Models, and Valpak. The notebook attempts exact read-only Lightspeed UUID resolution for retained names before sending unresolved rows to review.
- `Migration Supplier Mapping` contains 21 named supplier rows mapped to `Other` without an approval disposition. These are no longer trusted automatically.
- `Brand ID Map` has no missing UUIDs or duplicate brand names. Leanin Tree / Leanin' Tree / Leaning Tree intentionally share one UUID alias set.
- Mapping/UUID builders now reject conflicting duplicate rows instead of silently using the last row.

Safety/configuration corrections verified in v42:
- The Drive CSV is authoritative and setup fails closed when it is missing. The legacy RMS candidate sheet is disabled by default and requires explicit `ALLOW_LEGACY_SOURCE_FALLBACK=True`.
- Setup validates the current 38-column bridge schema, blank primary fields, and duplicate RMS Item IDs before analysis.
- Old notebook cells that independently reloaded/reanalyzed data were retired so setup-time review gates cannot be bypassed by running top-to-bottom.
- Unmapped categories display `General > No Category` only as a review label; they remain unmapped and cannot enter write batches.
- Explicit category mappings missing a Cat ID UUID are routed to review.
- Blank suppliers and unresolved named suppliers remain review items; they are never silently assigned to `Other`.
- Exact retained/current supplier names override stale `Other` mappings, with missing UUIDs resolved by exact Lightspeed name when possible.
- Nonblank brands missing a UUID are routed to review.
- Source code typing uses CUSTOM for SKU, UPC for 12 digits, EAN for 8/13 digits, and ITF for 14 digits.
- Cleanup refuses to patch an existing Lightspeed test product from a hard identity-conflicted source row.
- The dedicated `Flagged Migration Items` workbook receives current review rows while preserving manual review status/notes and the existing Review Status column position.
- Separate category, supplier, and brand mapping-gap tabs are maintained.
- Reorder writes independently load Lightspeed credentials and verify the configured outlet.
- No production Railway deployment is involved in the Colab notebook workflow.

Known test cleanup:
- The incorrect controlled-test Model Railroader product created from the corrupted source row remains identified for cleanup and was not automatically deleted or modified.

Open cutover decisions:
- Decide whether RMS `Inactive` should cause migrated products to be inactive in Lightspeed. Current controlled payloads set `active.in_store=True`.
- Decide separately whether any migrated products should be enabled for the Ecwid/online channel; current payloads set `active.ecwid=False`.
- Tags are not currently migrated.
- `DEFAULT_RMS_WEIGHT_UNIT='LB'` is a documented source assumption because RMS does not provide an explicit weight-unit column.
- Add/verify a full-catalog collision preflight against existing Lightspeed product codes, beyond the current exact-SKU duplicate lookup, before final catalog cutover.

Next:
- Reload v42 and run the top configuration plus ONE-CLICK NON-DESTRUCTIVE SETUP with all write switches disabled.
- Verify the setup reports the Drive CSV as the source, 54,255 analyzed rows, opening inventory 0, and the expected review/warning counts.
- Review the dedicated flagged queue plus category/supplier/brand gap tabs.
- Run the next bounded controlled product batch only after the dry preview is reviewed.
- Integrate the validated migration write path into the non-production `Tawgod/Lightspeed:feature/rms-product-migration-rehearsal` branch.
- Run a larger controlled rehearsal before final catalog cutover.
- Preserve suppliers/categories, then perform full physical inventory after catalog migration.


Notebook audit 2026-10-16:
- Audited the full Colab notebook, `analysis.py`, `rules.py`, `test_harness.py`, and live mapping tabs in `LS: importer`.
- Current audited notebook version: `2026-10-19-v55`.
- Consolidated the notebook around the ONE-CLICK setup result so later cells no longer reload/reanalyze the legacy RMS candidate sheet or rebuild stale UUID maps.
- Product test/write size is now controlled by `TEST_BATCH_SIZE` with no separate fixed 20-product cap; reorder test cap remains separately configurable at 5.
- The live retailer returns 404 for the 2026-10 product endpoints. Controlled product writes now translate the validated internal family model into the supported legacy `/api/2.0/products` create/read schema; image upload also uses the legacy supported endpoint.
- Failed `ERROR` test rows are no longer excluded as if successfully migrated; only CREATED/VERIFIED/SKIPPED_EXISTING rows enter the prior-test SKU exclusion set.
- Test batch selection now randomizes equally representative candidates while preserving category/supplier/image/reorder coverage, so repeated dry runs provide variance instead of returning the same SKUs.
- Verified all 151 nonblank RMS category mappings resolve to a Cat ID path; there are no conflicting RMS department/category mapping keys and no duplicate Cat ID paths.
- Verified Supplier ID Map and Brand ID Map have no missing UUID values or duplicate names. Three brand-name aliases share the same Leanin' Tree UUID intentionally/compatibly.
- Found five retained Supplier-tab names missing from Supplier ID Map, including Hornby America and Salvino JR Models; the notebook now attempts exact Lightspeed UUID resolution for retained/current supplier names instead of silently routing them to Other.
- Blank RMS suppliers, unresolved supplier UUIDs, unresolved brands, unmapped categories, web-description identity conflicts, and barcode identity conflicts are REVIEW gates and are excluded from controlled write selection.
- A proposed fallback category such as `General > No Category` no longer counts as an approved mapping.
- Supplier cost now prefers the primary-supplier `RMS_SupplierListCost` when available, then falls back to item-level legacy cost fields.
- Controlled product read-back now verifies family name, long description, category, brand, codes/UPC, supplier/code/cost, retail price, weight, active state, and image presence when requested.
- Cleanup is blocked for source rows with identity conflicts so a flagged RMS row cannot overwrite an already-created Lightspeed test product.
- Dedicated flagged review workbook remains `Flagged Migration Items` / `Flagged Items`; legacy `Migration Review` remains for compatibility.
- Legacy RMS source fallback is disabled by default (`ALLOW_LEGACY_SOURCE_FALLBACK = False`), so setup fails closed if the fresh Drive CSV is missing.
- Cross-row source product-code collisions are detected before write selection and forced to REVIEW.
- The old Web Description word-overlap/similarity trust heuristic was removed after confirming Hobby Corner intentionally uses Web Description for expanded titles (for example `MTG` -> `Magic the Gathering`). Identifier conflicts remain the hard identity gate.
- Brands-tab alias resolution now treats `Clean Brand Name` as canonical and `Combine` as the RMS/source alias. Exact canonical matches are resolved against Lightspeed before any create is considered.
- 28 warning brand values were already represented by `Brands!Combine`; 35 truly absent values were added to the `Brands` tab for review/mapping.
- Missing-brand creation follows the explicit live product-create switch and is now just-in-time: only a canonical brand referenced by a product actually selected into the current write batch may be created, verified, and synchronized into `Brand ID Map`.
- High-confidence Brands cleanup mapped `Atlas Model Railroad -> Atlas`, `Mantic Games -> Mantic Entertainment`, `Paladium -> Palladium Books`, `Studio 2 -> Studio 2 Publishing Inc.`, `The Op -> The Op Games`, and `Wow Toys -> Wow Toyz`; the two Breaking Games spellings were consolidated to one canonical row plus alias.
- No Railway deployment was changed and no additional Lightspeed product write was performed by this audit.

Audit commits on `Tawgod/Hobby-Corner-Discord-Bot:product-migration-colab`:
- `7bcd1fcc65958eb7ed087a620ace47aa8871b104` — category/blank-supplier review gates.
- `e23119791e09fffbc1bf2ca1516429d7b20f890f` — consolidated notebook mappings/configuration.
- `a59ea235e8976473f2f05d61b445756c5a8478bf` — expanded controlled product read-back verification and supplier-list cost precedence.
- `5ee22e2df64dc52755e6acb68f5c8d55573ea100` — absolute test caps and cleanup identity guard.
- `e9d8560d8af178e9783589be966812d6a1affbbb` — notebook v39 runtime safety finalization.
- `350762464e448202c7937bbe76be2d2beba919dc` — migration README synchronization.

Next audit gate:
- Rerun Colab v43 from the top with every write switch False.
- Confirm the new export loads from Drive, review counts and unmapped counts are sensible, and the known Model Railroader/Star Wars mixed row lands in the dedicated review workbook.
- Review the 20-row dry preview before enabling any further controlled product writes.

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
Branch: `integration/hobby-corner-consolidation`
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
Branch deployed: `integration/hobby-corner-consolidation`
Railway service: `timeclock`
Database: shared Railway PostgreSQL
Last verified deployment: SUCCESS, 2026-10-12

Requirements established:
- Sunday-Saturday weeks.
- Pay periods 1-15 and 16-end of month.
- Recent daily history and weekly totals for employees.
- Administrative corrections with notes.
- Automatic clock-out after 14 hours.
- Overtime review and pay-period summary.
- Multi-year data retention.
- Employee identity can exist independently of Discord; Discord linking is optional.

Verified:
- A substantial timeclock backend exists and the extension contains a timeclock UI.
- Lightspeed-backed employee records can be assigned a unique 4-digit timeclock PIN directly by Employee ID without requiring a Discord account.
- Existing Discord-linked PIN reset remains compatible with the same backend endpoint.
- PIN changes are audited and duplicate PINs are rejected.
- Railway `timeclock` successfully deployed the non-Discord PIN-assignment backend on 2026-10-12.

Testing / follow-up:
- Verify the production Discord control-panel deployment exposes the employee-name `Set / Reset PIN` picker.
- Run one end-to-end non-Discord employee onboarding test at the store timeclock.
- Production readiness and complete reporting coverage still require validation.

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

Security:\nAn operational preorder sheet contains a plaintext Discord bot credential. On 2026-10-09 this was explicitly accepted as a temporary risk because access is currently restricted and the sheet is planned for retirement. Rotate the token and remove it from the sheet as part of the special-orders/preorder cutover; do not broaden sheet access in the meantime.

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
- `lightspeed-api` -> `Tawgod/Lightspeed:integration/hobby-corner-consolidation`
- `timeclock` -> `Tawgod/Lightspeed:integration/hobby-corner-consolidation` with root directory `/timeclock`
- `special-orders-test` -> `Tawgod/Lightspeed:integration/hobby-corner-consolidation`
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

1. Accepted temporary risk: plaintext Discord bot credential in the restricted preorder sheet; rotate/remove at sheet retirement.\n2. Legacy risk: source-controlled Lightspeed credential in the private importer repository; retire/rotate with legacy importer shutdown.
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


## Repository and deployment organization audit — 2026-10-12

See `BRANCH_AND_DEPLOYMENT_POLICY.md` for the detailed branch/deployment map and cleanup sequence.

Verified findings:
- The current Chrome extension points to the main Hobby Corner Railway project's `lightspeed-api` and `timeclock` domains.
- Railway projects `capable-trust` and `enthusiastic-rebirth` contain older/duplicate Lightspeed deployments outside the main Hobby Corner project and are retirement candidates pending explicit approval.
- Several GitHub branches have no unique commits and are cleanup candidates; branches with unique work will be reconciled before deletion.
- No branches, services, projects, or deployments were deleted or changed during this audit.


### Railway consolidation update — 2026-10-12
- Duplicate `capable-trust/Lightspeed` and `enthusiastic-rebirth/Lightspeed` services have been retired.
- Both old Railway project containers are now empty.
- The `Hobby Corner` Railway project is the authoritative home for current Hobby Corner runtime services.


### Consolidated Lightspeed candidate branch — 2026-10-12
A non-deployed `Tawgod/Lightspeed:integration/hobby-corner-consolidation` branch now combines the current Special Orders live-base, all seven order-split-only commits, and the complete current product-scanner foundation. It is the preferred candidate for future unified testing. Railway has not been repointed; existing deployed branches remain live until an explicitly approved cutover.


### Consolidated branch test status — 2026-10-12
- Branch: `Tawgod/Lightspeed:integration/hobby-corner-consolidation`
- Status: **Testing**
- Static/syntax/import/reference checks: passed after fixes.
- Three Special Orders defects were identified from live test-service logs and corrected on the integration branch only: non-idempotent schema constraint creation, reconciliation LIMIT parameter binding, and preorder campaign-type SQL parameter binding.
- Railway remains on the existing deployed branches; integration fixes are not live.
- Next gate: isolated/live database smoke test followed by extension workflow acceptance before any Railway repointing.


### Isolated integration test environment — 2026-10-12
- Railway project: `Hobby Corner Integration Test`
- Environment: `test`
- App service: `lightspeed-integration-test`
- Source: `Tawgod/Lightspeed:integration/hobby-corner-consolidation`
- Database: dedicated isolated PostgreSQL service and volume
- Temporary domain: `lightspeed-integration-test-test.up.railway.app`
- Safety: Lightspeed live mode, migration, and product writes disabled; production Lightspeed credentials not copied.
- Verified: clean build; database schema initializes on fresh database; second deployment initializes successfully against the same database; Railway root health check passes.
- Remaining: authenticated Special Orders route tests and Lightspeed-dependent workflow tests require test credentials/configuration before they can be exercised.


### Consolidated functional test result — 2026-10-12
- Special Orders isolated HTTP/database smoke suite: **8/8 passed**.
- Timeclock isolated functional smoke suite: **8/8 passed**.
- Timeclock 14-hour automatic close: **passed**, including `AUTO_CLOSED`, review flag, and `AUTO_CLOCK_OUT` event verification.
- Reusable Timeclock integration smoke/auto-close scripts are now committed on `integration/hobby-corner-consolidation`.
- Production Railway services remain unchanged.
- Remaining acceptance gates: Lightspeed-authenticated read/write tests with tightly controlled test records, Chrome extension employee workflow testing, supplier-page scanner browser testing, and dependency/security review.


### Railway consolidated-branch cutover — in progress 2026-10-12
- `special-orders-test`, `timeclock`, and `lightspeed-api` are now configured to source `Tawgod/Lightspeed:integration/hobby-corner-consolidation`.
- Railway replacement deployments for consolidated commit `c49f0e99d6f1a550696e52d3646fa6ab38ef7e70` are currently initializing.
- Existing successful deployments remain serving until replacements settle.
- Old deployed branches must remain until post-cutover SUCCESS/health verification.


### Consolidated Railway cutover — verified 2026-10-12
- `lightspeed-api`, `timeclock`, and `special-orders-test` are all live from `Tawgod/Lightspeed:integration/hobby-corner-consolidation`.
- All three replacement deployments reached SUCCESS.
- All seven Hobby Corner Railway services are online with zero current failures.
- The consolidated branch is now the authoritative deployment line for these three services.
- The former deployment branches `feature/order-split-poc` and `special-orders-foundation-livebase-2026-10-02` no longer back active Railway services and are eligible for retirement after branch deletion is performed manually or through a GitHub tool that supports branch deletion.


### Post-cutover cleanup — 2026-10-12
- Temporary `Hobby Corner Integration Test` Railway services/database/volume are being retired; deletions are currently applying.
- Main Hobby Corner production services remain untouched and healthy.
- Four superseded Lightspeed feature branches are ready for deletion, but the connected GitHub tool does not expose branch deletion:
  - `feature/order-split-poc`
  - `feature/product-scanner-foundation`
  - `special-orders-foundation-2026-10-02`
  - `special-orders-foundation-livebase-2026-10-02`
- Do not emulate deletion by force-moving refs.


### Lightspeed branch cleanup complete — 2026-10-12
Verified deletion of the four superseded feature branches used before consolidation. `integration/hobby-corner-consolidation` remains the authoritative deployed branch. Remaining legacy cleanup candidates are `V1.2` and the identical `Apps-script-importer` / `Importer` pair.

### GW preorder web publishing workflow — 2026-10-12
Status: **Testing**

- GW weekly preorder management has been moved out of the main Special Orders dashboard into a dedicated staff page at `/gw-preorders`, linked from `/special-orders`.
- The dedicated page reuses the Special Orders access key and provides GW email/form intake, campaign review, Discord preview, and controlled Discord publishing.
- Discord publishing is initiated from the Special Orders web application rather than Discord slash commands.
- `special-orders-test` receives the existing Discord bot token through a Railway service-variable reference; the token was not copied into source code or exposed in project documentation.
- A database-backed `preorder_discord_publications` record is created before sending posts. Its unique campaign/channel constraint prevents duplicate whole-campaign publication and retains message IDs/status for partial-failure review.
- Publishing remains targeted to the isolated GW test channel `1336092698935033917` while the workflow is being accepted.
- The production `Hobby-Corner-Discord-Bot` service has been returned to `Tawgod/Hobby-Corner-Discord-Bot:main`; slash-command publishing is not the intended staff workflow.
- Initial consolidated implementation commit: `5b6a6ab8f66d131ddb386fd5b2ae206071d1d921`.
- Publish-button safety follow-up: `89622f98c2466fb6cfc8e187fd2d83b02778ac08`, requiring a fresh successful preview before the web Publish button is enabled.

Remaining acceptance:
- Open the dedicated GW page from the Special Orders dashboard and verify the browser workflow.
- Run one reviewed campaign through preview.
- Perform one controlled publish to the GW test channel and verify embeds/images/reactions.
- Wire customer reaction capture into the Special Orders database before replacing the legacy preorder-sheet reaction workflow.


## Product Scanner — verified 2026-10-12

## 2026-10-12 — Product Scanner Timeclock authentication and read-only live smoke test

**Status:** Testing (code implemented and deployed; valid employee sign-in and real product matching not yet end-to-end verified).

- Merged `Tawgod/Lightspeed` PR #5 into authoritative `integration/hobby-corner-consolidation`, commit `ef0b8176763fe788e87ea23543044638e49f6c1e`.
- New scanner PIN sign-in uses existing Timeclock employee credentials. Active staff default to `scanner_can_lookup=true`; `scanner_can_approve=false` by default and can be changed per employee through Timeclock's admin-protected endpoint.
- Scanner gateway in `special-orders-test` reuses the existing Special Orders local/remote match routes. Admin and internal service secrets remain server-only. Login throttling is shared-PostgreSQL-backed; sessions are short-lived.
- Railway deployment SUCCESS: `lightspeed-api` `414cd129-7c71-47e3-99f8-0287bb2ec797`, `timeclock` `bae57489-e0ad-414a-88b7-35799fb500ef`, `special-orders-test` `b4ff34d9-1f17-469b-9fed-f0cf4f063d7a`.
- Activated `SCANNER_ENABLED=true` on `special-orders-test` only; deployment `496b4dd6-f16d-4cc3-9049-d16ace494a4b` reached SUCCESS, with `[scanner] authenticated read-only gateway enabled` in startup logs.
- CI regression/syntax tests passed: GitHub Actions run `38299780733`. Live non-destructive security smoke re-run `38300384359` attempt 2 passed: unauthorized internal Timeclock PIN verification **403**, unauthenticated scanner matching **401**, invalid scanner PIN **401**.
- Chrome extension source/release package on consolidated branch is version `0.3.19`; staff-installed copies do not update automatically. Product Create/Update remains disabled.
- Remaining: verify a real authorized employee PIN from Chrome, confirm read-only Lightspeed and local matching, test permission revocation and login lockout, and review scanner approval/write design before enabling any writes.

No Lightspeed product records were created or updated in this test. The existing Timeclock database gained default scanner-lookup and approval-permission columns on startup.

## Purchase Order Companion — planned requirements (2026-10-13)

**Status: Planned. No implementation or deployment completed.** Owning application: `Tawgod/Lightspeed`, Chrome extension; authoritative development base `integration/hobby-corner-consolidation`.

- On a supplier website, open a very narrow right-side PO companion panel (target about one-quarter of the monitor; adjustable/collapsible) tied to the supplier's open Lightspeed purchase order.
- Present each line compactly with supplier-specific SKU or UPC, product name, and order quantity. Color-code product exceptions needing investigation (missing identifier, mismatches, availability concerns, etc.).
- Allow a **SKU / UPC display-and-copy toggle**, ideally per panel with optional per-item override. Copy the selected identifier to the clipboard with one click or a dedicated copy button; do not require selecting text. Keep the panel compact enough to leave the supplier website's search/quick-add bar accessible. Do not automatically type or submit in the supplier's website without a separately accepted integration.
- **Supplier SKU is per supplier-product relationship, not a single universal Lightspeed SKU.** Products sourced from several suppliers must resolve the SKU for the *currently selected PO supplier*. UPC can serve as an alternate when available. If a supplier SKU is missing or ambiguous, visibly flag it; do not silently substitute another supplier's SKU.
- Each line has a tiny checkbox to reveal compact editable `RP`, `RQ`, `Cost`, and `MSRP` fields. Unchecking only hides these fields; draft changes remain intact when rechecked. Items checked for update are included in a separate review queue.
- **Review Changes** opens a separate popup (not an expanded sidebar) with before/after Lightspeed values, exceptions, and an explicit approval step. The sidebar itself remains narrow.
- Employees authenticate using the existing Timeclock identity; normal staff may search/read by default. Product creation, editing, and price/reorder changes remain gated by individually granted approval permission. Never auto-write values while checking a box.
- Drafts must be recoverable as appropriate to the PO and supplier without mixing data between purchase orders. Review supplier cost vs. global product cost / MSRP carefully and make update scope explicit; never overwrite global pricing just because the supplier's cost differs.
- Reuse existing Special Orders supplier-product identifier mapping, Lightspeed PO integration, and Product Scanner matching/auth infrastructure. Do not create a separate supplier catalog importer or bulk supplier scraper.

Next recommended action: In a dedicated PO Companion development conversation, inspect consolidated extension, PO retrieval endpoints, supplier-product mapping and Railway configuration; sketch a minimal sidebar prototype and data contract. Do not deploy to production or edit Lightspeed products without explicit approval.

## Chrome Web Store automatic extension updates — 2026-10-14

**Status:** In Development (release packaging verified; publishing not started).

- Current store PCs use regular manually installed Chrome, so prefer a **single unlisted Chrome Web Store stable extension** for one-time per-PC installation and subsequent automatic Web Store updates.
- GitHub source: `Tawgod/Lightspeed:feature/chrome-web-store-release` based on authoritative `integration/hobby-corner-consolidation`. No merge or Railway deployment performed as part of Web Store preparation.
- `scripts/build-chrome-web-store.py` creates a Web Store upload ZIP with manifest at ZIP root and generated 16/48/128 PNG icons, without altering existing unpacked ZIP distribution.
- CI: `.github/workflows/chrome-web-store-package.yml`. Successful GitHub Actions run `38587818262`. Upload artifact accessible in the workflow run (authenticated GitHub access may be needed).
- Publishing, listing and user-data review checklist: `docs/chrome-web-store-release.md`. Chrome Web Store developer account availability has not been verified; user believes an account exists.
- Before publication: review necessary permissions and user-data privacy disclosures, host a suitable public privacy policy URL, capture real product screenshots without employee/customer data, confirm the extension's single purpose, inspect store account and visibility, then submit for Google review.
- Once approved, replace unpacked versions with Web Store version one time per store PC; subsequent versioned approved releases should update automatically.
- No Chrome Web Store item or publish action has been created. Existing deployed extension and production Lightspeed/Timeclock services remain unchanged.

## Scanner pre-publication field refresh — 2026-10-14

**Status: In Development.** Code implemented but browser/live acceptance not yet completed; not merged, deployed or published.

- Source: `Tawgod/Lightspeed:feature/scanner-fields-create-preview`, based on consolidated `integration/hobby-corner-consolidation`. Development extension version `0.3.20`.
- Scanner review fields now distinguish **General SKU (Lightspeed)**, **Supplier reorder number**, and **UPC / GTIN**. Supplier page's SKU maps to supplier reorder number, not automatically to general SKU.
- Expanded structured UPC extraction (GTIN/meta/itemprop), removed Currency and Manufacturer Part Number from editor. UPC extraction from non-standard supplier layouts must be tested against actual pages.
- Added **Prepare Create Item** action after signed-in employee receives successful no-match results from both matching services. Button produces only a review proposal, not a Lightspeed create operation, and is invalidated by edits. No product create/update backend access enabled.
- Automated checks passed: https://github.com/Tawgod/Lightspeed/actions/runs/38597687416. Browser and supplier site regression testing still needed.
- Acceptance notes: `Tawgod/Lightspeed:feature/scanner-fields-create-preview/docs/scanner-field-refresh.md`.
- Chrome Web Store publishing remains **on hold**; Web Store preparation branch is separate and its current `v0.3.19` package does not contain these improvements. Do not submit that as the finalized scanner release.

## Scanner — ACD supplier page extraction test (2026-10-14)

**Status: In Development; implemented on isolated branch, fixture-tested, not browser-verified or deployed.**
- `Tawgod/Lightspeed:feature/scanner-fields-create-preview`: added ACD Distribution (`acdd.com`) visible-label fallback for supplier-specific reorder number, UPC/GTIN, manufacturer, supplier reference price, MSRP, preorder category and optional weight with unit.
- Based on supplied Mechs vs. Minions example: ACD SKU `IDRAYA4102100EN`, UPC `850052382605`, supplier displayed price `$41.24`, MSRP `$74.99`; general SKU intentionally blank for employee confirmation.
- The label parser handles ACD's side-by-side data fields. Test fixtures also verify unrelated supplier pages do not use ACD fallback and generic structured GTIN remains supported.
- GitHub Actions test `38598715417`: passed. Live Chrome browser test on an actual ACD product page remains required.
- Full notes: `Tawgod/Lightspeed:feature/scanner-fields-create-preview/docs/scanner-field-refresh.md`.
- No Lightspeed writes or Chrome Web Store publication. Keep publishing on hold until scanner acceptance.

## Product Scanner supplier snapshots and supplier defaults (2026-10-14)

**Status: In Development.** Changes implemented on `Tawgod/Lightspeed:feature/scanner-fields-create-preview`; no merge/deployment or Lightspeed write.

- Compact optional **Save Supplier Snapshot** checkbox in Chrome scanner popup captures the currently visible supplier page on explicit employee action. Reference images are resized and saved only in that browser's local extension storage, one per domain, capped at eight domains. Scanner review permits viewing, uploading and deleting local reference screenshots.
- Templates are currently **visual references only**. Automated scraper templates, OCR and cross-PC sharing have **not** been implemented. Recommended shared follow-up: Railway-managed supplier template registry, employee permissions and retention controls, tested per-supplier field extraction rules.
- Scanner review suggests existing detected supplier name (e.g. ACD Distribution) or domain, with editable supplier field. On zero verified local/remote product matches, Prepare Create Item includes the supplier suggestion marked `supplierNotYetVerified`. Editing supplier invalidates prior match verification.
- Still required before supplier/product creation: authenticated supplier name/domain/ID lookup in existing supplier records, duplicate/alias handling, choose existing vs create-new, protected approval, final product/supplier duplicate recheck and idempotent writes. Do not silently create suppliers from domains.
- Automated scanner UI run `38599555517` passed; preview package run `38599555479` passed. Live browser acceptance outstanding. Chrome Web Store publication remains on hold.

## Scanner shared supplier template and native role authorization foundation — 2026-10-14

**Status: In Development; not deployed.** Branch `Tawgod/Lightspeed:feature/scanner-fields-create-preview`.
- User requested mapping Scanner edit permissions to native Lightspeed X-Series employee roles and eventually granting their employee appropriate capabilities. Current Timeclock scanner login lacks a verified mapping to the user's Lightspeed employee and individual role rights; service-level Lightspeed API credentials must not be used as evidence of individual user rights. Existing scanner Timeclock default remains lookup ON, approve OFF. No employee permission modified. Next: verify Lightspeed staff permissions API and employee ID mapping, implement fail-closed server-side role checks and audited Timeclock overrides.
- Shared supplier templates: `services/scannerSupplierTemplates.js` with PostgreSQL table initialization and authenticated reference snapshot routes (not mounted). Lookup-only users may read; upload requires Timeclock approval permission. Domain, image size and selector fields validated; templates stay REFERENCE until reviewed. Existing local screenshot capture in extension remains available separately and does not yet sync across PCs.
- Automated supplier registry tests passed in GitHub Actions `38600156022`. UI/live browser tests and Railway connection still pending. Zero Lightspeed product/supplier writes. Publishing stays on hold.

## Scanner native Lightspeed role permission decision — 2026-10-14

**Decision:** Scanner approval eligibility should be automatic for **verified Lightspeed Admin and Manager users**, including Account Owner, using Timeclock's existing `employees.lightspeed_user_id` mapping. The linked Timeclock PIN is the employee authentication method; no new invisible/custom Lightspeed field is needed unless the existing link proves insufficient. Other roles default read-only unless individually granted by the Timeclock administrator; `scanner_can_lookup=false` denies all scanner access.

**Implementation status:** In Development, not deployed. `Tawgod/Lightspeed:feature/scanner-fields-create-preview` adds conservative linked-ID role evaluator `timeclock/scannerLightspeedRoles.js`, wires dynamic role checks into Timeclock's scanner PIN verification and session reauthorization and displays the returned approval entitlement in the scanner. Automatic entitlement fails closed on missing/ambiguous ID, unavailable API, unknown role or inactive Lightspeed user. Existing audited Timeclock approvals remain independent.

**Verification:** Unit and syntax tests passed in GitHub Actions `38600826210`. Actual Lightspeed user's API role fields and manager PIN browser sign-in not yet verified. Create Item remains proposal-only. No employee permissions manually changed; no Lightspeed writes, Railway production changes or Chrome Web Store publication.

## 2026-10-14 — Scanner v0.3.21 / Lightspeed order detection rollout

**System:** Hobby Corner Toolkit Chrome extension, Timeclock scanner identity, Special Orders scanner gateway.
**Status:** **Testing** — implemented, CI tested and deployed. Browser/UI acceptance remains outstanding.

- Repository: `Tawgod/Lightspeed`, authoritative branch `integration/hobby-corner-consolidation`. Merged PR #6; deployment commit `f5202d5ea8ebd1dea88f1566ae3a0493c586d155`.
- Scanner popup now provides **Scan Open Supplier Page** with an open-tab selector and explicit per-site permission request; scanner capture is shared between toolbar action and review popup. Staff can scan another supplier product while keeping the review window open.
- Lightspeed order recognition handles more invoice labels, headings, UUID sale URLs and query parameters; selects an open Lightspeed tab even if another window is focused. The extension distinguishes Purchase Order context from customer sales/invoices and offers manual entry when a reference isn't identifiable.
- Timeclock PIN authentication now resolves existing `lightspeed_user_id` through Lightspeed users, with role catalog lookup when records only expose a role ID. Verified Admins/Managers/Account Owners have scanner approval entitlement automatically; unknown/inactive/unverified roles remain read-only. Existing Timeclock approval grants remain. Product writes stay disabled.
- Supplier scanner includes ACD UPC/SKU/MSRP/weight capture, editable suggested supplier, optional local screenshot and non-writing **Prepare Create Item** proposal. Shared supplier template backend groundwork exists but remains unmounted; templates do not sync across PCs.
- Automated scanner UI, capture, supplier template, role and sale-detection tests passed: GitHub Actions `38622351874` (includes follow-up order detector checks from `38622040997`).
- Railway successful deploys on commit `f5202d5`:
  - `lightspeed-api`: `d85d84de-6506-48ec-ab66-ebcff2b01f6c`;
  - `timeclock`: `a883ba2a-e81d-4986-8924-7734b227f890`;
  - `special-orders-test`: `6fe63052-8881-4f53-af98-036dd60c0510` (startup log: authenticated read-only scanner gateway enabled).
- Auth-denial smoke test after redeployment: GitHub Actions run `38300384359`, third attempt SUCCESS. This does not validate a real Manager PIN or a live Lightspeed match.
- Extension v0.3.21 is served from `https://lightspeed-api-production-c087.up.railway.app/extension` (unpacked ZIP). Chrome Web Store listing remains unpublished/on hold pending browser testing and privacy review.

**Next:** Have a manager install/reload v0.3.21 and test (1) order auto-detection on actual Lightspeed URL, (2) scanning selected open supplier tab, (3) ACD UPC and supplier-specific reorder code, (4) PIN showing role-based approval eligibility, (5) no-match Create Item proposal. Record any failure and correct without enabling product writes. Validate true Lightspeed role response, custom-role permission rules and Chrome optional permission prompt. Do not activate actual create/update writes without separate authorization.

## Scanner v0.3.22 review automation and role diagnostics — 2026-10-14

**Status: In Development**. Branch `Tawgod/Lightspeed:feature/scanner-review-auto-lookup` based on `integration/hobby-corner-consolidation`. Implemented and CI-verified, **not merged/deployed**.

- Auto-check existing products after employee PIN sign-in and each supplier page scan; field edits queue recheck and invalidate prior results. Keep no-match Create Item as an unsaved proposal; **no product creation/update enabled**.
- Compact PIN sign-in in scanner header. Removed raw supplier product JSON/HTML and visible product ID. Matching cards now show SKU, description, and missing UPC/weight/picture where source confirms missing; if local data lacks weight/image metadata, show `Not verified` instead of false negative.
- Scanner supplier selection calls authenticated read-only `GET /api/scanner/suppliers` backed by existing local suppliers table, offers exact matches and warns if unmatched; ACD alias recognized. Existing product checks stay global across suppliers.
- MAP price is separate from supplier cost/MSRP and only auto-extracted when supplier explicitly labels MAP. Future web storefront price-floor enforcement is **Planned**, not implemented.
- Railway Timeclock logs showed repeated role lookup errors; no individual user identified. New implementation attempts documented X-Series per-user `GET /api/2026-07/users/{id}`, falls back to legacy endpoints and returns non-sensitive role-resolution reason for signed-in staff. Unknown/unverifiable roles remain read-only. **Real Admin/Manager account role checks still need live verification after authorized deployment.**
- GitHub Actions `Scanner review UI regression` latest passed `38627452704`; packaged v0.3.22 unpacked preview `38627168260` passed. Browser and live server acceptance outstanding.
- Documentation: `Tawgod/Lightspeed:feature/scanner-review-auto-lookup/docs/scanner-review-auto-lookup.md`.
- No Railway configuration, Lightspeed records, employee privileges, consolidated branch or Web Store listing modified as part of v0.3.22 development.

**Next:** Review branch, obtain approval to merge and deploy a controlled test build, confirm PIN permission diagnostic with real Manager, test supplier matching and automatic lookups, and then plan write approval and MAP rules separately.

### GW preorder workflow restructure — 2026-10-14
Status: **Testing**

Target staff flow:
1. Sync & Scrape
2. Cleanup Items
3. Post to Discord
4. Record Responses passively
5. Send customer order confirmation after a 10-minute adjustment window
6. Send updated-order DM if a confirmed customer later removes an item
7. Auto-submit the final order to GW

Current implementation:
- Sync & Scrape now creates/refreshes the campaign and saves items in one action.
- Cleanup fields are Item Description, Short Code, MSRP, Cost, and Post Y/N.
- Cost is internal-only.
- Case packs are detected and given suggested single-item names/prices; French/Québec products, fixtures, and unreviewed case packs default to Post=No.
- Discord preview/post controls are in the same panel as cleanup.
- Special Orders backend has passive reaction capture, Discord message/product mapping, 10-minute delayed customer confirmation DMs, and post-confirmation removal update DMs.
- Discord gateway bridge is implemented on `Tawgod/Hobby-Corner-Discord-Bot:gw-preorder-test-publisher` but is **not deployed to the production bot**.
- Actual Google Form auto-submission remains safety-disabled pending dedicated form-submission implementation/testing.

Latest Lightspeed development commit: `979352329e356e1454579d9e9deafe43e8d8769a`.

## Scanner v0.3.23 / preorder staging rollout — 2026-10-14

**Status: Testing — implemented and merged, Railway rollout in progress pending final service verification.** 
- Authoritative source `Tawgod/Lightspeed:integration/hobby-corner-consolidation`; scanner PR #7 merged commit `d13f58f8a96c40466a6b47b753ef0ea866134205`. Follow-up hotfix PR #8 merged commit `4614a11d162472ba47d4d670bea2152b355fc198`.
- Scanner review now auto-checks product matches after PIN sign-in and new scan, displays SKU/description and missing UPC/weight/picture when source supports those checks, puts compact Timeclock sign-in in header and removes raw supplier JSON and employee-visible product IDs.
- Supplier matching uses authenticated read-only supplier-list lookup from existing Special Orders `suppliers` database; ACD name aliases supported, unmatched supplier warning shown. Cost, MSRP and MAP kept separate; MAP only captured from explicitly labeled sources, not inferred from advertised price.
- Added **Add to preorder campaign** checkbox: when checked, a dropdown shows existing open preorder campaigns. Verified manager/admin can stage multiple scanned items into a separate `scanner_preorder_staged_items` table linked to the campaign and supplier, with idempotent uniqueness and `PENDING_REVIEW` status. Scanner lists staged names/SKUs by campaign.
- **Safety boundary:** Scanner staging is stored in Hobby Corner database but **does not yet insert into live preorder_products**, create/update Lightspeed items or post to Discord. Future review/promotion step will move approved items into the publication workflow. Existing preorder campaigns and Discord GW publisher unchanged.
- Scanner permission failure investigated: previous Timeclock logs showed repeated Lightspeed role API lookup errors. Added documented X-Series single-user API read and safe role diagnostics to explain why PIN is read-only when role verification fails. Actual manager PIN needs live verification; no manual privilege override.
- CI successful: scanner UI regression `38629569978`, integration regression `38629576895`, and v0.3.23 Chrome artifact build `38629594665`. GW parser hotfix syntax CI `38629960382` passed.
- During simultaneous consolidated-branch rollout, a separate GW preorder parser regex error from commit `979352329e356e1454579d9e9deafe43e8d8769a` crashed `special-orders-test`. Hotfix in PR #8 corrected escaped regex syntax; awaiting Railway health verification.
- Next: verify Railway three service deployment statuses and logs, install v0.3.23 Chrome extension, validate actual manager PIN, automatic lookup, campaign staging for multiple products, duplicate safeguards, and future staged-to-live preorder approval flow. Chrome Web Store remains unpublished.

### Deployment verification addendum — 2026-10-14

- Railway consolidated commit `4614a11d162472ba47d4d670bea2152b355fc198` confirmed **SUCCESS** on `lightspeed-api`, `timeclock`, and `special-orders-test`.
- Special Orders startup verified: database schema ready, startup success, and authenticated read-only scanner gateway enabled. GW parser syntax crash fixed by PR #8.
- Post-deployment scanner security smoke test: GitHub Actions `38300384359`, attempt 4, **SUCCESS**. This confirms authorization denial checks, not a real employee PIN or a product write.
- Latest extension v0.3.23 can be obtained from the consolidated API's `/extension/download` endpoint for unpacked browser acceptance.
- **Still Testing:** Validate Admin/Manager PIN role, default product match results, chosen campaign list, staging multiple products, duplicated UPC conflict, and proper review/promotion of pending items. No Discord publication, Lightspeed product writes, or Chrome Web Store publication was performed.


## Chrome Extension Cross-Chat Release Control — 2026-10-14

**Authoritative queue:** `Tawgod/Hobby-Corner:main/CHROME_EXTENSION_RELEASE_QUEUE.md`

Any conversation that prepares a Chrome extension version bump, packaged ZIP, distribution update, Railway-served extension update, or Chrome Web Store release must read and reconcile the shared release queue first.

Required behavior:
- Check the release queue and current extension-related GitHub branches/PRs before packaging.
- Include every compatible `READY` item.
- Do not silently omit `QUEUED`, `IN DEVELOPMENT`, or `BLOCKED` work; record an explicit defer/block reason.
- After release, update the queue with shipped version, consolidated commit, test result and release date.
- Any chat that creates or queues extension work must update the queue directly when possible or provide a manager handoff suitable for the queue.
- A release is not complete until the queue has been updated.

The Purchase Order Companion request is seeded in the queue as `QUEUED`.

### Special Orders page split — 2026-10-14
Status: **Testing**

- Normal `/special-orders` is being kept focused on everyday customer special-order intake and open-item management.
- Preorder Campaigns and Allocations moved to a dedicated `/preorders` page.
- GW weekly preorder intake remains on dedicated `/gw-preorders`.
- Added a dedicated `/ordering` page for supplier-order work.
- Ordering supports three views:
  - General
  - By supplier
  - By sourcing category/department
- Ordering lines show customer, item, requested/supplier SKU, quantity, preferred supplier, sourcing category, supplier cost when available, supplier-order linkage, and current order status.
- Each line has an inline status selector backed by the existing `PATCH /items/:id/status` workflow, so status history continues to be recorded rather than bypassed.
- Initial ordering scope covers `OOS`, `READY_TO_ORDER`, `ORDERED`, and `BACKORDERED`, with filters for needs-ordering-only vs already-ordered/backordered.
- Implementation: `Tawgod/Lightspeed@1f039469710fc5a6f6633ed42fafefa93071a4d7`.
- Railway deployment is currently building; browser acceptance remains required before marking Deployed.

### Supplier Ordering workspace — 2026-10-14
Status: **Testing**

Dedicated page: `/ordering`

Implemented workflow:
1. View Special Order lines in General, By Supplier, or By Category views.
2. Filter to items that still need ordering or items already ordered/backordered.
3. Assign/change a preferred supplier directly from the Ordering queue while the line is not attached to a supplier order.
4. Select multiple lines for one supplier.
5. Add optional floor-stock quantity line by line.
6. Create a local-only supplier-order draft.
7. Reopen an existing draft and add more selected lines for the same supplier.
8. Edit draft customer quantity, floor quantity, total quantity, unit cost, supplier order number, expected date, and notes.
9. Remove draft lines without deleting the underlying customer Special Order.
10. Explicitly push the reviewed draft to Lightspeed.

Safeguards:
- One Special Order line cannot be attached to multiple supplier orders.
- Supplier routing cannot be changed after a line is attached to a supplier order.
- Only `DRAFT` supplier orders and their lines are editable.
- Placeholder/unmatched products block Lightspeed PO push.
- A supplier order already linked to a Lightspeed consignment cannot be pushed again.
- The Lightspeed consignment ID is stored as soon as the PO is created, before line upload, so a partial failure cannot be blindly retried into a duplicate PO.
- Successful explicit Lightspeed push changes the local supplier order to `ORDERED` and changes linked Special Order lines from OOS/READY_TO_ORDER/BACKORDERED to `ORDERED`, including status-history entries.
- No supplier or Lightspeed order is submitted automatically from the Ordering page.

Category view uses the product's Lightspeed/local product category when available, with sourcing department as fallback.

Implementation commits:
- `1f039469710fc5a6f6633ed42fafefa93071a4d7` — split Preorder/Ordering pages
- `97425fa333860ad2b73a4572b775a4375dc58f34` — draft supplier-order management APIs
- `a998c64468ec611f8a15b79c475475649e06933d` — draft workspace UI
- `02c1bc395a2d9304f5746befd2e12ef08eb265f1` — draft append/duplicate safeguards + placeholder push check
- `ebae33fa4c9a74948d6b7fbfea12601fe89b8a09` — add selected lines to open draft
- `b1649ae2e8c1790a9c075c676ee6a13d7e133b1f` — product-category grouping
- `7be1ba90e53fc009616c81dfaef07793fdf17ccb` / `50b296feb52efc48ed1f543f9f11dcd550f68f05` — preferred supplier assignment
- `597a9d8375e73cf35b514a3aea0446450a5fe649` — duplicate Lightspeed PO push guard

Browser acceptance with real supplier-order data is still required before this is considered fully verified for daily use.

#### Ordering workspace follow-up safeguards — 2026-10-14
- Preferred supplier can now be assigned/changed from the Ordering queue until the line is attached to a supplier order.
- Customer quantity on supplier drafts is now derived from and locked to the underlying Special Order quantity.
- Staff may adjust floor-stock quantity and unit cost without changing the customer demand quantity.
- Existing supplier drafts can accept additional selected lines for the same supplier.
- Duplicate Special Order line attachment is blocked server-side.
- Lightspeed PO push now blocks already-linked/synced orders and records the Lightspeed consignment ID before uploading lines to protect against duplicate retries after partial failures.

Latest commits:
- `7be1ba90e53fc009616c81dfaef07793fdf17ccb`
- `50b296feb52efc48ed1f543f9f11dcd550f68f05`
- `597a9d8375e73cf35b514a3aea0446450a5fe649`
- `f45543c7a870e662c798137ff3884035e74b219c`
- `7463c424c8ee7f143cd7e8a9f8f3a809cd537688`
- `723bd06fdb59689c3d3ab663f9fd564aeff31d2b`

The first draft-workspace builds have reached Railway SUCCESS. The latest follow-up commits are still moving through the shared Railway deployment queue, so final browser acceptance remains pending.

### Ordering workflow pivot — 2026-10-15
Status: **Testing**

Ordering is now being treated as an operational review/check layer around Lightspeed rather than a separate PO-authoring system.

Target workflow:
1. Generate PO in Lightspeed.
2. Enter order into supplier system.
3. Use Hobby Corner Ordering to check/update/add Special Orders and verify nothing is missed or duplicated.
4. Submit supplier order.
5. After supplier order confirmation, update line statuses and later evaluate creating the corresponding customer orders/sales in Lightspeed.

Implemented changes:
- Removed the supplier-draft workflow from the Ordering UI. Existing local draft APIs/data are left intact for compatibility/history but are no longer the primary staff workflow.
- `/ordering` now uses the live Lightspeed supplier list as the authoritative supplier source.
- Added current Lightspeed purchase-order reads and line-item cross-checking.
- Local Special Order lines are marked when their linked Lightspeed product is already on a current Lightspeed PO, including PO number/reference and PO status.
- Added a read-only Lightspeed unfulfilled-fulfillment demand section to surface customer demand that may not exist in the local Special Orders table.
- Added a read-only current Lightspeed Purchase Orders section.
- Added Supplier, Category, Status, and Sort controls. Empty supplier/category filters show the full list.
- Added `All` as a status filter.
- Added per-line notes checkbox/expand area with saved notes.
- Preferred supplier can be changed directly from the Ordering checklist.
- Supplier recommendations are advisory only and can be requested per line. Recommendations use:
  - direct product/supplier mappings,
  - existing preferred-supplier choices already stored on Special Order lines,
  - new explicit routing history,
  - product category history.
- New supplier choices are recorded to `supplier_routing_history`, allowing recommendations to improve over time.
- Current recommendation selections never happen automatically.

Lightspeed API basis:
- suppliers: `GET /api/2026-04/suppliers`
- purchase orders: `GET /api/2026-04/purchase_orders`
- purchase-order lines: `GET /api/2026-04/purchase_orders/{id}/line_items`
- open fulfillment summary: `GET /api/2026-04/fulfillments`
- sale detail: `GET /api/2026-04/sales/{id}`

Important safety behavior:
- Lightspeed fulfillment demand is review-only for now; it is not automatically imported into Special Orders or converted into new customer orders.
- Ordering page no longer creates/pushes a new Lightspeed PO as part of normal workflow.
- Existing PO-write backend remains available for compatibility but is not exposed in the new Ordering UI.
- Customer-order creation in Lightspeed after supplier ordering remains a future step pending a dedicated duplicate-safe design.

Implementation commits:
- `842459dd3951f4e42b04769a57a4109f5479c783` — live Lightspeed suppliers, PO reads, learned routing backend
- `0751837c8fb7d715a79bfd17cdb47338ceaade45` — Ordering UI pivot to filters/checklist + Lightspeed demand/PO panels
- `54170a4e04cf592aae44cf4f920ff86a331a4848` — seed recommendations from existing routing choices

Browser acceptance against live Lightspeed supplier/PO/fulfillment data is still required before marking fully deployed.

#### Ordering — Lightspeed unfulfilled enrichment — 2026-10-15
Status: **Testing**

- Lightspeed unfulfilled rows now explicitly resolve related customer and product records instead of relying on thin embedded sale/line payloads.
- Customer name is displayed from the Lightspeed customer record and can be expanded to show email/phone when returned.
- Product display now includes resolved item name, SKU/UPC, and product image when available.
- The unfulfilled table column is shortened to `LS PO#`.
- Added per-row `Ordering Check` action that jumps back to the Ordering Checklist and highlights a matching local Special Order line when one exists.
- Each unfulfilled Lightspeed row shows whether there are matching local Special Order records.
- Current Lightspeed Purchase Orders now include a `Special Orders` count plus customer-unit total, based on local non-cancelled Special Order lines whose linked Lightspeed products appear on that PO.
- Backend commit: `6a8bdf6f32810b356955a404058df64abb2becf1`.
- UI commit: `f2d6ba6f78826b5ec087726151b36b99e0bd52ca`.
- Railway deployment for these latest commits is still building/queued; browser acceptance remains pending.

#### Ordering activity log and aging — 2026-10-15
Status: **Testing**

- Added per-line activity history on the Ordering Checklist.
- Activity combines:
  - existing status-history records,
  - new note-save history,
  - preferred-supplier routing changes.
- Each history entry records timestamp and changed-by/source when available.
- Existing notes created before note-history tracking appear as an `Existing note snapshot`; the displayed time uses the best available item update timestamp and is explicitly not claimed as the original note submission time.
- New notes now retain exact save timestamps in `special_order_item_activity`.
- Added a `Log` button beside each line's Notes control.
- Added an Age column and row aging colors based on line creation date:
  - 0–2 days: green
  - 3–6 days: yellow
  - 7–13 days: orange
  - 14+ days: red
- Added a visible aging legend above the checklist.
- Implementation: `Tawgod/Lightspeed@96ca09dfbf0876b0e96e744dbcca32089b8da53d`.
- Railway deployment is currently building; browser acceptance remains pending.



### RMS migration source-integrity safeguards — 2026-10-16
Status: **Testing**

A controlled migration run exposed a mixed legacy RMS record for Model Railroader (SKU `074666012738`): the RMS item/brand/supplier data identified Model Railroader/Kalmbach, while the legacy NitroSell/PAM web-description join and Alias data supplied Star Wars Destiny: Empire at War content and barcode `074369012738`.

Changes on `Tawgod/Hobby-Corner-Discord-Bot:product-migration-colab`:
- Added source-identity review gating for unrelated RMS Description vs Web Description data.
- Added barcode identity conflict detection for valid GTIN-like numeric item codes versus conflicting RMS UPC/alias values.
- Rows with identity conflicts are forced to `REVIEW` and cannot enter controlled product-write batches.
- Removed automatic fallback of unresolved named RMS suppliers to Lightspeed `Other`.
- Blank-disposition named-supplier mappings to `Other` are now treated as unresolved rather than approved conversions.
- Exact current Lightspeed supplier names override stale `Other` mappings during Colab setup.
- Notebook version advanced to `2026-10-16-v36`.

Commits:
- `19e01583cfae04d229c9d94c814c7c2b27e81db2`
- `cbccb9988d470a8d5d53df9581ab0a166704a148`
- `f06b0d8b6e158c50f4e658bac309a5c2a0c690dc`

Known test cleanup:
- Incorrect controlled-test product remains in Lightspeed as family `9dbfa2b8-a17d-42af-b7db-fe2220ffd753`, product `48165e1f-3df2-48c8-b177-6e505bd6b73b`. It was not automatically deleted or modified.


### RMS migration v50 policy corrections
- Named unmapped RMS suppliers now fall back to the UUID-backed `Other` Lightspeed supplier; blank primary suppliers remain review-only.
- Games Workshop no longer receives a blanket REVIEW status. It migrates under normal rules, with only genuine identifier collisions or other ordinary migration issues blocking it.
- Added an `Aging Stock` migration tag for positive-quantity products with no reliable sale in the last 12 months; age alone does not put those items on the flagged-review list.
- Added explicit mappings for `Outdoor Toys + blank category -> Toys > Outdoor Toys` and `Other + Clothing -> General > Clothing`.
- Correctly mapped suppliers such as Horizon Hobby and John N. Hansen may still appear in REVIEW for non-supplier reasons; v50 now supplies an explicit zero-stock/aging review reason instead of leaving that reason blank.


### RMS migration v51 corrections
- Replaced Lightspeed product-tag usage with a hidden product custom field `migration_flags` for migration-only annotations. Current values include Aging Stock, Missing Picture, and Picture Replacement Needed; these annotations do not block migration.
- Added unique category-name recovery for PAM/RMS department/category mismatches. Exact Department+Category mapping remains first priority; category-only recovery is used only when it resolves to one unique Lightspeed path.
- Confirmed export source-of-truth: core product fields come from the connected RMS Item database/tables, while only `RMS_WebDescription` comes from `HQcorp.dbo.nitroasl_pamtable.WebDescription`. The correct cross-database key is the store Item's `HQID` (`PAM.ItemID = I.HQID`), not local `Item.ID`; this was verified with GW48-111 (store ID 57014, HQID 57155; HQ item ID 57155).

- Notebook v52 adds a preflight regression guard that refuses to proceed if GW48-111 still carries the stale Tenfold Dungeon WebDescription, proving an old pre-HQID CSV is being reused.

### RMS migration v53 test fixes
- Controlled product tests now default to 50 products and no longer retain any hidden 20-item helper limit. Setup reports exactly how many products are eligible before and after prior-success exclusions.
- Reorder tests now support newly created zero-stock products that do not yet have an outlet inventory row: reorder settings are upserted first, then the materialized inventory record is verified at unchanged zero stock with the requested MIN_MAX values.

### RMS migration v54
- Fixed legacy product creation so inventory tracking is enabled (`has_inventory=true`) and verified on read-back.
- Reorder tests now repair inventory tracking on earlier test products before applying MIN_MAX settings.
- Product and reorder test batch sizes both follow `TEST_BATCH_SIZE`; no fixed numeric helper caps remain.

### RMS migration v55 category audit
- Migration setup now treats the live Lightspeed category hierarchy as the UUID source of truth and refreshes Cat ID after reconciliation.
- Missing mapped leaves may be created only under an already verified parent, and only when that leaf does not already exist elsewhere in Lightspeed under another hierarchy/Level 1.
- Alternate-path, duplicate-live-path, and missing-parent/root cases are review-only; the migration never moves or deletes existing categories.

### RMS migration v60 category mapping hardening
- `Mapping` is explicitly authoritative for RMS Department/Category routing, with a setup regression probe for Trains + HO Scale.

### RMS migration v63 workspace cleanup
- Migration operational/reporting tabs were removed from LS: importer and centralized in the Flagged Migration workbook.
- LS: importer now retains migration reference authorities such as Mapping, Cat ID, RMS-D&C, supplier/brand maps, and related import/reference data.
- Historical run summaries, product test history, failure history, and the category UUID audit were preserved in the Flagged Migration workbook.
- Current review/gap/test tabs were recreated there as clean workspaces; a Migration Guide documents persistence/refresh behavior.

### RMS migration v64 failure-prevention hardening
- Inventory tracking is now explicitly repaired/read-back verified after controlled product creation using the legacy 2.1 common track_inventory update path.
- Non-leaf category mappings are blocked before product writes and surfaced in Category Leaf Audit.
- Supplier UUID caches are reconciled against the full live supplier catalog by exact normalized name; UUID mismatches are corrected and near-name suggestions are surfaced for review only.
- Invalid Lightspeed SKU characters are rejected before a write.
- Status: implemented, runtime verification pending controlled v64 test.

### RMS migration v65 category fallback behavior
- Restored legacy parent-category fallback behavior: when no explicit level-3 mapping exists and the mapped target is a parent, migration uses/creates an `Other <parent name>` leaf beneath that parent.
- Explicit level-3 mappings remain authoritative.
- Fallback leaves are created and verified during category reconciliation before product payloads are built.
- Status: implemented; runtime verification pending v65 setup.

### RMS migration v66 pre-test hardening
- Supplier disposition now routes blank/unmapped primary suppliers to the live `Other` supplier; explicit `Other` mappings are preserved.
- Supplier and brand UUID caches are reconciled against live Lightspeed exact names before controlled writes, with near-name audits for unresolved names.
- Earlier migration-created products recorded as failures can enter a constrained repair/read-back path; unrelated existing products remain duplicate-safe and untouched.
- Invalid SKU characters are flagged before preview.
- Category reconciliation now uses full-path identity, paginates the category catalog, and safely creates verified `Other <parent>` fallback leaves.
- RMS-D&C/Mapping gained safe mappings for obvious aliases and blank-category department fallbacks. Five ambiguous category combinations (15 products) remain REVIEW-only.
- Status: In Development / Testing. Implemented, not yet runtime verified.

### Consignment Management
Status: In Development (separate synthetic-data beta deployed; production functionality not implemented).
Last verified: 2026-10-19.
Purpose: replace paper Game/Puzzle/RC/used-item intake and sales/credit binders with digital, auditable lifecycle tracking tied to Lightspeed Retail X-Series.
Repository: Tawgod/Lightspeed.
Base: integration/hobby-corner-consolidation.
Working branch: feature/consignment-layout-foundation.
Draft pull request: https://github.com/Tawgod/Lightspeed/pull/11.
Test Railway project/environment: Hobby Corner Integration Test / test.
Test service: consignment-beta.
Beta review URL: https://consignment-beta-test.up.railway.app/consignment.
Implementation: browser-local synthetic review beta has staff dashboard, online and staff multi-item submissions, advisory matches, condition/price editing, aging warnings, customer portal preview, status tracking and three-day/80%-credit simulation. Special Orders navigation and development-only extension launcher included. Initial SQL schema and credit ledger are committed but not applied.
Reuse: scanner product-match normalization, read-only matching contract, and Special Orders product creation payload contract. Product writes are disabled pending verified category UUID, accounting policy, authorization, and duplicate tests.
Chrome coordination: launcher queued in CHROME_EXTENSION_RELEASE_QUEUE.md as IN DEVELOPMENT; no extension release/package.
Testing: CI consignment smoke and scanner regression suites passed on initial beta. Browser usability and production integrations not yet verified.
Deployment: isolated test only; no production Lightspeed product/credit writes and no customer records synced. Demo data stored in user's browser.
Decisions: all used items in General > Consignment; unique used SKU for each physical copy, do not reactivate previously sold copy, reuse canonical original-new-item template instead; NEVER copy original pictures, barcode, inventory, supplier info or SKU. Default in-store only with staff opt-in for online. Staff also gets matching suggestions on online customer submissions.
Dependencies: Special Orders backend/product match and customer lookup, Lightspeed Retail X-Series category/product/customer/sales API, confirmed Lightspeed Online authentication capabilities, Chrome extension release queue.
Next: staff beta feedback; protected database APIs; real matching using existing local+remote lookup; verified product creation and deactivation; sale/return reconciliation and idempotent delayed credit; customer portal SSO research; label templates.

Consignment customer-first beta update (2026-10-20): new standalone sample-only customer form at https://consignment-beta-test.up.railway.app/consignment/submit, with Games/Puzzles prioritized, type-specific condition descriptions, missing components, household and mechanical/Train fields, and notification-preference UI. Staff queue supports consignor-name filtering and multi-item approval simulation. The form does NOT send actual submissions to staff, create customers, or send notifications; protected shared persistence and Lightspeed/Klaviyo/Discord integrations remain pending. Tested by GitHub Actions smoke and scanner regression checks on feature branch; test-only Railway deployment.

### RMS migration v67 supplier/category disposition cleanup
- Horizon Hobby Rockets: in-stock Estes-branded products route to live supplier ESTES; other rows route to Other.
- Removed stale Horizon Hobby Rockets supplier UUID cache entry and documented the conditional migration mapping.
- Small known ambiguous category groups now route to General > Other or Toys > Other Toys as appropriate; future unmapped/high-volume groups remain visible for review.
- Added a setup regression probe for the Horizon Rockets supplier rule.
- Status: In Development / Testing; implemented, runtime verification pending.

### Discord preorder watch — 2026-10-20
Status: **Testing**

Purpose:
Capture customer interest in products/preorders that are not yet orderable without prematurely creating a Lightspeed order or committed Special Order.

Special Orders:
- Added `preorder_watch_items` with statuses:
  - `WATCHING`
  - `AVAILABLE`
  - `CONVERTED`
  - `DISMISSED`
- Watch entries store:
  - matched local customer when Discord ID is linked
  - Discord user/display name
  - item/request text
  - original message text
  - guild/channel/message IDs
  - Discord message URL
  - capture mode
  - confidence for informal detection
  - notes and timestamps
- Discord message/command captures are deduplicated by `source_key`.
- Re-capturing an informal message manually upgrades its capture mode rather than creating a duplicate.
- Added **Discord Preorder Watch** panel to `/preorders` for staff review/edit/status/notes.

Discord bot development branch:
- Branch: `Tawgod/Hobby-Corner-Discord-Bot:gw-preorder-test-publisher`
- Informal capture watches `#gw-preorders-chat` by default.
- Additional channel names/IDs can be configured through:
  - `PREORDER_WATCH_CHANNEL_NAMES`
  - `PREORDER_WATCH_CHANNEL_IDS`
- Informal capture uses conservative preorder/future-availability wording and remains a watch item only.
- Added customer-facing formal command:
  - `/hc preorder_watch item:<product>`
- Added staff Discord message context action:
  - right-click message → Apps → **Add to Preorder Watch**
- Staff context capture requires Timeclock staff/admin role and stores the exact source message/link.
- Production Discord bot remains on `main`; these bot changes are **not deployed to production**.

References:
- Lightspeed backend: `b4768268e8240a202c0c75c3aa653ba755c85e2a`
- Preorders UI: `08b5bcdc5b4e1e709da8aa6277c0ae635634cabd`
- Capture-mode dedupe upgrade: `c61d382fbb95c90d7d2b4b985cfe589469f29c81`
- Bot informal + slash capture: `f423a8490fb87fef308b3fb08d98014c0e1475d4`
- Bot staff message action: `084a0f23ad1414923c476a188f25c53393f39af6`

Next verification:
- Confirm `/preorders` watch UI after Railway deployment.
- Test the bot development branch against a test Discord channel before production bot cutover.
- Confirm customer matching by Discord user ID.
- Validate informal detection against real chat messages and tune false positives/negatives before production enablement.



## Railway variable consolidation/security audit — 2026-10-22
- Read-only audit completed; no Railway variables, deployments, credentials, or databases were changed.
- Detailed proposal: `RAILWAY_VARIABLE_SECURITY_AUDIT.md`.
- Production currently has no environment-level shared variables and no sealed application variables.
- Main consolidation candidates: Lightspeed account credential (pending identity/scope verification), Timeclock admin secret, scanner service secret, customer-sync/Rewards admin key, Discord token only if both consumers are verified to use the same bot identity, and Postgres connection references.
- Test `consignment-beta` remains isolated with no production business credentials.
- Explicit approval is required before applying Railway changes or rotating credentials.


### Railway variable consolidation implementation — 2026-10-22
- Production Shared Variable layer created for Lightspeed, Timeclock admin, scanner service, and customer/Rewards trust relationships.
- Database consumers now reference the managed Postgres service.
- Internal Timeclock/customer-sync/scanner service calls have been switched to Railway private-domain references in configuration.
- Secret values were not read or copied; shared variables currently bridge to existing canonical service values.
- Controlled activation started with Timeclock only. Replacement deployment is currently queued; existing healthy service remains live.
- Discord, Microsoft Graph, Google, and credential rotation remain intentionally unchanged pending verification.

## Shared Addon UI / UX Coordination — Planned

**Status:** Planned

Add a dedicated future UI/UX coordination workstream for Hobby Corner tools and addons.

Purpose:
- Coordinate the visual language and interaction patterns across Hobby Corner interfaces.
- Make Chrome-extension features, popups, side panels, admin tools, scanner/review screens, Timeclock surfaces, Special Orders tools, Purchase Order Companion, Product Manager, Consignment, and other employee-facing interfaces feel like one coherent system.
- Keep this work focused on **look, layout, controls, terminology, navigation, interaction behavior, and consistency** rather than changing the underlying service architecture or business logic.

Planned deliverables:
- Shared design system for colors, typography, spacing, buttons, forms, warnings, status badges, tables, dialogs, side panels, and popups.
- Common interaction patterns for save/cancel, approval, confirmations, errors, loading states, search/filtering, keyboard/scanner workflows, and employee permissions.
- Consistent terminology and status language across tools.
- Reusable UI components where practical.
- Accessibility/readability standards for store employees.
- A central UI/UX discussion/development channel to coordinate cross-addon interface decisions before major frontend changes.
- Migration plan to bring existing tools into the shared visual/interaction system incrementally without disrupting working features.

Guideline:
- Individual feature chats remain responsible for their service/business logic.
- Cross-cutting UI changes should be coordinated through the shared UI/UX workstream so one addon does not independently establish conflicting interface patterns.


### Shared Addon UI / UX Coordination
Status: In Development (standards documented; implementation not yet started)
Owner: cross-system UI coordination; business service owners retain operation/permission authority.
Source of truth: `SHARED_ADDON_UI_UX.md` in this repository; implementation base `Tawgod/Lightspeed:integration/hobby-corner-consolidation`.
2026-10-27: audited extension popup and scanner source and defined baseline tokens, reusable interaction patterns, accessibility and keyboard/scanner acceptance gates, cross-system audit register and incremental rollout sequence. Other app screen-level audits remain pending. No UI code changed, tests run, extension released or Railway deployment performed.
Next: inspect remaining source screens and active PRs, create isolated component specimen, pilot popup/scanner, reconcile extension release queue before packaging.

Consignment protected-backend milestone (2026-10-27): feature/consignment-layout-foundation, draft PR #11. New isolated opt-in /api/consignment-beta routes with mandatory staff key, independent CONSIGNMENT_BETA_DATABASE_URL (never production DATABASE_URL), and disabled-by-default DB writes. Read-only matching endpoint can reuse existing scanner/Special Orders matcher once an authenticated gateway is configured. Pure credit eligibility planner enforces 72-hour hold, reversal/reconciliation checks, integer-cent calculations and stable idempotency key; no credit posting. API and credit tests added to GitHub CI. Test Railway has no database credentials, so actual persistence, live matching and product/customer/credit writes remain NOT enabled. Next: isolated test Postgres provisioning, role-based auth, authenticated customer submissions, genuine API match wiring and end-to-end sale reconciliation.

## Product Scanner audit and read-only safety development — 2026-10-27
- **Status:** In Development. **Implemented:** read-only safety fixes in PR #14; **tested:** UI CI 40532962645 SUCCESS and integration CI 40533134983 SUCCESS; **deployed:** NO; **browser accepted:** NO.
- **Authoritative base:** `Tawgod/Lightspeed:integration/hobby-corner-consolidation`; new branch `feature/scanner-duplicate-safety-review-20261027`; PR https://github.com/Tawgod/Lightspeed/pull/14.
- **Existing functionality reviewed:** supplier single-tab JSON-LD/ACD capture, dual-source product matching and supplier lists, Timeclock session and linked Lightspeed role resolver, preorder staging, duplicate checking, scanner tests, extension queue and active PRs.
- **Key fixed issue:** remote matcher previously treated failed upstream Lightspeed requests as no matches; now fails closed (502) and searches all distinct identifiers. Normalized merge now uses available remote UPC/description while preserving unknown vs missing weight/picture. Review blocks multi-product listing captures, requiring an individual product page.
- **Known limitation:** Existing scanner `Prepare Create Item` is still an unsaved preview; actual Lightspeed create/update, review queue promotion and rollback are NOT implemented. Preorder staging uses separate pending table and does not post to Discord. Browser/PIN acceptance pending.
- **Permissions conflict to reconcile:** PR #12 would give any active Timeclock employee scanner review/staging privileges; prior linked Lightspeed Admin/Manager verification remains relevant for final product-write approval. Do not silently merge policy changes; separate basic editing from sensitive write approval.
- **Other active extension work:** PO Companion `feature/po-companion-consolidated-v2` exists but separate acceptance and release reconciliation needed; Consignment PR #11 has extension launcher component. Chrome Web Store packaging still deferred. Release queue updated for PR #14.
- **Railway status:** No scanner changes deployed. The inspected environment reported one crashed `migration-test-bsi117` service (separate migration project service); scanner service-specific live health and role acceptance require separate confirmation.
- **Documentation:** `Tawgod/Lightspeed:feature/scanner-duplicate-safety-review-20261027/docs/scanner-acceptance-and-approval-plan-20261027.md`.
- **Next:** run real store employee Chrome acceptance and live API role verification; verify duplicate fail-closed behavior in deployed test environment only after authorized merge/deploy; design persistent review queue with audit, revalidation, idempotency and controlled write approval before enabling any product writes.

### Special Orders employee acceptance / receiving / notification pass — 2026-10-27
Status: **Testing**

Verified before development:
- Authoritative source remained `Tawgod/Lightspeed:integration/hobby-corner-consolidation`.
- Railway services were still sourced from the consolidated branch.
- Existing `/ordering`, `/preorders`, preorder-watch, activity-log, aging, supplier-routing, and Lightspeed-first PO review functionality was present.
- Split/Recall remains implemented through `routes/orderSplit.js` and `routes/orderSplitExecute.js`; no dependency conflict with the new receiving/status workflow was found in this pass.

#### Lightspeed-first receiving
Added an employee-facing **Receiving Review** workflow to `/ordering`:
- Select a current Lightspeed PO.
- Read its product lines.
- Match PO products to waiting local Special Orders.
- Display customer, required quantity, existing allocation, quantity already allocated from that PO, and Lightspeed-reported received quantity when available.
- Employee confirms cumulative customer allocation target per Special Order line.
- Receiving confirmation updates local Special Orders only; it does **not** modify Lightspeed inventory.

Duplicate-safety:
- Added `lightspeed_po_receipt_allocations`.
- Unique PO + Special Order relationship prevents replay/double allocation.
- Confirmations are cumulative targets; retries add only the positive difference.
- Previously confirmed targets cannot be reduced through the receive endpoint.
- Product must actually be on the selected Lightspeed PO.
- When Lightspeed reports a positive received quantity, cumulative customer allocations from that PO/product cannot exceed the reported received quantity.
- If Lightspeed does not provide a received quantity, staff remain responsible for physical receiving verification rather than the system guessing.

When a customer Special Order becomes fully allocated:
- status moves to `RECEIVED`
- receiving/status history is recorded
- one `READY_REVIEW` customer-notification review item is created.

#### Customer notification acceptance
Added **Customer Notification Review** to `/ordering`.
Employees can:
- review customer/item/contact information
- approve notification
- suppress notification with a reason.

Approved notifications are routed to:
1. Discord when the customer has a linked Discord user ID
2. Email otherwise
3. SMS otherwise

Added **Approved Delivery Queue** to `/ordering` so staff can see queued/in-progress/error delivery records separately from items awaiting employee review.

Discord delivery API uses claim/send/complete states:
- `QUEUED`
- `SENDING`
- `SENT`
- `ERROR`
and successful Discord delivery moves the Special Order to `CUSTOMER_NOTIFIED`.

The Discord sender is implemented only on:
`Tawgod/Hobby-Corner-Discord-Bot:gw-preorder-test-publisher`
and is **not deployed to the production bot**.

Email and SMS delivery integrations are not implemented yet; approved items remain visible in their delivery queues.

#### Scanner service isolation
The consolidated Product Scanner startup check could crash the entire Special Orders service when `SCANNER_ENABLED=true` but one scanner-only secret/config value was missing.

Changed scanner startup behavior to fail closed for Scanner only:
- missing scanner config disables the scanner gateway
- missing variable names are logged without values
- Special Orders / Ordering / Preorders continue starting.

This prevents an unrelated scanner configuration problem from taking down daily Special Orders operations.

#### Key commits
- `dcab50d141cec5496834f7a225b53e201d5b569b` — duplicate-safe Lightspeed PO receiving backend
- `337ff74e73a2be9952c9d20276d6098ce2dffc78` — Receiving Review + Notification Review UI
- `6a54990294ca7728af0114524394d51ab84dd011` — separate employee review from delivery queue
- `6da50041a0e8c2877af9e33049c50e90c3b7c784` — route approved notifications to Discord/email/SMS queues
- `74a71456beb98d258bf063830f3590ad5b45f6a5` — retry-safe delivery routing
- `27b6cfe5369a9a3ad8cd7e31eb9dac3258f034b2` — Approved Delivery Queue UI
- `d87b18ae7d3f06feb4b0e98323136718369ac294` — fail closed scanner without crashing Special Orders
- `c1e42f5ff6b779ea87ea0e13a2d432bd7f7a6e52` — cap customer allocations to Lightspeed reported received quantity
- Discord development worker: `Tawgod/Hobby-Corner-Discord-Bot@fb9efaca20496cd20ce84798b219b5cc2b94ff47`

Remaining employee acceptance:
- Browser-test Receiving Review against real partially/fully received Lightspeed POs.
- Confirm actual Lightspeed purchase-order line received-quantity field shape for Hobby Corner account data.
- Test notification review with matched Discord customer and unmatched/no-contact customer.
- Test Discord sender on a non-production bot deployment before production cutover.
- Implement email/SMS delivery or document manual handling.
- Validate preorder-watch informal detection in a test Discord channel before production bot enablement.

No Chrome extension release was prepared in this pass, so the Chrome extension release queue was not modified.

#### Messenger / WhatsApp notification destinations — 2026-10-27
Status: **Testing**

Added Facebook Messenger and WhatsApp as potential customer-notification destinations alongside Discord, email, and SMS.

Customer records now support:
- `facebook_messenger_id`
- `whatsapp_number`

Special Orders customer UI:
- New-customer form can record Messenger and WhatsApp contact information.
- Existing-customer Update Customer modal can edit both fields.
- Customer summary/search indicates when Messenger/WhatsApp contact data is present.
- These fields are Special Orders/local notification data and are not written to Lightspeed by the contact-sync option.

Notification Review:
- Employee approval now shows a destination selector using only contact methods actually available for that customer.
- Default priority is:
  1. Discord
  2. Facebook Messenger
  3. WhatsApp
  4. Email
  5. SMS
- Employee can choose any available destination instead of relying on the default.
- Added queue channels:
  - `MESSENGER_READY`
  - `WHATSAPP_READY`
- Both are visible in the Approved Delivery Queue.

Delivery status:
- Discord delivery worker remains implemented/test-only on the Discord bot development branch.
- Messenger and WhatsApp are **queue destinations only** right now; no Meta Messenger/WhatsApp production sender has been configured or enabled.
- Email/SMS likewise remain queued pending their delivery integrations.

References:
- `Tawgod/Lightspeed@f9cb4d9c2d7407df6c27e89db2b16523dc15a933`
- `Tawgod/Lightspeed@b4dc4f4b4c4f63e29713b96c2efb909dcebb7a41`

## Product Scanner phase 2 — persistent new-product review inbox (2026-10-27)
- **Status:** In Development. **Implemented in branch:** yes. **Automated testing:** PASS (`40539225636`). **Browser testing:** NOT DONE. **Deployed:** NO.
- **Repository/branch:** `Tawgod/Lightspeed:feature/scanner-review-queue-foundation-20261027`. **PR:** https://github.com/Tawgod/Lightspeed/pull/15. Base: `integration/hobby-corner-consolidation`.
- **What's changed:** Introduced an isolated scanner new-product proposal inbox backed by `scanner_product_review_proposals`, capturing supplier, SKU/UPC fields, source URL, submitting employee and time with status `PENDING_REVIEW`. Added scanner submit/view UI and authenticated list/detail/submit routes. On submit, server rechecks local and remote product matching and refuses known duplicates. Duplicate proposal requests are rejected via supplier/item uniqueness. No Lightspeed product creation/update, live preorder publication, Discord or approval endpoint was added.
- **Dependency:** Current consolidated remote matcher can ignore failed searches; **PR #14 must be reconciled/merged before deploying PR #15**, and both endpoints must be tested together. PR #12's active Timeclock employee basic scanner access is a separate permissions decision; do not conflate with final product-write approval.
- **Shared extension coordination:** Queue updated for PR #15. PO Companion PR #13 and Consignment PR #11 remain separate. No extension packaging, release version bump, production Railway deployment or Chrome Web Store publication was performed.
- **Next action:** Browser/employee acceptance after isolated deployment approval; implement dedicated reviewer decision UI and final-write authorization with server-side duplicate checks, audit/idempotency and partial failure recovery, then seek separate permission to enable any Lightspeed writes.
- **Developer documentation:** `docs/scanner-product-approval-phase-20261027.md` on PR #15 branch.

## Shared Addon UI / UX — beta foundation implementation (2026-10-27)
- **Status:** In Development. **Foundation implemented:** YES, in isolated branch only. **Automated tests:** PASS — shared UI foundation CI run [40544824489](https://github.com/Tawgod/Lightspeed/actions/runs/40544824489) (5/5 checks). **Browser/employee testing:** NOT DONE. **Deployed:** NO.
- **Repository/branch:** `Tawgod/Lightspeed:feature/shared-addon-ui-beta-foundation-20261027`; draft PR [#16](https://github.com/Tawgod/Lightspeed/pull/16) against `integration/hobby-corner-consolidation`.
- **Implementation:** `shared-ui/hc.css` namespaced navy/blue/shaded panel tokens, reusable forms/buttons/tables/badges/dialogs, responsive/focus styles; `shared-ui/showcase.html` interactive demonstration with sample-only data; `shared-ui/clipboard.mjs` exact-text and sanitized rich clipboard helper; two optimized assets derived from owner-supplied Hobby Corner logos; adoption guide, tests, CI and changelog.
- **UI surface changed in production:** None. No existing Chrome extension/Scanner/Special Orders/Ordering/Timeclock UI modified. No production code merge, Railway deploy, extension version bump or package.
- **Dependencies:** Existing extension queue and open PRs #11 (Consignment), #12 (Timeclock scanner access), #13 (PO Companion), #14 (scanner duplicate safety), #15 (scanner review inbox). Future feature UI changes must selectively adopt kit without resetting outstanding behavior.
- **Next:** Verify CI, test browser/keyboard/zoom, accept draft PR, pilot popup/scanner in separate reconciled branches; stage extension changes in the shared release queue before shipping.
- **Owner decision:** Navy/blue beta with cool gray-blue shaded panel separation, original store branding, restrained density, keyboard accessibility and source-faithful copying.

## Scanner beta integration and controlled test creation — 2026-10-27
- **Status:** `Testing` (code merged and deployed; extension beta packaged; employee acceptance BLOCKED). **Code:** integrated PR #17, `Tawgod/Lightspeed:integration/hobby-corner-consolidation` at `61016a92971bceead57f07f1a09aa47461d1d343`. PR #14 duplicate-safety merged `4a69d25`; old PR #12 and #15 closed as superseded by #17.
- **Implemented:** Active Timeclock employee scanner editing/staging without Lightspeed role lookup; persisted new-item review queue with fresh local and remote duplicate checks; exact product fields; one-supplier-product-page capture; conditional *isolated test Lightspeed tenant* create-only action and one-shot audit/reconciliation; shared navy/blue shaded UI adopted in Scanner and extension popup using approved local Hobby Corner brand assets.
- **Automated testing:** Scanner integrated CI [40549240678](https://github.com/Tawgod/Lightspeed/actions/runs/40549240678) PASS; v0.3.25 beta package [40549569151](https://github.com/Tawgod/Lightspeed/actions/runs/40549569151) PASS with scanner/read-only/test creation and UI checks.
- **Railway deployment:** `lightspeed-api`, `timeclock`, `special-orders-test` each reported `SUCCESS` at commit `61016a9`. **Operational blocker:** scanner backend log on `special-orders-test` says scanner gateway DISABLED due to missing/empty `SCANNER_SERVICE_SECRET` at runtime even though variable name appears in Railway. Credential value unavailable to connector; needs secure comparison/repair against Timeclock before real browser PIN test. Do not replace an unreadable secret blindly.
- **Live product writes:** NOT enabled. Test creation route requires separately configured Lightspeed tenant different from production, dedicated token and explicit feature flag. No test tenant variables currently set; no real product created.
- **Extension beta:** Unpacked `v0.3.25` artifact from `release/scanner-v0.3.25-beta-20261027`, commit `5c304d4`, [Actions download](https://github.com/Tawgod/Lightspeed/actions/runs/40549569151), artifact `12754687005`. Normal consolidated extension manifest remains `0.3.23`, so this preview is not an auto-update or published release.
- **Cross-project queue:** `CHROME_EXTENSION_RELEASE_QUEUE.md` reconciled and updated. Shared UI PR #16 source retained, but Scanner/popup adoption shipped in beta; separate PO Companion PR #13 and Consignment PR #11 deferred pending their browser acceptance, Chrome Web Store release deferred.
- **Next:** 1) Securely repair scanner service secret/reference and verify scanner startup; 2) configure isolated Lightspeed sandbox tenant without sharing production creds; 3) Chrome browser test active/inactive employee login, exact/fuzzy matches, supplier capture, cached SKU, preorder staging and pending proposals; 4) confirm test-create one product in sandbox, audit/reconcile; 5) keep final live product write approval behind dedicated safeguards and explicit authorization.

## Scanner Shared Addon UI adoption — 2026-10-27
- **Status:** In Development. **Implemented:** PR #19 in `Tawgod/Lightspeed:feature/scanner-shared-ui-adoption-20261027`; **tested:** regression suite authored, GitHub UI workflow check pending; **browser/employee-tested:** NO; **merged/deployed:** NO.
- **Sources:** approved shared UI spec `SHARED_ADDON_UI_UX.md`; design foundation draft PR #16, `feature/shared-addon-ui-beta-foundation-20261027`; authoritative app base `integration/hobby-corner-consolidation`.
- **Changes:** Incremental namespaced adoption of shared shaded panel/inset, forms, buttons and status classes in Scanner, plus verbatim reuse of foundation `copyHobbyCornerField` helper from `extension/shared-ui/clipboard.mjs` for exact-text product JSON copying. Existing dark navy/blue Scanner and toolbar popup layout/logo styling from merged PR #17 preserved. IDs, APIs, Timeclock role/PIN, duplicate checks, preorder stage, proposal review, isolated test-store gate and live-write restrictions untouched.
- **Files:** `extension/product-scanner/review.html`, `review.js`, `extension/shared-ui/clipboard.mjs`, `tests/scannerSharedUiAdoption.test.js`, `.github/workflows/scanner-ui-check.yml`, `docs/scanner-shared-ui-adoption-20261027.md`.
- **Testing:** Static UI, exact clipboard text and ID preservation regression authored; awaiting workflow execution and real Chrome browser keyboard, 100/125/200% zoom, PIN, ACD single-product scan, error/empty, preorder, copy-and-paste acceptance. Do not claim WCAG certification based on CSS only.
- **Dependencies:** Shared UI PR #16 still draft; PO Companion PR #13 and Consignment PR #11 remain separate release queue entries. Scanner backend auth runtime previously reported a missing/empty scanner service secret; UI update will not repair it.
- **Next:** review PR #19, verify CI, run store employee browser acceptance, reconcile queue before a separate approved extension package; no production merge/deploy performed.

### PO Companion — shared UI beta integration (2026-10-27)
- Status: **In Development**; UI code implemented on `Tawgod/Lightspeed:feature/po-companion-consolidated-v2`, draft PR #13, not merged or deployed.
- Reused shared beta source from draft PR #16: version-locked `extension/shared-ui/hc.css`, original Hobby Corner icon/wordmark and clipboard helper. Updated supplier-side panel and separate review window with scoped `hc-ui` patterns, blue/navy actions and gray-blue shaded separation; retained compact supplier-site geometry.
- Static JS syntax checks passed for panel, background and review scripts. Browser, zoom, keyboard, clipboard and Timeclock acceptance remain pending. No live PO integration or Lightspeed writes enabled.
- Shared Chrome release queue updated; reconcile both PR #13 and PR #16 before extension release. Feature notes: `docs/PO_COMPANION_CONSOLIDATED_V2.md`.

Consignment shared UI milestone (2026-10-27): adopted exact shared UI stylesheet from draft PR #16 into Tawgod/Lightspeed:feature/consignment-layout-foundation (draft PR #11), without merging either branch. Both isolated beta staff and customer screens use hc-ui scoped wrapper, hc-panel/header/body, hc-button, hc-alert, navy/blue/orange palette and original store wordmark. Small compatibility adapter preserves dynamic markup, IDs, handlers, matching, approvals and fail-closed API. Shared UI CSS/routes/branding smoke and scanner regression tests passed on integration commit 29a0eaa9. Railway consignment-beta remains isolated test service with automatic development-branch deployment; manual visual/keyboard/zoom acceptance pending. No Chrome extension file or release, no production Lightspeed writes. Dependency: PR #16 may evolve, so reconcile shared component version before merge.

- **PR #19 verification update (2026-10-27):** GitHub Actions scanner integration [run 40563269131](https://github.com/Tawgod/Lightspeed/actions/runs/40563269131) PASSED after regression test corrections. Implementation head `eb210aa742db608355c963c5b8e6af3a673944e4`; remains not merged, not deployed, not packaged and Chrome browser acceptance pending.


## Shared UI adoption audit — 2026-10-27
- **Already integrated/under active UI work:** Product Scanner + extension popup, PO Companion, Consignment, Product Manager, PO Avery label tool.
- **New core-ops UI branch:** `Tawgod/Lightspeed:feature/core-ops-shared-ui-20261027`, draft PR #21. Applies shared PR #16 stylesheet + compatibility adapter to Special Orders, Ordering, Preorders and GW Preorders without changing IDs, handlers, APIs or business logic.
- **New extension-launcher UI branch:** `Tawgod/Lightspeed:feature/extension-launchers-shared-ui-20261027`, draft PR #22. Aligns Timeclock and Split / Recall injected UI with approved navy/blue/shaded design; Chrome release not prepared.
- **Remaining:** browser/keyboard/zoom acceptance across all updated surfaces; reconcile PR #16 component version before merge; no production deployment or extension publication from PR #21/#22 yet.

## Scanner Timeclock authentication repair staged — 2026-10-27
- **Status:** `Testing / Blocked pending deployment approval`. Railway production logs confirmed scanner gateway disabled at startup: `SCANNER_SERVICE_SECRET` missing/empty, despite both `timeclock` and `special-orders-test` showing the name.
- **Action completed:** Generated a new long random scanner-only service secret and staged the same value on both Railway services. Values not stored in project docs, the extension, or GitHub. Production environment patch contains **2 non-destructive variable updates**, and has **not been deployed**.
- **Services affected:** `timeclock` and `special-orders-test`, in Railway project `f7e91de7-43f6-472e-b4ca-46b0623f8e0e`, production environment. Lightspeed API token, employee PINs, linked user IDs and product write flags unchanged.
- **Next required authorization:** User to explicitly approve applying the staged Railway variable updates (this redeploys both services). Then confirm fresh Special Orders startup shows `[scanner] authenticated read-only gateway enabled`, confirm PIN sign-in and inactive employee rejection from actual Chrome extension, and verify no production product writes.
- **Known constraints:** Browser acceptance and isolated test-tenant creation still pending. No Chrome extension package/version changed by this repair.

## Scanner shared-secret production repair verified — 2026-10-27
- **Status:** `Testing` — production configuration **deployed and scanner gateway startup verified**, real employee PIN/browser acceptance still pending.
- **Authorized action:** User explicitly approved the two staged Railway `SCANNER_SERVICE_SECRET` variable changes on `timeclock` and `special-orders-test`. Railway production patch committed successfully; no pending patch remains.
- **Deployments:** Timeclock `2a372fdb-d1f2-4a34-a31d-0b46e27d1eb4` SUCCESS; Special Orders `fdf05275-8a03-4ab5-9fb8-bd7962b8a8a5` SUCCESS, both at consolidated `61016a92971bceead57f07f1a09aa47461d1d343`. No application-source changes or Lightspeed write authorization changed.
- **Runtime evidence:** Timeclock startup: `Timeclock listening on port 8080`. New Special Orders startup: `[scanner] authenticated read-only gateway enabled` and `Server listening on port 8080`. Earlier missing-secret gateway-disabled startup issue resolved.
- **Not yet verified:** Correct Timeclock PIN success/failure response from the employee browser; scanner UI loading suppliers and matched product data; real isolated test-store create still requires separate tenant configuration.
- **Next action:** Test v0.3.25 unpacked beta from approved GitHub Actions artifact with active Timeclock employee PIN. Validate disabled employee and expired session behavior without sharing PINs. Report any status/error to scanner development; keep production product creation blocked.

### Shared UI adoption — Special Orders core operations — 2026-10-27
Status: **Testing**

Special Orders family pages now adopt the approved Hobby Corner Shared Addon UI / UX beta foundation on the authoritative consolidated branch.

Updated surfaces:
- `/special-orders`
- `/ordering`
- `/preorders`
- `/gw-preorders`

Implementation approach:
- Reused `shared-ui/hc.css` from `feature/shared-addon-ui-beta-foundation-20261027`.
- Reused/adapted `shared-ui/core-ops-compat.css` from the coordinated core-ops UI branch / PR #21 work.
- Added explicit server routes for the shared stylesheets.
- Scoped styling through `body.hc-ui`; no global Lightspeed host injection.
- Added `hc-page` workspace wrapping and current-page navigation state.
- Preserved existing element IDs, JavaScript handlers, API contracts, permission gates, receiving flows, notification review/delivery queues, preorder-watch behavior, supplier routing, activity logs, aging logic, and GW submission safeguards.

Visual adoption:
- approved navy/blue beta palette
- cool gray-blue canvas
- shaded panels/cards with clearer separation
- shared button/input/focus treatment
- more consistent table surfaces
- stronger current-page navigation treatment
- existing aging/status colors remain semantic and text-labeled

Reference:
- Shared foundation spec: `Tawgod/Hobby-Corner:main/SHARED_ADDON_UI_UX.md`
- Foundation branch: `Tawgod/Lightspeed:feature/shared-addon-ui-beta-foundation-20261027`
- Core-ops coordinated branch: `Tawgod/Lightspeed:feature/core-ops-shared-ui-20261027`
- Consolidated implementation: `Tawgod/Lightspeed@53b4508821319c1ab33b4d44c8b2c8bfca81880d`

Status:
- Implemented: YES
- Railway deployment: in progress at last verification
- Browser/employee acceptance: pending
- Chrome extension release: not part of this change; release queue not modified



## Planned Future Workstreams — Store Operations Expansion

### Back Room Inventory
**Status:** Planned

Purpose:
- Track products moved from the sales floor into back-room overflow storage.
- Record whether an item is stored in back room, quantity stored, and expected sales-floor capacity.
- Determine when floor stock has fallen below the desired level and the back room contains replenishment stock.
- Generate daily employee reminders/work lists for products that should be restocked to the floor.

Expected capabilities:
- Mark/unmark products as back-room stocked.
- Track back-room quantity separately from sales-floor capacity/target.
- Store per-product sales-floor capacity.
- Daily replenishment queue showing suggested quantity to move from back room to floor.
- Scan/search products using existing Product Scanner/Lightspeed product identity where practical.
- Audit adjustments and prevent duplicate restock actions.
- Integrate with Lightspeed inventory reads while avoiding a conflicting inventory source of truth.
- Employee-facing UI should use the shared Hobby Corner UI/UX design system.

Dependencies:
- Lightspeed Retail X-Series product/inventory data.
- Product Scanner/product matching.
- Future inventory-count/reconciliation workflow.
- Shared employee UI/navigation.

### Service Requests / Repairs / Warranty / Commissions
**Status:** Planned

Purpose:
- Manage customer service requests including RC/train/model repairs, warranty replacements, and other service work.
- Track assigned employee/technician, repair status, parts/items required, labor/service fees, and commission where applicable.

Expected capabilities:
- Customer and product lookup through Lightspeed/Special Orders.
- Service ticket lifecycle: intake, diagnosis, estimate, approval, waiting for parts, in repair, ready, completed, cancelled/returned.
- Attach parts/products used or ordered to complete a repair.
- Reuse Special Orders for products/parts that need to be ordered instead of creating a separate purchasing system.
- Create/link appropriate Lightspeed sale/order records for parts, service fees, and customer pickup/payment.
- Configurable repair/service fee schedules.
- Employee assignment tied to Timeclock employee records.
- Map Lightspeed sales-rep identifiers/numbers to Timeclock employees.
- Track repair/service commissions and expose them in Timeclock/payroll reporting without changing historical time records.
- Dashboard for open work, aging, parts waiting, employee workload, completed work, and commissions.
- Preserve audit history and approval controls for financial adjustments.
- Employee-facing UI should use the shared Hobby Corner UI/UX design system.

Dependencies:
- Lightspeed customers/products/sales.
- Special Orders ordering and receiving.
- Timeclock employee identity and payroll reporting.
- Product Scanner for item identification.
- Shared customer notification system.
- Shared UI/UX design system.

### Game Room Reservations & Events
**Status:** Planned

Purpose:
- Manage reservations and events for the Hobby Corner game room and hallway overflow area.

Expected capabilities:
- Visual room-layout editor/map.
- Add/remove/move tables and define table size, capacity, identifier, and area.
- Support the main game room and hallway overflow area as separate reservable zones.
- Customer reservations by date/time, party size, table/resource requirement, and contact information.
- Staff-created reservations.
- Blackout dates/times and unavailable tables/areas.
- Event scheduling with reserved tables/areas, recurring events, setup/cleanup windows, and capacity rules.
- Conflict detection so overlapping reservations cannot claim the same resource.
- Calendar/day/week views and a simple floor-map view of occupied/available tables.
- Optional waitlist and reservation notes.
- Customer reminders/notifications using the existing notification architecture where practical.
- Future option to connect paid events/fees to Lightspeed without making the reservation system dependent on POS transactions.
- Employee-facing UI should use the shared Hobby Corner UI/UX design system.

Dependencies:
- Customer/contact data.
- Shared notification system.
- Shared employee UI/navigation.
- Possible future Lightspeed payment/event-fee integration.

### Coordination rule
These three workstreams should reuse existing Hobby Corner infrastructure rather than becoming disconnected applications. Before implementation, each development chat should review the current consolidated Lightspeed branch, project registry, relevant Railway services, Special Orders/Timeclock dependencies, and shared UI standard.

Consignment coordinated navigation (2026-10-28): Tawgod/Lightspeed draft PR #25, feature/consignment-shared-nav-20261028 targeting feature/consignment-layout-foundation. Both staff manager and customer submission preview now use PR #23's six verified core-operations destinations, with explicit Consignment Beta label and customer form in responsive More disclosure. Shared UI PR #16 tokens and original branding retained; no extension files, staff handlers, authentication, or Lightspeed writes changed. Dedicated navigation CI passed; broader beta smoke and browser zoom/keyboard/visual acceptance pending. Not merged or deployed. PR #23 owns the shared core navigation standard; omitted Timeclock/Scanner/PO/Product Manager/Split Recall links await verified routes.

# Avery PO Label Maker — Current Handoff

**Last verified:** 2026-10-29  
**Status:** **Testing** — existing label printer works in production; shared UI candidate PR #29 remains unmerged and needs current-base reconciliation, real Chrome and physical print acceptance.

## Source

- **Repository:** `Tawgod/Lightspeed`.
- **Authoritative application branch:** `integration/hobby-corner-consolidation` at **`f50c3309824986633c3ba37a95e6eb43aae15a3c`** (GitHub branch verified 2026-10-29).
- **Current feature candidate:** [PR #29](https://github.com/Tawgod/Lightspeed/pull/29), `feature/labels-shared-ui-reconciled-20261028` at **`a000c084d8d3f3bd818dda6d4ef244885e3bb11e`**, **open, draft, mergeable=true** (GitHub snapshot, not merge approval).
- **Divergence as of 2026-10-29:** PR #29 **7 commits behind / 10 commits ahead** current consolidated; it originated at consolidated `24e9834a6aaaec2fae5e656a65939e93b63143cf`. Must reconcile latest consolidated changes and rerun CI before independent merge.
- **Superseded:** [PR #20](https://github.com/Tawgod/Lightspeed/pull/20), `feature/labels-shared-ui-beta-20261027@2041e8932fd571bc621d4394de8a52ffee2c663c`, still open/draft. **Safe to close as superseded after coordination; do not independently merge.** PR #29 has exactly the same `index.html` blob SHA (`a6a3b7e...`) as PR #20; reusable shared stylesheet blob (`c98ec1a...`) already exists in consolidated. Its specific label functionality is preserved; legacy handoff notes are replaced by this snapshot. PR #20 added its own stylesheet copy; PR #29 intentionally does not.
- **Retired historic source:** `feature/order-split-poc` is not a valid development base.

## Implemented

### Existing label functionality (production system, not a claim of PR #29 deployment)
- Lightspeed purchase-order page has a Chrome Toolkit **Print Avery Labels** launcher in `extension/content.js` opening backend-served `/index.html?poId=...`.
- Standalone PO Label Maker reads `/api/templates` and `/api/po/:poId/data`; employee can choose template, start sheet row/column, custom date/store text and per-item total/special-order label quantities and customer names; each item has Skip; `POST /api/labels/generate` opens a printable PDF without receiving stock or writing Lightspeed products/POs.
- PDFKit renderer in `server.js` supports US Letter, 3 columns x 10 rows (30 labels/sheet), start-row/start-column offset, multi-page overflow, normal and special-order quantity splits and customer-name/special-order layout. Templates include `Templates/Avery_5960.json` and `Templates/Special Order Label.json`. **Preserve exact geometry:** page margins top/bottom 36 pt, left/right 13.5 pt; origin X `13.5 + col*198`, origin Y `36 + row*72`; label offset `((startRow-1)*3)+(startCol-1)`; page progression 30-up. The Avery JSON grid is 3x10 with spacingX 198/spacingY 72.
- **SKU Code 128 barcodes** generated directly from `item.sku` with text preserved, including leading zeros. Do not replace SKU with UPC or normalize identifiers without a distinct approved change. Price and wrapped-name offset, special-order customer text and barcode sizing must remain as previously working.
- Owner reported **physical print alignment/accuracy good on the existing deployed Avery labels**. This is historical acceptance of the old layout, not acceptance of PR #29.

### PR #29 development-only work
- Additively reskins standalone `index.html` with navy header, blue action, original store logo, muted gray-blue page, shaded sections, responsive table, focus styling and shared `hc-ui` classes; original DOM IDs, per-item fields and PDF API payload retained.
- Adds only two static GET asset routes in `server.js` pointing to current consolidated `shared-ui/hc.css` and existing `extension/product-scanner/hc-wordmark.webp`; no duplicate shared stylesheet or extension source changes.
- Added tests and workflow: `tests/labelSharedUi.test.mjs`, `tests/labelBrowserSmoke.mjs`, `tests/labelPdfSmoke.mjs`, `.github/workflows/label-ui-regression.yml` and `docs/LABEL_SHARED_UI_RECONCILIATION.md`. No PDF algorithm/template changes.

## Tested

- **Automated CI at PR #29 head `a000c084`:** [Avery regression run 40730902857](https://github.com/Tawgod/Lightspeed/actions/runs/40730902857) **SUCCESS**. Node source-contract tests **4 passed / 0 failed**. Synthetic headless Chromium: keyboard Tab/Shift+Tab; leading-zero SKU and customer value fidelity; responsive narrow table; CSS zoom 100%, 125%, 200%; zero page JS errors — all **PASS**.
- Actual backend PDF endpoint exercised with synthetic PO payloads; **3 output PDFs generated** and archived as GitHub Actions artifact `avery-5960-synthetic-pdf-samples` (artifact ID `12835565472`): regular labels **1 page/3,400 bytes**; start **row 3/column 2**, mixed special order **1 page/3,020 bytes**; 32-label multi-page **2 pages/24,097 bytes**. Checks cover PDF header, US Letter MediaBox, page count and barcode image presence. **They do not prove physical alignment or scanner decoding**.
- [Scanner integration regression 40730902922](https://github.com/Tawgod/Lightspeed/actions/runs/40730902922) **SUCCESS** at the same PR head.
- **Not tested:** native Chrome browser zoom at 100/125/200 (automated CSS zoom is different), actual employee keyboard/visual acceptance on store PCs, physical Avery 5960 sheets with print scaling, first/middle/last label alignment and start position, barcode reading with real Lightspeed register scanner; real/representative Lightspeed PO fetch in the new UI; regression against *new* consolidated head `f50c3309`.
- **Limitations of test coverage:** synthetic sample PDFs do not exercise live credentials or proprietary invoice/customer records; special-order customer wording and print clipping have not been physically checked.

## Deployed

- **Railway verified 2026-10-29:** project Hobby Corner, production environment: `lightspeed-api`, `timeclock` and `special-orders-test` each configured from `Tawgod/Lightspeed:integration/hobby-corner-consolidation`, latest deployments **SUCCESS** on 2026-10-28 at about 20:20 UTC. `lightspeed-api` deployment ID `6d1d3cd4-dcd1-4827-b07a-8b36bf926df2`. Deployment metadata did not independently establish exact deployed commit.
- **Existing deployed label system:** present in `lightspeed-api` on consolidated branch; existing owner-reported Avery output good.
- **PR #29:** **NOT merged, NOT deployed**, no extension ZIP/version/publication involved. No change to existing production label printing. No production writes performed in this chat.

## Shared dependencies

- **Shared UI/navigation:** use consolidated `shared-ui/hc.css` and original wordmark; PR #27 shared UI and PR #24 core operations **merged**. No competing CSS/navigation systems; page is standalone, not a new extension sidebar.
- **Chrome Toolkit:** existing extension PO launcher lives in `extension/content.js`; this PR does not modify extension files. Future launcher changes must reconcile `CHROME_EXTENSION_INTEGRATION.md`, queue and active extension PRs before packaging.
- **Lightspeed PO and PO Companion:** current backend label API and readonly PO retrieval; [PR #31](https://github.com/Tawgod/Lightspeed/pull/31) (PO Companion) is a separate development candidate; do not replace working label PO calls or duplicate PO readers.
- **Shared Lightspeed services:** [PR #32](https://github.com/Tawgod/Lightspeed/pull/32) and stacked [PR #33](https://github.com/Tawgod/Lightspeed/pull/33) contain developing shared transport/read-only PO and exact-permission contracts; **unmerged and undeployed**, so do not assume label routes use them. Later migration only after tested shared gateway consumer conversion.
- **Timeclock/staff permissions:** use existing verified Timeclock identities if privileged functionality is added; do not introduce another employee/PIN system. Generating a local printable PDF must never bypass server authorization or introduce Lightspeed write access. Current old label UI does not establish a new role policy.
- **Product Scanner / Product Manager:** reuse canonical product identity/SKU lookup for future template/label metadata; preserve exact SKU, UPC and supplier code strings, including leading zeros. No competing product-matching engine.
- **Special Orders / Ordering / Preorders:** special-order label/customer information is derived from PO context; do not interpret invoice/tracking as received stock or customer pickup readiness.
- **Invoice Reconciliation (future feature, NOT implemented):** `FEATURE_INVOICE_RECONCILIATION.md` allows approved invoice proposal to **create a new OPEN supplier PO or update existing PO**, secondary supplier mappings and verified sender aliases/tracking for Special Orders **On the way**. It must **never receive product, set received quantities, change inventory on hand or mark customer items ready**. Label Maker remains strictly print-only; do not proactively print labels merely because an invoice is approved or shipment is in transit. If required later, labels can print from an independently verified PO after normal review/receipt workflow, without adding an invoice writer here.
- **Railway PostgreSQL / Discord / Rewards:** existing shared infrastructure; **no DB tables, notifications, customer synchronization or credit workflows owned by Label Maker**. No coupling or migration requested.

## Shared files / integration surfaces affected

- PR #29: `index.html`, `server.js` (two static asset routes only), `tests/labelSharedUi.test.mjs`, `tests/labelBrowserSmoke.mjs`, `tests/labelPdfSmoke.mjs`, `.github/workflows/label-ui-regression.yml`, `docs/LABEL_SHARED_UI_RECONCILIATION.md`.
- Read-only dependencies: `Templates/Avery_5960.json`, `Templates/Special Order Label.json`, `shared-ui/hc.css`, `extension/product-scanner/hc-wordmark.webp`, `extension/content.js`, PO backend routes.
- Do not change PDF positioning merely for shared visual design.

## Unfinished requirements / known issues

- **Planned additional label templates** for varied product sizes/packaging (smaller price labels, larger information labels, special-order/hold variants, different Avery sheet sizes). Existing JSON template directory/selector provides a foundation; renderer still uses some hard-coded Avery 5960 geometry, so genuine support for different grids requires a **separate planned feature and isolated tests**. Do not modify working Avery template geometry as part of the PR #29 UI change.
- **Maintenance requested:** robust quantity validation, including negative/non-integer entries and special-order qty not exceeding total; missing SKU/product error handling; safe text insertion/HTML encoding for supplier-controlled product/customer/template names (existing UI constructs HTML with template literals and `innerHTML`), improve actionable error/status messages. These are identified concerns, **not fixes shipped in PR #29**.
- **Optional later improvements:** print preview prior to PDF, embedded/dialog label-maker flow rather than standalone tab, visibility of yellow Print Avery Labels purchase-order button across Lightspeed light/dark mode. These are **proposals**, not approved mandatory work.
- **Known UI concern:** PR #29 preserves existing JS insertion and alerts; passing synthetic tests does not establish XSS hardening, user-input validation or complete accessibility. Do not conflate cosmetic style adoption with business logic fixes.
- **Review needs:** clarify whether different template types should expose dynamic row/column ranges and alternate barcode data; retain current SKU barcode until explicitly approved.
- **No open user request to ship an extension release**; this page is backend-served and isolated from Chrome extension packaging.

## Remaining blockers

1. Reconcile PR #29 with newest consolidated `f50c3309` (7 behind at verification), preserve any current shared UI/auth/backend changes, then rerun automated CI on reconciled head.
2. Native Chrome desktop acceptance at 100%, 125%, 200% and normal/keyboard/edge cases.
3. Physically print sample PDFs at **Actual size / 100%**, Fit-to-page off, on Avery 5960 sheets; verify first/middle/last grid cells, start row 3 col 2, multi-page, long-name/special-order customer text and scan Code128 labels on real register hardware.
4. Record printer model, printer driver/media preset, scaling settings, and acceptance outcome. No physical test was possible from the assistant environment.
5. Review if server-side label endpoints require separate access/authorization checks; no permission change without deliberate policy decision.

## Decisions needed

- Store owner/employee physical printer and native Chrome acceptance required before independent merge.
- User to prioritize which **new templates** to implement first after stabilization, with exact stock/format requirements.
- Authorization required separately for PR merge/production deployment; no blanket approval from tests.

## Recommended next action

1. In a new Avery Labels chat, read this handoff and current consolidated PRs, reconcile PR #29 onto the newest base **without altering print geometry**, run CI, and independently validate browser acceptance.
2. Have store staff print the archived synthetic PDFs and record alignment, barcode scanning, start position and scaling. Once accepted, assess PR #29 as standalone merge candidate; PR #20 may be closed after verified supersession, not silently merged.
3. Then address **HTML/text safety and quantity validation** as a separate small change, followed by a multiple-template requirements/design exercise.

## Restrictions / safety

- Do not merge or deploy production-connected branches, publish extension packages, change live Lightspeed product/PO/inventory records, send notifications, alter credentials, or change employee/customer data without explicit authorization.
- No geometric changes to Avery 5960 PDF positioning to achieve shared UI consistency; no automatic receiving or inventory adjustment in this workstream.
- Never infer successful print/scan from synthetic PDF or CSS zoom tests.

## Documentation

- `HOBBY_CORNER_PROJECT.md` Current Authoritative Development Matrix (2026-10-29).
- `HOBBY_CORNER_CHAT_TRANSITION.md`, `handoffs/README.md`, `handoffs/TEMPLATE.md`.
- `ROADMAP.md`, `LIGHTSPEED_SHARED_SERVICES.md`, `SHARED_STAFF_AUTH_PERMISSIONS.md`, `FEATURE_INVOICE_RECONCILIATION.md`.
- `SHARED_ADDON_UI_UX.md`, `CHROME_EXTENSION_INTEGRATION.md`, `CHROME_EXTENSION_RELEASE_QUEUE.md`.
- `Tawgod/Lightspeed:feature/labels-shared-ui-reconciled-20261028/docs/LABEL_SHARED_UI_RECONCILIATION.md`.
- PR #29 CI [40730902857](https://github.com/Tawgod/Lightspeed/actions/runs/40730902857), Scanner CI [40730902922](https://github.com/Tawgod/Lightspeed/actions/runs/40730902922); GitHub Actions artifact `avery-5960-synthetic-pdf-samples` ID `12835565472`.

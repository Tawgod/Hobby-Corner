# Purchase Order Companion — Current Handoff

**Last verified:** 2026-10-29  
**Status:** In Development — read-only PO candidate; PR #31 remains draft.

## Source
- Repository: `Tawgod/Lightspeed`
- Authoritative base: `integration/hobby-corner-consolidation@f50c3309824986633c3ba37a95e6eb43aae15a3c`
- Current PR: [#31](https://github.com/Tawgod/Lightspeed/pull/31), branch `feature/po-companion-consolidated-20261028`, head `a4ef5475cfa4a3cc44e1903898944d4dd8d0d832`. **Draft/open/unmerged**.
- Superseded: PR #13; unique panel/review/copy/draft behavior selectively preserved, old independent nav/legacy consignments PO read intentionally excluded.

## Implemented
- Chrome PO supplier-side panel with reviewed names, quantities, supplier SKU/UPC exact-string clipboard copy, draft edit controls, warnings and separate read-only review shell.
- Shares PR #26-style Toolkit popup, navigation, branding and clipboard; there are overlapping shared popup/manifest files to reconcile before release.
- New backend `routes/poCompanionRead.js` behind signed Timeclock Scanner session reauthorization reads current `2026-04/purchase_orders` and `/line_items`; local supplier/product mapping comes from Special Orders PostgreSQL. No direct extension Lightspeed credential or PO write.
- Existing PO panel background worker login/load is still fail-closed: **live extension-to-PO authentication/load is not complete**.

## Tested
- PR-head GitHub Actions `40730813762` PO read-only tests and `40730814092` Scanner integration **SUCCESS**, both at `a4ef5475cfa4a3cc44e1903898944d4dd8d0d832`.
- Synthetic fixture behavior includes supplier SKU/UPC leading zeros, unresolved supplier/product warnings and read-only API denial.
- Real PO pagination/end-to-end employee PIN/loaded Chrome/copy/draft/review acceptance: **not verified**. Current backend page_size=1000 does not prove complete listing for larger datasets; PR #33 introduces a planned stricter shared read service.

## Deployed
- PR #31: not merged, deployed or packaged. Existing Railway lightspeed-api tracks consolidated branch with SUCCESS latest deployment; not PR #31.
- Approval and live PO write capability: disabled.

## Shared dependencies
- PR #26 Scanner popup/navigation, PR #22 content overlay, PR #24/#27 merged shared UI and navigation.
- Phase 1/2 PR #32 and stacked draft #33 supply canonical PO reader and shared authorization; **unmerged**, must not be assumed available in runtime.
- Existing Timeclock session and `SHARED_STAFF_AUTH_PERMISSIONS.md` remain authoritative.
- Planned Invoice Reconciliation: PO Companion displays links to invoice-specific Product Manager review and shipping/tracking details; create/update **OPEN/non-received PO** is owned only by shared backend after complete invoice approval. Secondary supplier preserves primary; no automatic RECEIVED status. No invoice feature implemented in PR #31.

## Shared files / integration surfaces affected
- `extension/manifest.json`, popup HTML/JS, `extension/po-companion/*`, shared navigation/clipboard/brand assets, `routes/poCompanionRead.js`, `services/scannerTimeclockGateway.js`, `server.js`, regression CI.
- PR #26 overlap must be reviewed manually before merge; preserve all launchers.

## Remaining blockers
- Finish secure extension-owned employee login/PO load (currently fail-closed).
- Live X-Series read paging/supplier mapping tests, actual PO and selected employee access, native Chrome zoom/keyboard/clipboard acceptance.
- Reconcile PR #31 with Phase 2 shared PO reader without losing draft/state or local supplier mapping.
- Extension queue/release coordination.

## Decisions needed
- Authenticated panel launch/messaging design and exact read-only gateway/PO line schema contract; when to introduce invoice contextual links.
- Explicit production release approval separately from code review.

## Recommended next action
- Convert a controlled PO read consumer to canonical shared `purchaseOrders.js` after Phase 1/2 acceptance, preserve the existing backend PO UI response and test full current PO retrieval. Keep all writes blocked.

## Restrictions / safety
- Do not infer stock received from invoice/tracking. No PO create/update, no production data changes, no independent Chrome package or production deployment without approval.

## Documentation
- `docs/PO_COMPANION_CONSOLIDATED_20261028.md` in PR #31; `FEATURE_INVOICE_RECONCILIATION.md`; `CHROME_EXTENSION_RELEASE_QUEUE.md`.

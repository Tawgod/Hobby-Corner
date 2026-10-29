# Product Scanner / Toolkit — Current Handoff

**Last verified:** 2026-10-29  
**Status:** Testing — PR #26 ready for review, extension release BLOCKED pending real Chrome acceptance.

## Source
- Repository: `Tawgod/Lightspeed`
- Authoritative application/extension base: `integration/hobby-corner-consolidation@f50c3309824986633c3ba37a95e6eb43aae15a3c`
- Current PR: [#26](https://github.com/Tawgod/Lightspeed/pull/26) — `feature/scanner-consignment-nav-alignment-20261028`, head `0b3e6f110932efea94dc23c23903cc97ee20e541`, open, non-draft, **unmerged**.
- Superseded: PR #19 (shared scanner UI work selectively preserved); old Scanner candidate branches are historical.
- Connected project status: `CHROME_EXTENSION_RELEASE_QUEUE.md`, Scanner **BLOCKED/Testing**; no shipped extension version verified.

## Implemented
- Coordinated Scanner review page and Toolkit popup navigation with active-page state, More menu, keyboard/Escape handling, shared branding, original copy/clipboard fidelity, namespaced reusable UI.
- Reused established Special Orders product matching, scanner PIN/Timeclock identity and the existing isolated test-tenant product writer; **no new production product writer**.
- PR #26 owns additive updates to `extension/popup.html`, `popup.js`, `extension/product-scanner/review.html`/`review.js`, shared nav/clipboard and UI tests; does **not** own `extension/content.js`.

## Tested
- Automated: Scanner integration `40724995019` PASS, Scanner UI `40724981558` PASS; Chromium mocked layout/keyboard/zoom `40725500639` PASS at the exact PR head (GitHub verified). Prior static clipboard/navigation regression documented in PR.
- Real loaded Chrome with employee PIN, supplier association, scanning, review/staging, permissions and click-through: **unverified**.
- Railway/deployment: no PR #26 production deployment, Chrome package, version bump or publication.

## Deployed
- PR #26: **Not merged or deployed**; existing Scanner infrastructure in consolidated service only. No verified new extension package/release.
- Current production `lightspeed-api`, `timeclock`, `special-orders-test` Railway services follow consolidated integration and report latest SUCCESS (deployed commit not independently confirmed).

## Shared dependencies
- Core Operations PR #24 and shared UI PR #27 are **merged**, not pending.
- PR #22 Timeclock/Split modifies `content.js`; PR #31 PO Companion modifies popup/manifest/PO background and needs selective nav reconciliation; PR #32/#33 shared services unmerged.
- `SHARED_STAFF_AUTH_PERMISSIONS.md`: current Timeclock Scanner allows all active employees lookup/review; approval is not authorization for a live Lightspeed product write.
- **Planned Invoice Reconciliation:** `FEATURE_INVOICE_RECONCILIATION.md` — Scanner must later scan supplier UPC/SKU and supplier-specific cost, submit proposals to a selected shared invoice, and reuse supplier sender-alias/tracking links. This feature will **never receive stock**; invoice can create/update only an approved OPEN/status-safe supplier PO. No Scanner invoice bridge implemented yet.

## Shared files / integration surfaces affected
- `extension/popup.html`, `popup.js`, `product-scanner/review.html`/`review.js`, `extension/shared-ui/navigation.mjs`/`.css`, `clipboard.mjs` and related CI.
- Do not independently replace shared manifest/popup/nav or publish a package without release queue reconciliation.

## Remaining blockers
- Real employee and supplier Chrome acceptance including invalid PIN, per-action permissions, scanning, review queue, staged preorder and read-only mode.
- Shared extension navigation / PO Companion PR #31 popup manifest coordination; full release queue READY/BLOCKED disposition.
- Future invoice bridge is **planned**, not PR #26 scope.

## Decisions needed
- Timing of joint extension release and any verified Invoice Updates launch surface; avoid separate tool launcher without need.

## Recommended next action
- Run actual Chrome employee acceptance, then coordinate Scanner popup/nav with PO Companion PR #31 and Timeclock PR #22. Prepare an independent invoice-scoped Scanner price lookup proposal on a later branch only after shared backend queue exists.

## Restrictions / safety
- No production product creation/PO writes, no inventory receiving, no Chrome package/version/publish without explicit authorization.
- Preserve isolated Scanner test writer, Timeclock verified identity and product duplicate safeguards.

## Documentation
- `docs/scanner-navigation-consignment-alignment-20261028.md` in PR #26
- `FEATURE_INVOICE_RECONCILIATION.md`, `CHROME_EXTENSION_INTEGRATION.md`, `CHROME_EXTENSION_RELEASE_QUEUE.md`, `SHARED_STAFF_AUTH_PERMISSIONS.md`.

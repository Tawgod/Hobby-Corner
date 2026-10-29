# Core Operations UI / Navigation — Current Handoff

**Last verified:** 2026-10-29  
**Status:** Testing — PR #24 merged into consolidated source; additional runtime acceptance remains

## Source

- Repository: `Tawgod/Lightspeed`
- Authoritative branch: `integration/hobby-corner-consolidation@f50c3309824986633c3ba37a95e6eb43aae15a3c` (verified 2026-10-29)
- Merged PR: #24 — `feature/core-ops-ui-consistency-nav-20261028` (GitHub verified MERGED 2026-10-29)
- Current commit: `69cc608e1bb89f5eb8715cf1b45d9faa5de1d2d7`
- Superseded PRs / branches: PR #21 and PR #23 — no remaining unique valid functionality; eligible to close as superseded

## Implemented

- Shared Hobby Corner core-operations navigation across Special Orders, Ordering, Preorders and GW Preorders.
- Original Hobby Corner wordmark, current-page state, responsive More menu and navy/gray-blue hierarchy.
- Current consolidated Timeclock-backed employee PIN/header authentication preserved on all four pages.
- Existing Special Orders, Ordering, receiving, notification/delivery queue, Preorders and GW workflow client code preserved.
- PR #27 shared UI reconciliation foundation preserved unchanged.

## Tested

- Automated: Core Operations UI run `40739200019` PASS; Scanner integration regression `40739200256` PASS; Shared UI reconciliation `40739199988` PASS.
- Browser / employee acceptance: headless Chromium layout/focus/open-menu smoke PASS; live store-browser checks also passed for native zoom, valid PIN, invalid PIN rejection, buttons/navigation, session restoration after refresh, and persistent sign-out.
- Runtime / deployment verification: source PR #24 merged; Railway lightspeed-api/timeclock/special-orders-test currently track integration branch and their latest deployment statuses are SUCCESS. Exact deployed SHA not independently confirmed.

Automated auth/session coverage includes invalid PIN fail-closed, valid PIN session creation, sign-out, expiry, restoration, denied/deactivated employee clearing and server-side reauthorization.

## Deployed

- Environment: Railway application services follow consolidated integration branch
- Service / extension version: no Chrome extension package/release asserted
- Deployment reference: latest Railway service status SUCCESS; precise deployed commit not verified
- Production status: PR #24 source merged; verify any deployment-specific regressions separately

## Shared dependencies

- Timeclock-backed employee identity / authorization
- `shared-ui/hc.css`
- merged PR #27 shared UI foundation
- Special Orders / Ordering / Preorders / GW backend and client contracts

## Shared files / integration surfaces affected

- `special-orders.html`
- `ordering.html`
- `preorders.html`
- `gw-preorders.html`
- `shared-ui/core-ops-compat.css`
- `shared-ui/assets/hc-wordmark.webp`
- `server.js` static wordmark route
- core operations tests/workflow only

No feature client JS, Lightspeed API route, request payload, permission gate or write path is changed.

## Remaining blockers

- No outstanding merge decision for PR #24 (already merged). Full workflow/runtime acceptance remains an ongoing QA activity.
- Session expiry and deactivated-employee behavior remain covered by automated auth/session tests; current business policy has no per-employee edit/create restriction in these tools, so permission-denied employee acceptance is not applicable to this PR.

## Decisions needed

- PR #24 was merged. Do not attempt another merge. Continue feature acceptance against the consolidated base.
- PR #21 and PR #23 can be closed as superseded; do not merge them independently.

## Recommended next action

- Test remaining Core Operations workflows on the consolidated branch; adopt the shared auth/permissions contract for future new API clients, without changing current all-employee edit/create behavior.

## Restrictions / safety

- Do not independently deploy production.
- Do not modify or package the Chrome extension as part of this PR.
- No Lightspeed writes were executed during this reconciliation.

## Documentation

- `HOBBY_CORNER_PROJECT.md` updated 2026-10-28.
- `CHANGELOG.md` updated 2026-10-28.
- PR #24 description updated with live acceptance and final CI.
- Final layout-only commit `69cc608e1bb89f5eb8715cf1b45d9faa5de1d2d7`; Core Operations run `40742593872` PASS.

## Planned shared Invoice Reconciliation dependency — 2026-10-29

- Future supplier invoice emails/PDF attachments and tracking/preorder notices feed a shared invoice-PO staging process documented in `FEATURE_INVOICE_RECONCILIATION.md`.
- Special Orders/Ordering should display verified invoice-to-PO and shipment links, preserve existing allocations/notifications, and not mark stock RECEIVED or customer orders READY based on invoice or tracking alone.
- Product Manager's global Invoice Updates dropdown and Scanner supplier SKU/cost proposals are separate feature surfaces. Shared backend owns PO mutation after complete invoice approval; no independent raw PO writer should be added to existing Special Orders screens.
- **Planned only**; no change to merged Core Operations PR #24 or current deployed routes.

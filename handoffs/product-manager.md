# Product Manager — Current Handoff

**Last verified:** 2026-10-28  
**Status:** Testing

## Source
- Repository: Tawgod/Lightspeed
- Authoritative branch: integration/hobby-corner-consolidation
- Current PR: #28 (feature/product-manager-current-base-20261028), not merged
- Current commit: ce12016564fd8580fdf4eb46591acebe4b74059f (browser acceptance workflow added)
- Superseded PR: #18 (safe to close; all unique Product Manager files preserved)

## Implemented
- Reused merged shared-ui/hc.css; no duplicate component library.
- Replaced fallback text header with original approved logo from current consolidated shared-ui/assets/hc-wordmark.webp.
- Retained core navigation links and read-only Product Manager demo, with current-page selection.
- Fixed multi-field stage bug: name, price, online status captured and staged before a single UI rerender.
- Local change review, individual undo, inactive filter, search, reset and validation retained.
- New automated Chromium browser acceptance script and CI workflow steps.
- Source-of-truth unchanged: no product API request, no live create/update/delete.

## Tested
- Prior Node CI SUCCESS: Actions run 40748939537 on commit 0d802cced7760189956fd132bcac4e3c3d9752f0.
- New head CI: **PASS**, GitHub Actions run 40749046354 (all jobs/steps successful). Workflow installs Chromium then exercises search/filter/empty, editing drafts/review/undo, input errors, keyboard Enter selection and responsive layout.
- Zoom: scripted CSS visual zoom at 100/125/200%; **not native Chrome browser zoom**. Native browser zoom/manual employee acceptance still required.
- Loading state: standalone demo performs no async read requests; live loading/error/auth flows not implemented and therefore cannot be accepted.
- No Railway or live Lightspeed runtime verification performed during incident.

## Deployed
- Environment: none
- Service / extension version: not applicable
- Deployment reference: none
- Production status: unchanged

## Shared dependencies
- Current merged PR #27 shared UI foundation and PR #24 core nav.
- Timeclock-backed authorization/session for later read APIs (server-side fail closed).
- Scanner and Special Orders product matcher/create-review flow to be reused, not duplicated.
- Shared logo asset must be served from approved route in any eventual hosted Product Manager page.

## Shared files / integration surfaces affected
- Product Manager HTML, JS, UI regression test, browser acceptance script, GitHub Actions workflow.
- No shared CSS, extension, server, or Railway files changed.

## Remaining blockers
- Latest CI head run 40749046354 passed; browser in real employee environment and native zoom still needed.
- Native Chrome 100/125/200% zoom plus keyboard and screen-reader employee acceptance.
- Hosted route and original logo actual HTTP asset serving; current app standalone demo.
- Real employee authentication and read-only API integration.
- Implement explicit loading/async failure states when connected to backend.

## Decisions needed
- Acceptance of this as an isolated demo candidate only; no live API deployment.

## Recommended next action
- Complete latest CI, then independent native Chrome acceptance; keep PR #28 draft until accepted.

## Restrictions / safety
- No Railway deployment, consolidation merge or Chrome extension packaging during incident.
- No Lightspeed writes. Any future write flow requires employee authorization, diff preview, explicit approval, idempotency and readback.

## Documentation
- product-manager/SHARED_UI_ADOPTION.md; project handoff in Tawgod/Hobby-Corner:main/handoffs/product-manager.md

## Timeclock authentication and profiles update — 2026-10-28
- Implementation branch remains PR #28; modules `product-manager/profiles-api.js` and `profiles-api.test.js` added.
- Reuse existing /api/staff-auth/session (Timeclock authoritative PIN and staff sessions); no second PIN table or auth service.
- Browser PIN entry and sign-out controls implemented; session held in tab memory only; employee revocation/expiration clears state.
- Profile storage contract: PostgreSQL table `product_manager_profiles` keyed on authenticated employee_id and slot (Default/Profile 1/Profile 2/Profile 3), server-side permission check per request, bounds-check schema and parameterized writes.
- Security restriction: profile router is **NOT mounted**, table initializer is **NOT invoked** on Railway; no production database or API change. This is integration-ready code awaiting isolated acceptance/deployment approval.
- Current grid does not yet implement drag-order and per-column width customization: Save Layout stores a baseline configuration, not real employee modifications. Do not call per-employee customization complete until UI controls actually bind to configuration.
- Existing read-only product safeguards preserved. Demo data visible signed out, but no live product API exists.
- CI failure on first auth commit run 40749755479 (missing Express dependency during tests; obsolete no-network assertion) was diagnosed; test setup/assertion corrected; **PASS** GitHub Actions run 40749886006 (Node validation/profile tests and Chromium browser acceptance).

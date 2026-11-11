# Timcorp Web Foundation Integration — Current Handoff

**System / feature:** Hobby Corner → Timcorp Productions shared web foundation  
**Last verified:** 2026-11-11  
**Status:** In Development / Testing — code prepared; gateway staging verification blocked on central path/config access.  
**Implemented:** Yes, on non-production branches.  
**Tested:** Focused helper/local and source-readback checks complete; exact branch CI pending/being observed.  
**Deployed:** No.

## Repository / branches

- Main web/API: `Tawgod/Lightspeed:feature/timcorp-base-path-hobby-corner-20261111`
- Base: `integration/hobby-corner-consolidation@014a7a949fe570b756b48d8f59995c1b0a434859`
- Store Map: `Tawgod/Lightspeed:feature/timcorp-base-path-store-map-20261111`
- Store Map base: `store-map-production@c7e76b8cad6f6c740d5bc3d9c3c96a7f36ae0475`
- PRs: intentionally not opened yet to avoid unrelated existing PR-triggered CI before path confirmation.

## Implemented

- Configurable, validated `HC_PUBLIC_BASE_PATH` for main Hobby Corner web/API service.
- Optional `HC_PUBLIC_LANDING_PATH` for prefixed landing requests only.
- Existing root Railway paths remain supported.
- Server-rendered base URL for Core Operations/Avery HTML.
- Base-path-safe navigation, assets, staff-auth API, Special Orders/Ordering/Preorders/GW APIs and Order Split test harness.
- Removed hardcoded Special Orders Railway URL from extension-download page.
- Store Map supports configured prefix while preserving root and health endpoints.
- No session/cookie model changes; current bearer/sessionStorage employee session preserved.
- No WebSocket/SSE changes because none were found.

## Proposed public contract

- `/hobby-corner/*` → `special-orders-test`
- `/hobby-corner/labels/*` → `lightspeed-api`
- `/hobby-corner/store-map/*` → `store-map`

Longest-prefix routing required.

## Testing

- Local Node helper tests: PASS.
- Store Map helper tests: PASS.
- GitHub source read-back/static URL scan: PASS for converted current entry files.
- Focused branch-only workflows added with no dependency installation or browser/database suite.
- No real Timcorp gateway/browser acceptance yet.

## Actual deployment state

- Existing Railway production URLs unchanged.
- No Timcorp DNS/gateway configuration changed.
- No new Railway variables set.
- No deployment triggered.
- Timeclock's unrelated staged Railway source patch remains untouched.

## Dependencies / conflicts

- PR #35 hierarchical navigation overlaps Core Operations HTML/server/staff-auth.
- PR #59 Timeclock security staging; do not overwrite.
- PR #61 shared security/exact permission work remains authoritative.
- Chrome extension URL switch must be a later coordinated release item.
- Timcorp central path/gateway config is not available through current connected sources.

## Blockers

- Confirm actual central path assignment; `/hobby-corner` is proposed, not independently verified.
- Non-production gateway/proxy acceptance.
- Reconcile active navigation/security branches before merge.
- Real employee/browser tests through the gateway.

## Recommended next action

Confirm the Timcorp gateway path contract. Then reconcile this branch with PR #35/#61 as needed and perform staging-only proxy/browser acceptance using the documented variables. Do not open the production-connected merge/deploy gate until those tests pass.

## Safety restrictions

Do not change central DNS/gateway, production Railway variables, production deployment, credentials, databases, employee/customer data, Lightspeed records or Chrome release state without explicit approval.

## Documentation

- `TIMCORP_WEB_FOUNDATION_INTEGRATION.md`
- `Tawgod/Lightspeed:feature/timcorp-base-path-hobby-corner-20261111/docs/TIMCORP_WEB_FOUNDATION.md`

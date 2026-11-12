# Shared Web Foundation — Current Handoff

**Last verified:** 2026-11-12  
**Status:** Testing (automated); not deployed

## Verified cross-tool Railway deployment inventory — 2026-11-12 (read-only)

These are actual **deployed** versions, not latest branch heads; all inspected services were left untouched.

| Tool/service | Railway project/env | Running deployment source | Proposed foundation route | Readiness |
| --- | --- | --- | --- | --- |
| Store Operations/Special Orders/Ordering/Preorders/GW | `Hobby Corner/production`, `special-orders-test` | `Tawgod/Lightspeed:integration/hobby-corner-consolidation@014a7a9`, deployed Nov 4 | Configurable parent `/hobby-corner/*` (or gateway-approved variant) | Combined PR #63 **CI PASS**, not deployed |
| Labels/Toolkit API | `Hobby Corner/production`, `lightspeed-api` | Same `integration/hobby-corner-consolidation@014a7a9`, deployed Nov 4 | Proposed `/hobby-corner/labels/*` (or gateway-approved variant) | Existing Timcorp basepath branch prepared, real deployment/proxy acceptance pending |
| Store Map | `Hobby Corner/production`, `store-map` | `store-map-production@c7e76b8`, deployed Nov 4 | Proposed `/hobby-corner/store-map/*` (or gateway-approved variant) | Separate `feature/timcorp-base-path-store-map-20261111` branch prepared; not deployed |
| Timeclock | `Hobby Corner/production`, `timeclock` | Last **actual deployment** `integration/hobby-corner-consolidation@014a7a9` on Nov 4; Railway service source setting has a newer `feature/owner-timeclock-scoped-credential-20261110` pin | No public Timeclock gateway route in phase 1; backend-to-backend continues | **Source setting differs from deployed commit**; do not assume new scoped credential code is live |
| Discord bot | `Hobby Corner/production`, `Hobby-Corner-Discord-Bot` | `Tawgod/Hobby-Corner-Discord-Bot:main@7c3af0e`, deployed Oct 27 | Not a public web route | Current bot lacks historical Special Orders delivery/GW endpoints; no machine grant based on legacy variables |
| Consignment beta | `Hobby Corner Integration Test/test`, `consignment-beta` | `feature/consignment-layout-foundation`, deployed Oct 27 | Remains external Store Tools link | Separate service, not verified for Timcorp prefix; do not silently route |
| Admin navigation bridge | `Hobby Corner Integration Test/test`, `admin-nav-bridge-test` | `staged-create`, **no deployment** | Not a standalone public gateway destination | Stage-only patch awaiting approval, synthetic read-only grant not equivalent to live Owner |

**Staging caution:** The Railway Hobby Corner production environment also has a staged patch; a staged configuration does not establish deployment. Do not accept/apply staged changes wholesale because they may belong to other development channels. Chrome Toolkit/Scanner source requires release-queue coordination before any version/package/distribution changes.

**Route precedence proposal:** The two separately hosted longest prefixes (Store Map, Labels) must win before the Store Operations catch-all. The current central gateway `/HobbyCorner/` fallback is planned/503; neither these routes nor the requested `/hobby-corner/` aliases are live integrations. No new central routing was configured.

---

## Latest combined foundation milestone — 2026-11-12

**System / feature:** Shared Store Operations web foundation + default-deny employee/service security. **Status:** Testing (automated CI PASS); not staged, not deployed, not released.

- **Authoritative combined review candidate:** `Tawgod/Lightspeed:feature/shared-foundation-security-web-20261112`, [draft PR #63](https://github.com/Tawgod/Lightspeed/pull/63) against `integration/security-all-tools-20261111` (security draft PR #61). Tested head `63f13787ed4451b20bddd304f595d2af6fdaff56`.
- **Source components preserved:** nav/Timcorp [draft PR #62](https://github.com/Tawgod/Lightspeed/pull/62) (based on navigation PR #35) and security PR #61. No parent source branch was overwritten or merged.
- **Implementation:** Ported shared UI/dashboard, six prefixed HTML routes, API/Timeclock/permission-aware navigation, Order Split, Admin read-only helper and tests onto the security source without replacing guarded Special Orders status, verified audit actor, Discord delivery lease, GW reaction or GW submission SQL atomicity. Added the count-only `GET /priority-review` to actual Special Orders router, registered it as **pending** `special-orders.read` in the now 88-entry route inventory and tracked the new browser call. Security middleware remains **unmounted**, employee/machine grants unchanged.
- **Automated CI PASS on latest combined head:** [security policy 43256005235](https://github.com/Tawgod/Lightspeed/actions/runs/43256005235), [combined source contract 43256005415](https://github.com/Tawgod/Lightspeed/actions/runs/43256005415), [Core Operations Chromium/browser 43256005508](https://github.com/Tawgod/Lightspeed/actions/runs/43256005508), [Shared UI reconciliation 43256005397](https://github.com/Tawgod/Lightspeed/actions/runs/43256005397), [Scanner regression 43256005287](https://github.com/Tawgod/Lightspeed/actions/runs/43256005287). One initial test-only omission (the Admin navigation read-only SQL review file) was corrected by `63f13787...`; all five runs on corrected head **SUCCESS**.
- **Prior real PostgreSQL acceptance:** 13/13 passing on security branch for guarded statuses, notification atomicity/lease and GW operations. The combined branch has not been rerun against disposable PostgreSQL; source test green does not substitute for that acceptance.
- **Central route discrepancy:** requested `timcorp-productions.com/hobby-corner` vs current central `Tawgod/timcorp-projects-foundation` documented `timcorp-projects.com/HobbyCorner` (gateway currently 503 for Hobby Corner). Base-path code supports both variants, but real route/domain needs user/gateway-owner reconciliation. No DNS, gateway, environment variables or domain attachment was changed by this work.
- **Next:** One disposable Codespaces PostgreSQL regression run on combined branch, non-production prefixed HTTP/Playwright + employee denial/permission acceptance, exact staging authorization and service caller commissioning. No production deploy or Chrome release until explicit approval.

---


## Source

- Repository: `Tawgod/Lightspeed`
- Authoritative web-only composition branch: `feature/timcorp-unified-nav-integration-20261112` (superseded as staging integration by combined PR #63)
- Web-only draft PR: [#62](https://github.com/Tawgod/Lightspeed/pull/62), stacked against `feature/unified-hierarchical-navigation-20261109` (PR #35).
- Web-only tested commit: `de61f882ca8591253dc37dfa3c92c032b4bd372b`; combined candidate is described above
- Other coordinated branches: `feature/timcorp-base-path-hobby-corner-20261111` (existing base-path source), `feature/timcorp-base-path-store-map-20261111`, `integration/security-all-tools-20261111` (draft PR #61), `feature/unified-hierarchical-navigation-20261109` (PR #35).
- No merge or production deployment.

## Implemented

- Composed already-developed hierarchical Store Operations shell and Timcorp base-path support, rather than creating duplicate systems.
- Preserves Home dashboard / Priority Review, Special Orders > Preorders > GW Preorders, Purchasing/Ordering nested under Special Orders, Store Tools and conditional same-origin `admin.read` link.
- Validated optional `HC_PUBLIC_BASE_PATH` middleware accepts prefixed and existing root URLs, and optional `HC_PUBLIC_LANDING_PATH` redirects the prefixed root.
- Six public HTML entrypoints inject a validated base href; static links/assets, four Store Operations browser clients, shared signed PIN session endpoints, Admin read check, dashboard API fetches and Order Split harness resolve under that base.
- Existing Railway root URLs and separate deployment remain supported; external Consignment / Toolkit links remain on their independent origins pending their gateway work.
- Browser `about:blank` test documents use safe root URL fallback rather than crashing; VM-based legacy session tests still work.
- No new machine identity, employee grant, Owner account or authentication bypass is created.

## Tested

- **Automated:** All six PR #62 commit `de61f882...` GitHub workflows SUCCESS on November 12: Timcorp and unified navigation integration smoke `43253361828`, Unified hierarchical navigation `43253361992`, Shared UI reconciliation `43253361964`, Scanner integration regression `43253361785`, Core Operations UI navigation including Chromium keyboard/layout, dashboard/login/sign-out browser smoke `43253361791`, and Navigation Admin permission contract `43253361824`.
- Standalone Timcorp basepath and Store Map branches were also tested previously; these are separate and are not claims of merged/runtime deployment.
- **Browser / employee acceptance:** Synthetic Playwright smoke passed; real signed employee/station/passkey/permission testing under a gateway and real database is outstanding.
- **Runtime / deployment verification:** No composed branch deployment; no end-to-end same-origin reverse-proxy test. Railway existing source was only inspected read-only.

## Deployed

- Environment: None for PR #62.
- Service / version: No change.
- Deployment reference: None.
- Production status: Existing Railway services unchanged.

## Shared dependencies

- Navigation PR #35's independent Admin navigation read-only grant DB, Timeclock signed employee session and staged-not-deployed Admin read-only bridge.
- Security PR #61 default-deny guard remains **unmounted**; real employee/workstation and service grants not commissioned.
- Chrome extension release queue remains authoritative; no extension package/version or publish action made.
- Store Map and labels are separate Railway services; their own path changes must be tested before the gateway routes them.

## Important central gateway discrepancy

- User-requested destination in project instructions: `https://timcorp-productions.com`.
- Current connected GitHub central gateway source: `Tawgod/timcorp-projects-foundation:main` documents `https://timcorp-projects.com` and `/HobbyCorner/` as **planned**, currently **503/not connected**. Railway `Timcorp Productions Homepage` project currently has the gateway service `timcorp-gateway-git-preview` sourced from that repo; `timcorp-projects.com` is its attached custom domain (verify current DNS/TLS separately).
- Our earlier Lightspeed Timcorp proposal planned `/hobby-corner`. The application base path is configurable and can support the central `/HobbyCorner` contract without source changes, but the proposed URL/host/path **must be reconciled by the central gateway owner before settings or routing are changed**.
- We have not changed central DNS, route registry or gateway deployment. Do not claim `/hobby-corner` or `/HobbyCorner` is publicly routed.

## Shared files / integration surfaces

- `server.js`, `services/publicBasePath.js`, `routes/orderSplit.js`, six HTML entrypoints, four browser clients, `shared-ui/staff-auth.js`, `shared-ui/operations-nav.mjs`, `shared-ui/store-operations.mjs`, and focused tests.
- Integration docs: `Tawgod/Lightspeed:feature/timcorp-unified-nav-integration-20261112/docs/SHARED_WEB_FOUNDATION_COMPOSITION.md`.
- Security handoff: `Tawgod/Hobby-Corner:main/handoffs/employee-admin-security.md`.

## Remaining blockers

1. Agree final central host/prefix: `timcorp-productions.com/hobby-corner` vs current gateway `timcorp-projects.com/HobbyCorner`.
2. Reconcile composition PR #62 with navigation PR #35 and security PR #61 without blindly replacing shared `server.js`, clients or staff-auth.
3. Verify full browser/API/auth/redirect/asset sessions through a **non-production gateway**, including denied Admin and worker routes and independent Railway URL compatibility.
4. Commission independent verified employee/service identities and exact grants in an isolated staging environment before opting into Core Operations guard. Real Owner ceremony is separate.
5. Independently test Store Map and labels paths and Chrome extension compatibility; do not bundle a Chrome release with web migration.
6. Approve staging configuration/deployment explicitly. Do not alter existing Railway production service or central DNS during preliminary testing.

## Decisions needed

- Confirm central hostname and route spelling after gateway source-of-truth reconciliation; retain both as pending, do not infer.
- Owner approval for isolated staging deployment and test identities/configuration once the composition/security review has finished. No production approval requested at this stage.

## Recommended next action

- Keep PR #62 draft while preparing isolated staging deployment and the security guard mount plan, then request explicit approval for staging-only work and credentials.
- Use a Codespaces local proxy or disposable test service to verify prefix and root login/API behavior before production change.

## Restrictions / safety

No production deployment, merge, central DNS/gateway configuration, service credential, employee grant, DB migration, Lightspeed mutation, Discord message, or Chrome extension release occurred.

## Documentation

- `docs/SHARED_WEB_FOUNDATION_COMPOSITION.md` on PR #62.
- `docs/TIMCORP_WEB_FOUNDATION.md` on earlier base-path branch.
- `handoffs/employee-admin-security.md` for security verification and remaining staging gates.

# Shared Web Foundation — Current Handoff

**Last verified:** 2026-11-12  
**Status:** Testing (automated); not deployed

## Source

- Repository: `Tawgod/Lightspeed`
- Authoritative composition branch: `feature/timcorp-unified-nav-integration-20261112`
- Current draft PR: [#62](https://github.com/Tawgod/Lightspeed/pull/62), stacked against `feature/unified-hierarchical-navigation-20261109` (PR #35).
- Current tested commit: `de61f882ca8591253dc37dfa3c92c032b4bd372b`
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

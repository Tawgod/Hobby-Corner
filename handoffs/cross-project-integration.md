# Cross-Project Integration — Current Handoff

**Last verified:** 2026-11-09  
**Status:** In Development / Testing — cross-project production rollout not authorized

## Source
- Canonical integration/release contract: `Tawgod/Hobby-Corner:main/HOBBY_CORNER_INTEGRATION_CONTRACT.md`
- Production Lightspeed base: `Tawgod/Lightspeed:integration/hobby-corner-consolidation`
- Shared services Phase 1 / Phase 2: draft PRs #32 / #33 (stacked)
- Employee Administration: draft [PR #34](https://github.com/Tawgod/Lightspeed/pull/34), `feature/employee-admin-security-foundation-20261106` functional integration workflow commit `cc433e396545402b1aa32bb442f8a3f5f2dccc38`
- Web navigation: `feature/unified-hierarchical-navigation-20261109` tested commit `17a35003c7b570f9a810000fd4b6ea77ab8e61cb`
- Navigation coordination: [issue #36](https://github.com/Tawgod/Lightspeed/issues/36)
- Chrome release gate: `CHROME_EXTENSION_RELEASE_QUEUE.md`, `CHROME_EXTENSION_INTEGRATION.md`

## Implemented
- Existing source reconciled across Admin PR #34, unified web navigation branch, shared services PRs #32/#33, Timeclock/Scanner and Railway production/test deployments.
- Admin PR #34: `services/security/adminIntegrationCatalog.js`, optional read-only `GET /api/integrations`, `tests/employee-admin-integrations.test.mjs`, targeted `.github/workflows/employee-admin-integration.yml`. Metadata lists ten tool areas, source owners, intended nested navigation and exact candidate permissions. Every permission adapter explicitly reports `not-integrated`, settings adapter `not-connected`. It creates no privileges and changes no business data.
- Unified navigation branch: current web nav already uses **Special Orders dashboard > Preorders > GW Preorders**, with **Purchasing / Ordering under Special Orders**, plus top-level **Store Tools**. Added conditional `Employee Administration` navigation only after a fresh **same-origin** response from `GET /api/admin/navigation-access` explicitly confirming `authenticated:true`, `allowed:true`, `operation:'admin.read'`. Any failure/absence denies display. Staff sign-in/sign-out emits `hc-staff-auth-changed`, listened to on `window`; sign-out removes Admin immediately; tab visibility resume rechecks server. No browser role/sessionStorage assertion confers admin.
- Navigation test `tests/hierarchical-navigation-admin.test.mjs` covers denied grants/spoofs, intended hierarchy, conditional visibility and revocation. Existing `hierarchical-navigation.test.mjs` Priority Review expectations aligned with the latest read-only operational dashboard. Added targeted `.github/workflows/navigation-admin-contract.yml` job. No parallel navigation registry created.
- Created central contract `HOBBY_CORNER_INTEGRATION_CONTRACT.md`; documented nav owner requirement in issue #36 and maintained draft PR #34.

## Tested
**Admin branch** at `cc433e396545402b1aa32bb442f8a3f5f2dccc38`:
- [Employee Admin integration contract 42673992585](https://github.com/Tawgod/Lightspeed/actions/runs/42673992585) **SUCCESS**.
- [Shared Lightspeed foundation 42673992885](https://github.com/Tawgod/Lightspeed/actions/runs/42673992885) **SUCCESS**.
- Scanner workflow `42673993023` reported failure with no jobs; the prior Admin-branch Scanner run `42673574765` **SUCCESS**. No evidence of an actual Scanner test regression from the no-jobs run. Root cause of intermittent no-job workflow startup is unverified; don't claim fixed GitHub infrastructure.

**Navigation branch** at `17a35003c7b570f9a810000fd4b6ea77ab8e61cb`:
- [Navigation admin permission contract 42674514784](https://github.com/Tawgod/Lightspeed/actions/runs/42674514784) **SUCCESS**.
- [Unified hierarchical navigation 42674514692](https://github.com/Tawgod/Lightspeed/actions/runs/42674514692) **SUCCESS**.
- [Shared UI reconciliation 42674515031](https://github.com/Tawgod/Lightspeed/actions/runs/42674515031) **SUCCESS**.
- [Scanner integration regression 42674514795](https://github.com/Tawgod/Lightspeed/actions/runs/42674514795) **SUCCESS**.
- [Core Operations UI navigation 42674514777](https://github.com/Tawgod/Lightspeed/actions/runs/42674514777) **SUCCESS**.
- Browser/manual staff acceptance for new conditional Admin navigation **not performed**.

## Deployed
- **No new staging or production deployment from this work.**
- Previous Railway verification: production `store-map`, `lightspeed-api`, `special-orders-test`, `timeclock`, `Hobby-Corner-Discord-Bot`, `migration-test-bsi117`, `Hobby-Corner-Rewards`, `Postgres` all online/SUCCESS at check, no warnings/criticals.
- Isolated `staff-security-staging`, `consignment-beta`, `Postgres` online/SUCCESS. Staging admin remains deployment `41a3ee7d-6fb9-4ac1-9f5f-a27120f95256` on earlier commit `21a44f4f06ebaacec3d005344faa89f8907feb46`.
- No Timeclock roster, employee, PIN, grant, Lightspeed record, Chrome extension file/package or production configuration changed.

## Shared dependencies
- **Outstanding backend nav gate:** `GET /api/admin/navigation-access` is not currently mounted on the consolidated Special Orders runtime. Until a trusted server-side `admin.read` resolver is provided, the navigation correctly hides Admin for everyone. This is a *safe incomplete integration*, not a functioning production Admin link.
- Real Owner Timeclock identity has not been securely commissioned; synthetic staging employee 901 is not a production Owner.
- Admin and tool permissions need an independently verified active Timeclock session, exact operation scopes and factor proof, enforced by each destination backend. Client-side nav hiding alone is not authorization.
- Shared services Phase 1/2, Timeclock no-sync roster API and approved onboarding flow require separate review/deployment; tool-specific settings and writes remain unconnected.
- Chrome extension remains governed by the coordinated release queue and has not been packaged or versioned.

## Remaining blockers
- Wire the same-origin `admin.read` nav capability endpoint to vetted staff-session and delegated grants on a tested integration branch. Do not infer permissions from PIN, UI roles or test Owner.
- Complete browser acceptance across real permitted/denied employee sessions, passkey/TOTP Admin step-up and sign-out.
- Coordinate integration of PR #32/#33/#34 and unified-nav source into a release candidate; never wholesale merge overlapping shared files.
- Investigate intermittent GitHub Actions startup failures with zero jobs when feasible; new targeted and full test runs provide green verification but root cause remains unclear.
- Separate approval required before production migrations, tool authorization switch, Chrome extension release or deployment.

## Recommended next action
1. Build a same-origin **read-only admin-navigation access adapter**, verifying the signed Timeclock session and exact `admin.read`, behind an opt-in integration gate with default deny.
2. Wire vetted Timeclock no-sync directory service and real Owner commissioning in isolated staging, with separate Admin grant migration and browser tests.
3. Perform branch integration review and staged release testing before any real employee or Lightspeed permission write.

## Restrictions and documentation
No merge, production write, staging deployment or extension release was authorized/performed in this pass. Project specifications: `HOBBY_CORNER_INTEGRATION_CONTRACT.md`, `HOBBY_CORNER_PROJECT.md`, `handoffs/employee-admin-security.md`, `CHROME_EXTENSION_RELEASE_QUEUE.md`.

## Same-origin employee Admin navigation authorization adapter — 2026-11-09

**Status: In Development / CI-tested / not deployed.** Implemented the missing navigation-to-backend boundary on `Tawgod/Lightspeed:feature/unified-hierarchical-navigation-20261109`, tested at functional/workflow commit `bf920731d4eb4264ae2dfe286f75a49d94d81c4f`.

- `shared-ui/operations-nav.mjs`: `canShowAdminNavigation` now requires the existing `HCStaffAuth` signed-session object and sends its bearer token to same-origin `GET /api/admin/navigation-access` using `cache:no-store`, `credentials:omit`, and `redirect:error`. No employee ID, local role or stored permission is accepted. Failure removes Admin nav.
- `services/security/adminNavigationAccess.js`: server router checks for bearer session via injected `staffAuth.verifyEmployee`, verified live Timeclock identity through its established scanner authorization adapter, exact `admin.read` via an injected grant reader, and rejects missing/spoofed/expired or inactive identity. No factor is requested just to show a link; opening Admin continues to require independent verified passkey/TOTP.
- Same module has a read-only PostgreSQL adapter that queries the exact existing Admin principal+grant schema: independently commissioned active Owner or active delegated administrator with explicit `hc_admin_grants.operation='admin.read'`. Errors/missing DB schema fail closed; no auto-owner, migration, PIN, token or account write.
- `server.js`: mounts only inside the already enabled signed staff-auth gateway, only when new `HC_ADMIN_NAV_ENABLED=true` and an explicitly configured `HC_ADMIN_GRANTS_DATABASE_URL` exist. No fallback to production special-orders `DATABASE_URL` and no migration/role creation. Dedicated DB pool with bounded timeouts; disabled by default.
- Tests `tests/admin-navigation-access.test.mjs`, extended `tests/hierarchical-navigation-admin.test.mjs`, and updated workflows exercise no-sign-in, forged roles, missing/incorrect grant, unrecognized employee, missing table, exact query, no mutations, and trusted bearer transmission. A CI-only Express dependency omission in navigation workflow was corrected before success.
- GitHub Actions at `bf920731d4eb4264ae2dfe286f75a49d94d81c4f`: **Navigation Admin permission contract `42676576983` SUCCESS**, **Unified hierarchical navigation `42676576965` SUCCESS**, **Scanner integration `42676576966` SUCCESS**, **Shared UI reconciliation `42676576982` SUCCESS**. Core Operations workflow `42676577042` was still running at the last query.
- No staging or production rollout, migrations, real Owner commissioning or employee permission writes. This bridge remains disabled until the actual source-owned Admin database is deployed and the Owner and manager grants are independently commissioned. The synthetic staging employee 901 must never serve as the production authorization authority.

**Next:** complete separate source/db security review, commission real Owner identity through an approved passkey ceremony, stage a dedicated Admin grants DB and enable this read-only hint only in isolated integration testing, verify real-browser authorized/ungranted/revoked employee transitions, and only then consider production rollout with separate authorization. Note that the current Timeclock scanner `authorize` endpoint can impose tool-specific requirements; test manager without Scanner privileges before treating the shared staff gateway as universally usable.

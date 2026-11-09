# Employee Administration & Central Tool Settings — Current Handoff

**Last verified:** 2026-11-06  
**Status:** In Development (read-only foundation), Testing (automated); no admin production or staging deployment

## Source

- Repository: `Tawgod/Lightspeed`
- Development branch: `feature/employee-admin-security-foundation-20261106`
- Current PR: [#34 — employee administration foundation](https://github.com/Tawgod/Lightspeed/pull/34), **DRAFT**, stacked on Phase 1 PR #32
- Final development/docs head at verification: `bece86f8c05bee0da423582e4e82122195697512`
- Current runtime source for unrelated isolated security testing: `Tawgod/Lightspeed:feature/shared-lightspeed-services-phase1-20261029`, `staff-security-staging` on Railway (independent; PR #34 NOT deployed)
- Authoritative consolidated production base: `Tawgod/Lightspeed:integration/hobby-corner-consolidation`. Not modified by PR #34.
- Superseded branches/PRs: none; preserve dependency on PRs #32/#33 and extension release queue.

## Requirements

Single protected administration menu for **all configurable settings from current and future Hobby Corner tools**, as well as employees, Timeclock information and settings not exclusively owned by Lightspeed, individually scoped tool/item-create permissions, local/remote login windows, PIN management/recovery and a verified-store-computer installation/download link.

Entry to admin must require independently verified enrolled **passkey OR Authenticator**, even on trusted store devices, plus active employee identity and exact administrator grant. Sensitive changes require fresh stronger cryptographic proof. Central menu must never invent a working setting merely because its category appears in the UI.

## Implemented

- Server-only fail-closed admin authorization gate in `services/security/employeeAdminAccess.js`; blocks PIN-only or device-only admission, checks active employee session, factor freshness/binding via trusted injected verifiers and exact permission.
- Source-owned central tool setting registry in `services/security/adminSettingsRegistry.js`. Supports Security, Employees, Timeclock, Tool Permissions and Tool Settings. Actual values are unconnected; some candidates marked planned or requiring audit.
- Read-only `routes/employeeAdmin.js` APIs (overview, registry listing, registry detail), with strong admin gate, no-store, strict static-page CSP and **no write endpoints**. **Not mounted anywhere in a runtime service.**
- Responsive inert UI `admin/employee-admin.{html,css}`, `admin/employee-admin-client.js`, requiring a future trusted browser admin factor injector; browser without one cannot load protected data. No raw credentials or secrets stored.
- Local versus remote idle/absolute timeout validator and change preview in `services/security/adminSessionPolicy.js`; default 900 seconds each, matching currently tested 15-minute base session; no live policy changes.
- Unapplied, additive `db/hc_admin_session_policies.sql` and `services/security/adminSessionPolicyPostgres.js`: durable policy version guard, explicit fresh strong admin authorization, audited changes and append-only event history. **Not wired into Timeclock/scanner session minting or validated live.**
- `docs/EMPLOYEE_ADMIN_FOUNDATION.md` and branch `CHANGELOG.md` added for integration and release restrictions.

## Tested

- Automated: GitHub Actions [Shared Lightspeed foundation run 42275711630](https://github.com/Tawgod/Lightspeed/actions/runs/42275711630) **SUCCESS** at source/CI commit `cf6689f610c3825306115ae4287cddd6326cbfef`. Tests `tests/employee-admin-access.test.mjs`, `employee-admin-router.test.mjs`, `employee-admin-client.test.mjs`, `employee-admin-session-policy.test.mjs`, `employee-admin-session-policy-postgres.test.mjs`. Disposable PostgreSQL confirmed audited policy writes, expected-version conflict detection and immutable history.
- Browser / employee acceptance: **not started** for new admin panel. Existing independent security staging Owner's passkey and Google Authenticator tests cannot be treated as admin-shell acceptance.
- Runtime / deployment verification: **not applicable** because no service deployment performed.

## Deployed

- Environment: none for admin panel
- Service / extension version: none
- Deployment reference: none for this feature
- Production status: **not deployed**, no production data or authentication policy modified

## Shared dependencies

- Shared Timeclock employee/PIN identity + signed active employee session; independent verified MFA/passkey.
- Shared Lightspeed authorization and audited gateway; per-tool permission contracts.
- Core Operations/Timeclock employee roster, time records, PTO, shifts and existing audited PIN management APIs.
- Shared UI/UX and Deployment Coordination for responsive admin tool and trust boundary.
- Chrome extension queue and authoritative consolidated source for any verified workstation installer/provisioning.
- Hobby Corner Manager for policy/default values, manager roles and rollout decisions.

## Shared files / integration surfaces affected

New development-only `services/security/adminSettingsRegistry.js`, `employeeAdminAccess.js`, `adminSessionPolicy.js`, `adminSessionPolicyPostgres.js`, `routes/employeeAdmin.js`, `admin/employee-admin.{html,css}`, `admin/employee-admin-client.js`, `db/hc_admin_session_policies.sql`, `tests/employee-admin-*.test.mjs`, and Phase 1 branch-derived foundation workflow. No modifications to current production `server.js`, Timeclock, Chrome extension source or Railway deployment.

## Remaining blockers

- Actual trusted admin login integration: passkey/WebAuthn or enrolled TOTP verified for same signed employee session, plus backend owner/manager grants; no safe production admin bootstrap shortcut.
- Backend owner-approved permissions and audit for PIN/security changes, device management, policy edits and employee data reads; existing Timeclock legacy routes must be hardened without breaking clocking.
- Actual server enforcement for configurable session idle/absolute duration, secure revocation, active-session migration, and local workstation proof.
- Genuine tool-specific configurable settings inventory/validators; registry candidates do not confirm exposed values.
- Verified installer/update link and approved unique per-computer key enrollment, requiring Chrome release queue coordination.
- End-to-end security review, browser tests, rollback and owner production authorization before exposure.

## Decisions needed

- Initial approved local/remote idle and absolute session windows (examples in spec are NOT live).
- Owner-only versus delegated manager control for PIN reset, permissions, session policies and device approval; recovery/dual control.
- Exact employee data allowed in admin versus Lightspeed and payroll-owned sources.
- Official signed extension/installer distribution method and device approval workflow.

## Recommended next action

1. Obtain/implement real vetted owner/manager admin authorization and independent factor proof adapter, then stage a **read-only** panel behind those gates.
2. Connect permitted Timeclock roster/status reads and relevant existing settings with safe source ownership.
3. Integrate policy enforcement and revocation in separate controlled staging, run concurrent and timeout acceptance before enabling edits.
4. Integrate PIN/permission/device management with fresh strong factor, exact operation grants, audit and readback; reconcile Chrome release queue before any package.
5. Obtain store-browser acceptance and explicit deployment approval.

## Restrictions / safety

Do not edit production employee PINs, privileged grants, Lightspeed records, Timeclock routes or Chrome source; don't deploy or merge PR #34 without separate review. Do not present future controls or settings registry entries as working configuration. No production-side policy migration or extensions authorized by this handoff.

## Documentation

- `Tawgod/Hobby-Corner:main/EMPLOYEE_ADMIN_SECURITY_PANEL.md`
- `Tawgod/Hobby-Corner:main/HOBBY_CORNER_PROJECT.md`
- `Tawgod/Hobby-Corner:main/SHARED_STAFF_AUTH_PERMISSIONS.md`
- `Tawgod/Hobby-Corner:main/STAFF_SECURITY_BASELINE.md`
- `Tawgod/Hobby-Corner:main/CHROME_EXTENSION_RELEASE_QUEUE.md`
- `Tawgod/Hobby-Corner:main/handoffs/lightspeed-shared-services.md`
- `Tawgod/Lightspeed:feature/employee-admin-security-foundation-20261106/docs/EMPLOYEE_ADMIN_FOUNDATION.md`

## Owner and delegated manager permissions — 2026-11-06

**Status: In Development; implemented and CI-tested on draft PR #34, no production or staging deployment.**

Owner requirement: Owner must be visible as `Owner` (after real Timeclock identity verified/commissioned). Owner can independently grant/revoke admin-panel access and specific management actions per employee. Delegated managers may be authorized to onboard new employees and modify selected tool settings or per-employee tool permissions **without access to private staff records** or general employee data. Not every manager is an admin; no implicit rights from workstation, role label or PIN.

**Code implemented:** `services/security/adminPermissionCatalog.js` exact admin/tool operation registry; `db/hc_admin_delegations.sql` durable non-auto-provisioned Owner/delegated principals, explicit grants, scoped allowed tool operations and setting IDs, individual employee tool grants, immutable audit history; `services/security/adminDelegationsPostgres.js` active-Timeclock-target validation, Owner-only strong-factor admin delegation and scopes, manager-only scoped tool rights, self/Owner modification denial, revocation; `services/security/adminOwnerCommissioning.js` unmounted one-time owner commission requiring explicitly configured expected real Timeclock employee ID and independently verified dedicated Owner passkey ceremony. No account was actually commissioned. `routes/employeeAdmin.js` protected management APIs under injection and restricted metadata to manager; admin UI now displays `Owner` or `Delegated administrator` from trusted server role and includes scope-dependent permission forms.

**Tests:** Real disposable PostgreSQL delegation regression `tests/employee-admin-delegations-postgres.test.mjs` checks no ungranted admin, restricted manager onboarding capability, disallowed private Timeclock/PIN/role actions, tool-operation and settings scope enforcement, invalid inactive/unverified employee targets, Owner/self denial, fresh strong factor on permission writes, revocation and immutable audit. HTTP regression `tests/employee-admin-delegated-router.test.mjs` verifies sections/settings are filtered and admin escalation denied. `tests/employee-admin-owner-commissioning.test.mjs` checks configured employee identity, dedicated passkey purpose, no TOTP-only claim and no second Owner. GitHub Actions **Shared Lightspeed foundation workflow `42284308898` SUCCESS** for Phase-1-stacked PR #34 at commit `4e31d2af289a0bc4b483ea56fed9c5769da988e3`. Later commits were documentation only.

**Remaining:** Real Owner Timeclock ID and passkey commissioning is not configured; `admin.read`/tool/setting admin grants are not applied to any actual employee; actual Timeclock employee signup and private roster adapters are not built; tool-settings editors and production enforcement are still unconnected; no admin route mounted or released. Current synthetic 901 Owner exists only in disposable tests and prior isolated security test account, not proof of production Owner assignment. No live PIN, Timeclock, Lightspeed, tool permission, Chrome extension or Railway change occurred.

**Next:** Verify actual Owner's Timeclock identity and stronger credential through an approved commissioning process, then mount a **read-only admin interface in isolated staging** using real verified permissions, add minimal employee search/picker and a protected employee-onboarding workflow (not general private data browse), and connect per-tool setting validators and permissions enforcement one tool at a time after owner authorization.

## Isolated read-only admin sign-in candidate — 2026-11-06

**Status:** In Development; coded and automated tests PASS; **not staged or deployed to Railway**.

- Development branch `Tawgod/Lightspeed:feature/employee-admin-security-foundation-20261106`, draft PR #34, currently at `160fc84e4c2d2478a706222282941def71e5bdce` (documentation-only change after tested commit). Underlying app source tested by Shared Lightspeed foundation GitHub Actions `42293979612` **SUCCESS**, including browser and HTTP behavior.
- Built `staging/isolated-admin-readonly.js` reusing **real existing isolated** signed base employee session, passkey verifier, and enrolled TOTP verifier. Only synthetic test employee 901 may read admin/setting metadata after independent proof; no actual Owner identity is commissioned and no live employee privileges are granted. Test-only synthetic Owner screen label does not imply a production Owner. Server checks base identity, factor freshness and purpose, bound signed proof, exact read operation, and optional same-origin/cross-site checks.
- `staging/isolated-test-login.js` enables the route **only with the explicit new `HC_STAGING_ADMIN_READONLY_ENABLED=true` flag**, and only if existing isolated passkey and TOTP enrollment services are enabled. Flag is absent/off in current deployment; no new public route yet. `staging/isolated-owner-enrollment.js` exports a server-only TOTP proof verifier. Browser `staging/isolated-admin-auth-client.js` allows synthetic PIN + Google Authenticator OR passkey; ephemeral proof stored only in memory, no storage, sign-out/page-hide clearing. `admin/employee-admin.html` and client support new sign-in controls, owner-capability read-only rendering, and denied-access feedback.
- No admin delegation, PIN edit, tool settings edit, employee roster, audit writing or provisioning endpoints are mounted in the isolated preview: `createEmployeeAdminRouter` uses a **read-only capability resolver** instead of the delegated-write adapter. Direct attempt to POST grant endpoint fails 404. Verified HTTP tests cover PIN-only, forged role, cross-origin, no-write and valid MFA/passkey read access.
- **Railway verified unchanged:** project `Hobby Corner Integration Test`, environment `test`, `staff-security-staging` deployment `c0f9ccb3-e076-4ce4-8b4d-62ffd0416a04` **SUCCESS**, deployed source `d2a90b49e0f58104f17391c1f67623c256950326`; no staged changes pending. This new admin preview has **NOT** been deployed.
- **Next:** owner approval of safe isolated-only PR #34 commit deployment/feature flag; review rollback; then real-browser synthetic login + MFA/passkey, admin authorization denial, five-minute proof expiration; only later wire a real Timeclock Owner principal and delegated managers with protected employee directory. Do not deploy production or merge PR #34 without explicit authorization.

The prior staged security page and its current functioning PIN+Authenticator tests remain untouched. The real-device fifteen-minute PIN session expiry acceptance check remains independent.

## Read-only admin isolated staging deployment — 2026-11-06

**Status: Deployed to isolated staging; automated tests passed; real-browser acceptance pending.**

Owner approved proceeding with the isolated-only read-only preview. Rechecked admin branch and test authentication composition (existing signed employee 901, existing WebAuthn passkey and TOTP verification; no admin mutation adapters mounted). GitHub Actions **Shared Lightspeed foundation `42293979612` SUCCESS** for the functional source commit after staging test harness correction; subsequent only documentation changes.

**Railway change scope verified before deploy:** `Hobby Corner Integration Test` / `test` / `staff-security-staging` only, patch `96f9d8e7-f146-404f-b759-a378994f60bc`, exactly source branch, pinned commit, and new `HC_STAGING_ADMIN_READONLY_ENABLED=true` variable; not destructive, no other services, secrets, database or Timeclock changes. Prior deployment `c0f9ccb3-e076-4ce4-8b4d-62ffd0416a04` source `d2a90b49e0f58104f17391c1f67623c256950326` was rollback reference.

**New Railway deployment:** `06537f54-d009-4329-823b-daa444c67eef` **SUCCESS**, source `Tawgod/Lightspeed:feature/employee-admin-security-foundation-20261106` pinned commit `160fc84e4c2d2478a706222282941def71e5bdce`. Railway environment reports `online` with zero warnings/critical issues, no remaining staged patch. Railway-managed staging domain `staff-security-staging-test.up.railway.app` verified as assigned to the service. **The admin page is available at** `https://staff-security-staging-test.up.railway.app/employee-admin/` **based on deployed route/source**, but direct unauthenticated remote HTTP probing was inconclusive because outbound DNS/web fetch was unavailable in this environment; browser manual acceptance remains pending.

**Test next:** User opens the admin page, signs in with the synthetic staging PIN; should remain outside admin after PIN only. They then verify an enrolled Google Authenticator code or registered passkey; server should authorize metadata-only dashboard marked test Owner. Verify a refreshed or expired proof is denied, and that no grant/PIN/tool-setting write endpoint is exposed. Do NOT share codes or security proofs. If errors occur, inspect Railway runtime logs, health status and frontend scripts before assuming a user mistake.

**Rollout safety:** This is NOT production admin Owner commissioning, no real Timeclock employee records are connected. The verified synthetic 901 profile is a staging-only fixture; delegated access, employee onboarding, tool permission grants and actual tool-settings changes are not enabled. Do not conflate staged read-only UI with production authorization.

## Real-browser Authenticator admin sign-in acceptance — 2026-11-09

**Staging testing — user-confirmed:** On 2026-11-09 the Owner opened the isolated staging Employee Administration portal, signed in using the synthetic employee identity and Google Authenticator, and supplied a screenshot showing the authenticated dashboard. The screen displayed `Owner · totp`, all seven navigation tiles (Employees, Security, Verified Computers, Timeclock, Tool Permissions, Tool Settings, Audit), and `14 registered settings and configuration areas` with read-only metadata/status badges. It displayed the notice `Settings metadata loaded. No employee information or configuration values were changed.`

This validates the browser sign-in and verified TOTP-to-read-only-admin-overview path on isolated Railway staging deployment `06537f54-d009-4329-823b-daa444c67eef` (pinned commit `160fc84e4c2d2478a706222282941def71e5bdce`). **Do not conflate the synthetic staging Owner label with real Timeclock Owner commissioning.** The screenshot does not establish passkey sign-in, PIN-only denial, real delegated manager enforcement, session expiry, or permission/settings writes. No employee record or production configuration was changed.

**Next manual acceptance:** test explicit sign-out and an independent passkey sign-in; negative PIN-only admin read and five-minute TOTP proof expiry are further outstanding. Admin edit actions remain unmounted. Continue feature-by-feature rollout only after verified authorization, source-owned settings adapters, and audit tests.

## Admin tab-leave verification message fix — 2026-11-09

**Status: Fixed; automated CI passed; deployed to isolated staging; real-browser recheck pending.** User verified staging Admin Portal `Owner · totp` and successful sign-out, but found that leaving the page for ~1 minute and returning left the stale message `Second factor verified; checking server-side administrator permission…`. On tab visibility loss, the browser intentionally clears the temporary factor; the UI did not replace its prior verification status text.

**Changes:** `Tawgod/Lightspeed:feature/employee-admin-security-foundation-20261106` commit `1da14532d6568e29f9653b563885097922acf695`: `staging/isolated-admin-auth-client.js` now explains that tab switching clears admin verification, invites re-verification with Authenticator/passkey, clears pending code, and guards against async factor responses arriving after tab leave. `admin/employee-admin-client.js` invalidates pending dashboard/settings fetches on sign-out/tab leave so protected content cannot reappear after proof removal; clears owner identity and sensitive UI panels. Added `tests/employee-admin-visibility-race.test.mjs` and updated browser test for meaningful return message. No authentication TTL, session grant, Owner identity, production system or API privilege changed.

**Test:** GitHub Shared Lightspeed foundation run `42661587540` **SUCCESS**. Earlier run failed on a new syntax typo in WebAuthn options call; fixed before release. **Deploy:** reviewed non-destructive single-field staging source SHA patch `60f1faed-d9bc-4596-9e4d-5d14e500a41f`, then applied ONLY to `Hobby Corner Integration Test/test/staff-security-staging`. Railway deployment `1f0443e9-9eae-425a-b819-4391c66a25ed` **SUCCESS**, online with 0 warnings and 0 critical issues. No remaining staged changes.

**Browser recheck:** Reload `https://staff-security-staging-test.up.railway.app/employee-admin/`, synthetic PIN + TOTP, confirm dashboard, switch tabs for a minute, then return. It should show the admin gate and `Admin verification is not active. Use your Authenticator or passkey to return to the dashboard.` rather than the old checking message. Re-verify a new six-digit code if the signed PIN session remains active. Signing out continues to clear the base session. Never share OTP or PIN.

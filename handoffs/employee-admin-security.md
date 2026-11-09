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

## Brief tab switching now retains unexpired MFA — 2026-11-09

**Status: Staging deployed; automated regression PASS; real-device recheck pending.** User reported that switching to another browser tab even for a second caused the admin portal to require an entirely new second-factor verification. This was caused by the previous client code intentionally calling `clearFactor()` on every `visibilitychange` to hidden, an overly restrictive UX policy.

**Fix:** `Tawgod/Lightspeed:feature/employee-admin-security-foundation-20261106` commit `21a44f4f06ebaacec3d005344faa89f8907feb46`. `staging/isolated-admin-auth-client.js` now **retains the existing memory-only proof** across short tab changes; it does **not** extend its original five-minute expiry. `admin/employee-admin-client.js` hides the dashboard immediately when the tab becomes hidden, invalidates pending server fetch results, and **server-revalidates** the same proof via both read-only admin endpoints whenever the tab is visible again. If the factor expired, the UI asks for Authenticator/passkey again, without renewing the employee PIN session. Browser navigation/pagehide and explicit sign-out still clear proof/session. No secrets written to browser storage, no server TTL change and no new authorization bypass.

**Tests:** Shared Lightspeed foundation GitHub Actions run `42663046081` **SUCCESS**. Updated `tests/employee-admin-staging-auth-client.test.mjs` for short tab change/valid proof and after-five-minute expired proof; `tests/employee-admin-visibility-race.test.mjs` confirms a delayed response cannot reveal admin data while hidden. **Railway:** non-destructive patch `9ffea2e0-648e-4c55-ac22-5711d2e70f3d` changed only the source SHA for isolated `Hobby Corner Integration Test/test/staff-security-staging`; deployment `41a3ee7d-6fb9-4ac1-9f5f-a27120f95256` **SUCCESS**, service online with no warning/critical issues, no staged changes remaining. No production changes.

**Manual acceptance:** Reload `https://staff-security-staging-test.up.railway.app/employee-admin/`, PIN + TOTP, switch tabs for a few seconds and return: expect server recheck and Owner dashboard without another code. After original five-minute MFA proof expiry, return and expect a fresh factor while the separate employee PIN session remains active (until its own expiry). User must confirm browser behavior before marking this real-device acceptance.

## Minimum employee directory and no-sync Timeclock adapter — 2026-11-09

**Status: In Development; automated tests PASS; NOT deployed.** After real-device confirmation that brief admin tab switching now works better, proceeded to next Employee Administration milestone: permission-gated Timeclock employee-directory integration, with strict separation from manager onboarding and private records.

**Source:** `Tawgod/Lightspeed:feature/employee-admin-security-foundation-20261106`, draft PR #34. Functional source/test commit `5fb9606b80cea8a63def3245c1b836cf8ae19317`. Development guide `docs/EMPLOYEE_ADMIN_FOUNDATION.md`.

- **Timeclock source audit:** existing `GET /api/timeclock/admin/employees` triggers `syncLightspeedUsers()`; deliberately **not** used as read-only admin data source because it may mutate business roster on page load. Added `GET /api/timeclock/admin/employees/readonly` to the development copy of `timeclock/server.js`, protected by existing server-only Timeclock admin secret, returns `listEmployees()` without sync. Not deployed to Timeclock.
- **Backend-only adapter:** `services/security/adminTimeclockDirectoryReader.js` allows secure server-side HTTP/HTTPS to the new endpoint with existing admin secret, no redirects, bounded timeout and response validation. Not browser-accessible or configured in deployed services.
- **Projection:** `services/security/adminEmployeeDirectory.js` validates/deduplicates employee identities and strips responses to `id,name,active` for `employees.directory.read`; limited private booleans only with separate `employees.private.read`. Never sends PIN hash, raw Discord/LS IDs, phone or email. The manager's `employees.onboard` alone does NOT allow directory browse.
- **Admin API:** `routes/employeeAdmin.js` conditionally adds `GET /api/employees` only when a verified directory adapter is injected. Requires strong administrator verification and exact directory permission; `?scope=private` requires stronger, independent private-read operation grant. The current synthetic staging preview is NOT supplied this adapter, so the directory API remains 404 and no employee data is fetched.
- **UI:** `admin/employee-admin.html` / `admin/employee-admin-client.js` include a hidden Employee Directory section, automatically queried only when the real server's verified permissions explicitly include `employees.directory.read`, showing minimum identity, active status and Timeclock ID. In current staging the synthetic Owner's capabilities exclude that operation, so no roster load occurs.
- **Tests:** New `tests/employee-admin-directory.test.mjs`, `tests/employee-admin-timeclock-directory-reader.test.mjs`, `tests/employee-admin-directory-client.test.mjs`. GitHub Actions **Shared Lightspeed foundation `42665224213` SUCCESS** and **Scanner integration `42665224227` SUCCESS** at final functional/test commit `5fb9606b80cea8a63def3245c1b836cf8ae19317`. One preceding test-only failure was incorrect simulated DOM `append` argument handling, fixed before passing CI.
- **Deployed:** No new deployment; isolated read-only Admin staging remains on `staff-security-staging` source commit `21a44f4f06ebaacec3d005344faa89f8907feb46` deployment `41a3ee7d-6fb9-4ac1-9f5f-a27120f95256` per latest known verification. Production Timeclock, scanner, employee data, PINs, employee permissions, Lightspeed and Chrome extension untouched.

**Next integration gates:** approve and separately deploy the non-sync Timeclock directory endpoint; connect server-side admin HTTP adapter only after independently verified real Owner principal and directory grant; test manager onboarding-only user receives 403 and no directory; audit required workforce/private fields and role permissions. Do not convert legacy employee list into an unguarded browser endpoint. Live Owner commissioning and per-tool settings writes remain pending.

## Short tab-switch behavior owner acceptance — 2026-11-09

**Testing — user feedback:** After isolated staging deployment `41a3ee7d-6fb9-4ac1-9f5f-a27120f95256` (source `21a44f4f06ebaacec3d005344faa89f8907feb46`) preserving a five-minute verified factor across brief tab switches and performing server revalidation on return, the Owner reported **“That looks better”** and requested continuation of development. This is positive real-browser UX acceptance for the short tab-switch behavior, though it does not independently prove precise MFA expiry, passkey sign-in, or long-idle session revocation. No production changes.

## Delegated new-hire requests, Owner review, exact tool grants and policy preview — 2026-11-09

**Status: In Development; implementation and regression tests PASS; not deployed.** Owner requested continuing all safe development possible without additional input. This milestone extends Employee Admin draft PR #34 without touching the successful live admin staging preview or actual employee data.

**Source:** `Tawgod/Lightspeed:feature/employee-admin-security-foundation-20261106`. Final functional/test commit `ef2776400451ce219b8d93d856ced302bde77436`; subsequent documentation-only commits. CI **Shared Lightspeed foundation `42668508441` SUCCESS** and **Scanner integration `42668509091` SUCCESS**.

**Implemented and tested:**
- `db/hc_admin_onboarding_requests.sql`, `services/security/adminOnboardingQueue.js`: persistent new-employee request queue, minimal new-hire name/proposed staff or manager role/reason fields, fresh strong-factor `employees.onboard` permission, idempotent unique request keys including concurrent retry reconciliation, own-request-only manager status, and append-only audit events. Queue does NOT create a Lightspeed/Timeclock identity, reset PIN or grant any tool operation.
- Explicit `employees.onboard.review` **owner-only** permission, separate backend Owner validation callback, strong factor, protected pending-review listing, atomic approve/reject, immutable audit. Approved status is `approved_pending_creation`: an approval does **not** create any account. Delegated manager cannot approve their own/others' requests or list requests for other employees.
- `services/security/adminDelegationsPostgres.js`: `canUseEmployeeTool` checks current active Timeclock employee and exact operation grant (default deny); `listEmployeeToolGrants` requires `permissions.read`, hides Owner target from managers and filters other employee permissions to each manager's Owner-approved operation scopes. Optional admin GET permission view. This is a **candidate** integration interface; Scanner/other production tool enforcement unchanged.
- `services/security/adminSessionPolicyPostgres.js`: `preview()` compares independently authorized local and remote proposed session windows with durable version and validation. Optional `GET /api/session-policy` and `POST /api/session-policy/preview` expose only reads/previews. No public save endpoint, no active-session TTL/policy change.
- Responsive admin development UI contains new-hire intake/own status, Owner review/decision, and local/remote session-window preview. Each section loads only if the **trusted server** explicitly granted corresponding operation. No private staff browse automatically follows onboarding permission.
- Tests `tests/employee-admin-onboarding.test.mjs` (disposable PostgreSQL and gated HTTP), updated `tests/employee-admin-delegations-postgres.test.mjs`, new `tests/employee-admin-policy-preview-http.test.mjs`, plus all inherited shared security and Scanner regressions. Latest CI passed after correcting only a preview test expected read count; no policy writer was called.

**Deployed:** None of this new code. Current isolated staging `Hobby Corner Integration Test/test/staff-security-staging` remains successful deployment `41a3ee7d-6fb9-4ac1-9f5f-a27120f95256` at existing source `21a44f4f06ebaacec3d005344faa89f8907feb46` with no pending Railway changes. Production Timeclock, Lightspeed, Scanner, real employee records, PINs and tool permissions unchanged. No Chrome extension release.

**Blockers / decisions requiring coordination:** actual vetted Lightspeed/Timeclock employee provisioning (canonical employee IDs, active state and onboarding workflow), verified real Owner commissioning and admin grants, scoped management adapters, additive migration to a disposable staging DB, real Chrome workstation installer and release queue, tool-by-tool server authorization policy transition, persistent session policy enforcement for idle/absolute windows, security/browser acceptance and explicit authorization before production writes. Avoid treating an approved onboarding request as an employee account or a metadata preview as a saved setting.

**Next recommended action:** independently review these new backend/migrations, then prepare an isolated DB/test-fixture admin manager/Owner flow for real UI acceptance, followed by integrating actual Timeclock onboarding and source-owned tool-setting adapters only after careful source/API review. Keep PR #34 draft/unmerged until coordination.

## Final permission-check hardening and regression verification — 2026-11-09

**Status: In Development, final CI PASS, no new deployment.** Final security review of exact tool operation grant resolver identified that accepting a plain employee ID could make it easy for a future tool integration to mistakenly trust a caller-supplied identity. Corrected `services/security/adminDelegationsPostgres.js` so `canUseEmployeeTool({context,toolOperation})` now requires a trusted injected `verifyToolSession(context)` backend verifier that resolves the employee from an independently authenticated signed session; if no verifier/context, invalid/unknown identity, inactive Timeclock record, missing exact grant, or DB failure, it **denies**. Explicit employee-ID input alone no longer authorizes an operation. It remains unmounted until an individual tool integrates and tests the trusted verifier.

Updated `tests/employee-admin-delegations-postgres.test.mjs` with signed-session fixture and caller-spoof denial. Latest functional/test commit `81a78d933711836b395c0d50e2dabcb118165ee0`; GitHub Actions **Shared Lightspeed foundation `42669190828` SUCCESS** and **Scanner integration `42669190918` SUCCESS**. Later work in this conversation updated documentation only. Previous milestone onboarding/Owner-review/policy-preview checks also passed in this latest security CI.

**Deployment unchanged:** Railway `staff-security-staging` remains successful deployment `41a3ee7d-6fb9-4ac1-9f5f-a27120f95256` pinned to `21a44f4f06ebaacec3d005344faa89f8907feb46`; no pending staged changes at last Railway inspection. Production Timeclock/Scanner/Lightspeed, real employee PINs, grants, tool settings, Chrome extension remain untouched. PR #34 stays DRAFT.

## Cross-project integration registry coordination — 2026-11-09

**In Development; new integration candidate NOT VERIFIED/NOT DEPLOYED.** On `Tawgod/Lightspeed:feature/employee-admin-security-foundation-20261106` (draft PR #34) added `services/security/adminIntegrationCatalog.js` and `GET /api/integrations` to return server-permission-gated read-only metadata about project tool integration status, exact operation IDs and proposed hierarchical navigation ownership. All operations remain `not-integrated` and settings adapters `not-connected`. No employee roles/grants, actual staff data, configuration writes or tool authorizers were changed. The existing validated staging Owner UI is still the previously deployed source, not this candidate.

**Coordination:** `Tawgod/Hobby-Corner:main/HOBBY_CORNER_INTEGRATION_CONTRACT.md`, `handoffs/cross-project-integration.md` and [navigation issue #36](https://github.com/Tawgod/Lightspeed/issues/36) define agreed shared ownership and requested Special Orders > Purchasing/Preorders > GW nesting, Store Tools, and verified `admin.read` nav. The active web nav branch `feature/unified-hierarchical-navigation-20261109` remains separately owned; no shared nav or Chrome extension file was modified by this admin chat.

**CI blocker:** New Shared foundation `42672182306` and Scanner `42672182349` report failure with zero jobs available via GitHub connector; rerun API returned 403 cannot retry. Do not mark new registry tested or stage it until verified green CI. Last successfully tested previous admin code is `81a78d933711836b395c0d50e2dabcb118165ee0`. No production/staging rollout performed.

## Cross-project Admin integration CI validated — 2026-11-09

**Status: In Development; new integration read-only source TESTED; not deployed.** On `Tawgod/Lightspeed:feature/employee-admin-security-foundation-20261106` draft PR #34, read-only `adminIntegrationCatalog` and optional server-gated `GET /api/integrations` list intended tool owners, operation IDs and hierarchy without falsely claiming any live permission grant/settings adapter. New independent `.github/workflows/employee-admin-integration.yml` and Admin branch direct foundation trigger were added after no-job CI startup failures. Source commit `cc433e396545402b1aa32bb442f8a3f5f2dccc38` passed [Admin integration contract `42673992585`](https://github.com/Tawgod/Lightspeed/actions/runs/42673992585) and [full foundation `42673992885`](https://github.com/Tawgod/Lightspeed/actions/runs/42673992885). Scanner had a no-jobs failure on latest run; earlier Admin source Scanner run `42673574765` SUCCESS, no specific regression established. Intermittent no-job GitHub root cause still unverified.

**Related web nav verified** on separate `feature/unified-hierarchical-navigation-20261109` at `17a35003c7b570f9a810000fd4b6ea77ab8e61cb`: all five navigation, Shared UI, Scanner and Core Ops CI suites SUCCESS. Source now has requested Special Orders/Preorders/GW/Purchasing nested structure and an Employee Administration link shown only with fresh trusted same-origin `admin.read` approval; sign-out revokes link. **Backend `/api/admin/navigation-access` is not yet implemented on live core-ops origin, so link remains hidden**. No real production Owner or delegated grants are provisioned.

**Deployed:** No new Admin staging source or production rollout. Previous isolated synthetic Owner staging remains unchanged. Next: create and test a trusted same-origin `admin.read` nav capability adapter on a future reviewed integration branch, separately from current synthetic Owner test identity, then stage cross-project browser acceptance. Details in `handoffs/cross-project-integration.md`.

## Dedicated Admin grants database isolated in Railway — 2026-11-09

**Infrastructure status: Deployed (test-only); Admin authorization status: Planned / Not wired.** A dedicated new PostgreSQL resource `Postgres-O39p` (Railway service `bd807d6a-0d9a-4b33-94a7-6eeff6fe6eb8`, volume `9d60c858-4890-4d96-ade8-e4f2446b574a`) was provisioned in `Hobby Corner Integration Test/test` by non-destructive Railway patch `5ca5f028-a6d4-41b1-a597-72829947d399`. Deployment `118442f5-0663-471c-b9a6-df746f9709bd` SUCCESS; health online, no warnings/criticals; **no public/custom domains**. Existing shared test DB and synthetic Admin staging unchanged. No employee records copied and no production changes.

This new database currently has **no installed `hc_admin_delegations.sql` schema, real Owner principal, manager grants or SELECT-only LOGIN**. New source-only reviewed role setup SQL `Tawgod/Lightspeed:feature/unified-hierarchical-navigation-20261109/db/admin_navigation_reader_isolated_review.sql` intentionally creates a `NOLOGIN` role and cannot grant authorization to anyone; it was not executed. Staff-auth/same-origin Admin hint route remains opt-in and unmounted. Do not use template administrator `DATABASE_URL` in the Admin navigation app; app startup's least-privilege preflight will reject it.

**Tests:** navigation branch function/test commit `bf58e63cc17798921ee0ed6607d8eaf9d8cf2a68` passed Admin Navigation `42680491246`, hierarchical navigation `42680491229`, Scanner `42680490800`, Shared UI `42680490765`, Core Operations `42680491141`. The disposable Postgres owner/manager/ordinary employee matrix and SELECT-only role test passed previously. Railway run did not execute any new migration or auth tests using the dedicated real test DB.

**Next:** separately approved isolated schema migration and dedicated read-only credential provisioning, then isolated same-origin route deployment and synthetic-only browser tests. Real Timeclock Owner commissioning, real employee permission grants and production rollout remain gated. Full cross-project handoff in `handoffs/cross-project-integration.md`.

## Isolated Admin authorization schema and SELECT-only role actually connected — 2026-11-09

**Status:** Isolated test-only PostgreSQL schema Deployed; dedicated restricted reader LOGIN Deployed and connection TESTED; no actual employee or Owner grants; Admin navigation/browser production NOT deployed. In `Hobby Corner Integration Test/test/Postgres-O39p`, the guarded canonical `hc_admin_delegations.sql` migration was executed by pinned one-time Railway job `admin-grants-schema-once` deployment `d39bee4b-14cf-4c8a-ad8b-889c4301362b` SUCCESS, runtime proved six required tables and **zero principals / zero grants**. A second test-only one-shot run `b62b8f3b-6c5c-437c-989e-cd09a02cfd40` SUCCESS provisioned an independently credentialed `hc_admin_nav_reader` role, SELECT-only on two navigation grant tables, with no table modification/schema CREATE privileges. Credential generated separately and retained in Railway, not in repository/docs. Third run `2c1384c3-7080-4921-bad7-674572ed17d0` SUCCESS used only this role to connect over private Railway networking and confirm the full DB preflight, empty principals/grants and denied synthetic test Owner.

**Sources:** Admin branch `scripts/admin-schema-isolated-once.mjs`, `scripts/admin-nav-reader-isolated-once.mjs`, their unit/regression tests; Nav branch `scripts/admin-nav-db-isolated-smoke.mjs` and tests. Foundation, Scanner, Admin integration and all five nav suites passed at respective pinned commits (see `handoffs/cross-project-integration.md`). No production migrations or Timeclock employee records changed.

**Guardrail:** The one-time Railway service was repinned to read-only smoke and its elevated migration URL disabled. Existing `staff-security-staging` deployed source is unchanged. Real Owner commissioning, delegated manager grants, signed employee bearer navigation endpoint and stronger Admin MFA entry have not been enabled using this DB. Browser acceptance remains pending.

**Next:** integrate real active Timeclock session verification and independent `admin.read` grant provider behind opt-in test-only navigation route; commission Owner through independently verified passkey before any real permissions; never seed synthetic `901` into this shared grant DB.

## Signed Timeclock Admin navigation bridge isolated candidate — 2026-11-09

**Status: In Development / CI TESTED / Railway service STAGED, not deployed.** The unified navigation branch `feature/unified-hierarchical-navigation-20261109` now contains a separate, private, test-only `scripts/admin-nav-isolated-bridge.mjs`. Reuses existing signed staff sessions and active Timeclock identity adapter plus the dedicated SELECT-only `Postgres-O39p` Admin permission reader. No new employee identity system, PIN signer, Owner auto-bootstrap, permission writes or settings changes. Without independent Timeclock signing/service secrets the endpoint denies all, even if the Admin database contains a grant. The Admin portal still requires independent fresh enrolled passkey/TOTP on entry.

All five GitHub CI suites passed on `87a9096990af099e085e390639cb312c250a9c5c`, including `tests/admin-nav-isolated-bridge.test.mjs` for valid/invalid signed sessions, active/revoked Timeclock employees, exact grants/revocations and default-deny. **No real employee-browser acceptance** has occurred. Railway test patch `27985da3-a390-44bb-ae3f-00d08a2fa408` is staged for new private service `admin-nav-bridge-test` id `73937ea7-1179-4664-9ec5-324da9352564`; pinned tested commit with internal SELECT-only DB variable references, no Timeclock credentials, no public domain. Patch not applied because activation requires explicit deployment authorization. The working synthetic Admin staging service and shared/staging/production databases remain unchanged.

**Next:** apply ONLY the isolated test service after authorization; verify default-denial and live read-only database health; coordinate independently reviewed Timeclock service credentials and real Owner commissioning before attempting positive real-staff navigation or delegated grants. Cross-project details: `handoffs/cross-project-integration.md`.

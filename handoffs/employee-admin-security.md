# Employee Administration & Central Tool Settings — Current Handoff

## Latest milestone — 2026-11-10, setup-ready staging safeguards (no deployment)

**System:** Hobby Corner Owner security, existing Timeclock employee identity, passkey + Google Authenticator, multi-Owner Admin.

**Status:** In Development; **implemented:** canonical Timeclock staging composition, dedicated staging launcher and operator-only one-use activation issuer. **Automated tests:** passed. **Deployed:** none; no live Owner setup URL.

**Source:** `Tawgod/Lightspeed:feature/owner-staging-real-timeclock-preflight-20261110`, [draft PR #58](https://github.com/Tawgod/Lightspeed/pull/58), stacked on staging route [PR #57](https://github.com/Tawgod/Lightspeed/pull/57), consolidated Owner [PR #56](https://github.com/Tawgod/Lightspeed/pull/56).

**What changed:** Reused the existing `createTimeclockScannerIdentity` and signed `createStaffAuthGateway`, limiting PIN login and all session reauthorizations to one operator-selected **real active canonical Timeclock ID** (explicitly denying synthetic ID 901 and any other employee). Added strict `validateOwnerTimeclockStagingConfig`, separate staging database name `hc_owner_stage_test`, a fail-closed standalone server that **never auto-migrates**, and `verifyOwnerStagingDatabasePrivileges` that forbids runtime insertion/rewriting of first-Owner approval facts. Added an **interactive, non-CI** activation issuer: canonical Timeclock lookup, exact employee confirmation, random 32-byte secret, SHA-256 digest-only storage, ten-minute expiry, one-use global bootstrap, no public issuance API. Issuer and staging launcher were not run against actual systems.

**Verification:** [GitHub Actions 42863206298](https://github.com/Tawgod/Lightspeed/actions/runs/42863206298) **SUCCESS: 36/36 tests passed; 0 failed, 0 skipped**, including previous Owner/Admin/Timeclock/passkey/TOTP disposable PostgreSQL tests, staged HTTPS/origin and new mock Timeclock, DB privilege, server/issuer safety tests. Tested functional commit `c92e8d38475047c8ba7a0efa31a7e2a546707fea`; docs-only edits followed. **No genuine device/WebAuthn or live Timeclock acceptance.**

**Railway validation:** Existing `Hobby Corner Integration Test` `staff-security-staging` still runs older synthetic staging and was not changed. Attempt to inspect main `Hobby Corner` Railway project service metadata was denied for lack of viewer permission; real Timeclock service endpoint and authorized secret remain unverified. **Do not guess hostnames, connect to a synthetic account, request real PIN/OTP/activation tokens in chat, or use production secrets.**

**Release blockers:** Verified actual canonical Owner Timeclock ID, approved Timeclock service origin/server-side credential, isolated HTTPS staging domain, dedicated app/operator database roles and reviewed migrations/backups, separate stored secrets, true phone/security-key WebAuthn acceptance and Google Authenticator QR confirmation, secure recovery, browser reverse-proxy acceptance, PR stack integration/branch checks, explicit staging deployment and later production authorization.

**Docs:** `Tawgod/Lightspeed:feature/owner-staging-real-timeclock-preflight-20261110/docs/OWNER_STAGING_SETUP_READINESS.md`, updated `CHANGELOG.md`. No Chrome extension release involved.

**Recommended next action:** Arrange authorized read-only Timeclock service metadata/identity mapping and dedicated isolated staging DB/HTTPS secrets. After separate staging deployment approval, physically test the actual user's existing Timeclock session, passkey and Google Authenticator under an approved non-production policy. Request further explicit approval for real Owner role assignment and production migration. No changes to live employee account, PIN, passkey, TOTP secret, role, Railway service, or production data.

---

## Latest milestone — 2026-11-10, isolated Owner security staging composition

**System / feature:** Existing Timeclock Owner activation, passkey verification, same-account Google Authenticator and multi-Owner Admin.

**Status:** In Development; **implemented** as unmounted opt-in test-only assembly, **tested** via 29 full combined automated tests, **not deployed** and **not live**.

**Source:** `Tawgod/Lightspeed:feature/owner-staging-wiring-20261110`, [draft PR #57](https://github.com/Tawgod/Lightspeed/pull/57) based on unified Owner [PR #56](https://github.com/Tawgod/Lightspeed/pull/56), which reconciles original Owner stack #50/#53/#54/#55 with multi-Owner Admin #52.

**What changed:** Modified `operatorFirstOwnerPasskeyCandidate.js` and `isolatedFirstOwnerSetup.js` to expose WebAuthn authentication/verification using the **same** credential store, signed session and signing key after first Owner registration. Added `ownerSecurityStagingMount.js` to compose the existing verified Timeclock login adapter, protected one-time owner setup screen, persistent passkey verification and **existing** encrypted staff Google Authenticator settings on one exact HTTPS origin and matching RP ID. Fails closed on missing trusted adapters, production environment, synthetic test employee 901, or unsafe origin. Mutating endpoints check exact Origin and same-origin fetch metadata. Existing security settings UI gets a **memory-only** `HCStaffAuth` bridge instead of inheriting the general shared-ui sessionStorage and legacy API-key handling; other tools' auth client is unchanged. No operator approval issuance or Owner role auto-elevation API added.

**Testing:** [GitHub Actions 42860683805](https://github.com/Tawgod/Lightspeed/actions/runs/42860683805) **SUCCESS — 29 tests passed, 0 failed, 0 skipped**, encompassing prior Owner, Admin, Timeclock, disposable PostgreSQL 16, TOTP and browser HTTP contracts plus new staging mount, synthetic-account denial, shared auth client and registered WebAuthn verification endpoint. Latest functional test commit `e641c7979c298fd029e757955266a711e28de79b`. Browser WebAuthn is **mocked** in integration tests, so no real hardware/mobile passkey acceptance established.

**Verified Railway context:** Existing project `Hobby Corner Integration Test`, environment `test`, service `staff-security-staging` still reports an older success deployment from `feature/employee-admin-security-foundation-20261106` at `21a44f4f06ebaacec3d005344faa89f8907feb46`, not PR #57. Its legacy PIN environment is synthetic-only; never treat it as the actual user's signed Timeclock employee session or promote staging employee 901.

**Documentation:** `docs/OWNER_SECURITY_STAGING_WIRING.md` and `CHANGELOG.md` updated on #57.

**Remaining blockers:** Authorized read-only actual Timeclock employee mapping/session adapter, isolated HTTPS staging origin and WebAuthn RP ID, separate activation token issuer/private delivery and DB privileges, real physical authenticator/passkey testing, employee factor recovery, logging/CSRF/proxy acceptance, staging deployment approval, review of all stacked PRs/branch protection and separately approved live Owner role migration/grant.

**Recommended next:** Validate a real signed Timeclock session through a reviewed read-only backend in a **new isolated** HTTPS staging environment, then perform actual device WebAuthn and Google Authenticator enrollment tests with explicit authorization. Do not reuse or modify the synthetic existing staging account for real employee credentials. No production migrations, deployment, Owner grants, PIN changes, Railway changes or extension releases were made.

---

## Latest verified milestone — 2026-11-10, unified Owner security / Admin integration

**Status:** In Development. **Implemented:** consolidated first Owner + passkey + same-account Authenticator + multi-Owner role delegation in one draft source branch. **Tested:** combined 27/27 automated tests and separate existing Admin integration contract passed. **Deployed:** nothing; all new Owner setup components unmounted/test-only.

**Source:** `Tawgod/Lightspeed:integration/owner-security-unified-20261110`, [draft PR #56](https://github.com/Tawgod/Lightspeed/pull/56), based on first Owner/Authenticator stack #50 → #53 → #54 → #55 and carrying over multiple-Owner Admin changes from #52 (Admin #34). Functional tested commit `b5308cb89d87f986d102e41badd8b9f335ef7cfc`; subsequent docs commits on branch do not alter runtime behavior.

**Resolved divergence:** Admin schema's obsolete single-active-Owner index removed while first Owner bootstrap remains one-time and blocks after any Owner principal exists; later Owners can be appointed only by existing active strongly authenticated Owner to a canonical active Timeclock employee, with no self-elevation, no last-Owner revocation, serial transactions and immutable audit. Active Owners inherit known tool grants, not an exemption from per-operation write/MFA controls. Existing Timeclock account/PIN stays intact; no external business identity verification provider in the requested UX. The old experimental independent-signature alternative is not wired into the new activation route and must not be deployed as an additional bootstrap path.

**CI:** [Unified run 42857873844](https://github.com/Tawgod/Lightspeed/actions/runs/42857873844) **SUCCESS: 27 passed, 0 failed, 0 skipped**, disposable Postgres16, 12 Owner/Timeclock/Admin test files, including rollback, challenge replay, passkey-backed TOTP confirmation, active Owner role and Admin route denial. [Existing Employee Admin integration 42857873617](https://github.com/Tawgod/Lightspeed/actions/runs/42857873617) **SUCCESS**. WebAuthn device verification is mocked within integration tests; real browser/device acceptance remains unverified.

**Acceptance/release blockers:** exact real canonical Timeclock employee mapping via authorized read-only backend; independently protected one-time operator-selected activation and least-privilege DB grants; secure HTTPS origin/CSRF/host review; a real passkey ceremony; TOTP QR and code verification on user's phone; key custody, factor recovery and backup; admin multiple-Owner UI finalization; reconciliation of pending draft PR ancestry and staging/production deployment reviews. New test-only factories throw in production, and no real Owner screen URL currently exists.

**Documentation:** `Tawgod/Lightspeed:integration/owner-security-unified-20261110/docs/UNIFIED_OWNER_SECURITY_HANDOFF.md`. `CHANGELOG.md` updated on the integration branch.

**Safety:** No Timeclock record, employee PIN, live Owner permission, passkey, Authenticator enrollment, Railway service, production migration, Chrome extension or merge was modified.

**Recommended next action:** Build isolated real-browser staging assembly (signed Timeclock + approved private activation + WebAuthn + TOTP) without reusing synthetic staging Owner, then validate actual device acceptance. Request explicit authorization before any production DB migration, deployment or live employee role assignment.

---

## Latest milestone — 2026-11-10, Owner passkey-to-Authenticator self-enrollment

**Status:** In Development. **Implemented:** reusable tested backend composition plus Owner-only browser control in the existing Employee Security Settings. **Testing:** combined Owner HTTP/PostgreSQL/TOTP/UI suite **21 passed, 0 failed, 0 skipped** at [GitHub Actions 42855023414](https://github.com/Tawgod/Lightspeed/actions/runs/42855023414), tested commit `41bf9b235dcf6d49a211329e96f69d26e44190b6`. No real-device browser acceptance. **Deployed:** none.

**User goal:** Attach passkey and Google Authenticator to the **existing active Timeclock employee account** without changing the four-digit PIN or using an external ownership-verification provider. Owner gets full access and can appoint additional Owners through Admin after setup.

**Source:** [Lightspeed draft PR #55](https://github.com/Tawgod/Lightspeed/pull/55), branch `feature/owner-passkey-totp-enrollment-20261110`, stacked on Owner browser [#54](https://github.com/Tawgod/Lightspeed/pull/54), operator activation [#53](https://github.com/Tawgod/Lightspeed/pull/53), first-passkey [#50](https://github.com/Tawgod/Lightspeed/pull/50). Separate Admin multi-Owner [#52](https://github.com/Tawgod/Lightspeed/pull/52) must be reconciled.

**What changed:** Added `services/security/ownerPasskeyTotpEnrollmentCandidate.js` to reuse the existing durable staff TOTP approval/encryption/QR workflow, while allowing an **already active Owner** to approve enrollment of their own employee-bound Authenticator only after a fresh **server-verified registered passkey/security-key**. Denies PIN-only, inactive Owner, wrong employee, stale factor or absent Owner role. Preserves separate factor-recovery controls. The existing `staff-security.html` and `staff-security-client.js` now offer **Approve my setup with passkey (Owner only)**: native browser passkey authentication through existing `staff-passkey/authentication` routes, then short-lived proof to existing `staff-security/api/enrollment-approve`. No new TOTP table, no duplicate account and no persistent storage of factor proofs in browser.

**Verified evidence:** Original backend-specific run [42854055904](https://github.com/Tawgod/Lightspeed/actions/runs/42854055904) **SUCCESS** (disposable PostgreSQL first Owner TOTP enrollment). The preceding combined Owner HTTP + first-passkey suite [42854592617](https://github.com/Tawgod/Lightspeed/actions/runs/42854592617) **SUCCESS**, but its workflow omitted the newly added TOTP tests; this was found and corrected in workflow commit `41bf9b235dcf6d49a211329e96f69d26e44190b6`. The corrected combined run [42855023414](https://github.com/Tawgod/Lightspeed/actions/runs/42855023414) **SUCCESS**, with 21/21 tests passing, including `tests/owner-passkey-totp-enrollment-postgres.test.mjs`, `tests/owner-authenticator-ui-contract.test.mjs` and existing Owner/Timeclock regressions. This verifies automated development contracts, **not real-device UI acceptance or deployment**.

**Release blockers:** None of these services is mounted on an approved real-user HTTPS Railway environment. Operator-configured exact real Timeclock employee ID and short-lived activation issuance/DB privileges, production-safe CSRF/origin, real device WebAuthn sign/verify, full factor recovery, TOTP QR/OTP acceptance, multi-Owner schema reconciliation, explicit rollout approval are still required. Existing synthetic test account 901 must never be promoted as the real Owner. No live PIN, employee, authenticator, database, deployment, or Chrome extension change occurred.

**Next action:** Complete combined CI; reconcile stacked branches and Admin #52; stage an approved secure real-Timeclock browser acceptance path **without** altering production permissions, then request explicit production commissioning permission.

---

## Latest milestone — 2026-11-10, protected first Owner browser candidate

**Status:** In Development; browser/setup route candidate implemented and source tested; **not mounted, not deployed, no live Owner**.

**What changed:** [Draft Lightspeed PR #54](https://github.com/Tawgod/Lightspeed/pull/54), `feature/owner-activation-browser-20261110`, stacked on [operator activation PR #53](https://github.com/Tawgod/Lightspeed/pull/53). Added `owner-setup/index.html`, `styles.css` and `client.js` to sign in with the **existing Timeclock PIN** through the existing signed staff-session endpoint, privately enter a separate one-time activation, then register a native WebAuthn passkey. Added unmounted `routes/firstOwnerActivation.js` enforcing exact TLS origin (test-only localhost), strict same-origin fetch/Origin/JSON, secret header, bounded payloads, sanitized errors and restrictive CSP/no-store headers. `services/security/isolatedFirstOwnerSetup.js` composes the operator-first-Owner passkey candidate and route **only for isolated test environments**, with no approval-secret issuer and no server mount. Client keeps login and activation out of persistent browser storage.

**Tested:** [GitHub Actions 42852751541](https://github.com/Tawgod/Lightspeed/actions/runs/42852751541) **SUCCESS — 7 passed, 0 failed, 0 skipped** on functional commit `c53e6ac846bacc6296f06474e6816cb27392a422`. The test combines protected HTTP route checks, disabled-by-default composer and prior disposable PostgreSQL Owner passkey/transaction tests. **It does not establish real-device browser WebAuthn or real Timeclock identity**, and UI has not been manually accepted.

**Reused existing system:** `staff-security.html`, `staff-security-client.js`, `createPrimaryTimeclockTotpSubsystem` and the existing encrypted/approved `staffTotpPostgres` already support Google Authenticator setup, QR, six-digit confirmation and session MFA. Do not create a duplicate system. Current enrollment request flow requires a separate manager approval; reconcile initial Owner self-enrollment under a *fresh verified new Owner passkey and exact Owner grant* without PIN-only approval, then protect recovery. This is the next implementation blocker.

**Dependencies:** Reconcile #54 → #53 → #50 with **multiple-Owner Admin PR #52**, which lives on a different stacked Admin branch and removes the old one-active-Owner index. Protect first-Owner exclusivity while permitting later Owner appointments. Coordinate real canonical employee mapping and live HTTPS/WebAuthn with the Timeclock security owner. No Chrome extension release was prepared.

**Sources:** `Tawgod/Lightspeed:feature/owner-activation-browser-20261110/docs/FIRST_OWNER_BROWSER_ENROLLMENT.md`; `Tawgod/Lightspeed:feature/admin-multiple-owners-20261110/docs/SIMPLIFIED_OWNER_SETUP.md`.

**No live change:** No production database migration, PIN/Timeclock employee change, passkey, authenticator seed, real activation token, Railway deployment or admin role assignment. The user's existing PIN is unchanged.

**Next action:** Integrate fresh Owner passkey proof into the existing TOTP approval flow, accept a physical device in an authorized isolated HTTPS environment, reconcile multi-Owner schema/branches, and request explicit approval before creating the first live Owner credential.

---

## Latest milestone — 2026-11-10, operator-selected first Owner activation

**Status:** In Development. **Implemented:** one-time bootstrap source candidate. **Tested:** disposable PostgreSQL suite passed. **Deployed:** nothing.

**User's confirmed workflow:** Existing Timeclock account and PIN remain unchanged. Primary Owner receives full Admin and recognized tool permissions and can assign additional Owners through strongly authenticated Admin controls. Add a passkey and Google Authenticator to that same employee account. Do not require third-party business-ownership verification.

**What changed:** Draft [Lightspeed PR #53](https://github.com/Tawgod/Lightspeed/pull/53), branch `feature/first-owner-operator-bootstrap-20261110`, stacked on #50, introduces a separate **operator-selected** Owner enrollment alternative. A deployment operator must confirm the exact real active Timeclock employee ID and provision a single 32-byte activation secret privately; only its SHA-256 digest enters the database. The proposed approval expires in 15 minutes. An unmounted test-only adapter requires both the signed canonical Timeclock employee session and private operator activation, then uses existing WebAuthn registration to atomically create passkey, Owner grant, consumed authorization and append-only audit. No PIN or first-visitor promotion, external ownership provider or live employee selection was introduced.

**Testing:** [GitHub Actions run 42848285658](https://github.com/Tawgod/Lightspeed/actions/runs/42848285658) **SUCCESS**, 4 tests passed / 0 failed / 0 skipped. Tests include missing/wrong secret, wrong employee, first Owner passkey, forced audit-write rollback and challenge replay denial; successful WebAuthn verification uses a fixture, not a physical authenticator. Proposed activation SQL was executed only in disposable `hc_test` PostgreSQL.

**Cross-branch dependencies:** [PR #52](https://github.com/Tawgod/Lightspeed/pull/52) provides tested multi-Owner Admin appointment/revocation and Owner tool permissions, but is stacked on Admin #34 rather than PR #50/#53. Reconcile the old single-Owner index with PR #52 before any actual migration. Retain prior signed-attestation PR #45/#50 as unmounted development alternatives; don't deploy them unchanged or require third-party identity proof. Add the enrollment UI, CSRF and log protections, exactly scoped DB grants, real Timeclock mapping, device WebAuthn, Google Authenticator TOTP/recovery, and approved deployment.

**Source / documentation:** `Tawgod/Lightspeed:feature/first-owner-operator-bootstrap-20261110/docs/FIRST_OWNER_OPERATOR_SETUP.md`; `db/hc_first_owner_operator_activation.sql`; `services/security/operatorFirstOwnerPasskeyCandidate.js`; `tests/operator-first-owner-postgres.test.mjs`; PR head documented via GitHub PR #53.

**Safety:** No activation tokens or actual Timeclock ID generated, exposed or requested in chat. No real PIN, Owner grant, TOTP factor, passkey, production database, Railway service, extension or deployed service changed. Initial Owner enrollment is NOT available for use yet.

**Next:** Reconcile #53 with #52; create protected first Owner passkey enrollment screen in isolated development; verify real HTTPS browser/WebAuthn and TOTP enrollment with a non-production identity; review exact Timeclock employee selection and approval ceremony, then request explicit authorization for a production role assignment.

---

## Revised Owner requirements and implementation — 2026-11-10

**User decision:** The first Owner is the user's **existing real Timeclock employee identity**. Preserve the four-digit PIN and attach Google Authenticator TOTP plus a passkey to **that account**. Primary Owner has full Admin and recognized tool permissions and can appoint additional Owners or delegate granular permissions in the Admin menu. The user does **not** require third-party business-ownership verification. Keep a one-time operator-controlled initial Owner provisioning process, with a protected activation path, rather than permit self-elevation using a PIN or browser-supplied role. **This supersedes the earlier proposal to require an external business identity verifier.**

**Implemented in development:** [Draft Lightspeed PR #52](https://github.com/Tawgod/Lightspeed/pull/52), `feature/admin-multiple-owners-20261110`, stacked on draft Admin PR #34. `db/hc_admin_delegations.sql` drops the restrictive one-active-Owner draft index and adds `owner_appoint` / `owner_revoke` audit events. `adminDelegationsPostgres.js` adds a strongly authenticated current Owner's appointment/revocation of another canonical active employee, serialized in PostgreSQL with no self-appointed Owner, no TOTP-only elevation, no automatic reactivation and final-Owner protection. Active Owners inherit all recognized tool grant-layer permissions **without bypassing authentication, tool write controls or audit**. `routes/employeeAdmin.js` adds an optional unmounted `POST /api/owners` endpoint with backend-only permission validation. The app has **not** set the user's real Owner role.

**Tested:** Initial CI discovered a concurrent DDL collision from separately running PostgreSQL tests; test runner was corrected to `--test-concurrency=1`. Later full route / database suites [GitHub Actions 42846744282](https://github.com/Tawgod/Lightspeed/actions/runs/42846744282) **SUCCESS**, and [Admin integration 42846744279](https://github.com/Tawgod/Lightspeed/actions/runs/42846744279) **SUCCESS** on functional commit `62e1a6037343eae286b273ba5ff9e75d3beebee6`. Synthetic employee IDs in tests are fixtures, not real identity assignments.

**Coordination:** [Draft Owner commissioning/passkey PR #50](https://github.com/Tawgod/Lightspeed/pull/50) has tested passkey/Postgres transaction logic but its external Ed25519 business-verifier dependency is **no longer the desired initial setup workflow**. Do not deploy PR #50 unchanged. Reconcile into a one-time deployment-operator-configured primary Timeclock ID, signed canonical session, protected temporary activation and WebAuthn enrollment transaction. Existing TOTP enrollment needs current Owner strong step-up, verified code, recovery safeguards and real-browser acceptance. Source requirements are documented at `Tawgod/Lightspeed:feature/admin-multiple-owners-20261110/docs/SIMPLIFIED_OWNER_SETUP.md`.

**Status:** In Development; new multiple Owner code implemented, automated tests passed, unmounted, no migrations or role changes deployed. No Timeclock PIN, passkey, TOTP secret, credential, active employee, Railway or Chrome release modified.

**Next recommended action:** Implement and test operator-configured **initial Owner** one-time activation on the user's existing Timeclock employee session, register a real passkey through an authenticated browser, then add TOTP and recovery to the same account. Coordinate PR #52 and #50 with Admin foundation #34 and request explicit approval before any real employee promotion, migration, deployment or credential setup.

---

## Latest first-Owner milestone — 2026-11-10

**System / feature:** Shared staff identity, Employee Administration, first real Owner passkey commissioning, future primary PIN Authenticator enrollment.

**Status:** In Development; **implemented in unmounted test-only source**, **automated tests passed**, **not deployed**, **no live Owner employee verified**.

**Source:** `Tawgod/Lightspeed:feature/first-owner-passkey-registration-integration-20261110`, [draft PR #50](https://github.com/Tawgod/Lightspeed/pull/50), stacked on PRs #39–45. Functional tested commit `71e0ce2647950036bdc46cfa4d9ea16a8b0bc7cc`; latest docs/Codespaces branch commit recorded on PR.

**What changed:** Fixed corrupted/unapplied `db/hc_owner_commissioning.sql`. Added `services/security/firstOwnerPasskeyRegistrationCandidate.js`, an **unmounted test-mode-only** composition of canonical signed Timeclock session, independently signed 30-minute offline approval and existing PostgreSQL passkey ceremony with atomic first Owner+passkey+append-only audit. The app cannot create its own offline approval, derive Owner from a PIN, or copy synthetic employee 901 factors. Added disposable PostgreSQL CI including forced audit-insert failure to prove the Owner, credential and approval consumption all roll back. Added optional Node22/Postgres16 test-only `.devcontainer/` and `docs/FIRST_OWNER_CODESPACES_TESTING.md`; no Codespace was started and its setup has not been manually accepted.

**Testing:** [GitHub Actions 42835416894](https://github.com/Tawgod/Lightspeed/actions/runs/42835416894) **SUCCESS** (20 tests, none skipped). Following fault-injection fixture correction, [GitHub Actions 42835824260](https://github.com/Tawgod/Lightspeed/actions/runs/42835824260) **SUCCESS** (20 tests, none skipped) with real disposable PostgreSQL schema and transactional rollback. New test simulates WebAuthn registration verification; prior suites separately test cryptographic assertions. **No physical-device or real-employee acceptance**.

**Deployed:** Nothing. Railway, production schema, live Timeclock PIN/employee, Owner grant, authenticator seed, Chrome extension and existing synthetic staging remain unchanged.

**Remaining decisions/blockers:** A legitimate independent human Owner identity verifier and auditable offline signer/operator/key custody; production DB grants/privilege review; real read-only Timeclock identity acceptance; origin/CSRF controls and physical-device passkey/recovery tests; PR ancestry/release coordination; explicit approval for any production migration or deployment. Do not infer that passing fixture CI means a real Owner setup URL is ready.

**Next recommended action:** Agree on independent Owner verification authority, then implement its independently controlled issuance/recovery and run real signed Timeclock read-only acceptance in an approved isolated environment. Codespaces can support local disposable DB/browser testing once separately launched by a user; available connectors do not currently control Codespaces.

---

**Last verified:** 2026-11-10  
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


## Existing primary Timeclock employee — security commissioning preflight (2026-11-09)

**Status: In Development; candidate implemented and CI TESTED; primary account NOT modified.** Owner requests moving from isolated synthetic test employee `901` (test PIN and Authenticator) toward using their **existing primary Timeclock employee account** as the sole staff identity. A separate draft [PR #39](https://github.com/Tawgod/Lightspeed/pull/39), `Tawgod/Lightspeed:feature/primary-employee-security-readiness-20261109@5b168d6ad22dbe74a38d4c0e5b1034f0b1d12450`, targets Admin development PR #34 and adds an **unmounted/read-only** `services/security/primaryEmployeeSecurityReadiness.js`. The preflight requires a verified current active, signed/bound Timeclock session; independent backend Owner assignment (not Discord role/claimed employee identity); recent independent primary-employee-bound passkey/security-key/IdP proof; and metadata-only factor status for that exact primary employee. No account ID may be chosen through a request field, and an enrolled synthetic `901` factor cannot be re-assigned to a primary employee ID. No clock-in or schedule requirement.

[Primary employee CI 42702068819](https://github.com/Tawgod/Lightspeed/actions/runs/42702068819) **SUCCESS** on the PR head, with focused identity mismatch, expired/inactive, forged role, synthetic-factor, wrong-employee and factor-state negative tests, plus parse check. This is fixture-based contract verification, not live login/device acceptance. No Railway read of live employee records, production identity lookup, PIN/TOTP seed access, new credential enrollment, Owner commissioning, role grant, credential reset, schema change, deployment, Chrome update or migration of test identity has occurred.

**Next gated steps:** using an approved authenticated Timeclock UI/backend flow, privately verify the existing primary employee ID/active state and current signed-session binding without sharing the PIN, TOTP code or raw credential values in chat. Independently verify Owner appointment and recoverable strong-factor enrollment procedure; establish a fresh primary-bound passkey or approved managed proof before a new TOTP enrollment (not a secret copy), with separate user authorization for any changes. Keep isolated synthetic identity `901` untouched for test regressions. Then connect the unmounted verification adapter to a least-privilege test-only route with real employee consent and perform device acceptance; never auto-promote or auto-merge identities.


## Primary employee identity discovery and canonical Timeclock adapter — 2026-11-09

**Status: In Development / CI TESTED / not mounted or deployed.** A stacked draft [PR #40](https://github.com/Tawgod/Lightspeed/pull/40) on existing primary readiness draft PR #39 adds a separate read-only first-step identity check. It resolves the circular prerequisite in PR #39: an employee who has no primary-account passkey can first verify their *existing canonical identity* without an enrolled passkey, while this discovery step **never authorizes Owner commissioning or factor enrollment**.

Source: `Tawgod/Lightspeed:feature/primary-employee-identity-discovery-20261109@c33871e65e2809032ddc3489e11fcae7bc4ac92b`. Modules `services/security/primaryEmployeeIdentityDiscovery.js` and `primaryTimeclockCanonicalReader.js` require an existing active, nonexpired signed/bound employee session; then the trusted backend Timeclock integration's `authorize(employeeId)` must return the exact active record with `permissionSource='timeclock_employee'` and `canLookup=true`. The live Timeclock code's existing scanner authorize endpoint (reviewed in `integration/hobby-corner-consolidation/timeclock/server.js`) already queries `employees WHERE id=$1 AND active=TRUE`, without consulting clock-in status. Its role/canApprove fields do **not** establish Owner authorization. An independent Owner appointment lookup is mandatory, and missing appointment yields a **read-only independent commissioning gate**, not an automatic Owner grant. No employee ID is accepted from request parameters to select a target, and synthetic test-identity provenance fails canonical verification.

Dedicated [CI 42703295374](https://github.com/Tawgod/Lightspeed/actions/runs/42703295374) **SUCCESS** including earlier primary strong factor readiness tests, new signed-session/canonical matching tests, active/revoked/expired Timeclock cases, untrusted role/employee spoof checks, service outage fail-closed and immutable read-only result. All test fixtures use invented employee IDs; **the real Owner Timeclock record and current factors have NOT been inspected**. No server route mounted, actual PIN/session queried, real Owner appointment created, test credential copied, TOTP secret migrated, passkey enrolled, migration executed, Chrome package changed, or Railway/production deployed.

**Next release gate:** coordinate a narrowly scoped test-only authenticated self-identity endpoint using this backend adapter and actual independently trusted Timeclock service credentials; independently commission Owner through an audited approved external/strong proof with recovery, only then enroll the new primary-bound passkey/TOTP. Never use synthetic test PIN/Authenticator as authorization for an existing real employee. Coordinate with Employee Admin PR #34 and Shared Lightspeed/security PR #32/#33/#38 before integration. Preserve existing working store clock-in.


## Initial primary employee account discovery — 2026-11-09 continuation

**Status: In Development / automated CI TESTED / unmounted.** Added stacked draft [Lightspeed PR #40](https://github.com/Tawgod/Lightspeed/pull/40), branch `feature/primary-employee-identity-discovery-20261109`; latest changelog-only head `fcde1721192106d78a1477c522db8a6bc3e9e237`; final functional/CI head `55092098a6daec7a2a731952d27172e7c77c01d3`.

This resolves an enrollment sequencing issue in primary readiness PR #39: a new real employee cannot prove possession of a primary-account passkey before the first credential is commissioned. **Read-only first-stage discovery** now verifies the signed/bound active employee session and independently checks the same ID through the backend-only existing `createTimeclockScannerIdentity.authorize` client. The authoritative Timeclock integration endpoint already queries `employees WHERE id=$1 AND active=TRUE`, without requiring clock-in status, and emits `permissionSource='timeclock_employee'`; this does **not** establish an Owner role or permission grant. Separate Owner appointment verification returns either `independent-owner-commissioning` or `independent-primary-factor-verification`, with `enrollmentAuthorized:false` in all cases.

New source-only modules: `services/security/primaryEmployeeIdentityDiscovery.js`, `primaryTimeclockCanonicalReader.js`, and `routes/primaryEmployeeIdentity.js`. The HTTP router has **disabled-by-default** `GET /self` only and returns allowlisted own identity readiness; no method accepts an employee selector, changes credentials, copies synthetic factor 901 or grants Owner. Nothing is mounted in server routing or Railway. Separate strong-factor readiness from PR #39 still applies **after** independent commissioning.

Dedicated GitHub Actions [primary identity discovery run 42703689898](https://github.com/Tawgod/Lightspeed/actions/runs/42703689898) **SUCCESS** for canonical Timeclock bridge, signed-session/revocation/synthetic identity fail-close, first-factor sequencing and disabled-by-default HTTP/404 tests. All tested with fixtures, **not the owner's live primary account**. No primary PIN/TOTP seed, existing employee record, real Timeclock staff entry, Railway variables, or live authorization grants were queried or changed; no deploy/merge/extension release.

**Next:** separately authorize a narrow environment-specific read-only self-identity acceptance test with real verified primary Timeclock session and trusted backend integration; do not use the synthetic test authenticator for the primary record. Independently establish/audit the first real Owner appointment and strong-factor credential/recovery procedure, then separately approved new primary-account TOTP enrollment. Coordinate with Admin PR #34, shared security PRs #32/#33/#38, and Timeclock legacy-login remediation. Preserve operational store clock workflows.


## Primary account verification integration — 2026-11-09

**Status: In Development / automated CI TESTED / read-only candidate UNMOUNTED / real Owner employee NOT verified.** Draft [Lightspeed PR #41](https://github.com/Tawgod/Lightspeed/pull/41) on child branch `feature/primary-timeclock-verification-wiring-20261109`, stacked on PR #40 and PR #39, adds `services/security/primaryTimeclockVerificationWiring.js`. A trusted backend factory now composes the pre-existing `staffAuth.verifyBoundEmployee` signed session, backend-only `timeclockIdentity.authorize(employeeId)` canonical active Timeclock recheck, independent `checkOwnerAssignment`, and the read-only, self-only `primaryEmployeeIdentityRouter`. The factory refuses any environment other than `test` and its read-only endpoint remains off by default; no operational server mounts it.

Focused tests in [GitHub Actions 42706021754](https://github.com/Tawgod/Lightspeed/actions/runs/42706021754) passed test-only wiring, default-off, active off-clock employee, missing signed session, canonical revocation, synthetic staging negative path, no writes or arbitrary employee target, and production factory refusal. Functional commit `4b6e8e06b57e95fb3db835c38c3688e33e4488c6`; documentation-only head `eb463d7d9ed617e45d52f08da3416ddb3bbd4e4a`.

Read-only Railway inspection confirmed isolated `Hobby Corner Integration Test/test/staff-security-staging` still pins `feature/employee-admin-security-foundation-20261106@21a44f4f06ebaacec3d005344faa89f8907feb46`, successful deployment `41a3ee7d-6fb9-4ac1-9f5f-a27120f95256`, and has **no verified live primary Timeclock integration configured**; synthetic employee 901 continues to be used. The unrelated staged environment-wide `admin-nav-bridge-test` creation patch `27985da3-a390-44bb-ae3f-00d08a2fa408` was not altered or accepted.

**Blocker for actual account verification:** A future explicitly scoped, separately approved isolated real Timeclock-backed read-only acceptance route needs trusted internal Timeclock service credentials and the owner's real signed primary employee session in a secure browser flow, not credentials pasted into ChatGPT. Current primary ID, Owner appointment, passkey/TOTP registration and login behavior were NOT queried or verified. No real employee record, PIN, authenticator seed, grant, DB schema, Railway deployment, staging patch, Chrome extension or production service was changed. Next: coordinate approved private test environment and real-session acceptance first; independently verify/audit Owner commissioning and recovery before enabling any primary-bound factor enrollment.


## Live primary Timeclock PIN → Authenticator preparation — 2026-11-09

**Status: In Development / automated CI TESTED / NOT integrated, deployed or live-account verified.** Owner requested continued development until the primary employee is able to enroll Authenticator against the *existing* Timeclock PIN. Existing prior draft PRs #39/#40/#41 prepare bound primary identity discovery and read-only test verification. New stacked draft [Lightspeed PR #42](https://github.com/Tawgod/Lightspeed/pull/42), `feature/primary-live-totp-enrollment-gate-20261109@60265c9cbab392027708bbbec75ccae532744f33`, adds `services/security/primaryLiveTotpEnrollmentGate.js` and `primaryTimeclockTotpSubsystem.js`. The former enforces a current signed session tied to exactly the active canonical Timeclock employee record before any factor operation, and a recent independent passkey/security-key/managed MFA approver with exact backend grants; the latter connects that assurance to the **existing** durable PostgreSQL enrollment approvals, encrypted Authenticator QR/confirm and signed TOTP MFA session services. Composition is **test-only and unmounted**, with no new employee database, Owner auto-grant or test employee 901 factor copy.

[GitHub Actions 42709757349](https://github.com/Tawgod/Lightspeed/actions/runs/42709757349) **SUCCESS** at functional source/CI SHA `22dc405f02c4e6a4ebca5a258c1f256ec428c986`, including canonical Timeclock, missing/revoked employee, mismatched signed session, synthetic test exclusion, manager factor strength, durable approval preconditions and composed subsystem tests. Later commits add documentation only. Full activation/recovery runbook committed on branch as `docs/PRIMARY_EMPLOYEE_AUTHENTICATOR_ROLLOUT.md`; `CHANGELOG.md` updated.

**Not ready for real setup yet:** The user's actual primary Timeclock employee account, pre-existing Owner appointment and independently verified strong approver are NOT identified or authenticated in the available live runtime. No production Railway source/credentials, encrypted factor key custody, real signed primary session, migrations, approved recovery or browser verification exists for this candidate. The existing `staff-security-staging` service uses isolated synthetic employee 901 and must **not** be repurposed to verify or enroll a production user. Unrelated Railway staged Admin Navigation patch remains untouched. No real PIN, authenticator QR/seed or private employee record was accessed; no DB schema/write, Owner grant, deploy or Chrome release performed.

**Next dependent activities:** independently commission real Owner/strong-factor approver with audited identity/recovery, provision reviewed private Timeclock service identity and dedicated production-ready keys/DB scope, reconcile PR #32/#33/#34/#38/#39-#42, fully test Timeclock/session/rate-limiter, CSRF/proxy/browser and legacy clock routes, deploy only with explicit owner authorization, and run the private device setup flow (primary PIN sign-in → approved enrollment request → new QR scan → six-digit confirmation). No test PIN/OTP/secret should ever be pasted in chat.


## Independent live primary Authenticator approver boundary — 2026-11-09

**System:** Employee Admin / shared staff authentication / primary Timeclock Authenticator onboarding. **Status: In Development; implemented in draft source, automated tests passed; not deployed, not real-user verified.**

- [Lightspeed draft PR #43](https://github.com/Tawgod/Lightspeed/pull/43), `feature/primary-owner-enrollment-preflight-20261109` (functional SHA `2603ef4facdcd3cfc9bab43ca09119bff46e82b2`; later documentation SHA `b68d014187539d57f54744d5510421e5159095f6`) stacks on PR #42. New `services/security/independentPrimaryEnrollmentApproval.js` validates fresh strong approver passkey/security-key/IdP MFA, active canonical Timeclock identity for BOTH parties, distinct approving and enrolling employee IDs, and exact backend enrollment grant. Neither a PIN, Authenticator alone, synthetic 901 Owner, Scanner approval nor the browser's role controls enrollment.
- The test-only **unmounted** `primaryTimeclockTotpSubsystem.js` now uses that gate for the existing durable PostgreSQL enrollment approvals and encrypted TOTP subsystem. Its read-only preflight returns availability of a separately commissioned approver and an explicit next gate, always with `enrollmentAuthorized:false`. It never writes an Owner, resets PIN, changes employee records or displays a secret.
- [GitHub Actions 42711042161](https://github.com/Tawgod/Lightspeed/actions/runs/42711042161) **SUCCESS**, including independent-approver and existing primary Timeclock/TOTP composition tests.
- **Blocking decision:** first real Owner needs a *separately designed and audited secure commissioning ceremony* and recovery authorization to avoid circular self-approval. Current live Owner Timeclock employee ID, independently verified commissioning authority and strong credential have not been established. Do **not** adopt synthetic employee 901 staging self-approval exception. Coordinate with Timeclock/Employee Admin and deployment channels. No production or staging source deployment, DB migration, key change, real employee access, Chrome package or credential enrollment happened. The unrelated staged Admin Navigation Railway patch remains untouched.

**Recommended next action:** design and review an explicit one-time real Owner commissioning process using verifiable independent proof and immutable audit; then complete end-to-end test-environment signed primary Timeclock session acceptance, recovery readiness and real-device enrollment. Do not permit Owner self-approval or deploy until the first-Owner trust anchor is independently established and owner authorizes rollout.


## First real Owner passkey commissioning candidate — 2026-11-09

**System:** Shared staff authentication / Employee Administration / first Owner. **Status: In Development; automated contract TESTED; NOT mounted, migrated, deployed or verified against real employee.** Draft [Lightspeed PR #44](https://github.com/Tawgod/Lightspeed/pull/44), `feature/first-real-owner-commissioning-20261109`, stacked on independent primary enrollment PR #43. Adds **unapplied** `db/hc_owner_commissioning.sql` with short-lived one-use authorization records and append-only commissioning events; `services/security/firstOwnerCommissioning.js` supplies a candidate `commitRegistrationGrant` hook for the EXISTING Postgres verified-WebAuthn registration transaction. It requires canonical signed primary Timeclock identity, a separately issued approval record, independent evidence verification, no pre-existing active Owner, atomic one-use approval consumption + Owner grant + audit. No endpoint can mint the approval from a Timeclock PIN, Discord role or client claim.

Automated source/fixture tests [Actions run 42714947158](https://github.com/Tawgod/Lightspeed/actions/runs/42714947158) passed the Owner commissioning and inherited enrollment policy tests; documentation-only commit `c97f3102b2d03eb3edae0f9eebce97c7259bbb62` adds the on-branch operator runbook `docs/FIRST_OWNER_COMMISSIONING.md`.

**Important blockers:** No real owner identity proofing service/operator or independently issued authorization exists; `verifyIndependentEvidence` and canonical session callbacks are injected contracts, not live provisioned validators. No production DB role separation, schema migration, first-Owner credential, passkey setup page mount, recovery acceptance, protected real Timeclock staging route, real employee lookup, Railway deploy, Chrome release or live factor enrollment. The first-owner write flow is **not ready** until independent trust anchor, test evidence, role privilege, concurrency and browser acceptance are reviewed and authorized. Do not reuse synthetic account 901 self-approval logic. Existing store PIN/Timeclock unaffected.

**Next:** choose/approve a genuinely independent identity-verification and operator trust mechanism, implement its auditable evidence verifier/issuer outside the employee PIN app, verify secure recovery plan, reconcile draft PR stack, test PostgreSQL transaction rollback in disposable environment, then obtain explicit permission for read-only real employee acceptance followed by separately authorized commissioning and deployment.


## Real Owner verification — signed independent commissioning authorization (2026-11-09)

**Status: In Development, source implemented / CI TESTED; no live verification, deployment or credential enrollment.** Draft [Lightspeed PR #45](https://github.com/Tawgod/Lightspeed/pull/45), `feature/first-owner-signed-attestation-20261109` (functional SHA `e721b46a0d4870371715cc69f437e18343063048`, documentation-only latest `b198cf4a1b66d0ec87321d5c13fd79f64229d8c1`) adds `services/security/firstOwnerAttestation.js` as a concrete Ed25519 signature verification adapter. The independent approval signature binds the same real Timeclock employee ID, approved operator reference, digest of independently checked evidence, approval UUID, and <=30-minute validity window. The preexisting unmounted first Owner passkey registration callback passes the signature and original DB-backed facts for verification; the **unapplied** `db/hc_owner_commissioning.sql` adds mandatory `evidence_signature`.

[GitHub Actions 42717728513](https://github.com/Tawgod/Lightspeed/actions/runs/42717728513) **SUCCESS** for valid/malformed/tampered/future/expired/wrong-signing-key approvals and inherited Owner commissioning tests. The first run caught a malformed UUID regex and was corrected before the successful run. No independent signer private key, approval issuance endpoint, identity-verification provider, external operator credential or actual Owner attestation has been established. **A signed record alone is not independent proof of human ownership**; an approved separate verifier/identity-proofing procedure is still mandatory.

**Not verified:** actual primary Timeclock employee ID, first Owner appointment, real WebAuthn passkey and recovery, production DB roles/schema, staff browser acceptance, Timeclock legacy route migration, production Railway connection. No real PIN, OTP, employee row, Owner grant, TOTP secret, test credentials, Railway or Chrome deployment was touched. Do not promote draft PRs #39–45 or convert synthetic employee 901 into a real identity until the independent authority and explicit deployment/security gates are approved.

**Next concrete decision:** choose a legitimate independent first Owner identity authority/operator (e.g. approved offline verifier or managed identity provider with independent account administration) and its recovery method. Then implement its audited authorization issuance, safely provision operator public key with strict privilege separation, connect primary read-only Timeclock identity acceptance in a separately approved environment, perform independent real-owner verification, test transaction rollback in disposable Postgres and WebAuthn device setup, and request explicit deployment authorization.

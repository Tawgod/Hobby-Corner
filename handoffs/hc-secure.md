## Nov 24 milestone — disposable PG18 schema & privilege integration test ready

**Current milestone: In Development, awaiting operator Codespace test.** Located original Owner schema and provisioner in `Tawgod/Lightspeed`: `scripts/bootstrap-owner-stage-database.mjs` exports the **seven** existing SQL fixture paths and enforces the original Owner Railway scope; `db/hc_owner_staging_privilege_groups.sql` creates **two NOLOGIN grants groups** with deliberately restricted activation issuance/deletion/updates. Reviewed `scripts/prepare-owner-locked-login-roles.mjs`, `scripts/commission-owner-stage-db-credentials.mjs` and the Owner runtime preflight. **No original bootstrap was modified or used on the new Railway project.**

**Source-only implementation:** On `Tawgod/Lightspeed:feature/hc-secure-staging-readiness-20261123` draft [PR #77](https://github.com/Tawgod/Lightspeed/pull/77):
- `scripts/test-hc-secure-schema-disposable.mjs` — uses exact seven existing Owner schema fixtures on an empty **disposable** PostgreSQL 18 database. Hard guard: no Railway project/environment/service variables, exact `127.0.0.1:15488`, `hc_owner_stage_test`, local `postgres` login, forced `cluster_name=hc-secure-disposable-pg18` and PG18 version. Requires all nine tables and privilege groups absent before test. Runs fixtures and verifies Owner tables, forbidden runtime activation issuance/digest/employee/expiry rewrites, permitted activation consumption/credential, operator-only activation issuance, no operator TOTP SELECT. **Wraps every change in a transaction that ALWAYS ROLLS BACK**, even on success; strips existing `BEGIN/COMMIT` from one reviewed privilege fixture and rejects transaction control in others. Does not create a real Owner, activation token, credential or role password.
- `tests/hc-secure-disposable-schema.test.mjs` — local-only target, origin/Railway rejection, transaction delimiter handling, fail-before-connect and unexpected PG cluster/version refusal (five tests).
- `scripts/run-hc-secure-disposable-pg18.sh` — temp Docker `postgres:18` with **tmpfs**, bound only to loopback `127.0.0.1:15488`; random throwaway password, Docker container removed on exit. Runs complete PG18 SQL/grant test **twice**; second pass catches any failure to roll back first pass.
- Acceptance document updated at `Tawgod/Lightspeed:docs/HC_SECURE_AUTH_INTEGRATION_ACCEPTANCE.md`. Latest source commit `7047bb79cc516d1aafb8f7049eb04d890d42adf8`.
- **All three new scripts/tests authored but NOT yet run in Codespaces or deployed.**

**User-run next test:**
```bash
cd /workspaces/Lightspeed
git switch feature/hc-secure-staging-readiness-20261123
git pull --ff-only
node --test tests/hc-secure-disposable-schema.test.mjs
bash scripts/run-hc-secure-disposable-pg18.sh
```
Expected two `HC_SECURE_DISPOSABLE_SCHEMA_OK fixtures=7 tables=9 nonlogin_groups=2 rollback=true` messages and `HC_SECURE_DISPOSABLE_PG18_DOUBLE_PASS=true`. Docker may not be available in Codespaces; report that blockage without substituting a real Owner PostgreSQL DB. No live Railway change, DB schema migration, first-Owner activation, hostname/DNS change or production login rollout is part of this test.

**Next after result:** If PG18 tests PASS, design **new HC Secure-specific** provisioner that requires private new Railway project/database/service guards and fresh backup/secret/role provisioning, rather than reusing hard-coded original Owner provisioner. Do not commit/accept staged Railway patch until separate PG credentials and new-host WebAuthn continuity are independently reviewed.

---

## Nov 23 fresh-database preflight test results — operator-confirmed 5/5 PASS

**Codespace test evidence supplied by operator:** In `/workspaces/Lightspeed`, branch `feature/hc-secure-staging-readiness-20261123`, fast-forwarded from `70429b1` to `25d5f5d` and ran `node --test tests/hc-secure-fresh-db-preflight.test.mjs`. Output: **5 tests, 5 pass, 0 fail, 0 skipped, 0 cancelled**, duration `107.122218ms`. Passed cases: exact private target scope; original/wrong DB and unsafe URL rejection; read-only transaction, release and pool cleanup; partial schema/wrong DB/reported read-write rejection; and fail-before-connect on incorrect project ID. Tests are mocked and **do not establish real PG18 connectivity or migrations**.

**Status:** HC Secure fresh DB safety preflight **Testing: PASS (operator-supplied complete stdout)**, no staging deployment. Next: review actual Owner SQL schema and permission model, develop disposable PG18-only bootstrap/least-privilege tests before provisioning the separate HC Secure staging PostgreSQL. Do not copy Owner secrets, data or passkey/TOTP rows; existing staging credential workflow remains authoritative until separately migrated and tested.

---

## Nov 23 next milestone — read-only HC Secure database preflight

**Development milestone (not deployed):** Reviewed actual deployed Owner runtime privilege code `services/security/ownerStagingDatabasePreflight.js`, which requires nine tables and specifically **refuses** Owner activation issuance, deletion, or rewrite authority while permitting only the controlled consume/credential update needed by registered Owner enrollment. A fresh PG18 container alone does not supply this schema/role model.

**Source changes made** on `Tawgod/Lightspeed:feature/hc-secure-staging-readiness-20261123` (draft [PR #77](https://github.com/Tawgod/Lightspeed/pull/77)):
- New `scripts/check-hc-secure-fresh-db.mjs` at commit `fb1d205fd7e240f2a7e65cace07cd64ccb2bdfcc`: **read-only** preflight before any schema provisioning. Refuses project ID other than `120de974-f2e8-46be-9a00-8eb8b1be4cc4`, env ID other than `8c8cd3a9-079f-4fe8-b8f5-a76c79813f0c`, DB hostname other than `hc-secure-postgres-staging.railway.internal`, DB name other than `hc_owner_stage_test`, blank DB user/password or same connection URL as `DATABASE_URL` / original `HC_OWNER_STAGING_DATABASE_URL`. Performs only `BEGIN READ ONLY`, SELECT `current_database`, `current_setting('transaction_read_only')` and `to_regclass` for nine security tables, then `ROLLBACK`. Fresh target must have all nine tables absent; existing/partial schema forces a separate reconciliation, **not an automatic reset**. Logs only fixed status boolean; no credentials/rows.
- New `tests/hc-secure-fresh-db-preflight.test.mjs` at commit `25d5f5d8692fc653e2108865a7ed01c290d8bcc9`, five independent mock-only cases checking exact target, original-host/DB refusal, transaction read-only behavior and rollback/cleanup, partial schema rejection, and no connection on wrong project.
- **New tests NOT YET EXECUTED**, not represented as verified passing and not yet deployed; old positive config tests were operator-reported successful.

**Critical current blocker:** Target `HC Secure/staging` PG18 image service + volume are still `staged-create` without bootstrap password, dedicated database, prepared restricted roles or migrated schema. This code is intentionally **not** a schema writer: migration authoring must reuse reviewed Owner SQL and its separation between offline operator and restricted runtime. Do not accept-deploy pending Railway patch `60012c69-e526-4778-9422-055d705150f2` or point its runtime at original Owner DB. Existing original Owner app and DB remain unchanged. Domain/RPID/credential continuity and staff-wide authorization still pending.

**Next focused Codespace command (no live DB):**
```bash
cd /workspaces/Lightspeed
git fetch origin feature/hc-secure-staging-readiness-20261123
git switch feature/hc-secure-staging-readiness-20261123
git pull --ff-only
node --test tests/hc-secure-fresh-db-preflight.test.mjs
```
Run with installed `pg` dependencies. Report only pass/fail, never credentials. After successful tests, independently provision new staging PG credentials and role/schema in a separate reviewed migration then run read-only probe in an authenticated Railway context only for the *new* database.

---

## Nov 23 Codespace security tests — operator-reported success

**User report:** After cloning `Tawgod/Lightspeed` and running `npm install` rather than `npm ci` (no package-lock exists on branch), user reported **“success”** following requested `node --test tests/hc-secure-staging-gate.test.mjs tests/hc-secure-staging-readiness.test.mjs`. **Classification:** operator-reported Tests PASS, full stdout/individual assertion count not independently available via connector. Do not claim independent CI evidence or physical credential verification on new host. The test files remain on `feature/hc-secure-staging-readiness-20261123`, tracked in [draft PR #77](https://github.com/Tawgod/Lightspeed/pull/77). 

**Fresh Railway readback:** `HC Secure/staging` retains patch `60012c69-e526-4778-9422-055d705150f2` of **23 staged changes**; `hc-secure-auth-staging`, `hc-secure-postgres-staging` and its volume remain `staged-create`, none deployed/provisioned. Original `HC PR63 Isolated Staging/hc-owner-staging` and `Postgres-x8Ui` are independently online, latest deployments SUCCESS.

**Next work gate:** use a new, isolated HC Secure PG18 instance with independently provisioned database/admin credentials and reviewed least-privilege roles. The current service was staged from a generic PostgreSQL Docker image and was observed without bootstrap variables; **do not accept-deploy as-is**. Write/test DB schema and privilege bootstrapping in disposable Docker/PG18 first; plan a separate backup and encrypted TOTP/passkey continuity with old-host login and new RP ID, rather than copying existing Owner production records or keys blindly. Never print keys/QR/PIN/TOTP through chat; no live domain/production changes approved. After DB+runtime preflight, independent staging deployment approval is required, followed by physical device browser tests and employee-scoped grants integration.

---

## Nov 23 HC Secure next phase — fail-closed entrypoint and staged safe config

**State:** In Development / Testing pending. Read back HC Secure project `120de974-f2e8-46be-9a00-8eb8b1be4cc4`, `staging` env `8c8cd3a9-079f-4fe8-b8f5-a76c79813f0c`. The prepared `hc-secure-auth-staging` `8ef9adc0-2a4d-46c0-92cf-ba54834e33b5`, `hc-secure-postgres-staging` `454f4979-6148-4ee5-9857-97bc793dc72d`, and `hc-secure-staging-pgdata` `468ccb0a-3006-48b1-ac2d-f74293c7c075` remain **staged-create only** (no deployment/data/volume provision). Original verified Owner app and DB in `HC PR63 Isolated Staging` still successful and unaffected.

**Actual staging configuration written (STAGED ONLY):** eight nonsecret variables on auth service: `NODE_ENV=test`, `HC_SECURITY_ENV=isolated-staging`, `HC_OWNER_STAGING_ENABLED=true`, `HC_OWNER_TIMECLOCK_EMPLOYEE_ID=1`, `HC_OWNER_STAGING_ORIGIN=https://secure-hc.timcorp-productions.com`, `HC_OWNER_STAGING_RPID=secure-hc.timcorp-productions.com`, `HC_STAGING_TEST_LOGIN_ENABLED=false`, `HC_STAGING_PIN_SETUP_ENABLED=false`. **No credentials, encryption key or database connection injected.** Both target services' Railway variable listings contain *only Railway automatic variables* before this staging patch; PostgreSQL lacks its necessary provisioned database password/roles. **Do not accept pending patch**.

**Source-only implementation:** Created `services/security/hcSecureStagingGate.js` and `staging/hc-secure-security-server.js` on `Tawgod/Lightspeed:feature/hc-secure-staging-readiness-20261123`, commits `43ff760` and `e2d61b9`. The new entrypoint guards the **exact** HC Secure project + environment IDs, approved secure HTTPS origin/RP ID, Owner canonical employee, isolated staging flags, no fake staff logins, no live business/Timeclock admin keys, private DB hostname `hc-secure-postgres-staging.railway.internal` with exact `/hc_owner_stage_test` and nonblank DB user/password, before delegating to existing Owner server preflight. Existing `staging/owner-security-server.js` unchanged. If wrong, server logs only a generic error and refuses to open port. This is extra defense, not proof of full secure DB/Timeclock configuration. Added six negative/positive cases `tests/hc-secure-staging-gate.test.mjs` commit `70429b1880fbc304eaa9246e2a036a32a5961acd` and previously authored `tests/hc-secure-staging-readiness.test.mjs`. **Both unexecuted; do not claim passing tests.**

**Staged source readback:** `hc-secure-auth-staging` now points to EXACT dev branch commit `70429b1880fbc304eaa9246e2a036a32a5961acd`, start command `node staging/hc-secure-security-server.js`; still no live deployment. GitHub **draft PR #77**: https://github.com/Tawgod/Lightspeed/pull/77, base `fix/owner-staging-activation-digest-20261123`; DO NOT MERGE TO PRODUCTION. No custom domain, DNS/gateway change or public route.

**Next safe test:** With working `Tawgod/Lightspeed` Codespace and dependencies installed, on branch `feature/hc-secure-staging-readiness-20261123`, run:

```bash
git fetch origin feature/hc-secure-staging-readiness-20261123
git checkout --detach origin/feature/hc-secure-staging-readiness-20261123
node --check services/security/hcSecureStagingGate.js
node --check staging/hc-secure-security-server.js
node --test tests/hc-secure-staging-gate.test.mjs tests/hc-secure-staging-readiness.test.mjs
```

**Unresolved prerequisites BEFORE live staging deployment:** (1) Configure PostgreSQL template's private password/roles safely and separately provision an empty DB with exact name and required least privilege, *not* a clone of live Owner database; (2) ensure verified HTTPS hostname + DNS/TLS and exact RP ID, with authenticated new-passkey registration/handoff strategy (existing WebAuthn credential cannot sign for different RP); (3) verify trusted Timeclock identity and separately scoped secrets without pasting credentials; (4) run source and disposable DB tests, then isolated auth browser negative and positive tests; (5) separate user approval for domain/gateway changes and later production integration; (6) authorize non-Owner staff enrollment separately, not via Owner-only setup. Current old Owner TOTP fresh 19:58:34Z 200 verified, but no new same-window passkey proof. **Production staff strong MFA still not enforced across tools.**

**Important risk:** Railpack PostgreSQL image service was staged from the PG18 public image, NOT created through Railway's managed Postgres template flow. Its automatic variable name listing lacks POSTGRES_PASSWORD and other bootstrap values. The DB is **not deploy-ready** without explicit safe provisioning, startup test, and DB restore/privilege plan. Do not run accept-deploy to discover missing values.

---

## Nov 23 fresh original-host MFA check — verified Railway 200

**Fresh user report:** “Success, verification accepted” after instructed original-host authentication check. **Live Railway confirmation:** isolated `HC PR63 Isolated Staging/staging/hc-owner-staging` HTTP log shows `POST /api/staff-auth/session` 200 at `2026-11-23T19:58:16.325477Z`, and `POST /staff-security/api/mfa/session` **200 at `2026-11-23T19:58:34.825572Z`** (1:58:34 PM CST); earlier GETs for authenticator/enrollment also 200 at 19:58:12 and 19:58:52 UTC. Server stays online, deployment SUCCESS, 1 running replica, 0 recent failures/warnings/criticals. **This is fresh server confirmation of MFA/TOTP session acceptance**, not evidence that the same latest login session performed fresh WebAuthn; recent HTTP records contain no new `/staff-passkey/authentication/verify` during 19:58 window. Prior independent WebAuthn `/staff-passkey/authentication/verify` 200 at 17:13:06Z remains historical proof. Never misstate this as a verified new-host passkey.

**Still pending:** New HC Secure/staging domain/DNS, separate DB activation/least-privilege migration, no-reset cross-RP passkey registration, complete staff MFA permissions and cross-production tool integration. Current HC Secure staged-only patch remains unapplied; do not copy keys, destroy original DB or enforce production security gates yet.

---
## Nov 23 continued readiness — dedicated database staged and cross-tool auth audit

**User scope:** “Proceed until we can test whether the credentials are still working. Then make sure employee security works correctly across productions so we can work on tools again.” No live production security gates authorized for blind rollout. **Progress:** HC Secure/staging already had staged Owner server `hc-secure-auth-staging` `8ef9adc0-2a4d-46c0-92cf-ba54834e33b5`. Added dedicated **staged-only** `hc-secure-postgres-staging` `454f4979-6148-4ee5-9857-97bc793dc72d` with exact PG18 image `ghcr.io/railwayapp-templates/postgres-ssl:18` and **staged-only** 5GB volume `hc-secure-staging-pgdata` `468ccb0a-3006-48b1-ac2d-f74293c7c075` at `/var/lib/postgresql/data`. Both app + DB and attached volume are part of existing pending patch `60012c69-e526-4778-9422-055d705150f2` in `HC Secure/staging` `120de974-f2e8-46be-9a00-8eb8b1be4cc4 / 8c8cd3a9-079f-4fe8-b8f5-a76c79813f0c`. **Nothing committed/applied/deployed/provisioned; no domain, secrets, Owner records, DB backup/restore/migration**. Do not accept-deploy until database secrets/roles/runtime verified, new-host origin/RPID and credential path reviewed.

**New development branch (source-only):** `Tawgod/Lightspeed:feature/hc-secure-staging-readiness-20261123` based on exactly current deployed Owner SHA `977f63b267f226a29b731541386d492bb537c312`. Added `tests/hc-secure-staging-readiness.test.mjs` (commit `b0c426a56b3575ceb58e2b727b85170ffe4b73c4`) for target origin/RP ID, strict dedicated DB, synthetic exclusion, independent signing/encryption key. Added `docs/HC_SECURE_AUTH_INTEGRATION_ACCEPTANCE.md` (commit `4074d6698ab7b659d6091b19ad682097908be4c3`) recording full Owner+staff acceptance, old/new host/CSRF, protected service callers and no-reset constraints. Tests **created, NOT YET EXECUTED** in Codespace; `node --test tests/hc-secure-staging-readiness.test.mjs` from dev branch. Do not trigger broad GitHub Actions.

**Verified cross-service variable name and deployed source audit (values never requested/disclosed):**
- Production Timeclock: `timeclock` source `Tawgod/Lightspeed@a595fd336c5a38dcc5ab5423a8967698777c0929`, supports Owner-staging separate identity service; remains authoritative for employee PIN identity.
- Production `special-orders-test` source `Tawgod/Lightspeed:integration/hobby-corner-consolidation`: runtime `server.js` `createStaffAuthGateway` with Timeclock PIN session when `SCANNER_ENABLED=true`; `shared-ui/staff-auth.js` still attaches optional `x-hobby-corner-key` legacy header. **No proof** universal staff MFA or exact operation grants on deployed routes.
- Production `lightspeed-api` uses same integration branch but lacks Scanner session secret vars; no proof of central staff MFA.
- Production `store-map` separate branch/service, no central staff auth verification yet.
- Rewards/Discord service identities must remain non-human and scoped, do not require interactive PIN/TOTP for background sync.
- `staff-security-staging` in Integration Test remains synthetic isolated login and is NOT canonical employee authorization for production tools.
- All original production workspaces and original Owner/staff staging services remain intact, no deployment changes.

**Immediate credential smoke request (user device):** Open existing `https://hc-owner-staging-staging.up.railway.app/staff-security/`, perform *fresh* Timeclock PIN session, registered Owner passkey verification, *fresh* 6-digit Authenticator session verification, and use **Check verification status** to get server approval. User should report only PASS/FAIL/nonsecret error, never codes, QR or credentials. Existing historic Nov23 HTTP 200s are not new proof. HTTPS RP ID at original host will remain unchanged, so this test can verify whether original credentials still work without exposing them or requiring transfer.

**Blockers to new-host test:** No custom domain/DNS/gateway, no deployed new HC Secure backend, new DB not provisioned/migrated; registered Owner credential remains bound to `hc-owner-staging-staging.up.railway.app` and cannot sign `secure-hc.timcorp-productions.com` assertions. Need reviewed old-RP authenticated cross-origin handoff or safe new RP registration; no PIN-only reset. Must do real device + negative tests before declaring new-host ready. No staff-wide enforcement until canonical non-Owner enrollment/revocation, grants, fail-closed and service caller compatibility verified.

**Current statuses:** original Owner staging Deployed+verified historically; HC Secure new app/db Staged-create, not deployed/tested; staff integration audit In Development and production strong-MFA across tools NOT verified. **No DNS/gateway/production changes or deletion.**

---

## Confirmed permanent security hostname — 2026-11-23

**Approved hostname decision:** User selected **`secure-hc.timcorp-productions.com`** for the new HC Secure security login service. This replaces earlier suggested `secure.timcorp-productions.com` (which was only a suggestion). Target origin **`https://secure-hc.timcorp-productions.com`**, target WebAuthn RP ID **`secure-hc.timcorp-productions.com`** for *new credentials registered against that host*. Keep both exact values synchronized in `HC_OWNER_STAGING_ORIGIN` and `HC_OWNER_STAGING_RPID` when a **new**, separately configured HC Secure environment becomes deployable, and in CSRF/signed challenge validation, cookie domain rules, allowed redirects and gateway configuration. Do not assume old Owner credentials registered against `hc-owner-staging-staging.up.railway.app` will work under the new RP ID; require an explicitly tested safe credential migration or additional registration with existing strong Owner authentication. For future customer auth, design separate credential audience/policies, not implicit employee/Owner sharing.

**Change scope this turn:** design/documentation decision only. **No public DNS, Timcorp gateway, Railway custom domain attachment, TLS, environmental secrets, Owner data, deployment or production route changed.** Maintain existing working Owner staging URL through test and cutover. Future exact DNS/gateway changes require explicit separately reviewed launch approval after domain ownership verification and hardware/browser passkey tests. New `HC Secure` candidate remains staged-only (10 pending config changes) with no database/domain/secrets and must not be deployed.

---
# HC Secure — Identity & Authenticator Consolidation Handoff

**Last verified:** 2026-11-23  
**Status:** In Development (new project created, deployment staged); Testing (original Owner flow verified, new replacement NOT tested); Deployed (original only, no new HC Secure deployment)

## Goal and ownership

Establish **HC Secure** as the private Railway project containing Hobby Corner's shared security infrastructure for employee, Owner, and eventual customer authentication. This is an organizational and deployment boundary, **not** permission to merge all identities or databases into one trust domain.

- Staff: canonical Timeclock employee identity + Owner/manager-approved enrollment, passkeys, TOTP and exact grants.
- Owner: same secure authentication infrastructure but independent high-impact Owner grants and recovery/audit controls.
- Future customer portal: *separate identity namespace, audience, database permissions, recovery, rate limits and secrets*; no employee/Owner account or claims derived from customer self-registration.
- Production changes, Timesclock / browser / extensions and customer-data access remain out of scope until separately tested/approved.

## Source

- Original deployed Owner app: `Tawgod/Lightspeed:fix/owner-staging-activation-digest-20261123@977f63b267f226a29b731541386d492bb537c312`.
- Original live isolated Railway Owner project: `HC PR63 Isolated Staging` `5b46096d-3178-47ec-ba88-d5037696346a`; environment `staging` `46b93c76-3085-4e76-a37d-90dfdd250dd2`; app `hc-owner-staging` `3a8f9555-90e5-4bc2-bb63-4f48d8c852d0`; dedicated Owner database `Postgres-x8Ui` `5c4498e4-cffb-4224-916a-af57391d1cd9`, volume `04530c8a-cf70-4857-9f9b-0828b47bc54c`. **Preserve** the application URL `https://hc-owner-staging-staging.up.railway.app/`, existing Owner credentials, immutable activation/recovery audit, TOTP encryption key and domain binding; never reinitialize or consume new recovery codes to duplicate.
- Original staff synthetic test: `Hobby Corner Integration Test/test` project `c4586f88-0a5e-4582-8e0f-3861d851567b`, app `staff-security-staging` `5c4e9d67-8ac0-4958-adf6-92387c7cdbca` at source `Tawgod/Lightspeed:feature/employee-admin-security-foundation-20261106@21a44f4f06ebaacec3d005344faa89f8907feb46`. **Keep until replacement tested and synthetic fixture retention reconciled.** This is not the real canonical employee/Owner gateway.
- Timeclock is a separate active production authentication upstream: `Hobby Corner/production/timeclock` `dd3469bd-5fce-43bc-b9f9-7aa2a7806457`. Do not move it into HC Secure as a side effect.

## Implemented (verified Railway state)

New private project **`HC Secure`** created in same workspace:

- Project ID: `120de974-f2e8-46be-9a00-8eb8b1be4cc4`.
- Environment: `staging` `8c8cd3a9-079f-4fe8-b8f5-a76c79813f0c`; **no production environment is provisioned or deployed**.
- Staged-only service: `hc-secure-auth-staging` `8ef9adc0-2a4d-46c0-92cf-ba54834e33b5`, immutable repo source `Tawgod/Lightspeed@977f63b267f226a29b731541386d492bb537c312`, start command `node staging/owner-security-server.js`, `/health` check and fail-only restart policy.
- Railway pending patch `60012c69-e526-4778-9422-055d705150f2` with **10 staged changes**, `staged-create` service and **no deployment, no domain, no variables, no volumes, no DB, no data/secret duplication**. **DO NOT ACCEPT/DEPLOY pending patch in this state:** the Owner runtime intentionally refuses startup without its dedicated isolated PostgreSQL, exact HTTPS origin/RP ID, canonical Timeclock adapter, independent keys and privileges.
- The existing original Owner app `hc-owner-staging` and original Owner DB each read back **online, 1 running replica**. Old synthetic `staff-security-staging` read back **online, 1 running replica**.

## Verified source and key migration constraints

1. `staging/owner-security-server.js` rejects startup unless `HC_OWNER_STAGING_DATABASE_URL` parses as exact database `/hc_owner_stage_test` and is different from the default `DATABASE_URL`; checks DB runtime role privileges before opening HTTP. This code explicitly does not migrate or provision accounts.
2. `services/security/ownerTimeclockStagingBundle.js` requires `NODE_ENV=test`, `HC_SECURITY_ENV=isolated-staging`, `HC_OWNER_STAGING_ENABLED=true`; canonical non-synthetic Owner employee; `HC_OWNER_STAGING_ORIGIN` must be exact secure origin and `HC_OWNER_STAGING_RPID` exact hostname; Timeclock approved service URL; independent high entropy secrets and AES-256 TOTP key; synthetic test PIN setup forbidden.
3. `services/security/ownerSecurityStagingMount.js` asserts **RP ID equals exact HTTPS host**, and mutating routes enforce exact Origin + same-origin Fetch Metadata. A WebAuthn credential registered for `hc-owner-staging-staging.up.railway.app` **will not authenticate on a new Railway hostname**. Copying its database or TOTP rows alone cannot make passkey assertion valid at new origin. Do not misstate DB duplication as a complete test migration.
4. Existing Owner mounting already serves both `/owner-setup` and `/staff-security` routes, but `ownerPasskeyTotpEnrollmentCandidate.js` restricts eligibility to exact canonical Owner employee and same-owner approval; the existing app **does NOT yet support arbitrary staff MFA enrollment**. Must implement/review a separate employee authorization path; do not expose it by relaxing Owner checks.
5. Original staff-security test `staging/staff-security-server.js` is a synthetic isolated test runtime; its passkey preflight hardcodes old `https://staff-security-staging-test.up.railway.app` origin. Don't blindly move its data/secret/config to real Owner host or weaken its tests.
6. Never cross-wire test-only staff identities into the real Owner DB, and never copy production Timeclock Secrets to the new project until exact security/env scope is approved.

## Tested

- New project readback: correct name and `staging`; one staged-only service at pinned tested source and correct command; zero variables, domains, volumes and deployment; original Owner and old synthetic staff app both unchanged and online.
- The **original** Owner registration, fresh passkey authentication, TOTP enrollment and MFA verification were independently supported by successful Railway HTTP 200 on 2026-11-23 (see `handoffs/owner-login.md`). These are NOT tests of new HC Secure clone.
- No new credentials, privilege escalation, SQL, service data transfer or browser test executed. **New replacement not deployed or runtime-validated.**

## Recommended migration steps / release gates

1. **Security-domain design:** choose a stable HTTPS security hostname and exact RP ID strategy that allows existing Owner credential continuity or separately authorizes a verified, no-reset registration procedure. Don't alter original Railway domain/DNS or reset existing Owner.
2. **Safe database strategy:** create a distinct and backed-up/tested staging PostgreSQL for HC Secure; review whether cloned Owner audit and encrypted TOTP rows should be migrated at all; check access-control/privilege grants, encryption-key custody, replay protections and append-only audits. Prefer an explicitly reviewed migration with readback over reinitialization. Do not duplicate/seal secrets into GitHub or logs.
3. **Staff integration:** reuse underlying staff authenticator components with genuinely authenticated canonical Timeclock session and exact employee permissions; never reuse Owner’s self-approval special case for staff. Keep synthetic regression fixtures isolated. Test approval, revocation, token audience, wrong-user and spoofed-role denial.
4. **Stage config only after protected requirements:** pin exact reviewed source, configure independently scoped runtime variables and database credentials, assign a new HTTPS host; do not apply the currently incomplete 10-change patch yet.
5. **Test replacement independently:** startup/health/DB role check, signed staff session, verified Owner passkey and TOTP enrollment, replay denial, CSRF/Origin and wrong-RP ID, session expiry, audit retention and Windows/phone browser acceptance. Use disposable test identities wherever possible; preserve and compare original service throughout.
6. **Only after verified:** request separate approval for public domain cutover, source/config deployment, identity migration, and original staff synthetic service deletion. Preserve original Owner service/DB as rollback until audited acceptance. Keep a distinct `production` environment and do not auto-promote staging variables and secrets into it.
7. **Future customers:** adopt a separate customer authentication audience and least-privilege principal/data boundary; do not attach customer accounts to Timeclock Owner bootstrap, or let customers gain store permissions through shared middleware.

## Shared dependencies

- Main production Timeclock and Lightspeed store apps must continue to operate unmodified.
- Timcorp gateway integration and Chrome extension queue separate. No DNS, gateway, extension deployment, email or app integration changed here.
- Existing older `HC Owner Security Staging` project is an abandoned never-deployed patch, not the active original Owner stage. Distinguish by project IDs.

## Decisions needed

- Choose stable security domain and verified passkey continuity plan before any live clone testing involving Owner.
- Approve separate DB backup/restore and restricted secret management if real Owner account data is copied. The user's earlier “no more backup” instruction concerned recovery-key ceremony; do not infer permission to move active Owner data without migration backup.
- Determine which employee roles/approval/recovery policy will be active; future customer access strictly separate.

## Restrictions

- No user PIN, TOTP seed, activation code, QR or raw secret sent to ChatGPT or committed to GitHub.
- Never run first Owner activation or second/final recovery ceremony again on existing DB.
- Never deploy `HC Secure` staging while missing migration prerequisites; no production deployment.
- No delete/reset of original Owner service, its DB volume, old synthetic test server or Timeclock app without exact separate approval.

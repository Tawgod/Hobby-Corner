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

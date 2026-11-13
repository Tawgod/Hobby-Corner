# First Owner Login — Current Handoff

## Railway Owner staging patch reconciled read-only — 2026-11-12

**Status: STAGED, not applied.** Inspected Railway pending patch `45d1db2e-1f10-4b27-94e0-c0970c5d2d28` in `HC Owner Security Staging` (project `2b350cde-048e-4402-bd92-4e8ba6c9f877`, test environment `db9d6e8c-bb03-441b-a154-80c11536dfbb`). The 55 entries consist of **three staged CREATE resources**: the `owner-security-staging` app (repo `Tawgod/Lightspeed`, pinned candidate commit `6b6498a01d0cfca42db273f00e97680d140a6ccb`, start command `node staging/owner-security-server.js`), `Postgres` (PostgreSQL 18 SSL image), and a dedicated `postgres-volume`. Some variables are staged but encrypted values are not available for approval. Railway marks patch **non-destructive**, but that is not proof it is complete or secure. **Not deployed:** no committed runtime for this project; the patch remains unapplied.

**Decision:** Preserve the patch but **do not commit** until its owner-specific source, environment values, secret availability, first-Owner commissioning authority, backend Timeclock contract, WebAuthn origin/RP ID, and database/migration+role separation have been independently verified. The code-only canonical employee preview PR #73 is **not** this staged service. Existing `HC PR63 Isolated Staging` locked Owner preview is separate and unchanged. Owner/password/PII values were not retrieved or disclosed.

---

## Canonical staff identity candidate must not bypass first real Owner — 2026-11-12

Draft [Lightspeed PR #73](https://github.com/Tawgod/Lightspeed/pull/73) adds code-only real-Timeclock *self identity* preview on top of the separately accepted synthetic pilot, not real Owner commissioning. Existing `ownerSecurityStagingMount`, unified Owner passkey/activation candidate and independent approver checks are reused **as future dependencies**, not duplicated. Scanner `role` and `canApprove` are explicitly stripped from the employee preview. A genuine independent Owner assignment reader is mandatory; no browser/PIN/synthetic 901 self-appointment or TOTP/passkey QR may be activated.

**Live Railway readback:** separate `HC Owner Security Staging` project `2b350cde-048e-4402-bd92-4e8ba6c9f877` has **55 STAGED changes** in `test`, not committed. Do not apply or deploy this patch without inventory/reconciliation and explicit approval. The existing locked Owner preview in `HC PR63 Isolated Staging` remains untouched. [Combined CI 43356076149](https://github.com/Tawgod/Lightspeed/actions/runs/43356076149) **73 PASS, 0 failed** on synthetic/fake Timeclock and disposable PostgreSQL. Real first Owner identity/device attestation and real role appointment remain **Blocked**, pending independent secure commissioning.

---

## Owner staging identities, secrets and locked HTTPS preview — 2026-11-12 (latest)

**System/feature:** Hobby Corner first Owner login pre-enrollment. **Status:** Database and app **Deployed in isolated staging**; restricted-credential and HTTP/denial tests **PASS**; **real Owner login not enabled / not commissioned**.

**Actual Railway source of truth:** `HC PR63 Isolated Staging` project `5b46096d-3178-47ec-ba88-d5037696346a`, `staging` environment `46b93c76-3085-4e76-a37d-90dfdd250dd2`.
- Owner database: new PG18 `Postgres-x8Ui` service `5c4498e4-cffb-4224-916a-af57391d1cd9`, volume `04530c8a-cf70-4857-9f9b-0828b47bc54c`, deployment `51d04bf4-0f3e-4716-ba17-8e756a1bc1be` **SUCCESS**, private network only, `hc_owner_stage_test` with nine reviewed tables, no Owner activations.
- Owner runtime/operator NOLOGIN groups prepared by [PR #65](https://github.com/Tawgod/Lightspeed/pull/65). Separate *password-locked* LOGIN identities `hc_owner_stage_runtime` and `hc_owner_stage_operator` created through [draft PR #66](https://github.com/Tawgod/Lightspeed/pull/66) code `87d180ebb9f0cd7f5e7e7bf96b284b53d108f99d`, one-off deployment `dd1982ec-11af-4e0a-9c32-3edd812b4061` **SUCCESS**. At that step, both passwords were NULL, zero activations.
- **Secrets:** Verified Railway `secret(48)` variable generation and same secret fingerprint across **two** isolated redeploys, then deleted the disposable probe. Generated independent 48-character runtime password and Owner app signing/session/throttle/passkey/approval/MFA and dedicated Timeclock stage secrets on the `hc-owner-staging` service. Generated **separate operator password only on the Postgres-x8Ui service**, not on the web app. A distinct 32-byte Base64 TOTP encryption key was generated. No credential value was printed in logs, chat or committed to Git.
- Credentials commissioned by [draft PR #67](https://github.com/Tawgod/Lightspeed/pull/67), pinned code `c66876dda8d2b93b5e806d61305f1f458d911120`, one-off private Railway deployment `d6893a1f-29a1-4df8-9199-819a65f87bee` **SUCCESS**. Exact success log `HC_OWNER_DB_CREDENTIALS_OK runtime=true operator=true wrong_password_denied=true activations=0`: actual SCRAM-SHA-256 role login, the production-equivalent read-only DB privilege preflight under the restricted runtime, forbidden operator TOTP/consume and forbidden runtime grant writes, incorrect-password rejection. Focused CI [43305401275](https://github.com/Tawgod/Lightspeed/actions/runs/43305401275) **SUCCESS**. Privileged one-off runner **deleted** after verifying source, SQL and logs.
- Owner web preview service `hc-owner-staging` `3a8f9555-90e5-4bc2-bb63-4f48d8c852d0`, Railway deployment `c97a3939-8372-4412-b2b7-c89ec8c9e610` **SUCCESS**, pinned [draft PR #68](https://github.com/Tawgod/Lightspeed/pull/68) source `60cefaf71d7b737753728f95f8474df17e99912c`. Preview URL **`https://hc-owner-staging-staging.up.railway.app/owner-setup/`**. Same origin/RPID reserved for future stage passkey. Runtime connects only as `hc_owner_stage_runtime` via generated reference URL, performs live DB privilege preflight before serving. The page explicitly does not accept login. `/health` returns `ready:false,locked:true`; PIN/passkey/Owner routes HTTP **423**. No production Timeclock calls, public role grants, activation token, PIN or factor.
- CI [43306590232](https://github.com/Tawgod/Lightspeed/actions/runs/43306590232) **SUCCESS** for locked app source/preflight; [43307211049](https://github.com/Tawgod/Lightspeed/actions/runs/43307211049) **SUCCESS** for actual Railway HTTPS read-only smoke (locked UI, health, fake PIN/passkey/Owner header 423, unknown route 404). Supporting bootstrap CI [43307210828](https://github.com/Tawgod/Lightspeed/actions/runs/43307210828) SUCCESS. Latest test-only source head `6bdee3564bd2487ce1affec6680908b7872da845`, deployed runtime stays pinned to `60cefaf7...`.
- Railway read-back: Owner web service, Owner PG, foundation Store Operations and its separate PG **online**, no pending patch; the original obsolete `HC Owner Security Staging/test` 55-change patch remains **staged/unapplied**. Production Timeclock continues approved default-disabled `a595fd3` deployment `5c08d15e`, no production DB migration or Owner variables/role activated.

**Remaining Owner-presence/approval gates (not included in staging scope):** Review and expressly approve `timeclock/db/hc_owner_stage_login_limits.sql` additive production Timeclock throttle schema against backup; commission matching dedicated server-to-server secret and exact canonical active employee allowlist privately in Timeclock, leaving Owner permissions narrow; switch isolated Owner staging app from **locked preview** to existing real `staging/owner-security-server.js` only after DB/identity/preflight and URL/CSRF tests; issue first Owner single-use 10-minute activation from an interactive private operator terminal; have owner use existing PIN on trusted staging HTTPS, physically register passkey and Google Authenticator, then acceptance of revocation/replay and recovery. Passkeys are RP-ID-specific: staging enrollment cannot be treated as a credential on the future `timcorp-projects.com` origin; production requires separately authorized enrollment.

**Safety:** No actual Owner created, no PIN collected, no activation issued, no employee/customer records copied, no real Lightspeed/Discord operations, no Chrome extension change, no production schema/Timeclock enablement, no central gateway/DNS change. The Owner preview does **not** imply that sign-in is available. Secret values must stay in protected Railway configuration/private operator control.

---


## Dedicated Owner database / privilege bootstrap complete — 2026-11-12

**Owner-approved scope:** Isolated Owner database provisioning and restrictive access groups, without deploying Owner web login or touching production.

**Status:** Database **Deployed**, initial schema & NOLOGIN privilege groups **Testing PASS**; real Owner login **In Development / not deployed**.

- **Database:** New independent Railway PostgreSQL 18 `Postgres-x8Ui` service `5c4498e4-cffb-4224-916a-af57391d1cd9`, deployment `51d04bf4-0f3e-4716-ba17-8e756a1bc1be` **SUCCESS**, isolated `HC PR63 Isolated Staging/staging` project `5b46096d-3178-47ec-ba88-d5037696346a`, environment `46b93c76-3085-4e76-a37d-90dfdd250dd2`, separate durable volume `04530c8a-cf70-4857-9f9b-0828b47bc54c`, **no public domain/TCP proxy**, no production data. Separate from the existing Store Operations staging database.
- **One-shot migration:** [draft PR #65](https://github.com/Tawgod/Lightspeed/pull/65), source `feature/owner-db-isolated-bootstrap-20261112@81d23862428ceb3e35dafa32f575e7ab9135e2b5`. Its safety CI [43297855881](https://github.com/Tawgod/Lightspeed/actions/runs/43297855881) SUCCESS. A disposable private-network Railway runner pinned to exact source/environment applied six reviewed Owner schema files + `db/hc_owner_staging_privilege_groups.sql` under `hc_owner_stage_test`, verified **9 required tables, 2 NOLOGIN privilege groups, 0 activations**. Exact read-back success log `HC_OWNER_DB_BOOTSTRAP_OK tables=9 nonlogin_groups=2 owner_activations=0`, deployment `bf0cde18-9384-4d20-8ffe-577dcdea4bb2` SUCCESS.
- **Privilege separation:** The runtime group cannot create/delete an activation, alter employee/digest/expiry, or read operator secret; it can read/consume approved activation columns. The operator group can issue a first activation but cannot read TOTP or consume it. Both groups have NOLOGIN, no SUPERUSER, no CREATEROLE, no CREATEDB. PUBLIC DB CONNECT and schema CREATE revoked; no real employee account data, PIN, passkey or seed in DB. No LOGIN role or reusable password created yet.
- **Cleanup:** The temporary DB provisioner `hc-owner-db-bootstrap` service `6d29f944-e322-44c6-ac72-74904b3153cc` was deleted after confirming success, removing its temporary root database URL reference. The database and volume remain SUCCESS; existing Store Operations staging deployment `4cae33bf-1569-4b2d-90a0-2aee9e5de55e` unchanged and healthy. No staged patch remains in the active foundation staging project.
- **Old Owner staging patch:** The separate original `HC Owner Security Staging/test` project still has the **55-change STAGED patch `45d1db2e-1f10-4b27-94e0-c0970c5d2d28`**, containing a not-configured app and another proposed Postgres. Not committed. **Do not apply or duplicate it**; future Owner app can join the now-ready staging project and access the new Owner DB over private networking, after resolving protected runtime/operator credentials.
- **Remaining:** Separate private LOGIN roles/password custody, exact canonical real Timeclock employee ID, independently protected integration credentials, production Timeclock **additive throttle SQL** (still unapplied), staging app HTTPS/RP ID and data-role preflight, operator-only 10-minute activation, real device passkey and Authenticator. The production Timeclock Owner-verifier code remains deployed **disabled** as previously authorized. No production DB migration, live Owner permission or Timcorp gateway changes.

**Manager next:** Prepare private LOGIN role/secret handoff and run read-only runtime/issuer permission tests using those logins. Request approval for the distinct production Timeclock rate-limit SQL only when staging ID/secret path is ready. Owner activation must be performed interactively by the owner on their own device and verified employee account. Details: [PR #65](https://github.com/Tawgod/Lightspeed/pull/65) `docs/OWNER_STAGING_DB_ISOLATED_BOOTSTRAP.md`.

---


## Timeclock code-only release completed — 2026-11-12

**Verified:** **Deployed (production Timeclock code only)**; Owner endpoint intentionally **Disabled**; Owner staging application and real Owner account **Not Deployed / Not Commissioned**.

- **Approval and exact scope:** Owner explicitly approved default-disabled Timeclock PR #59 code-only production release. Railway `Hobby Corner / production` staged patch `20177311-bc46-41cb-b9c6-05b6760a9a6f` was rechecked before commit: exactly **two** changes, both on Timeclock `dd3469bd-5fce-43bc-b9f9-7aa2a7806457` source, branch to `feature/owner-timeclock-scoped-credential-20261110` and pinned SHA `a595fd336c5a38dcc5ab5423a8967698777c0929`. No destructive patch, no other resources.
- **Action performed:** Railway `accept_deploy` committed that patch. **New production Timeclock deployment `5c08d15e-7341-43d9-83bb-a1d495df9e16` SUCCESS**, exact git SHA `a595fd336c5a38dcc5ab5423a8967698777c0929`; runtime log reports `Timeclock listening on port 8080`. Railway health overview Timeclock **online**, 0 warnings and 0 critical alerts. Deployment rollback currently available.
- **Unchanged production:** `special-orders-test` deployment `201d651f-62b6-43c5-aba3-59fd97f6fe09` and `lightspeed-api` deployment `288d5089-62d4-4f22-9c7f-8fdd26d8574d` remain SUCCESS on consolidated git `014a7a949fe570b756b48d8f59995c1b0a434859`. Production patch is now **null/empty**, no pending work. Previous Timeclock commit `014a7a9` is available as rollback deployment `eaaa2b25-2ab5-4b14-b712-f7a6d89e8557` (now REMOVED, `canRollback=true`).
- **Deliberately not activated:** All `OWNER_STAGING_*` environment variable names remain **absent** on Timeclock; `OWNER_STAGING_IDENTITY_ENABLED` is not `true`. New routes are installed in code but return 403 for missing config even before DB. No `hc_owner_stage_login_limits` SQL was applied, no credentials or real employee ID were set, no Owner role/passkey/Authenticator was enrolled. Existing Scanner/PIN endpoints and credentials unchanged.
- **Automated tests:** GitHub [Owner Timeclock 42885171115](https://github.com/Tawgod/Lightspeed/actions/runs/42885171115) and [Scanner regression 42885171145](https://github.com/Tawgod/Lightspeed/actions/runs/42885171145) SUCCESS on the deployed exact commit. Railway health/readiness PASS. No authenticated live Scanner or Timeclock employee integration test was performed after deployment, and that is a separate verification boundary.
- **Pending next gate:** Owner staging database/schema and dedicated least-privilege runtime/operator PostgreSQL credentials + HTTPS origin and own security secrets; later **separately authorized** additive production throttle schema migration and default-off dedicated Timeclock credentials/employee binding; final private first Owner one-use passkey and Authenticator enrollment. Review existing 55 staged changes on `HC Owner Security Staging / test` before any commit. No production Owner access or Timcorp gateway change.

---


**Last verified:** 2026-11-12  
**Status:** Timeclock code Deployed; Owner login In Development / Testing — real account not commissioned

## Source
- **Repository:** `Tawgod/Lightspeed`.
- **Timeclock first-Owner verifier:** [draft PR #59](https://github.com/Tawgod/Lightspeed/pull/59), `feature/owner-timeclock-scoped-credential-20261110@a595fd336c5a38dcc5ab5423a8967698777c0929` (seven changed paths, 12 commits ahead/0 behind consolidated production).
- **Owner staging setup:** [draft PR #60](https://github.com/Tawgod/Lightspeed/pull/60), `feature/owner-staging-scoped-timeclock-adapter-20261110@6b6498a01d0cfca42db273f00e97680d140a6ccb` (original tested implementation). New docs-only runbook commit `64abf052c35bcb3f4aa766eef29e04dfd698e52f`.
- **Shared web/security base:** [draft PR #63](https://github.com/Tawgod/Lightspeed/pull/63), active isolated zero-grant staging guard; **does not include Owner login**.
- **Coordinating handoffs:** `handoffs/employee-admin-security.md`, `handoffs/shared-web-foundation.md`, `handoffs/hobby-bot-security-enrollment.md`.

## Implemented
- Default-disabled additive Timeclock Owner staging identity API with **independent server-to-server secret**, exact real active employee allowlist, no synthetic 901, PIN unchanged, persistent global throttle and separated Scanner auth.
- Standalone Owner staging server, exact origin/WebAuthn relying-party check, restricted signed staff session, first Owner operator-only one-time activation issuer, actual passkey enrollment and Authenticator/TOTP candidate using existing encrypted factor stack, no automatic owner role from browser flags or user PIN alone.
- Source-reviewed schema to create an isolated owner staging database and separate NOLOGIN runtime/operator groups, with read-only privilege preflight. Migration and credential issuance **not run**.
- New release checklist: `Tawgod/Lightspeed:feature/owner-staging-scoped-timeclock-adapter-20261110/docs/OWNER_SETUP_EXECUTION_CHECKLIST_20261112.md`.

## Tested
- **Automated:** PR #59 GitHub Actions Owner Timeclock `42885171115` and Scanner regression `42885171145` SUCCESS. PR #60 Owner scoped Timeclock adapter `42885210169` and Scanner `42885210127` SUCCESS. Existing synthetic DB tests include PostgreSQL 16/18, signed mock staff, factor and operator approval boundaries. They do not commission actual Owner identity.
- **Real-timeclock/browser/hardware:** Not done. Actual real Timeclock employee ID and passkey hardware not used; no actual Owner factor stored.
- **Database recovery evidence:** Prior operator reported a successful disposable PG18 restore (54 tables) from encrypted production archive, and exact matching external USB SHA-256. Passphrase custody reported in password manager. Google Drive copy was user-reported, not independently confirmed by file metadata/checksum; do not claim cloud copy verified.

## Deployed
- **Production Timeclock:** Existing running deployment `eaaa2b25-2ab5-4b14-b712-f7a6d89e8557`, consolidated source commit `014a7a949fe570b756b48d8f59995c1b0a434859`, deployed November 4, 2026, still **SUCCESS**, `canRollback=true`.
- **Timeclock source patch:** Railway `Hobby Corner/production`, `20177311-bc46-41cb-b9c6-05b6760a9a6f` remains **STAGED, NOT APPLIED**, exactly two changes: Timeclock source branch -> PR #59 and pinned source commit `a595fd3`. No destructive changes, no changed secrets, database, other services or deployment in this run. Current production Timeclock variable names contain no `OWNER_STAGING_*` settings; Owner route must remain disabled.
- **Owner dedicated isolated staging:** Railway `HC Owner Security Staging/test`, project `2b350cde-048e-4402-bd92-4e8ba6c9f877`, environment `db9d6e8c-bb03-441b-a154-80c11536dfbb`. `55` staged non-destructive changes (Owner app/PG18/volume), **zero deployed instances**. Applying entire patch without separate DB roles/schema/secrets would deliberately fail app startup. No Owner staging HTTPS link exists yet.
- **Public Timcorp:** `timcorp-projects.com/HobbyCorner` remains inactive; no Owner hostname configured.

## Shared dependencies
- Real existing active canonical Timeclock employee identity and unchanged PIN (never ask for PIN in chat); authenticated independent scoped server integration from production Timeclock only after approved code and dedicated schema/credentials.
- New isolated HTTPS staging hostname and exact WebAuthn RP ID, independent signing/session/MFA/TOTP keys and approved least-privilege runtime/operator DB roles. The Owner staging app expects **root-origin** routes; the `/HobbyCorner` path is a separate future integration. WebAuthn credential enrolled on Railway staging hostname **will not automatically work on** `timcorp-projects.com`.
- Owner private operator terminal, independent single-use 10-minute activation, real device passkey and Google Authenticator, recovery plan.
- Preserve production Timeclock/Scanner, Lightspeed, Discord and Store Operations while isolated Owner is tested.

## Remaining blockers
- Production Timeclock release is still stage-only, despite earlier narrowly scoped code-only approval discussion. **No action to apply production changes without deployment-specific explicit confirmation**, verified backup/rollback and a one-service patch preflight.
- PR #59 additive global-login-throttle table is unapplied; enabling Owner identity requires separately authorized SQL on production Timeclock with backup/recovery.
- Owner staging project patch is not deployable as currently configured: no isolated database/runtime-role/grants, HTTPS origin, private secrets or verified canonical employee binding.
- No actual physical passkey/TOTP enrollment; first Owner not yet established; no production Owner permission.
- No shared Timcorp path integration for Owner sign-in; RP ID and cookie/CSRF same-origin review pending.

## Decisions needed
1. Confirm **Timeclock-only code-only release** of exactly PR #59 at pinned SHA `a595fd3`, leaving Owner endpoint disabled and applying **no** SQL or Owner secrets/roles. Production change with backup/rollback boundary.
2. Independently approve isolated Owner staging database/schema/privilege/secrets setup, then app deployment.
3. Privately select exact canonical active Timeclock employee ID and physical passkey/Authenticator; no PIN, ID or activation token in public chat or source logs.
4. Owner-presence ceremony / recovery procedure and future production Owner commissioning approved independently.

## Recommended next action
- Ask for the specific code-only Timeclock deployment confirmation; then apply only the two-field staged patch and read back Timeclock health, deployed commit, Scanner behavior and unchanged Special Orders/Labels deployments. The existing rollback candidate is deployment `eaaa2b25-2ab5-4b14-b712-f7a6d89e8557`.
- After that, provision Owner isolated DB independently of the app and coordinate the private real identity/device setup, never activating fake Owner credentials or production Owner permissions.

## Restrictions / safety
No production deployment, SQL migration, employee identity read, PIN change, fake Owner assignment, passkey/TOTP enrollment, service credential issuance, Railway patch commit, web gateway/DNS or Chrome release occurred during this read-only preflight.

## Documentation
- `docs/OWNER_LOGIN_STAGING_RELEASE_PLAN.md` and `docs/OWNER_STAGING_SETUP_READINESS.md` on PR #60.
- `docs/OWNER_SETUP_EXECUTION_CHECKLIST_20261112.md` on PR #60.

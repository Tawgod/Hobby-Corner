# Hobby Corner Security Enrollment — Current Handoff

**Last verified:** 2026-11-05  
**Status:** Synthetic test PIN login: **Deployed / user-tested before latest update** | One-time setup retirement: **Deployed / CI passed / user browser login verified** | First Owner passkey: **Testing / not deployed** | Malcor status and invitations: **In Development / not deployed**

## Current authoritative snapshot

### Ownership and sources
- Backend: `Tawgod/Lightspeed` PR #32, `feature/shared-lightspeed-services-phase1-20261029`. Latest confirmed Phase 1 head `5db3b8d8850247433939de59b5d7141f20f7f1c9`, Foundation `42045052408`, Scanner `42045052388`, Core Operations `42045052696` all **SUCCESS**. The shared foundation integration test runner now serializes disposable PostgreSQL schema tests to prevent the earlier concurrent-DDL flake. Stacked Phase 2 draft PR #33 head `1ca3f33bbcc092bb2d6e373696b6a05b6b6b0915` now mirrors the relevant isolated PIN and Owner passkey code/schema/test assets; its latest branch-head CI remains independently unverified. Foundation workflow was updated to allow Phase 1 as a PR target, but no Phase 2 CI was returned by the connected GitHub tool.
- Malcor: `Tawgod/Malcor` draft PR #8, `feature/hobby-corner-owner-security-test-20261103`; owner-only `@Malcor hc security status` and separate disabled invitation candidate. Shared module docs in draft PR #3. Current live bot/AI unchanged.

### Implemented and tested
- The synthetic account (`901`, owner Discord ID `115626919134887940`) previously completed real browser PIN creation and successful sign-in; the user confirmed on 2026-11-05 that the existing PIN still works after retirement.
- **PIN hardening:** database-backed PIN validation is independent of the one-time setup route and setup key. Regression tests cover correct PIN after closing setup, incorrect PIN, and rejected setup.
- **First Owner passkey candidate:** exact staging owner/guild/host, signed synthetic employee session + separately provisioned 256-bit independent bootstrap key, real WebAuthn registration verification, DB-backed challenge, four-hour one-use grant and append-only audit. A denied bootstrap rolls back the credential plus event atomically; disposable PostgreSQL tests, client regression, and route preflight passed. **Not deployed, no secret provisioned, no device acceptance yet.**
- Read-only audit identified high severity `adm-zip` and `xlsx` dependencies; tracked at `Tawgod/Hobby-Corner` [issue #1](https://github.com/Tawgod/Hobby-Corner/issues/1). Remediation and import/export testing not yet completed.

### Verified Railway deployment
- **User-authorized test-only retirement** `Hobby Corner Integration Test / test`: accepted narrow Railway patch `679a3524-f460-45ce-84fe-f451127a851b` on 2026-11-05. Source pinned to Lightspeed `49c81533fe2c6bbeb3189319afc039299b95be96`. `HC_STAGING_PIN_STORE_MODE=database`; `HC_STAGING_PIN_SETUP_ENABLED=false`; consumed `HC_STAGING_PIN_SETUP_KEY` set empty. Security API deployment **`ce2d7703-5e14-413d-8e21-f57299733038` SUCCESS**, `/health` Railway healthcheck passed, 1/1 replica online. Isolated PostgreSQL and existing Consignment both online, unchanged. No other service or production deployment.
- External HTTP checks from this tool environment cannot resolve the generated HTTPS hostname. User confirmed the original `/test-login` still works with the existing test PIN after retirement. The retired `/test-pin-setup` should no longer allow creation; browser verification of that route remains outstanding.
- **Staged only, NOT deployed**: next test patch `43c28c64-63db-436e-b5ce-909f97949a4d` pins newer verified Phase 1 commit `24e543b55071c072baa49113d164130ade5a2b99` with `HC_STAGING_OWNER_PASSKEY_ENABLED=false`. It would introduce the guarded but disabled passkey code, not factor enrollment. Require separate approval before accepting.
- **Staged only, NOT deployed:** Malcor separate `staging` patch `0d760293-efc3-40bd-87b4-58893b905e31` contains only the Malcor service source/owner test configuration, with `MALCOR_HC_STATUS_ENABLED=true` and `MALCOR_HC_SECURITY_ENABLED=false`. No CI evidence for latest Malcor PR #8 or real Discord round-trip. Do not accept without separate review and user authorization.

### Dependencies, safety and blockers
- No real Timeclock employee integration, no first Owner passkey, no manager approval, no TOTP QR or factor enrollment deployed. Production Lightspeed, Timeclock, Chrome extension and production Hobby Bot unchanged.
- Before opening Owner passkey pilot: review passkey bootstrap key handoff via secure Railway administration, generate separate WebAuthn signing secret, approve isolated migrations, test the real device, design backup/recovery and audit.
- Before activating Malcor invitation: connect independently authorized security backend and verify exact `staff.authenticator.invite` permission, one-time tokens, separate manager proof, and private delivery. Never use PIN or Discord owner role alone as approval.
- Complete the dependency risk review before treating test login as production-grade.

### Recommended next action
Owner re-tests [staging login](https://staff-security-staging-test.up.railway.app/test-login) using the existing four-digit **test** PIN (never provide the PIN in chat). After that, seek explicit separate approval for the disabled-passkey-code staging patch and status-only Malcor patch; later prepare reviewed one-use first Owner passkey ceremony. Neither staged patch should be conflated with permission to enable QR enrollment.


## 2026-11-05 — PIN retirement browser acceptance verified
- **User acceptance (2026-11-05):** "Pin still works." The existing four-digit synthetic staging PIN successfully signs in after deployed retirement `ce2d7703-5e14-413d-8e21-f57299733038`. This closes the live sign-in regression check. The PIN was not disclosed or stored in chat/GitHub.
- **Still to verify:** direct browser access to the retired PIN setup page is blocked; passkey and Authenticator routes remain off. Do not enable factor enrollment without independent device/approval tests.

---

## Historical development notes (retained for traceability)

**The following dated entries are prior checkpoints; they are not the current deployment state.**

## Source

- Discord Bot: `Tawgod/Hobby-Corner-Discord-Bot:feature/security-enrollment-invites-20261102`, draft [PR #3](https://github.com/Tawgod/Hobby-Corner-Discord-Bot/pull/3), latest verified head `8a56078399d2a31af6851947d71695486e003ed9`.
- Security backend: `Tawgod/Lightspeed:feature/shared-lightspeed-services-phase1-20261029`, existing PR #32, latest verified `9e3b36e9b867c69dfa74d5676f0d4a5a6dd06a35`; mirrored on stacked draft PR #33, which remains ancestry-blocked and whose latest CI was not independently checked.
- Documentation: Lightspeed `docs/STAFF_DISCORD_ENROLLMENT_TESTING.md`; Bot `docs/STAFF_SECURITY_ENROLLMENT.md`.

## Implemented

- Hobby Bot development command `/hc security_setup` chooses a Discord employee; exact configured Staff/Admin/Owner roles and single approved guild; only Admin/Owner may issue. Private employee DM with ephemeral manager-only fallback.
- Bot-authenticated backend invitation, exact guild/role checks, active Timeclock Discord account linking for manager and employee, exact per-operation `staff.authenticator.invite` permission, durable throttle, 15-minute random one-use invitation stored only as keyed HMAC, issuer/redeemer audit.
- URL fragment held in browser memory and stripped before requests; employee Timeclock signed session is mandatory for token redemption. Invitation redemption creates only the existing employee/session-bound *pending approval request*. Existing manager passkey + exact `staff.authenticator.enroll` permission must separately approve.
- Invitation-only option disables direct employee self-request. Existing approved flow generates the private backend QR/manual setup key, verifies first six-digit code, activates encrypted TOTP factor.

## Tested

- Discord Bot draft PR #3 CI `41486273875` PASS (Python syntax, exact role IDs, destination/call validation).
- Lightspeed Phase 1 CI `41485971503` foundation PASS, `41485971579` Scanner PASS, `41485971679` Core Operations PASS at `9e3b36e9...`.
- Disposable Postgres/HTTP end-to-end synthetic test passes: private bot API, signed employee PIN login, cross-employee denial, forged manager-role denial, one-use token, existing independent manager *fixture* approval, locally generated PNG QR, real TOTP confirmation, status active and immutable audit.
- Browser VM test passes: fragment removal before network, one-time authorized redemption, manager pending state, status refresh without replay.
- **Not yet tested:** actual Discord interaction, real owner/admin passkey on a physical device, real employee Authenticator app, mobile/staff acceptance, staging API.

## Deployed

- **None of this candidate is deployed.** Production Discord bot remains on `main`; Railway production Lightspeed services remain on consolidated integration branch; no migration, API mounting or real security-factor writes.
- Existing Railway project `Hobby Corner Integration Test` has test environment `24b41ef2-e3d8-4c7a-b011-355204ecf075`, but as verified 2026-11-02 it only hosts `consignment-beta`. No security API, Postgres or bot provisioned there.

## Shared dependencies

- Timeclock active staff identity and trusted mapping to Discord user ID, existing signed staff session gateway.
- Exact backend `canInvite` and `canApproveEnrollment` operation grants and independently verified manager passkey.
- Existing `staffSecuritySubsystem` approvals, QR/TOTP and browser settings, plus dedicated test-only Postgres/HTTPS.
- Bot source is shared with existing Timeclock PTO/shifts and Rewards. Do not alter its live `main` without coordinated acceptance.

## Shared files / integration surfaces affected

- Discord Bot `main.py`, `security_invite.py`, draft CI/tests.
- Lightspeed `services/security/staffSecuritySubsystem.js`, `staffEnrollmentInvitations.js`, settings router, new invitation router/SQL, `staff-security-client.js`, CI/tests.
- **No Chrome extension changes or release-queue item**.

## Remaining blockers

- Initial independent owner/manager passkey bootstrap and lost-factor recovery; no PIN- or Discord-role-only bypass.
- Secure disposable staging service/database, configured test bot app, HTTPS origin, dedicated rotating secrets, test role IDs and approved test Timeclock identities. Guard against live production data.
- Trusted reverse-proxy IP and login throttling, DM/link leakage review, employee sign-out, real phone/Authenticator hardware acceptance and Timeclock legacy bypass hardening.
- Stacked PR #33 branch ancestry must be reconciled before coordinated integration.

## Decisions needed

- Which independent secure procedure will bootstrap the first Owner passkey.
- Approve configuring isolated staging services and employee test identities, with no access to live customer/employee records.
- Confirm test Discord guild, exact role IDs and selected pilot employee after secure bootstrap.

## Recommended next action

Arrange independent owner passkey bootstrap and an isolated HTTPS, disposable-Postgres security environment (existing test project can host *additional separate services* if approved); then run one real manager-issued invite through Google Authenticator before authorizing any production change.

## Restrictions / safety

- Do not merge PRs, deploy bot main, mount production routes, apply live migration or read live secrets without separate authorization.
- Keep QR/TOTP seeds off Discord; bot invitation is not itself approval.

## Railway isolated test provisioning staged — 2026-11-02

- User authorized beginning Railway test environment configuration. Existing project `Hobby Corner Integration Test` (`c4586f88-0a5e-4582-8e0f-3861d851567b`), environment `test` (`24b41ef2-e3d8-4c7a-b011-355204ecf075`).
- **Staged only, not deployed:** Railway PostgreSQL template (includes its own `postgres-volume`), empty `staff-security-staging` service (`5c4e9d67-8ac0-4958-adf6-92387c7cdbca`), empty `hobby-bot-security-test` service (`55bea846-a9c0-4f2e-8ed6-abde18d90269`); patch `ae35bd65-381a-4b33-804c-a7bbdfb4853d` contains 46 pending changes after non-secret environment labels. `consignment-beta` was not touched. The flags `HC_ENROLLMENT_MODE` and `SECURITY_ENROLLMENT_MODE` are labels only, not enforced auth controls.
- **No source connected, no service deployed, no test Postgres initialized, no public domain exposed and no credentials configured.** The general Lightspeed package starts production `server.js`; do not connect that as a staging service until an isolated security-only entrypoint exists. The Discord bot likewise needs an isolated startup and test bot application token, never the live bot token.
- Next: create dedicated security-staging HTTP entrypoint with test-only trusted staff account lookup and independently verified owner-passkey bootstrap; configure test Discord bot application/guild roles and dedicated service secrets safely; review stage patch before accepting changes. No live employee, Lightspeed, or Timeclock dataset should be connected without explicit scope approval.

## Security-only Railway staging entrypoint — 2026-11-02

- Implemented fail-closed `staging/staff-security-server.js` on Lightspeed Phase 1 PR #32; mirrored to stacked Phase 2 PR #33, with `tests/shared-security-staging-entry.test.mjs` and CI. It requires `NODE_ENV=test` and `HC_SECURITY_ENV=isolated-staging`, runs without main production `server.js`, exposes `/health` and rejects all security API calls (503) until separately verified trusted adapters are mounted.
- Railway Integration Test `test` environment patch `ae35bd65-381a-4b33-804c-a7bbdfb4853d`: staged security API start command `node staging/staff-security-server.js` and `/health` check, 48 pending changes last confirmed. No accept/deploy, source attachment or real secrets performed.
- Missing: isolated real employee identity/PIN verifier, independent first Owner passkey bootstrap, separate Discord bot credentials and guild role IDs, restricted staging database initialization, application route composition and HTTPS end-user domain. Do not consider `ready:false` health a working login.

## Railway test source and database wiring — 2026-11-02

- Staged in `Hobby Corner Integration Test:test` (patch `ae35bd65-381a-4b33-804c-a7bbdfb4853d`, last observed 57 changes): `staff-security-staging` GitHub source `Tawgod/Lightspeed:feature/shared-lightspeed-services-phase1-20261029`; `hobby-bot-security-test` source `Tawgod/Hobby-Corner-Discord-Bot:feature/security-enrollment-invites-20261102`; security API `DATABASE_URL` references the isolated `${{Postgres.DATABASE_URL}}` Railway service variable (no copied database password). Existing `consignment-beta` has **zero pending changes**.
- **Still staged, not deployed:** no private bot token, no Owner passkey, no custom/test guild roles, no domain or initialized security schema. Source attachment alone does not activate the login: staging entrypoint stays `ready:false` and returns 503 for factor/employee APIs until trusted adapters are mounted. Do not activate the test bot with the production Discord token.

## Malcor standalone, reusable test bot architecture — 2026-11-02

- User chose **Malcor** as a cross-project test Discord bot, separate from live Hobby Bot and ultimately a separate GitHub repository (suggest `Tawgod/Malcor`). Test guild: `1485804234753573066`; text channel: `1566905099429744700`; forum: `1566904908068946151`.
- Staged **new, empty** Railway service `malcor` (`d813e814-209b-4528-96c0-efeb37da139c`) in `Hobby Corner Integration Test:test`, current pending patch `ae35bd65-381a-4b33-804c-a7bbdfb4853d`. Staged non-secret `MALCOR_GUILD_ID`, `MALCOR_CHANNEL_ID`, `MALCOR_FORUM_ID`, `MALCOR_MODULES=core` and start command `python -m malcor`. No token, source attachment, deployment or installed Discord app.
- Packaged 19-file standalone Python `discord.py` repo starter and three passing local config tests as a conversation file `Malcor_starter_repository.zip`. Includes modular commands (`/malcor status`), git CI, changelog, module registry, PR checklist, deployment ledger, project-specific handoff snapshot, railway.toml. **The archive has not been uploaded to GitHub.**
- Connected GitHub integration exposes no repository-creation action. User must create `Tawgod/Malcor`, upload starter, and create a **new Discord Developer Portal Malcor application** (bot token should be entered privately into Railway, not chat). Bot can then be connected to the staged Railway service. Scoped permissions: bot/applications.commands, View Channels, Send Messages. No admin or privileged intents needed for core.
- The earlier `hobby-bot-security-test` staging service remains staged as legacy pilot; **do not deploy it** alongside Malcor to the same test guild until the migration strategy is resolved. Hobby Corner enrollment module for Malcor remains PLANNED, not implemented or activated. Existing live Hobby Bot unchanged.

## Independent Malcor test bot verified — 2026-11-03

- **Canonical reusable test bot:** private `Tawgod/Malcor:main`, TypeScript/Node mention-triggered AI assistant, not the old Python starter. Separate Railway project **Malcor** `eadb4129-07e1-4599-bf89-21a6fa2583b9`, environment `staging` `cf0cd4f3-8125-4123-b59b-d66e4d9bb677`, service `malcor-discord-bot` `7f6dd4e8-cb20-407b-b129-afd9971cf0dd`. Verified online, deployment `6fd76700-54b6-47d5-9af8-8eefd46c18ea` SUCCESS, logs show Gateway READY and an authorized mention-triggered status/AI response. Required bot/Guild/Owner/AI key variable **names** exist; no values read or changed. Test guild intended `1485804234753573066`, channel `1566905099429744700`, forum `1566904908068946151`; configured ID *values* not independently verified from Railway (OAuth returns names only).
- **Shared project tracking:** documentation-only draft `Tawgod/Malcor` [PR #3](https://github.com/Tawgod/Malcor/pull/3) on `docs/shared-module-change-coordination-20261103`; adds `CHANGELOG.md`, `docs/MODULE_REGISTRY.md`, `docs/CHANGE_REQUEST_TEMPLATE.md`, `docs/DEPLOYMENTS.md`, and `handoffs/hobby-corner-security.md`. Not merged or deployed.
- **Do not launch duplicate bot:** Hobby Corner Integration Test still contains a **staged, empty** `malcor` service `d813e814-209b-4528-96c0-efeb37da139c` and older staged `hobby-bot-security-test` `55bea846-a9c0-4f2e-8ed6-abde18d90269`. Both are superseded by the separate live Malcor bot for this work. **Exclude/remove these staged placeholders before accepting the Hobby Corner test environment patch.** No deletion or deployment has been performed here.
- **Hobby Corner security integration is not active on Malcor.** Its existing bot is mention-only and owner-only; employee Admin/Owner invitations and role verification need an isolated, typed, audited module and separate security staging service. Never treat a free-form AI request as privileged approval.

## Malcor sole-user staging authorization — 2026-11-03

- Test-server policy confirmed by owner: **only Discord user `115626919134887940`** may run privileged Hobby Corner tests; **no Staff/Admin/Owner Discord role IDs are required in the test guild**. Restrict to guild `1485804234753573066` and test channel `1566905099429744700`; forum `1566904908068946151` is reference context, not automatically authorized for privileged operations.
- In separate `Malcor/staging`, service `malcor-discord-bot`, `OWNER_DISCORD_ID`, `DISCORD_GUILD_ID`, `ALLOWED_CHANNEL_IDS` were **staged** with these exact values. Railway patch `bc799aac-6f89-4720-bc76-2df2a7e0dc21` also contains an existing unrelated staged PostgreSQL creation; **do not accept patch wholesale until reconciled**. Running Malcor process/variables are unchanged.
- Malcor documentation-only draft PR #3 now records sole owner test authorization in its changelog, module registry and Hobby Corner handoff. This **does not** create a functional enrollment module or bypass the backend's separate independent manager passkey requirement. Existing Lightspeed invite issuer currently requires Admin/Owner role IDs; create an explicitly staging-scoped, exact-owner authorization adapter before testing. Do not remove production role checks or weaken `staff.authenticator.enroll` proof.

## Malcor exact-owner security module and staging backend — 2026-11-03

- **Implemented in development, not deployed:** Malcor draft [PR #8](https://github.com/Tawgod/Malcor/pull/8), `feature/hobby-corner-owner-security-test-20261103`. It adds a disabled-by-default explicit `@Malcor hc security setup` owner-self command, independent of AI actions. Exact owner `115626919134887940`, test guild `1485804234753573066`, test channel `1566905099429744700`. Requests a **self-only** invitation through dedicated staging backend secret, checks HTTPS destination and sends the one-time link by private DM, with no public fallback. Does not authorize QR without independently verified manager passkey.
- **Backend gate:** Lightspeed shared-services PR #32, mirrored to stacked PR #33, supports optional `ownerOnlyTest` with exact identity/guild/channel **only if** `HC_SECURITY_ENV=isolated-staging`. Existing production role enforcement is unchanged; active Timeclock-linked test employee and exact `staff.authenticator.invite` permission remain mandatory.
- **CI:** Malcor PR #8 run `41692580179` PASS; Lightspeed Phase 1 foundation run `41692725951` PASS, Scanner `41692725899` PASS, Core Ops `41692726001` PASS. Tests include role/owner mismatch, wrong guild/channel, missing service key, no public invitation leakage and existing QR approval gates. **No real Discord invitation or phone test completed.**
- **Railway:** A new Malcor/staging patch `0d760293-efc3-40bd-87b4-58893b905e31` contains only `MALCOR_HC_SECURITY_ENABLED=false`, `MALCOR_HC_SECURITY_ENV=isolated-staging` and `MALCOR_HC_SECURITY_CHANNEL_ID=1566905099429744700`, pending only. Reverified that Malcor Postgres and schema-migration services have been deployed by other concurrent work; we did not deploy them. Confirm the environment patch again before any deployment.
- **Still blocked for real enrollment:** no separate functioning Timeclock PIN/test identity adapter for staging, HTTPS security endpoint, independently bootstrapped Owner passkey, or shared test-only bot/backend key; no deployment of Malcor PR #8 or mounting of security APIs. Never paste keys into GitHub or chat; configure secrets privately in Railway when all review gates are satisfied.

## Isolated synthetic Timeclock PIN login candidate — 2026-11-03

- **Implemented/tested, not deployed:** Lightspeed PR #32 source `feature/shared-lightspeed-services-phase1-20261029`, mirrored to Phase 2 PR #33, adds `staging/isolated-test-identity.js` (exact owner `115626919134887940`, guild `1485804234753573066`, synthetic employee ID `901`, salted scrypt-hashed 4-digit **test-only** PIN, no live Timeclock connection), `staging/isolated-test-login.js` (server-signed PIN session plus existing durable PostgreSQL per-account/IP throttle), and opt-in startup from `staging/staff-security-server.js` when `HC_STAGING_TEST_LOGIN_ENABLED=true`. This mounts **only** `/api/staff-auth`; enrollment/QR/passkey APIs stay unmounted (503) and synthetic PIN cannot approve any factor enrollment.
- Added regression tests `tests/shared-security-isolated-identity.test.mjs` and `tests/shared-security-isolated-login.test.mjs` with invalid identity/environment checks, wrong PIN, signed session, role/operation authorization and 503 on sensitive routes. Shared foundation workflow `41746716631` SUCCESS and scanner regression `41746716502` SUCCESS on pre-document commit `672261b1fe86c2dbab99662fa02d8d6ba13585ba`; the actual Railway test database sign-in is **not verified**.
- Railway `Hobby Corner Integration Test/test/staff-security-staging`: staged only `HC_STAGING_TEST_LOGIN_ENABLED=false`, `HC_STAGING_TEST_OWNER_DISCORD_ID=115626919134887940`, `HC_STAGING_TEST_GUILD_ID=1485804234753573066`. Existing service source and `DATABASE_URL=${{Postgres.DATABASE_URL}}` remain staged. Patch `ae35bd65-381a-4b33-804c-a7bbdfb4853d`, 66 pending changes as last confirmed. No deployment, migration or secret provisioning.
- See `Tawgod/Lightspeed/docs/STAFF_ISOLATED_STAGING_SIGNIN.md` for safely provisioning test PIN hash, separate session/throttle secrets, test-only `hc_staff_auth_throttle.sql` and controlled deployment. Do not expose the PIN in GitHub/chat or reuse employee PIN; do not commit the entire Railway test patch with the old superseded bot placeholders. Later Owner passkey bootstrap remains **required** before Authenticator seed/QR exposure.

## 2026-11-04 — Test sign-in deployment-ready (explicit activation pending)

- **Hobby Corner Integration Test/test** Railway patch `ae35bd65-381a-4b33-804c-a7bbdfb4853d` now has **only three new resources**: isolated PostgreSQL service, persistent `postgres-volume`, and `staff-security-staging` API. Removed the two **staged-only/unprovisioned** duplicate bot placeholders (`malcor`, `hobby-bot-security-test`); no running/production service was deleted. Existing `consignment-beta` has no changes.
- **Pinned tested GitHub commit** `Tawgod/Lightspeed:feature/shared-lightspeed-services-phase1-20261029` SHA `d0d0be4b349c45c00285be3609c60418f38f6d06` as the staged Railway security API source. CI: Shared Lightspeed foundation `41844243506`, Scanner `41844243658`, and Core Ops `41844243509` **SUCCESS**. Source is still an unmerged PR #32 candidate; Phase 2 draft PR #33 mirrors the staging code.
- **PIN login code:** a same-origin `/test-login` HTML/CSS/JS page avoids persistent browser token storage; `POST/GET /api/staff-auth/session` uses synthetic employee `901`, signed short-lived session, and persistent account/IP throttling. Private-Postgres migration script `staging/migrate-isolated-test-login.js` enforces exact test environment, owner `115626919134887940`, guild `1485804234753573066`, `*.railway.internal` database hostname and applies only `hc_staff_auth_throttle.sql`. Server waits/retries migrations before binding a listener. QR/approval/invitations routes remain **503** in this release.
- **Railway credentials staged:** `HC_STAGING_TEST_LOGIN_ENABLED=true`, a random test-only PIN's scrypt hash, fresh independent 32+ byte session/throttle secrets, exact guild and owner settings and private `DATABASE_URL=${{Postgres.DATABASE_URL}}`. **Never log/copy secret or PIN values into Git.** No production Timeclock, Lightspeed or Discord application secrets used.
- **Railway review:** current patch 59 non-destructive changes, all create-only; neither Postgres nor security API exists live yet. New service start command `node staging/staff-security-server.js`, healthcheck `/health`, 180-second healthcheck timeout, ON_FAILURE restart policy. No domain exists until service deploy. An explicit user decision to deploy the isolated staging patch is still required before running `accept-deploy`. This will create Railway-billed resources. Once approved, deploy, verify API logs and `/health`, generate HTTPS service domain, test browser login and invalid PIN, check factor routes 503.
- **Remaining milestone:** Malcor draft PR #8 owner-only invitation is not live. Real authenticator QR remains blocked on independent first Owner passkey/strong approval and separately reviewed staging migrations and public setup page.

## 2026-11-04 — Approved isolated Railway test deployment complete

- **User approval:** explicitly approved staging deployment in chat. Committed Railway test patch `ae35bd65-381a-4b33-804c-a7bbdfb4853d` via `accept_deploy`, workflow `commitChanges/24b41ef2-e3d8-4c7a-b011-355204ecf075/ae35bd65-381a-4b33-804c-a7bbdfb4853d`. Reviewed prior to commit: only isolated `Postgres`, `postgres-volume`, `staff-security-staging`; patch non-destructive; canceled superseded unprovisioned bot placeholders; no changes to live `consignment-beta`.
- **Railway live verification:** `Hobby Corner Integration Test/test`: PostgreSQL deployment `631b2e07-6362-47fc-9776-6fd375aa65aa` **SUCCESS**, 1/1 online; `staff-security-staging` deployment `28b37d6f-329d-4273-8b29-de2f05845b11` **SUCCESS**, 1/1 online; Consignment remains SUCCESS. API deployment build logs show `/health` check **succeeded**. Pinned Lightspeed source `d0d0be4b349c45c00285be3609c60418f38f6d06`. Startup script migrates isolated `hc_staff_auth_throttle` before listening when synthetic PIN login enabled, but table contents were not independently queried.
- **Test address created:** Railway-generated HTTPS domain `https://staff-security-staging-test.up.railway.app`; intended UI `/test-login`, API `/api/staff-auth/session`. Railway reports service domain created; external HTTP verification from the available browser/runtime **could not be completed** (new domain could not be fetched/resolved in our tool environment). Thus mark actual browser sign-in, invalid PIN, and factor endpoint responses **unverified**, despite passing automated CI and Railway health check.
- **Credential protection:** Existing sealed/restricted test-only PIN scrypt hash plus distinct session/throttle secrets were staged and applied; do not reveal, retrieve, or reuse live Timeclock credentials. The actual synthetic PIN was not delivered to the user in this deployment turn. Arrange secure reset/handoff before requesting a browser PIN test.
- **Still not activated:** Malcor Hobby Corner invitation PR #8 remains draft/not deployed; manager passkey bootstrap, approved TOTP setup, QR generation and real employee enrollments are not active. Production Timeclock, Lightspeed, and production Discord systems untouched.
- **Recommended next:** independently test `/test-login` from user browser; securely provision a known temporary synthetic test PIN if needed without putting the PIN in chat; verify rate limiting and status 503 for MFA routes; then design strong first-Owner WebAuthn/bootstrap with separate auditable authorization before testing Authenticator QR.

- **Security follow-up:** Railway build's `npm install` reported **2 high-severity dependency audit findings** (package/impact not yet identified). Review and remediate before treating the public staging sign-in as production-grade or enabling authenticator enrollment; do not blindly run `npm audit fix --force` against the shared Lightspeed application.

## 2026-11-04 — One-time user-chosen synthetic test PIN setup

- **Requested by user:** loaded test sign-in page but no known four-digit PIN. The `HC_STAGING_TEST_PIN_HASH` Railway variable is a salted scrypt hash, not a PIN to type into the sign-in form.
- **Implemented on existing Lightspeed Phase 1 PR #32:** `staging/isolated-pin-setup.js`, `staging/test-pin-setup.html`, `staging/test-pin-setup.js`, `db/hc_staging_pin_setup.sql`, and `tests/shared-security-pin-setup.test.mjs`. One-time POST `/api/test-pin-setup/set` requires full random 64-character test-only Railway setup key, exact approved HTTPS Origin, `NODE_ENV=test`, `HC_SECURITY_ENV=isolated-staging`, exact owner/guild, and flag `HC_STAGING_PIN_SETUP_ENABLED=true`. The test PIN is never written to GitHub, chats, or client storage: its freshly salted scrypt hash is stored in isolated test PostgreSQL, and the row is locked and marked completed atomically. Further setup attempts fail closed.
- **Signed PIN sign-in now reads the database hash** when the setup flag is enabled, instead of expecting the user to enter an environment-variable hash. Original non-setup code path is preserved for other tests. All Authenticator, approval and invitation routes remain disabled in this staging mount.
- **Test coverage:** owner/environment/HTTPS guard, bad setup key, wrong Origin, bad PIN, one-time use, POST replay rejection, successful signed PIN session and factor route 503. Shared Lightspeed foundation run `41859426437` initially failed due to an existing concurrent PostgreSQL throttle DDL race unrelated to the new PIN setup; rerun succeeded. Scanner `41859426419` and Core Ops `41859426993` succeeded. Pinned source SHA `7a74a47195c2c6a59898948989aab7ca93cf69cd`.
- **Railway staged/committed** test-only patch `66eb1aa1-4e9e-4be3-96e5-c39a4e2c9c6b`: update only `staff-security-staging` source pin and add `HC_STAGING_PIN_SETUP_ENABLED=true`, `HC_STAGING_PUBLIC_ORIGIN=https://staff-security-staging-test.up.railway.app`, and one-time `HC_STAGING_PIN_SETUP_KEY` variable. Credential value is not recorded in project documentation; separately delivered to the user as a local private text file. API deployment `c0d9623e-e6f3-4f3a-aabc-4eaa417ee5f7` started; confirm SUCCESS/health before directing user to `https://staff-security-staging-test.up.railway.app/test-pin-setup`.
- **Caveat:** The user still must choose and enter their PIN in the HTTPS page; cannot complete that step on their behalf. This setup is only for the synthetic staging employee 901; production Timeclock is unaffected. Do not mistake PIN setup for first Owner passkey enrollment/strong approval.

## 2026-11-04 — Owner confirmed real staging PIN setup and login

- **User-verified acceptance:** owner explicitly reported "Test pin is set up and logged in." This confirms a successful manual one-time PIN-creation and browser sign-in at the isolated security staging site. No PIN, setup key, or signed session value recorded.
- **Railway cross-check:** `staff-security-staging`, isolated `Postgres` and existing `consignment-beta` all **Online / SUCCESS** after that report.
- **Feature status:** synthetic test employee PIN setup **Deployed + user tested**. No production Timeclock/employee integration. Invitation, WebAuthn first-owner bootstrap, and Authenticator QR still **not deployed**. Existing Malcor owner-only invitation PR #8 remains independent of the running bot.
- **Security follow-up:** one-time setup credential is no longer needed after completion. Before removing `HC_STAGING_PIN_SETUP_ENABLED`, update the PIN reader to keep using the already saved database hash while denying the setup routes; disabling the flag with existing code as-is would regress sign-in to the old environment-variable hash. Then safely retire the one-time Railway setup key, with a test of continued sign-in. This has not been performed.

## 2026-11-04 — PIN retirement and isolated first Owner passkey candidate

- **User-verified current state:** Owner reported synthetic test PIN created and login succeeded. `Hobby Corner Integration Test/test` security API, Postgres and Consignment remain Railway **Online/SUCCESS**. No live enrollment, QR, or manager approval has been enabled.
- **PIN hardening implemented, pending CI/deployment:** Lightspeed Phase 1 PR #32 commit `49c81533fe2c6bbeb3189319afc039299b95be96` introduces separate `HC_STAGING_PIN_STORE_MODE=database` and `HC_STAGING_PIN_SETUP_ENABLED=false` controls. Storing the PIN hash in test PostgreSQL is now independent of whether the one-time setup routes are mounted. Regression tests cover setup, saved-PIN login after disabling setup, wrong PIN, replay, absent setup key and invalid storage mode.
- **Railway test-only staged patch:** `679a3524-f460-45ce-84fe-f451127a851b`, four **non-destructive** changes to `staff-security-staging` only: pin source to commit `49c815...`, set `HC_STAGING_PIN_STORE_MODE=database`, `HC_STAGING_PIN_SETUP_ENABLED=false`, and blank the previously used `HC_STAGING_PIN_SETUP_KEY`. **NOT ACCEPTED/DEPLOYED**, so current login is unchanged and one-time setup routes remain in the running code (database row one-use already consumed). Obtain a separate explicit staging deployment approval before accepting the patch. Post-deployment verify the same owner PIN still signs in and setup routes deny requests; Railway API does not provide a variable-delete action, so the now-empty variable may remain listed by name.
- **First Owner WebAuthn test candidate, not deployed:** Phase 1 PR #32 adds `staging/isolated-owner-passkey-grant.js`, `db/hc_staging_owner_passkey_bootstrap.sql`, `staging/test-owner-passkey.html`, optional transactional `commitRegistrationGrant` in `services/security/staffPasskeysPostgres.js`, isolated route mounting behind `HC_STAGING_OWNER_PASSKEY_ENABLED=true`, plus unit/routing tests and `docs/STAFF_ISOLATED_OWNER_PASSKEY_BOOTSTRAP.md`. Requires a **separate** high-entropy out-of-band Railway credential, signed synthetic PIN session, exact staging host, verified WebAuthn ceremony, no existing credential, one-use four-hour persisted grant and audit. No secret has been provisioned; flag remains absent/disabled. This does not authorize Authenticator QR, account recovery or general manager approvals.
- **CI status:** Foundation/Scanner/Core Ops checks on latest Phase 1 code are queued at the time of this handoff, **not yet proven passing**. Local package installation was unavailable (npm registry DNS resolution failed); no live device/browser WebAuthn test. Do not deploy the new passkey code or claim a verified first Owner passkey until CI, review and owner acceptance.
- **Coordination:** Phase 2 stacked branch has received the updated staging PIN composition, migration and pin-setup module. Remaining new tests, generic passkey hook and bootstrap assets are **not fully mirrored yet**; reconcile the source diffs and rerun both PRs before any merge. Do not overwrite unrelated Phase 2 work. Malcor draft PR #8 owner-only invitation remains unmerged/not deployed; no separate secure API key/owner approval integration yet.
- **Next priority:** finish queued CI; review and deploy the narrow PIN-retirement patch with explicit approval, re-test login, then separately review and activate the independent Owner test passkey candidate. Do not enable employee QR enrollment until approved manager-verification integration and TOTP migrations are verified.

## 2026-11-04 — Malcor owner-only staging health command

- **Development candidate:** `Tawgod/Malcor` draft PR #8 adds `modules/hobby-corner-security/status.ts`, `tests/hobby-corner-status.test.mjs` and main dispatcher wiring. Only exact mention `@Malcor hc security status` by owner `115626919134887940` in test guild `1485804234753573066`, channel `1566905099429744700` can make a read-only `GET /health` to `https://staff-security-staging-test.up.railway.app`. Responses are fixed text, not attacker-controlled API contents. No staff mutation, no bot credential, no AI-generated action. Invitation command remains separately disabled.
- **Staged, not deployed:** Malcor separate Railway `staging` patch `0d760293-efc3-40bd-87b4-58893b905e31` updated only `malcor-discord-bot` to pinned candidate source commit `3339051d55366db3292cfbb81173f69b9feaeeac`, matched exact owner/guild/channel and set `MALCOR_HC_STATUS_ENABLED=true` with exact API origin; `MALCOR_HC_SECURITY_ENABLED=false` remains staged. Review and obtain separate test-only deployment approval. Running Malcor `main` AI functions remain unchanged.
- **Verification:** source/tests committed; latest Malcor CI workflow was not yet visible on this checkpoint, and no live `hc security status` message has been verified in Discord. Do not claim deployed status until Railway and end-to-end test prove it.

## 2026-11-04 — Verified Owner bootstrap CI and dependency audit

- **CI verified:** Latest Lightspeed Phase 1 PR #32 head `ed9481d82ea619e335aab7a99633e5c354433c7a`. Shared foundation workflow `41868475342` **SUCCESS**, including `Verified Owner bootstrap atomicity on disposable Postgres` step; Scanner workflow `41868475386` **SUCCESS**. This covers transaction rollback of a verified credential and audit event when independent bootstrap grant fails, one-use grant consumption and signed staging browser route safeguards. Core Ops workflow `41868475167` was still in progress at this checkpoint. **Real hardware/browser WebAuthn not verified; candidate not deployed.**
- The legacy passkey browser regression initially failed when the optional Owner bootstrap field was treated as present by a mock DOM. Adjusted the client to recognize that field only when it is an actual password input; the next foundation runs passed. The generic passkey pilot remains functional per automated CI.
- Read-only dependency audit discovered **two high-severity packages**, `adm-zip` and `xlsx` in Lightspeed dependencies, without changing any versions. Tracked in [Hobby Corner issue #1](https://github.com/Tawgod/Hobby-Corner/issues/1). Do not treat the isolated service as production-grade or enable factor enrollment until the exposed ZIP/spreadsheet consumers and remediation plan are reviewed.
- **Deployment status unchanged:** Railway PIN-key retirement patch `679a3524-f460-45ce-84fe-f451127a851b` is staged only, pinned to the earlier separately tested minimal PIN fix `49c81533fe2c6bbeb3189319afc039299b95be96`. The new Owner bootstrap code from later Phase 1 commits is **not** in that staged deployment. No Malcor or first Owner passkey deployment was performed.

## 2026-11-05 — PIN retirement accepted; first-Owner bootstrap browser hardening

- **User verified acceptance:** Owner explicitly confirmed "Pin still works" after one-time setup retirement on `staff-security-staging`. This verifies browser login with the previously saved test PIN; neither PIN nor session secrets were shared in chat.
- **Current production isolation:** Railway `Hobby Corner Integration Test/test` still runs successfully with the isolated PIN login; PostgreSQL and Consignment are healthy. The remaining test patch `43c28c64-63db-436e-b5ce-909f97949a4d` changed concurrently since the previous handoff: it now includes a source update to `49261c8974e90ae678199d08e4fcb57e4af590a9` and adds **both** `HC_STAGING_OWNER_APPROVAL_ENABLED` and `HC_STAGING_OWNER_PASSKEY_ENABLED`. **Do not accept this patch based on the earlier description of a two-change/passkey-only patch.** Reconcile its exact variables, flags, source and current owner permission immediately before any deployment.
- **Implemented browser security hardening:** Lightspeed Phase 1 PR #32 commit `3a5e8d8ec16d02d87d748f459133ab01b0905329` clears the independent Owner bootstrap key from the HTML password input **before** the first network call or native WebAuthn prompt. The field stays empty after server denial, browser prompt cancellation and signout; a fresh attempt requires re-entry. Tests `tests/shared-security-owner-bootstrap-browser.test.mjs` cover failure/cancellation, exact header usage and no registration-completion submission when cancelled.
- **CI:** Latest Phase 1 head `0b2d0bd41a496563f5f5dc23a255b56d1ef2863c`, Foundation `42059458931` SUCCESS, Scanner `42059458658` SUCCESS, Core Operations `42059458824` SUCCESS. Updated client, test and workflow mirrored into stacked Phase 2 draft PR #33 head `ed89dd589e0ec58a49adb508610b5ff8998e0fdd`. **Phase 2 independent CI not returned** by connector.
- **Important architecture reconciliation:** The authoritative Lightspeed Phase 1 code now has a separately gated `HC_STAGING_OWNER_ENROLLMENT_ENABLED` composition in `staging/isolated-owner-enrollment.js`, `HC_STAGING_OWNER_APPROVAL_ENABLED` exact-operation policy, and `HC_STAGING_OWNER_BOOTSTRAP_ENABLED` separate from the passkey verifier. These exist in source but are **not deployed or user tested**. Never bypass the independent Owner WebAuthn grant or turn on factor/TOTP endpoints just because the synthetic PIN works.
- **Next:** review and reconcile the concurrently staged Railway patch, test a physical passkey device with a separately provisioned bootstrap key only after approved activation, then independently test manager approval and Malcor invitation routing. Production service and Chrome extension remain untouched.

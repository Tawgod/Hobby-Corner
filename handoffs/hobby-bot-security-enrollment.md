# Hobby Bot Security Invitations — Current Handoff

**Last verified:** 2026-11-02
**Status:** In Development / Testing — not deployed

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

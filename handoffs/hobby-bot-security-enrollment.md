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

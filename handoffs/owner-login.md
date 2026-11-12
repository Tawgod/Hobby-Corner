# First Owner Login — Current Handoff

**Last verified:** 2026-11-12  
**Status:** In Development / Testing — code verified, actual Owner not commissioned

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

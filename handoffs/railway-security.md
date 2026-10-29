# Railway Configuration / Credential Security — Current Handoff

**Last verified:** 2026-10-29  
**Status:** Testing / Maintenance — current topology read-only verified; credential/security improvements remain pending.

## Source
- Primary document: `Tawgod/Hobby-Corner:main/RAILWAY_VARIABLE_SECURITY_AUDIT.md` (2026-10-22 read-only inventory).
- Railway production project: `Hobby Corner` (id `f7e91de7-43f6-472e-b4ca-46b0623f8e0e`); environment `production`.
- Application source: `Tawgod/Lightspeed:integration/hobby-corner-consolidation`; Discord/Rewards source: `Tawgod/Hobby-Corner-Discord-Bot:main`.

## Implemented
- Existing application/runtime variable configuration across `timeclock`, `lightspeed-api`, `special-orders-test`, `Hobby-Corner-Discord-Bot`, `Hobby-Corner-Rewards`, Postgres and migration function; documented variable ownership and safe proposed reference topology.
- Security plan for shared Lightspeed credentials, Scanner/Timeclock service secret, session signing, customer-sync admin keys, Microsoft Graph application, Discord and Google credentials.
- New Invoice Reconciliation **planned**, not provisioned: future mailbox read-only OAuth token scopes, attachment storage and worker secrets must be isolated; sender aliases are not authentication or permission grants.

## Tested
- Railway environment inventory on 2026-10-29: all seven production services latest deployments SUCCESS, no staged patch, 1 persistent PostgreSQL volume; this does not prove any secret values match or services' business operations are correct.
- Connector exposes variable names with values redacted and does not support full database dump; no credential values inspected or copied here.
- Previous source audit found no obvious hardcoded production key literals in selected deployed code; this is not a full Git history/secret scan.
- Branch source check: `lightspeed-api`/`timeclock`/`special-orders-test` use consolidated integration; Discord and Rewards use Discord-Bot main.

## Deployed
- Existing production services are running; this handoff made **no changes** to Railway configuration, volumes, domains, secrets or deployments.
- No independent/full PostgreSQL table-row backup exists from the prior source archive; do not represent that archive as a recoverable live data snapshot.

## Shared dependencies
- Phase 1 PR #32 and draft Phase 2 PR #33 shared Lightspeed backend/auth, not deployed.
- Existing Timeclock `TIMECLOCK_PIN_PEPPER` is required for employee PIN hashes; rotate only with explicit PIN reset/rehash plan.
- Mail/attachment data security and Microsoft Graph shared tenancy must be evaluated before enabling Invoice Reconciliation.
- Migration test function direct Lightspeed API token requires audit before retirement or credential sharing.

## Shared files / integration surfaces affected
- Railway configuration and variable references; `RAILWAY_VARIABLE_SECURITY_AUDIT.md`; no runtime code changed.
- `Postgres` volume and server-side database credentials are production data assets; backup tests and retention policy remain unresolved.

## Remaining blockers
- Confirm equality/scope of same-named credentials behind redacted variables, appropriate provider secret sealing, leaked legacy credentials rotation, unused service/variable retirement, audit of migration function.
- Actual DB dump, independent retention and recovery drill, test environments and security acceptance.

## Decisions needed
- Whether to migrate to shared sealed variable references and when; data backup strategy; dedicated mailbox/permissions for future invoices.

## Recommended next action
- Verify source consumers and service logs without exposing secrets, then propose one small per-credential reference change with rollback. Keep Timeclock PIN pepper untouched until account migration plan approved.

## Restrictions / safety
- No secret reveals in GitHub/docs, no credential rotation/deletion, database volume modification, production deploy or provider login change without explicit authorization.

## Documentation
- `RAILWAY_VARIABLE_SECURITY_AUDIT.md`, `BRANCH_AND_DEPLOYMENT_POLICY.md`, `backups/2026-10-29-shared-services-phase1.md`, `FEATURE_INVOICE_RECONCILIATION.md`.

# Hobby Corner Railway Variable Consolidation & Security Audit

**Date:** 2026-10-22  
**Status:** Proposed / read-only audit complete; no Railway configuration changes applied.  
**Production project:** Hobby Corner  
**Test project:** Hobby Corner Integration Test

## Safety boundary

This audit intentionally records variable names, dependencies, and proposed reference topology only. Secret values are not recorded here.

No Railway variables were changed, no service was redeployed, no credentials were rotated or revoked, and no database was recreated or deleted.

## Current Railway inventory

### Production — lightspeed-api
Source: `Tawgod/Lightspeed:integration/hobby-corner-consolidation`

Application variables:
- `DATABASE_URL`
- `LIGHTSPEED_DOMAIN`
- `LIGHTSPEED_TOKEN`
- `SPECIAL_ORDERS_ALLOW_MIGRATION`
- `SPECIAL_ORDERS_LIVE_MODE`

The service also receives Railway-provided runtime/service variables.

### Production — special-orders-test
Source: `Tawgod/Lightspeed:integration/hobby-corner-consolidation`

Application variables:
- `DATABASE_URL`
- `DISCORD_TOKEN`
- `GW_AUTO_SUBMIT_ALERT_CHANNEL_ID`
- `GW_AUTO_SUBMIT_ALERT_ROLE_ID`
- `GW_MAILBOX_USER_ID`
- `GW_PREORDER_TEST_CHANNEL_ID`
- `LIGHTSPEED_DOMAIN`
- `LIGHTSPEED_TOKEN`
- `MS_GRAPH_CLIENT_ID`
- `MS_GRAPH_CLIENT_SECRET`
- `MS_GRAPH_CLIENT_SECRET_EXPIRES_AT`
- `MS_GRAPH_TENANT_ID`
- `SCANNER_ENABLED`
- `SCANNER_LOGIN_LIMIT_SECRET`
- `SCANNER_SERVICE_SECRET`
- `SCANNER_SESSION_SECRET`
- `SCANNER_TIMECLOCK_ORIGIN`
- `SPECIAL_ORDERS_ADMIN_KEY`
- `SPECIAL_ORDERS_ALLOW_MIGRATION`
- `SPECIAL_ORDERS_ALLOW_PRODUCT_WRITES`
- `SPECIAL_ORDERS_LIVE_MODE`

### Production — timeclock
Source: `Tawgod/Lightspeed:integration/hobby-corner-consolidation`, root `/timeclock`

Application variables:
- `DATABASE_URL`
- `LIGHTSPEED_DOMAIN`
- `LIGHTSPEED_TOKEN`
- `SCANNER_SERVICE_SECRET`
- `TIMECLOCK_ADMIN_SECRET`
- `TIMECLOCK_PIN_PEPPER`
- `TIMECLOCK_TIMEZONE`

### Production — Hobby-Corner-Rewards
Source: `Tawgod/Hobby-Corner-Discord-Bot:main`

Application variables:
- `DATABASE_URL`
- `LIGHTSPEED_API_VERSION`
- `REWARDS_ADMIN_KEY`
- `REWARDS_DRY_RUN`
- `REWARDS_LOOKBACK_DAYS`
- `REWARDS_RUN_HOUR_UTC`
- tier spend/discount settings for tiers 1-4

Source-code note: `rewards_service.py` can also use `LIGHTSPEED_ACCESS_TOKEN` and `LIGHTSPEED_DOMAIN_PREFIX`, but those names are not present on the Railway Rewards service. Direct Lightspeed access therefore must not be assumed enabled.

### Production — Hobby-Corner-Discord-Bot
Source: `Tawgod/Hobby-Corner-Discord-Bot:main`

Application variables:
- `CHANNEL_SHEET_MAP`
- `CUSTOMER_SYNC_ADMIN_KEY`
- `CUSTOMER_SYNC_API_URL`
- `DISCORD_TOKEN`
- `GOOGLE_SERVICE_ACCOUNT_JSON`
- `GW_PREORDER_TEST_CHANNEL_ID`
- `MASTER_CUSTOMER_SHEET_ID`
- `MASTER_CUSTOMER_TAB`
- `SPECIAL_ORDERS_ADMIN_KEY`
- `SPECIAL_ORDERS_API_URL`
- `TIMECLOCK_ADMIN_ROLE_ID`
- `TIMECLOCK_ADMIN_SECRET`
- `TIMECLOCK_API_URL`
- `TIMECLOCK_STAFF_ROLE_ID`

Source-code note: current deployed `main.py` does not reference `SPECIAL_ORDERS_ADMIN_KEY`, `SPECIAL_ORDERS_API_URL`, or `GW_PREORDER_TEST_CHANNEL_ID`. Treat these as removal candidates only after final runtime/history verification.

### Production — migration-test-bsi117
Source: Railway Bun function image.

Application variables:
- `LIGHTSPEED_DOMAIN`
- `LIGHTSPEED_TOKEN`

The current function script reads only these two variables and performs direct Lightspeed API operations.

### Production — Postgres
Managed PostgreSQL 18 service with persistent volume.

Application-facing database connection should be consumed by reference:
`DATABASE_URL=${{Postgres.DATABASE_URL}}`

Do not duplicate the Postgres password or individual PG connection fields into app services.

### Test — consignment-beta
Source: `Tawgod/Lightspeed:feature/consignment-layout-foundation`

Current Railway environment contains only Railway-provided variables. No production Lightspeed, Discord, Microsoft, Google, Postgres, scanner, or Timeclock credentials are configured.

This is the desired isolation baseline.

## Source-code secret scan

Reviewed deployed Lightspeed branch application/server/extension code, deployed Discord/Rewards code, scanner scripts/config, and the consignment beta source for obvious hardcoded token/secret/private-key literals.

No hardcoded production credential literal or private key was found in the scanned deployed source files.

This does not prove that no credential was ever committed historically. Historical Git history and legacy Google Sheets remain separate incident-review scopes.

## Confirmed dependency relationships

### Lightspeed
Direct consumers:
- lightspeed-api
- special-orders-test
- timeclock
- migration-test-bsi117

All four currently have `LIGHTSPEED_DOMAIN` and `LIGHTSPEED_TOKEN` variable names.

Before consolidation, confirm that all four values represent the same Lightspeed X-Series account and the same intended permission scope. The OAuth Railway connector exposes variable names but intentionally redacts values, so equality was not assumed.

### Timeclock administration
Receiver:
- timeclock: `TIMECLOCK_ADMIN_SECRET`

Caller:
- Hobby-Corner-Discord-Bot: `TIMECLOCK_ADMIN_SECRET`

The bot actively calls Timeclock admin routes using this secret. This is a legitimate shared underlying credential.

### Scanner service authentication
Receiver:
- timeclock: `SCANNER_SERVICE_SECRET`

Caller:
- special-orders-test: `SCANNER_SERVICE_SECRET`

The scanner gateway uses this server-to-server credential. This is a legitimate shared underlying credential.

### Scanner session and login-limit secrets
- `SCANNER_SESSION_SECRET` — special-orders-test only; session-signing secret.
- `SCANNER_LOGIN_LIMIT_SECRET` — special-orders-test only; HMAC key for login throttling.

These must remain independent and service-specific.

### Timeclock PIN pepper
- `TIMECLOCK_PIN_PEPPER` — timeclock only.

Existing employee PIN hashes depend on this value. Do not rotate or replace it without a deliberate PIN rehash/reset migration.

### Customer sync / Rewards administration
Receiver:
- Hobby-Corner-Rewards validates `REWARDS_ADMIN_KEY` on `/admin/customer-source/discord-sheet`.

Caller:
- Hobby-Corner-Discord-Bot sends `CUSTOMER_SYNC_ADMIN_KEY` as `x-admin-key`.

Railway HTTP logs on 2026-10-22 show successful Python requests to the Rewards customer-sync route. These two variable names therefore represent one communicating trust relationship and should reference one underlying secret after current-value verification.

### Discord
Consumers with `DISCORD_TOKEN`:
- Hobby-Corner-Discord-Bot
- special-orders-test

Do not share automatically. Confirm both tokens identify the same Discord bot application before consolidation. If they are the same identity, use one shared production Discord bot token. If they are different bot identities, retain separate secrets.

### Microsoft Graph
Consumer:
- special-orders-test only.

Variables:
- `MS_GRAPH_CLIENT_ID`
- `MS_GRAPH_CLIENT_SECRET`
- `MS_GRAPH_TENANT_ID`
- `MS_GRAPH_CLIENT_SECRET_EXPIRES_AT`

Keep service-specific unless another production service genuinely joins the same Graph application. The secret should be sealed.

### Google
Consumer:
- Hobby-Corner-Discord-Bot only.

Current source parses `GOOGLE_SERVICE_ACCOUNT_JSON` directly into Google service-account credentials for Google Sheets/Drive access.

Preferred long-term direction is keyless Workload Identity Federation if the hosting platform can provide a suitable trusted workload identity. Google recommends Workload Identity Federation for external workloads when an external identity is available. Railway documentation reviewed during this audit documents user OAuth/OIDC but did not establish a native ambient workload ID token intended for Google WIF. Therefore do not replace the working key until a concrete Railway-to-Google federation design is validated.

Short-term safer posture:
- keep the service-account credential only on the Discord bot;
- seal it in Railway;
- restrict the Google service account to only required Sheets/Drive resources/scopes;
- rotate the key after incident recovery;
- do not copy it into shared variables unless another service truly needs it.

## Proposed production shared-variable topology

The following are proposed shared *underlying* values. Existing application variable names should be preserved via references.

### Shared Lightspeed values — pending equality/scope verification
- `HC_LIGHTSPEED_DOMAIN`
- `HC_LIGHTSPEED_TOKEN` (sealed)

References:
- lightspeed-api:
  - `LIGHTSPEED_DOMAIN=${{shared.HC_LIGHTSPEED_DOMAIN}}`
  - `LIGHTSPEED_TOKEN=${{shared.HC_LIGHTSPEED_TOKEN}}`
- special-orders-test: same mapping
- timeclock: same mapping
- migration-test-bsi117: same mapping

Do not grant Rewards this credential merely because its source supports Lightspeed. Add it only if the Rewards architecture intentionally requires direct Lightspeed access.

### Shared scanner inter-service secret
- `HC_SCANNER_SERVICE_SECRET` (sealed)

References:
- special-orders-test: `SCANNER_SERVICE_SECRET=${{shared.HC_SCANNER_SERVICE_SECRET}}`
- timeclock: `SCANNER_SERVICE_SECRET=${{shared.HC_SCANNER_SERVICE_SECRET}}`

### Shared Timeclock admin credential
- `HC_TIMECLOCK_ADMIN_SECRET` (sealed)

References:
- timeclock: `TIMECLOCK_ADMIN_SECRET=${{shared.HC_TIMECLOCK_ADMIN_SECRET}}`
- Hobby-Corner-Discord-Bot: `TIMECLOCK_ADMIN_SECRET=${{shared.HC_TIMECLOCK_ADMIN_SECRET}}`

### Shared customer-sync / Rewards admin credential
After equality and endpoint verification:
- `HC_CUSTOMER_REWARDS_ADMIN_KEY` (sealed)

References:
- Hobby-Corner-Rewards: `REWARDS_ADMIN_KEY=${{shared.HC_CUSTOMER_REWARDS_ADMIN_KEY}}`
- Hobby-Corner-Discord-Bot: `CUSTOMER_SYNC_ADMIN_KEY=${{shared.HC_CUSTOMER_REWARDS_ADMIN_KEY}}`

### Discord
If both current consumers are verified to use the same bot identity:
- `HC_DISCORD_BOT_TOKEN` (sealed)
- bot: `DISCORD_TOKEN=${{shared.HC_DISCORD_BOT_TOKEN}}`
- special-orders-test: `DISCORD_TOKEN=${{shared.HC_DISCORD_BOT_TOKEN}}`

If identities differ, use two separately named sealed shared/service variables instead.

### Database
Do not create a manually maintained shared database password.

Set each database consumer explicitly:
- lightspeed-api: `DATABASE_URL=${{Postgres.DATABASE_URL}}`
- special-orders-test: `DATABASE_URL=${{Postgres.DATABASE_URL}}`
- timeclock: `DATABASE_URL=${{Postgres.DATABASE_URL}}`
- Hobby-Corner-Rewards: `DATABASE_URL=${{Postgres.DATABASE_URL}}`

This keeps Postgres itself as the single source of connection credentials and uses Railway private networking.

## Variables that should remain service-specific

### special-orders-test
- `SPECIAL_ORDERS_ADMIN_KEY` — currently internal/local Special Orders administrative trust; do not broaden access without a caller requirement.
- `SCANNER_SESSION_SECRET`
- `SCANNER_LOGIN_LIMIT_SECRET`
- Microsoft Graph application variables
- GW channel/role/mailbox identifiers
- Special Orders enable/write/migration flags
- `SCANNER_ENABLED`

### timeclock
- `TIMECLOCK_PIN_PEPPER`
- `TIMECLOCK_TIMEZONE`

### Rewards
- reward tier configuration
- `REWARDS_DRY_RUN`
- lookback/scheduling configuration
- `LIGHTSPEED_API_VERSION`

### Discord bot
- Google service account credential
- Sheet IDs/tab/map configuration
- Discord role IDs
- service endpoint variables, preferably converted to Railway private-domain references where the caller and receiver are in the same project

## Private-network URL proposal

Because the bot, Timeclock, Rewards, and Special Orders services are in one Railway project, server-to-server calls should use private networking where practical.

Candidates after controlled testing:
- `TIMECLOCK_API_URL=http://${{timeclock.RAILWAY_PRIVATE_DOMAIN}}:8080`
- `CUSTOMER_SYNC_API_URL=http://${{Hobby-Corner-Rewards.RAILWAY_PRIVATE_DOMAIN}}:8080`
- `SCANNER_TIMECLOCK_ORIGIN=http://${{timeclock.RAILWAY_PRIVATE_DOMAIN}}:8080`

Keep browser-facing extension/API URLs public. Do not put Railway private domains into frontend/browser code.

## Candidate obsolete variables

On `Hobby-Corner-Discord-Bot`, current deployed `main.py` does not reference:
- `SPECIAL_ORDERS_ADMIN_KEY`
- `SPECIAL_ORDERS_API_URL`
- `GW_PREORDER_TEST_CHANNEL_ID`

Do not remove until deployment history and any external scripts are checked, but these are strong cleanup candidates.

## Sealing recommendation

Current Railway inventory reports no sealed application variables.

After approved migration, seal high-impact secrets where Railway allows:
- shared Lightspeed token
- Discord token(s)
- Microsoft Graph client secret
- Google service-account credential if retained
- shared Timeclock admin secret
- shared scanner service secret
- customer/rewards admin key
- scanner session secret
- scanner login-limit secret
- Timeclock PIN pepper
- Special Orders admin key

Non-secret IDs/domains/configuration do not need sealing.

## Required code modifications

No code modification is required merely to adopt Railway shared/reference variables because current application variable names can remain unchanged.

Recommended code/security changes:
1. Remove the partial Lightspeed token prefix from the `lightspeed-api` PO error page. Even five characters of a token should not be reflected to users.
2. Consider splitting Rewards' direct-Lightspeed capability from its Postgres/customer-sync role. It currently has code for direct Lightspeed access but is not configured with those credential names.
3. If Google WIF is adopted, replace service-account JSON loading with Google external-account/ADC-compatible credentials.
4. Once obsolete Discord-bot Special Orders variables are verified unused, remove them from Railway and corresponding historical setup docs.
5. Add startup configuration diagnostics that report only presence/absence, never secret lengths/prefixes/values, for critical integrations.

## Migration plan after explicit approval

1. Record a rollback snapshot of current variable *names and topology*; do not export secrets into documentation.
2. Verify current identity/equality:
   - Lightspeed account/permission scope across four consumers.
   - Discord bot identity across bot and Special Orders.
   - customer-sync key equals Rewards admin trust relationship.
3. Create production shared variables with new neutral names.
4. Convert one low-risk consumer at a time to reference the shared value while preserving its existing application variable name.
5. Convert database consumers to `${{Postgres.DATABASE_URL}}`.
6. Convert internal service URLs to private-domain references where supported.
7. Redeploy/test in this order:
   - timeclock
   - special-orders-test
   - lightspeed-api
   - Rewards
   - Discord bot
   - migration-test-bsi117 last, only if still needed
8. Verify integrations and store workflows.
9. Rotate incident-exposed external credentials only after reference topology is stable.
10. Remove superseded per-service literal variables after successful validation.
11. Seal retained/high-impact secrets.
12. Re-audit service variable names and access scope.

## Credential rotation order

Recommended after topology migration:
1. Internal service/admin secrets that can be coordinated safely.
2. Microsoft Graph client secret.
3. Discord token(s), with bot reconnect and Special Orders publishing verification.
4. Google service-account key, or migrate to WIF first.
5. Lightspeed API token last, because it has the broadest operational dependency set.
6. Do not rotate `TIMECLOCK_PIN_PEPPER` without a PIN migration/reset plan.

## Test plan

Expected downtime can be near-zero because Railway keeps old deployments serving until replacements become healthy, but each variable change can trigger a redeployment.

Acceptance checks:
- Timeclock health, PIN authentication, admin Discord commands, employee linking.
- Scanner PIN session, rate limiting, Timeclock permission check, product lookup.
- Special Orders auth, dashboard data, product match/reconciliation, GW Graph sync, Discord test post.
- lightspeed-api extension/download endpoint, order split/recall, PO/label reads, ZIP/USPS paths.
- Rewards health, current customer reward reads, customer-source sync.
- Discord bot startup, Google Sheets access, customer sync, timeclock commands.
- migration-test only if its migration/read-only function remains operationally required.
- Database connectivity from every consumer via Postgres reference.

## Residual risks

- Railway OAuth audit access redacts variable values, so equality of duplicated credentials cannot be proven from this audit alone.
- No current application secret is sealed.
- The main Lightspeed token is broad-impact because four services currently depend on it.
- Google uses a long-lived service-account key until a validated WIF design replaces it.
- Legacy/history sources may contain credentials even though the current deployed source scan found no hardcoded production secret literals.
- Previously documented legacy preorder-sheet secret exposure should be re-verified and included in incident credential rotation if still applicable.
- `migration-test-bsi117` retains direct Lightspeed credentials despite being a test/migration utility; retire or restrict it when no longer required.

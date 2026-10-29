# Rewards / Customer Sync — Current Handoff

**Last verified:** 2026-10-29  
**Status:** Deployed (service), Maintenance (shared API and identity migration planning).

## Source
- Repository: `Tawgod/Hobby-Corner-Discord-Bot`, branch `main@ce54862f67d678f8a1cb77302e520c59fb0c7118`.
- Source: `rewards_service.py` (FastAPI/postgres customer tiers), `main.py` (Discord/customer sync). Other RMS/bridge branches are separately in development.
- No new Rewards PR inspected or deployed in this handoff.

## Implemented
- Deployed Rewards service from Discord-Bot main with customer identity mapping, RMS/Discord customer staging, legacy transaction consolidation, tier overrides, rolling spend snapshots and job/run records in PostgreSQL schema.
- Supports configured scheduled reward calculation and admin-triggered customer sync; current source has direct X-Series HTTP adapter that requires separate token/domain variables to function.
- Existing identity fields and customer custom fields must not be duplicated or exposed in new tools.

## Tested
- Railway production `Hobby-Corner-Rewards` and `Hobby-Corner-Discord-Bot` latest deployment status **SUCCESS** with sources on `main` (as of 2026-10-29); this verifies deployment status, **not** end-to-end reward calculations or current sync content.
- Source `rewards_service.py` inspected; live customer record parity, scheduled task execution, API permissions and balance updates **not verified** this turn.
- Railway security audit notes missing `LIGHTSPEED_ACCESS_TOKEN`/`LIGHTSPEED_DOMAIN_PREFIX` variable names from Rewards service as last inventoried; **do not assume direct Lightspeed writes currently configured**.

## Deployed
- Railway production services: `Hobby-Corner-Rewards`, `Hobby-Corner-Discord-Bot` from `Tawgod/Hobby-Corner-Discord-Bot:main`; deployment state SUCCESS.
- Direct Lightspeed custom-field writer status and customer-sync job end-to-end accuracy: unverified.

## Shared dependencies
- Customer identity and verified shared gateway/auth planned in `LIGHTSPEED_SHARED_SERVICES.md`; PR #32/#33 **unmerged**, not a service replacement yet.
- RMS/Discord staging; legacy customer identities, timezone rules and tier thresholds need data validation before changing customer attributes.
- Invoice Reconciliation: customer shipment/on-way annotations belong to Special Orders, **not** Rewards tiers; no new Rewards write path for invoice events.

## Shared files / integration surfaces affected
- `rewards_service.py`, `main.py`, `rms_bridge/*`, `migration/*` as applicable, existing Postgres schemas and Railway deployment variables.

## Remaining blockers
- Verify real scheduled runs, customer sync path, source token/config and role scopes before retiring direct API client.
- Inventory rewards settings, exceptions, legacy transaction mapping and documented dry-run behavior; protect historical customer data.
- Coordinate customer custom field writes only after read-only shared gateway parity and explicit mutation approval.

## Decisions needed
- Which current customer sync data remain authoritative after January 2027 migration, and timing of credential retirement.

## Recommended next action
- Run read-only reconciliation of current Rewards schema/settings, sources and last job status; document exact API paths and fail-closed behavior before any production conversion.

## Restrictions / safety
- Do not modify real customer discounts, merge identity records, rotate credentials or redeploy production from this handoff without explicit approval.

## Documentation
- `RAILWAY_VARIABLE_SECURITY_AUDIT.md`, `LIGHTSPEED_SHARED_SERVICES.md`, `HOBBY_CORNER_PROJECT.md`.

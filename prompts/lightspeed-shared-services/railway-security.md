# Prompt — Railway Security / Credential Coordination for Shared Lightspeed Services

The shared Lightspeed gateway will eventually change credential ownership. Read:
- `Tawgod/Hobby-Corner:main/LIGHTSPEED_SHARED_SERVICES.md`
- `RAILWAY_VARIABLE_SECURITY_AUDIT.md`

## Goal

Plan a safe credential topology where the canonical Lightspeed gateway holds the production Lightspeed credential and other services use authenticated internal APIs whenever feasible.

## Tasks

1. Inventory which Railway services currently receive Lightspeed domain/token variables.
2. Map each service to the shared-service conversion plan.
3. Do not remove credentials until the consumer is converted and parity-tested.
4. Define internal service-auth requirements for Rewards/Special Orders/other consumers.
5. Keep Scanner isolated-test credentials separate from production.
6. Keep migration/test utility credentials separately controlled.
7. Preserve current secret values; do not expose them in docs.
8. Stage removals only after live service health and rollback plans are verified.

## Handoff

Update `Tawgod/Hobby-Corner:main/handoffs/railway-security.md`.

No production variable removal/rotation/redeploy without explicit authorization.

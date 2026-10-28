# Prompt — Rewards / Customer Sync Shared Lightspeed Conversion

Rewards should migrate away from its independent production Lightspeed client toward the shared gateway. Read:
- `Tawgod/Hobby-Corner:main/LIGHTSPEED_SHARED_SERVICES.md`

Current Rewards code in `Tawgod/Hobby-Corner-Discord-Bot` has its own Python Lightspeed client and writes customer custom fields.

## Goal

Move Rewards toward authenticated Hobby Corner internal service contracts for:
- customer enumeration/read
- sales history reads
- customer custom-field definition/value writes

The Rewards tier calculation remains Rewards-owned.

## Requirements

1. Do not rewrite tier calculations while changing transport.
2. Define the exact shared Customer/Sales/Custom Fields API contract needed by Rewards.
3. Add service-to-service authorization.
4. Preserve dry-run behavior.
5. Preserve custom-field types/names unless a separately approved migration changes them.
6. Move production Lightspeed credential ownership out of Rewards only after the shared gateway is deployed and verified.
7. Use staged dual-read/comparison if useful; do not remove current credentials/code before parity is proven.

## Testing

- customer count/parity
- sales totals/parity
- custom field encoding
- dry-run
- service auth failure
- write audit/idempotency where applicable

## Handoff

Update `Tawgod/Hobby-Corner:main/handoffs/rewards.md`.

Document credential-removal readiness separately from code readiness.

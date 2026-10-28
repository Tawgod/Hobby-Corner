# Prompt — Deployment Coordination for Shared Lightspeed Services

Shared Lightspeed service conversion must be merged/deployed in dependency order. Read:
- `Tawgod/Hobby-Corner:main/LIGHTSPEED_SHARED_SERVICES.md`
- `HOBBY_CORNER_PROJECT.md`
- relevant handoffs
- Chrome integration/release docs when extension consumers are affected

## Goal

Coordinate incremental shared-service rollout without breaking existing tools.

## Suggested rollout

1. Shared transport/read modules + tests.
2. Compatibility wrappers so existing routes continue working.
3. Convert one read-only consumer at a time.
4. Verify parity/runtime.
5. Convert controlled write modules.
6. Convert write consumers one at a time with rollback.
7. Remove old direct raw calls only after all consumers pass.
8. Remove duplicate Lightspeed credentials only after Railway security review and explicit approval.

## Required checks

- source base current
- CI/regressions
- Railway service ownership
- database migration impact
- auth/service-secret dependencies
- extension queue impact
- rollback path
- write-disable flags

Do not combine credential removal, route deletion and write-path migration in one irreversible step.

## Handoff

Update `Tawgod/Hobby-Corner:main/handoffs/deployment-coordination.md` with the current conversion/deployment matrix.

# Prompt — Shared Lightspeed Services Foundation

The Hobby Corner shared Lightspeed service architecture is now documented at `Tawgod/Hobby-Corner:main/LIGHTSPEED_SHARED_SERVICES.md`. Read it before making changes.

Use `Tawgod/Lightspeed:integration/hobby-corner-consolidation` as the authoritative application base. Re-read the current branch head before implementation.

## Goal

Build the shared Lightspeed service foundation without rewriting working feature behavior.

This work should establish the reusable transport/policy/audit/domain structure that other Hobby Corner tools can consume.

## First implementation scope

1. Audit current direct/raw Lightspeed access in the consolidated source.
2. Reconcile the existing `services/lightspeedApi.js` client with the versioned/raw helpers currently embedded in Special Orders.
3. Create the shared internal namespace described in `LIGHTSPEED_SHARED_SERVICES.md`, starting with:
   - client/transport
   - write policy
   - audit/idempotency contracts
   - customers read/search
   - product identity/matching
   - catalog reference reads
4. Preserve current public routes and response shapes during extraction.
5. Add contract/unit tests before moving consumers.
6. Do not enable any new production write capability.
7. Do not remove existing code paths until all known consumers have migrated and regression tests pass.

## Architecture rule

Feature code should eventually call shared domain modules or authenticated `lightspeed-api` gateway routes. Cross-service consumers should not gain their own production Lightspeed credentials merely for convenience.

Keep Scanner isolated-test writer and RMS bulk migration explicitly separate.

## Coordination

Before changing code, inspect the active Core Operations, Scanner, PO Companion, Consignment, Product Manager, Timeclock/Split and deployment branches/PRs for overlapping backend files.

Do not mix this refactor into a UI-only PR simply to reduce PR count.

## Testing

At minimum:
- transport/client tests
- version/error parsing tests
- policy fail-closed tests
- idempotency/audit contract tests
- customer read/search contract tests
- product identity/matching regression tests
- Scanner regression
- Special Orders regression
- no-new-write assertions

## Handoff

Update `Tawgod/Hobby-Corner:main/handoffs/lightspeed-shared-services.md` using `handoffs/TEMPLATE.md`.

Also update `LIGHTSPEED_SHARED_SERVICES.md` when implementation decisions change the architecture.

No Railway production deployment or credential relocation without explicit authorization.

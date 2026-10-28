# Shared Lightspeed Services — Current Handoff

**Last verified:** 2026-10-28  
**Status:** In Development

## Source

- Management repository: `Tawgod/Hobby-Corner`
- Architecture: `LIGHTSPEED_SHARED_SERVICES.md`
- Runtime repository: `Tawgod/Lightspeed`
- Authoritative runtime branch: `integration/hobby-corner-consolidation`
- Observed consolidated head during architecture audit: `59a971d223eab70005c35b825d16cefdc025299a`
- Implementation PR: not started yet

## Implemented

- Project-wide target architecture documented.
- Current shared vs duplicated Lightspeed integration patterns audited.
- Canonical module boundaries defined for:
  - transport/client
  - authorization/write policy
  - audit/idempotency
  - customers
  - product identity/matching
  - products
  - catalog references
  - media
  - inventory
  - sales
  - fulfillments
  - purchase orders
  - store credit
  - customer custom fields
- Cross-chat conversion prompt set created under `prompts/lightspeed-shared-services/`.
- Explicit isolation rules documented for Scanner test-tenant writes and RMS bulk migration.

## Tested

- Architecture/source review only.
- No runtime code refactor has been performed yet.
- No production or browser testing applies yet.

## Deployed

- No.
- No Railway service, credential, database or extension configuration changed.

## Shared dependencies

- Timeclock-backed employee identity / staff auth
- Special Orders product/customer logic
- Product Scanner matching
- PO Companion
- Consignment
- Product Manager
- Split / Recall
- Avery Labels
- Rewards
- RMS migration
- Railway credential/security coordination

## Shared files / integration surfaces affected

Planned shared runtime namespace:
- `services/lightspeed/*`
- authenticated `lightspeed-api` gateway routes
- compatibility wrappers in existing feature routes during migration

Management/coordination files:
- `LIGHTSPEED_SHARED_SERVICES.md`
- `prompts/lightspeed-shared-services/*`

## Remaining blockers

- Dedicated foundation implementation branch/PR has not been started.
- Direct Lightspeed call inventory needs an executable/source-level regression guard.
- Shared transport/policy/audit contracts need implementation.
- Consumers must migrate incrementally without breaking existing behavior.
- Credential ownership cannot be reduced until converted consumers are parity-tested.

## Decisions needed

- Confirm implementation sequencing through the shared foundation prompt.
- Decide exact internal route names/schema when coding begins.
- Approve production deployment/credential changes separately after parity testing.

## Recommended next action

- Start the Shared Lightspeed Services Foundation development prompt from `prompts/lightspeed-shared-services/shared-lightspeed-services-foundation.md`.
- In parallel, notify affected feature chats using the short sentences in the prompt index so they do not add new parallel Lightspeed code.

## Restrictions / safety

- No new production Lightspeed writes authorized.
- No credential migration/removal authorized.
- No production Railway deployment authorized.
- Do not delete existing feature paths until all consumers are converted and tested.

## Documentation

- `Tawgod/Hobby-Corner:main/LIGHTSPEED_SHARED_SERVICES.md`
- `Tawgod/Hobby-Corner:main/prompts/lightspeed-shared-services/README.md`

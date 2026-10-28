# Prompt — Product Scanner / Toolkit Shared Lightspeed Conversion

Shared Lightspeed services coordination has started. Read:
- `Tawgod/Hobby-Corner:main/LIGHTSPEED_SHARED_SERVICES.md`
- `CHROME_EXTENSION_INTEGRATION.md`
- `CHROME_EXTENSION_RELEASE_QUEUE.md`

Use the latest consolidated branch as the authority.

## Goal

Make Product Scanner a consumer of the canonical Product Identity, Product, Catalog and employee-write-policy contracts rather than owning duplicate Lightspeed behavior.

## Requirements

1. Preserve supplier-page capture, completeness checks, proposals, staging and shared navigation.
2. Preserve the current Special Orders matching semantics until the new Product Identity module is proven equivalent.
3. Move Scanner matching adapters toward the canonical Product Identity contract.
4. Scanner must not gain an independent production product writer.
5. Any future approved product creation must call the canonical shared Product service with Timeclock-backed authorization, duplicate verification, idempotency, audit and readback.
6. Keep `scannerIsolatedTestWriter.js` separate and test-tenant-only. It may reuse validation helpers but must never fall through to production credentials.
7. Do not add direct Lightspeed credentials to the extension.

## Testing

Re-run Scanner integration/UI/clipboard/browser regression plus:
- exact and ambiguous product matching
- remote lookup failure fail-closed behavior
- employee authorization
- proposal/staging preservation
- isolated-test writer domain separation
- no production write path from the extension

## Coordination

Do not independently alter shared popup/navigation or packaging. Reconcile with current extension integration work.

## Handoff

Update `Tawgod/Hobby-Corner:main/handoffs/product-scanner.md` and `CHROME_EXTENSION_RELEASE_QUEUE.md` when release readiness/dependencies change.

State which Scanner calls now use shared contracts and which legacy adapters remain.

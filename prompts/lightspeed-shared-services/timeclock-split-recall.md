# Prompt — Timeclock + Split / Recall Shared Lightspeed Conversion

Split/Recall backend Lightspeed access is part of the shared-service conversion. Read:
- `Tawgod/Hobby-Corner:main/LIGHTSPEED_SHARED_SERVICES.md`
- `CHROME_EXTENSION_INTEGRATION.md`

## Goal

Keep the Timeclock employee identity system separate, but migrate Split/Recall backend Lightspeed access onto canonical Sales, Fulfillment and Customer read contracts.

## Requirements

1. Preserve current Timeclock PIN/session behavior.
2. Preserve sale identification, eligible-order lookup, Split/Recall, Partial Pickup and Retrieve-to-Register behavior.
3. Reconcile existing use of `services/lightspeedApi.js` with the new shared transport/domain services.
4. Higher-level split/deposit/work-order orchestration remains feature-owned.
5. Raw sale/customer/fulfillment API access inside workflow code should move behind shared domain modules.
6. New mutations must use common policy/audit/idempotency controls.
7. Do not put Lightspeed credentials in the extension/content script.

## Testing

Re-run all Split/Recall regression and real Chrome acceptance after each backend conversion, including partial/unknown failure behavior.

## Handoff

Update `Tawgod/Hobby-Corner:main/handoffs/timeclock-split-recall.md` and the release queue when extension readiness changes.

Document which higher-level workflows remain feature-owned and which low-level Lightspeed calls moved to shared services.

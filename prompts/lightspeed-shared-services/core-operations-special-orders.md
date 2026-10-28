# Prompt — Core Operations / Special Orders Shared Lightspeed Conversion

Shared Lightspeed services coordination has started. Read:
- `Tawgod/Hobby-Corner:main/LIGHTSPEED_SHARED_SERVICES.md`
- `Tawgod/Hobby-Corner:main/HOBBY_CORNER_PROJECT.md`

Use the latest `Tawgod/Lightspeed:integration/hobby-corner-consolidation` as the source of truth.

## Role in the conversion

Special Orders currently contains the most mature customer/product/PO/inventory integration and is the primary source of behavior to extract, not rewrite.

Do not overload the completed UI/navigation PR merely to perform this backend refactor. Use a current-base backend branch or coordinate with the shared-services foundation branch.

## Audit and extraction targets

Inventory every current Lightspeed call in:
- `special-orders.js`
- `routes/specialOrderProducts.js`
- related Ordering/receiving/PO code

Map each to the canonical modules in `LIGHTSPEED_SHARED_SERVICES.md`:
- customers
- product identity/matching
- products
- catalog references
- media
- inventory
- purchase orders
- sales/fulfillments where used

Preserve:
- customer create/update behavior and local profile synchronization
- product required-field validation
- duplicate prevention
- supplier resolution
- tax-exclusive price normalization
- product tagging/audit behavior
- local product-registry synchronization
- receiving and supplier-order workflows
- Timeclock-backed employee authentication
- all existing write flags and fail-closed safeguards

## Conversion approach

Extract tested logic into shared domain services while keeping existing Special Orders HTTP routes compatible until all consumers move.

Do not introduce a second implementation beside the old one.

## Tests

Run:
- Special Orders workflow regressions
- product duplicate/matching tests
- customer create/update contract tests
- PO/receiving tests
- Scanner regression
- authorization/write-disabled tests
- idempotency/audit tests for any extracted mutation path

Do not perform live production writes solely to validate this refactor.

## Handoff

Update `Tawgod/Hobby-Corner:main/handoffs/core-operations.md` and note:
- which raw Lightspeed calls remain
- which shared modules are now authoritative
- which existing routes are compatibility wrappers
- tests performed
- consumer migrations still pending

If extension release state changes, update the release queue as required.

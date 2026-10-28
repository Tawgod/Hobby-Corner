# Prompt — Purchase Order Companion Shared Lightspeed Conversion

PO Companion should use the shared Purchase Order and catalog contracts. Read:
- `Tawgod/Hobby-Corner:main/LIGHTSPEED_SHARED_SERVICES.md`
- `CHROME_EXTENSION_INTEGRATION.md`
- `CHROME_EXTENSION_RELEASE_QUEUE.md`

## Goal

Finish PO Companion as a read-only consumer of the canonical Purchase Order service rather than owning an independent Lightspeed PO client.

## Requirements

1. Implement/read against the shared Purchase Order contract for current POs and line items.
2. Use shared Product/Catalog normalization for SKU, UPC, supplier and product references.
3. Preserve supplier SKU/UPC text exactly, including leading zeros.
4. Reuse Timeclock-backed employee authorization.
5. Do not place Lightspeed credentials in the extension.
6. Do not add a second raw PO endpoint/client in PO Companion.
7. Keep approval/write behavior disabled until separately authorized.
8. Reconcile popup/navigation/manifest changes through the shared extension contract.

## Testing

- representative real read-only PO
- line-item mapping
- supplier/product IDs
- leading-zero copy fidelity
- auth failure
- empty/closed PO states
- extension regressions

## Handoff

Update `Tawgod/Hobby-Corner:main/handoffs/po-companion.md` and the Chrome release queue.

State whether all raw PO access has been removed from feature-specific code.

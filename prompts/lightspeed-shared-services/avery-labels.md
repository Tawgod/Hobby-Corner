# Prompt — Avery PO Label Maker Shared Lightspeed Conversion

Avery Labels should consume shared PO/product read contracts without changing label geometry. Read:
- `Tawgod/Hobby-Corner:main/LIGHTSPEED_SHARED_SERVICES.md`

## Goal

Ensure label-data retrieval uses the canonical Purchase Order/Product read services while keeping rendering/printing feature-owned.

## Requirements

1. Replace or wrap any feature-specific raw PO/product reads with shared Purchase Order/Product contracts.
2. Preserve the existing label API response consumed by the label generator during migration.
3. Do not change Avery 5960 geometry, barcode generation, SKU text, start positions or customer/special-order label logic as part of service centralization.
4. No new write permissions are needed.

## Testing

- representative POs
- leading-zero SKU/barcodes
- customer/special-order fields
- PDF regression
- physical Avery print acceptance remains authoritative for geometry

## Handoff

Update `Tawgod/Hobby-Corner:main/handoffs/avery-labels.md` with the shared read-service status and confirm label calculations remain unchanged.

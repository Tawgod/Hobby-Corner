# Prompt — Consignment Shared Lightspeed Conversion

Consignment's future Lightspeed integration must use the shared gateway. Read:
- `Tawgod/Hobby-Corner:main/LIGHTSPEED_SHARED_SERVICES.md`
- the current Consignment handoff/project matrix

## Shared modules Consignment should consume

- Customers: lookup/match/read
- Product Identity: existing-product matching
- Products: controlled product creation only if later approved
- Sales: sale/return reconciliation
- Store Credit: delayed credit transactions
- Catalog: category/tag/supplier references where needed

## Safety requirements

1. Preserve the isolated beta.
2. Introduce real data read-only before any production writes.
3. Do not create Consignment-specific raw Lightspeed customer/product/store-credit writers.
4. Store-credit posting must use canonical idempotency/audit/readback controls.
5. Product creation must use the canonical Product service and duplicate checks.
6. Customer creation, if later needed, must use the canonical Customer service.
7. Keep extension launcher work separate from the backend conversion.

## Testing

- read-only customer/product matching
- sale/return reconciliation
- duplicate protection
- three-day/delayed credit idempotency
- retry/partial failure
- no beta-to-production credential leakage
- Scanner regressions where matching is shared

## Handoff

Update `Tawgod/Hobby-Corner:main/handoffs/consignment.md` and release queue if extension state changes.

Record exactly which production writes remain disabled.

# Prompt — RMS Migration Alignment with Shared Lightspeed Services

RMS migration should align identity/payload rules with the shared Lightspeed contracts while keeping bulk migration isolated. Read:
- `Tawgod/Hobby-Corner:main/LIGHTSPEED_SHARED_SERVICES.md`

## Goal

Reuse shared normalization/identity/catalog validation where practical without turning migration into an ordinary staff write path.

## Preserve migration isolation

Keep:
- dry-run/review gates
- bounded batches
- source conflict detection
- migration-specific audit context
- test/cutover controls
- opening inventory policy
- explicit credential/cutover authorization

Do not route bulk migration through an employee-facing create-product endpoint unless a dedicated bulk contract is intentionally designed and tested.

## Reuse where practical

- SKU/UPC/product-code normalization
- duplicate/product identity rules
- category/supplier/brand exact resolution
- product payload validation
- image validation
- readback normalization

Compare migration behavior against the canonical Product/Product Identity/Catalog rules and document intentional differences.

## Handoff

Update the current RMS migration handoff or create `Tawgod/Hobby-Corner:main/handoffs/rms-migration.md`.

Record which rules are shared and which remain intentionally migration-specific.

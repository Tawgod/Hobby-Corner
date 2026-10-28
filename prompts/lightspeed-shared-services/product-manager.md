# Prompt — Product Manager Shared Lightspeed Conversion

Product Manager should integrate through the shared Lightspeed service contracts. Read:
- `Tawgod/Hobby-Corner:main/LIGHTSPEED_SHARED_SERVICES.md`
- `handoffs/product-manager.md`

## Goal

Connect Product Manager to shared read services first, without creating Product Manager-specific Lightspeed clients or write code.

## Use shared contracts for

- Product reads/search
- Product Identity / duplicate matching
- Catalog references: supplier, brand, category, tags
- Inventory reads
- Product media rules where images are later managed

Reuse Timeclock-backed employee identity and the existing Product Manager employee profile/work-backup design.

## Writes

Do not implement direct Lightspeed product writes inside Product Manager.

Future create/update actions must call the canonical Product service and require:
- employee authorization
- diff/preview
- duplicate/identity verification
- explicit approval
- idempotency/audit
- readback
- partial-failure handling

Keep live writes disabled until separately approved.

## Testing

Add mocked/shared-service contract tests before live integration. Preserve current staged edits, undo, employee profile isolation and work-backup behavior.

## Handoff

Update `Tawgod/Hobby-Corner:main/handoffs/product-manager.md` with:
- shared modules consumed
- remaining demo-only code
- auth/read integration status
- write status
- tests and blockers

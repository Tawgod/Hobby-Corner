# Prompt — Back Room Inventory on Shared Lightspeed Services

Build Back Room Inventory on the shared Product/Inventory contracts. Read:
- `Tawgod/Hobby-Corner:main/LIGHTSPEED_SHARED_SERVICES.md`
- current project matrix

## Architecture rules

- Use canonical Product Identity/Product reads.
- Use canonical Inventory reads for total/outlet inventory.
- Do not create a separate Lightspeed inventory client.
- Back-room quantity and floor-capacity are Hobby Corner operational metadata, not a replacement for Lightspeed total inventory.
- Design explicit reconciliation rules for moving units between floor/back-room conceptual locations.
- Use Timeclock-backed employee identity for adjustments and audit.
- Reuse Scanner for product identification where practical.

## Initial scope

Design the data model, daily restock queue and read-only inventory reconciliation first. Any Lightspeed inventory adjustment write requires a separate approved design.

## Handoff

Create/update `Tawgod/Hobby-Corner:main/handoffs/back-room-inventory.md`.

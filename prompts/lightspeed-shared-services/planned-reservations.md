# Prompt — Game Room Reservations on Shared Lightspeed Services

Reservations should reuse shared Customer identity and any future Lightspeed payment/sale integration. Read:
- `Tawgod/Hobby-Corner:main/LIGHTSPEED_SHARED_SERVICES.md`

## Architecture rules

The room/table/resource/calendar engine remains a separate Hobby Corner domain.

Use shared Lightspeed services only where appropriate:
- Customer lookup/create if staff need to attach a Lightspeed customer
- Sales/payment/event-fee integration if later approved

Do not make reservations depend on Lightspeed for basic scheduling.

Do not implement a reservation-specific raw customer or sale client.

Start with resource map, reservations, blackout dates, conflict detection, events and notifications. Treat paid-event/POS linkage as a later shared-service integration.

## Handoff

Create/update `Tawgod/Hobby-Corner:main/handoffs/reservations.md`.

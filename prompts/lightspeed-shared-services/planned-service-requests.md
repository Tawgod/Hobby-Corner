# Prompt — Service Requests / Repairs on Shared Lightspeed Services

Build Repairs/Service Requests on shared Customer/Product/Sales/Special Orders/Timeclock contracts. Read:
- `Tawgod/Hobby-Corner:main/LIGHTSPEED_SHARED_SERVICES.md`

## Required shared contracts

- Customer lookup/create/update
- Product identity/product reads
- Special Orders parts ordering
- Sales/work-order creation and readback
- Timeclock employee identity
- future commission reporting linkage
- shared notification architecture

Do not create feature-specific raw Lightspeed customer/product/sale writers.

Keep the service-ticket lifecycle feature-owned: intake, diagnosis, estimate, approval, waiting parts, repair, ready, completed, cancelled.

Fees and commission rules should be stored as Hobby Corner business data, while Lightspeed sales/work-order operations use the canonical Sales service.

## Handoff

Create/update `Tawgod/Hobby-Corner:main/handoffs/service-requests.md`.

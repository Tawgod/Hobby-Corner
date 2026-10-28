# Shared Lightspeed Services — Cross-Chat Prompt Index

Read the architecture first:

`Tawgod/Hobby-Corner:main/LIGHTSPEED_SHARED_SERVICES.md`

These prompts coordinate conversion from feature-owned/raw Lightspeed API calls to shared Hobby Corner Lightspeed domain services.

## How to use

Send the short sentence for the relevant development chat, or send the complete prompt from the linked file.

Each development chat should:
- read the architecture note before making Lightspeed integration changes;
- inspect current consolidated source before changing code;
- preserve working feature behavior;
- update its central `handoffs/<system>.md` file;
- update the Chrome release queue when extension work is affected;
- not deploy production or enable new Lightspeed writes without explicit authorization.

## Current development chats

| Chat / workstream | Short sentence to send | Full prompt |
| --- | --- | --- |
| Shared Lightspeed Services Foundation | **A shared Lightspeed service layer is now a project dependency. Please read `LIGHTSPEED_SHARED_SERVICES.md` and `prompts/lightspeed-shared-services/shared-lightspeed-services-foundation.md` before starting the foundation implementation.** | `shared-lightspeed-services-foundation.md` |
| Chat / workstream | Short sentence to send | Full prompt |
| --- | --- | --- |
| Core Operations / Special Orders | **Shared Lightspeed services coordination has started. Please read `Tawgod/Hobby-Corner:main/LIGHTSPEED_SHARED_SERVICES.md` and `prompts/lightspeed-shared-services/core-operations-special-orders.md` before continuing Lightspeed API work.** | `core-operations-special-orders.md` |
| Product Scanner / Toolkit | **Shared Lightspeed services coordination has started. Please read `Tawgod/Hobby-Corner:main/LIGHTSPEED_SHARED_SERVICES.md` and `prompts/lightspeed-shared-services/product-scanner-toolkit.md` before continuing Scanner integration work.** | `product-scanner-toolkit.md` |
| Product Manager | **Product Manager should now integrate through the shared Lightspeed service contracts. Please read `LIGHTSPEED_SHARED_SERVICES.md` and `prompts/lightspeed-shared-services/product-manager.md`.** | `product-manager.md` |
| Purchase Order Companion | **PO Companion should now use the shared Purchase Order and catalog contracts. Please read `LIGHTSPEED_SHARED_SERVICES.md` and `prompts/lightspeed-shared-services/po-companion.md`.** | `po-companion.md` |
| Consignment | **Consignment's future Lightspeed customer/product/sale/store-credit integration must use the shared gateway. Please read `LIGHTSPEED_SHARED_SERVICES.md` and `prompts/lightspeed-shared-services/consignment.md`.** | `consignment.md` |
| Timeclock + Split / Recall | **Split/Recall backend Lightspeed access is part of the shared-service conversion. Please read `LIGHTSPEED_SHARED_SERVICES.md` and `prompts/lightspeed-shared-services/timeclock-split-recall.md`.** | `timeclock-split-recall.md` |
| Avery PO Labels | **Avery Labels should consume the shared PO/product read contracts without changing label geometry. Please read `LIGHTSPEED_SHARED_SERVICES.md` and `prompts/lightspeed-shared-services/avery-labels.md`.** | `avery-labels.md` |
| Rewards / customer sync | **Rewards should migrate away from its independent production Lightspeed client toward the shared gateway. Please read `LIGHTSPEED_SHARED_SERVICES.md` and `prompts/lightspeed-shared-services/rewards-customer-sync.md`.** | `rewards-customer-sync.md` |
| RMS migration | **RMS migration should align identity/payload rules with the shared Lightspeed contracts while keeping bulk migration isolated. Please read `LIGHTSPEED_SHARED_SERVICES.md` and `prompts/lightspeed-shared-services/rms-migration.md`.** | `rms-migration.md` |
| Railway security/config | **The shared Lightspeed gateway will eventually change credential ownership. Please read `LIGHTSPEED_SHARED_SERVICES.md` and `prompts/lightspeed-shared-services/railway-security.md` before changing Lightspeed variables.** | `railway-security.md` |
| Deployment coordination | **Shared Lightspeed service conversion must be merged/deployed in dependency order. Please read `LIGHTSPEED_SHARED_SERVICES.md` and `prompts/lightspeed-shared-services/deployment-coordination.md`.** | `deployment-coordination.md` |

## Planned workstreams

| Future chat | Short sentence to send | Full prompt |
| --- | --- | --- |
| Back Room Inventory | **Build Back Room Inventory on the shared Product/Inventory contracts; read `LIGHTSPEED_SHARED_SERVICES.md` and `prompts/lightspeed-shared-services/planned-back-room-inventory.md` before implementation.** | `planned-back-room-inventory.md` |
| Service Requests / Repairs | **Build Repairs/Service Requests on shared Customer/Product/Sales/Special Orders/Timeclock contracts; read `LIGHTSPEED_SHARED_SERVICES.md` and `prompts/lightspeed-shared-services/planned-service-requests.md`.** | `planned-service-requests.md` |
| Game Room Reservations | **Reservations should reuse shared Customer identity and any future Lightspeed payment/sale integration; read `LIGHTSPEED_SHARED_SERVICES.md` and `prompts/lightspeed-shared-services/planned-reservations.md`.** | `planned-reservations.md` |

## Conversion ownership

The first implementation should be led from the Core Operations / Special Orders backend because it currently contains the most mature product/customer/PO/inventory logic to extract. Other chats should consume/reconcile the shared contracts, not independently invent competing modules.

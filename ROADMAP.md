# Hobby Corner Development Roadmap

Last verified: 2026-10-28

This roadmap is the current planning view. Detailed implementation history remains in `HOBBY_CORNER_PROJECT.md`; Chrome extension release state remains in `CHROME_EXTENSION_RELEASE_QUEUE.md`.

## 1. Immediate coordination and stabilization

### Consolidated application base
- Keep `Tawgod/Lightspeed:integration/hobby-corner-consolidation` as the authoritative integration base.
- New or refreshed feature branches must start from the current consolidated source.
- Do not resume development from superseded branches without selective reconciliation.

### Current shared UI / navigation convergence
- Rebase and validate PR #24 for Special Orders / Ordering / Preorders / GW Preorders navigation and UI consistency.
- Finish PR #27 shared UI reconciliation, preserving only unique reusable pieces; retire PR #16 after verification.
- Continue Product Manager on PR #28.
- Continue Avery Label Maker on PR #29.
- Continue Consignment on PR #30.
- Continue PO Companion on PR #31.
- Continue Scanner/Toolkit on PR #26.
- Continue Timeclock + Split/Recall extension UI on PR #22.

### Real employee acceptance
Automated tests are not sufficient for release. Complete real browser/store acceptance for:
- Timeclock PIN sign-in, invalid/deactivated employee behavior, session expiry and sign-out.
- Product Scanner supplier capture, duplicate-safe matching, staging/proposals and navigation.
- Split / Recall / Partial Pickup including Retrieve to Register.
- PO Companion against a real read-only PO.
- Shared navigation, keyboard use and 100/125/200% zoom.
- Host Lightspeed CSS isolation.

## 2. Coordinated Chrome extension release

Do not package individual feature branches.

Release sequence:
1. Finish feature-specific acceptance for PR #26, #22 and #31.
2. Decide whether a Consignment launcher from PR #30 is approved for the release; beta destinations must remain clearly labeled.
3. Build one current-base release-testing branch.
4. Selectively integrate compatible changes.
5. Reconcile `CHROME_EXTENSION_INTEGRATION.md` and every item in `CHROME_EXTENSION_RELEASE_QUEUE.md`.
6. Run cross-feature automated and real Chrome acceptance.
7. Request explicit release approval.
8. Only then bump the version, build/package and publish/distribute.
9. Record released version, commit, tests and date in the queue.

## 3. Current feature completion

### Special Orders / Ordering / Preorders / GW Preorders
Status: Testing
- Complete browser acceptance of Timeclock-backed employee PIN/header login.
- Confirm receiving review against representative Lightspeed POs.
- Verify customer notification review and delivery queues.
- Finish Discord notification worker testing before production cutover.
- Implement or explicitly document manual handling for email/SMS/Messenger/WhatsApp delivery until senders exist.

### Product Scanner
Status: Testing
- Complete real employee Chrome acceptance.
- Keep production product writes disabled until dedicated write authorization and failure-recovery controls are approved.
- Configure/test isolated Lightspeed test tenant only if controlled create testing is still required.

### Purchase Order Companion
Status: In Development
- Finish authenticated read-only PO retrieval using current Lightspeed PO endpoints.
- Reuse shared Timeclock-backed employee authorization.
- Verify supplier SKU/UPC copy fidelity and draft preservation.
- Run Chrome acceptance with representative real POs.
- Keep approval/write actions disabled until separately authorized.

### Consignment Management
Status: Testing
- Review PR #30 against current core navigation.
- Promote only to isolated test deployment after approval.
- Add protected persistence in an isolated database.
- Verify real customer/product matching read-only first.
- Validate sale/return reconciliation and exact delayed-credit idempotency before any production credit posting.
- Keep production customer/product/inventory/credit writes disabled until explicit approval.

### Product Manager
Status: In Development
- Run CI and browser acceptance on PR #28.
- Restore/verify original Hobby Corner branding route.
- Confirm shared navigation compatibility.
- Define authenticated integration before any live product writes.
- Keep bulk product changes behind preview/review/approval safeguards.

### Avery PO Label Maker
Status: Testing
- Run browser/native zoom acceptance.
- Generate representative PDFs.
- Physically verify Avery 5960 alignment, barcode readability and start positions.
- Merge independently only after acceptance because label geometry must remain unchanged.

### Timeclock + Split / Recall
Status: Testing
- Run real Chrome acceptance for PR #22.
- Preserve PIN identity, overlay state, sale identification, fulfillment, eligible-order and Retrieve-to-Register behavior.
- Keep UI alignment separate from business-logic changes.

## 4. Security and infrastructure

### Railway
- Preserve managed Postgres service and volume.
- Complete remaining credential rotation/sealing where practical.
- Retire obsolete local duplicate variables only after successful reference verification.
- Do not rotate `TIMECLOCK_PIN_PEPPER` without an explicit PIN migration/reset plan.
- Review the continuing need for `migration-test-bsi117` and restrict/retire it if no longer required.

### Legacy secrets
- Verify/rotate any historically exposed Discord credential in legacy Sheets.
- Retire source-controlled legacy Lightspeed importer credentials when the remaining importer dependency is removed.
- Keep secrets out of the public management repository.

## 5. Migration and legacy retirement

### RMS / product migration
Status: Testing
- Complete controlled full-catalog collision preflight.
- Resolve remaining category/supplier/brand review gaps.
- Complete larger controlled rehearsal before catalog cutover.
- Preserve inventory quantity for physical inventory rather than importing RMS on-hand values.
- Retire migration-only tooling and credentials after parity/cutover is verified.

### Legacy importer
Status: Maintenance
- Retain only required category/migration functions.
- Prefer direct Lightspeed integrations for new functionality.
- Remove the legacy credential path when remaining dependencies are retired.

## 6. Planned store-operations workstreams

### Back Room Inventory
- Track back-room quantity and floor capacity by product.
- Generate daily replenishment work lists.
- Reuse Product Scanner/Lightspeed identity.
- Avoid creating a second inventory source of truth.

### Service Requests / Repairs / Warranty / Commissions
- Service-ticket lifecycle for repairs/warranty work.
- Link customer/items to Lightspeed and parts ordering to Special Orders.
- Assign technicians through Timeclock employee identity.
- Configure fees and sales-rep/commission mapping.
- Provide aging/workload/commission dashboard.

### Game Room Reservations & Events
- Configurable game-room/hallway table/resource map.
- Reservations, blackouts, events, recurring schedules and conflict prevention.
- Calendar and floor-map views.
- Reuse customer notification architecture.
- Add Lightspeed payment/event-fee integration only if later approved.

## 7. Planned research / integrations

### Ring cameras
- Continue official/sustainable API capability research only.
- No production camera/account changes without explicit approval.

### MarketTime / supplier integrations
- Prefer extending existing Ordering/Special Orders infrastructure.
- Validate official API/support paths before committing to automation.
- No external purchase submissions without explicit approval.

## Definition of “current”
A feature is not considered current merely because code exists. The manager should track **Implemented**, **Tested**, and **Deployed** separately. A Chrome feature is not release-ready until shared integration/release-queue reconciliation and real browser acceptance are complete.

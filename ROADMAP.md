# Hobby Corner Development Roadmap

Last verified: 2026-10-29

This roadmap is the current planning view. Detailed implementation history remains in `HOBBY_CORNER_PROJECT.md`; Chrome extension release state remains in `CHROME_EXTENSION_RELEASE_QUEUE.md`.

## Current development coordination (owner-confirmed 2026-10-29)

Five ongoing chats: **Shared Lightspeed Services**, **Hobby Corner Manager**, **Shared UI / UX Coordination**, **Deployment Coordination**, and separate **RMS Item Migration**. Previous feature tool chats were archived; their requirements, unfinished work, PRs and handoffs remain active project work, not completed or cancelled. Restart focused feature chats as priorities arise using the GitHub handoff/startup instructions.

**RMS migration remains standalone:** other tools may adopt reviewed pure product matching/normalization/collision-check logic when valuable, through test-backed shared modules and coordinated integration, **not** through migration bulk writers, historical on-hand stock import, live credentials or automatic migration-branch merges.

## 1. Immediate coordination and stabilization

### Shared Lightspeed services
- Review Phase 1 PR #32, now hardened through `0082eacc` with passing final-head CI `40955180232`: canonical default-read-only transport/policy/audit/idempotency, conservative uncertain-write handling, strict JSON/UTF-8/response-byte limits, safe API targets, payload mutation guards, durable PG unknown-key read-only inspection and expanded regressions. **Still unmerged, unapplied and not deployed.**
- Keep Phase 2 PR #33 draft/stacked on #32; hardening is synchronized and final-head CI `40955195986` passed, but branch ancestry must be reconciled after the foundation is approved. No consumer is live on the shared gateway yet.
- Convert read-only consumers first, then controlled writes.
- Prevent new feature-specific production Lightspeed clients while conversion is underway.
- Move cross-service consumers toward authenticated `lightspeed-api` contracts before removing duplicate credentials.
- Keep Scanner isolated-test and RMS migration writers separately controlled.


### Consolidated application base
- Keep `Tawgod/Lightspeed:integration/hobby-corner-consolidation` as the authoritative integration base.
- New or refreshed feature branches must start from the current consolidated source.
- Do not resume development from superseded branches without selective reconciliation.

### Current shared UI / navigation convergence
- PR #24 Core Operations navigation/UI and PR #27 shared UI foundation are **merged** into the consolidated branch; do not repeat their merge work.
- Continue runtime/employee acceptance on the deployed consolidated Core Operations pages, especially receiving and notification/delivery edge cases.
- Continue Product Manager on PR #28.
- Continue Avery Label Maker on PR #29.
- Continue Consignment on PR #30.
- Continue PO Companion on PR #31.
- Continue Scanner/Toolkit on PR #26; it remains unmerged and requires current-base reconciliation/real Chrome acceptance.
- Continue Timeclock + Split/Recall extension UI on PR #22; it remains unmerged and requires current-base reconciliation/real Chrome acceptance.

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
Status: Testing / Deployed
- PR #24 is merged and the current consolidated source is deployed on the three core Railway services.
- Store-browser acceptance passed for valid/invalid PIN, refresh session restoration, persistent sign-out, native zoom and core buttons/navigation.
- Continue receiving-review and notification/delivery edge-case acceptance against representative live/test data.
- Production Discord ready-order delivery and Discord preorder-watch capture are not verified on the deployed bot `main`; complete or explicitly defer those workers.
- Email/SMS/Messenger/WhatsApp are queue/manual paths until production senders are implemented and accepted.
- Preserve current all-active-employee edit/create behavior unless the owner explicitly approves a new permission policy.

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
Status: Testing / Blocked
- Core Timeclock backend and Discord control plane are deployed from current sources; PR #22 remains an unmerged Chrome visual candidate.
- Preserve Timeclock as the shared employee/PIN identity authority. Discord is optional for basic clocking; non-Discord employees can be provisioned by employee-name PIN assignment.
- Preserve Sunday-Saturday weeks, 1-15 / 16-end-of-month pay periods, Central-time presentation, 14-hour auto-close/review and audited corrections.
- PTO balance remains authoritative in payroll. Timeclock records PTO eligibility, PTO vs unpaid requests and requested PTO hours only.
- Scheduling scope includes store hours, assigned/open shifts, role-notified extra hours, shift claiming and optional coverage shift creation from approved time off.
- Repair the verified deployed backend defects before further expansion: the manual missed-entry route calls an undefined `createManualTimeEntry`, and employee-filtered entry browsing builds an invalid PostgreSQL placeholder.
- Add focused regression coverage for PTO/time-off/store-hours/shifts/manual-entry/entry-browser paths.
- Complete real employee acceptance for non-Discord onboarding, PTO review, open-shift claim/role notification, store hours, corrections and entry browsing.
- Next scheduling UX: employee My Schedule plus manager Sunday-Saturday weekly schedule; add conflict detection, affected-shift/time-off reconciliation and multi-day coverage handling.
- Payroll finalization/post-payroll adjustment, configurable weekly overtime, robust midnight/pay-period splitting, five-year retention/archive policy and PIN rate limiting remain unfinished requirements.
- PR #22 is currently 2 commits ahead / 7 behind consolidated `f50c330982`; its owned `extension/content.js` baseline is unchanged, but the branch must be reconciled to current consolidated before release integration.
- Run real Chrome acceptance for PR #22 on Sell/webregister and fulfillment/pickup, including valid/invalid PIN, keyboard/focus/close, native 100/125/200% zoom, host CSS isolation, Split/Recall, Partial Pickup and Retrieve to Register.
- Keep UI alignment separate from business-logic changes and do not add a second shared navigation implementation to `extension/content.js`.
- See `handoffs/timeclock-split-recall.md` for the verified full requirement/bug/deployment snapshot.

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

### Invoice Reconciliation — planned shared Product Manager / Scanner / Special Orders feature
- Requirements and API safety plan: `FEATURE_INVOICE_RECONCILIATION.md` (recorded 2026-10-29). This is **not a new tool**.
- Read-only mailbox ingest for supplier invoices, preorders/acknowledgments, shipping and tracking; secured PDF parsing and provenance.
- Match each invoice to an existing Lightspeed PO **or stage creation of a new OPEN supplier PO**, and product identities; stage 90%+ candidates, secondary supplier associations and new-product/price variance reviews in Railway PostgreSQL.
- Product Manager gets a shared, authenticated **Invoice Updates** dropdown, filtered by selected invoice, regardless of an employee's private saved profile.
- Scanner supplies verified SKU/UPC and supplier-specific cost proposals. Special Orders/PO Companion show PO/invoice/tracking context without automatically changing stock or notifying customers.
- After all lines are reviewed and the invoice approved, **create an OPEN supplier PO or update the selected existing PO** through the shared audited/idempotent backend; **never receive stock or modify inventory**. Add supplier shipping-sender aliases, match shipping/tracking to the correct supplier/invoice/PO, and show informational **On the way** in Special Orders.
- Prioritize supplier sender/alias and email/PDF format validation, staging and tracking review before PO writer implementation. X-Series supplier consignment create/update must be explicitly OPEN/status-safe and avoid receive/dispatch side effects.
- No mailbox, PO, employee, production or Chrome changes authorized by this planning item.

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

### Shared staff security baseline and Timeclock exposure — priority stabilization (2026-10-30)

- Source audit found a legacy Timeclock staff status/clocking path that accepts name or four-digit PIN outside the newer signed staff session. This is **high-priority security debt**, not a claim of a live breach.
- Existing HMAC PINs, database-backed attempt limiter and 15-minute staff sessions help, but 4-digit PIN-only public access remains inadequate; global rate limiting can cause store-wide lockout under attack.
- `STAFF_SECURITY_BASELINE.md` specifies approved-store-device or independently strong remote sign-in and per-operation permissions. Unmounted candidate `services/security/staffAccessBaseline.js` is implemented/tested on PR #32 and synced to PR #33, but **not deployed**.
- Next: design/check abuse controls, registered workstation/IdP integration, identity-bound sessions and revocation. Migrate Timeclock backend + `extension/content.js` together with real employee tests before blocking the legacy path. Keep existing store clocking functional until authorization and release approval.
- Product/PO/inventory/credit/admin writes require separate step-up MFA, exact grant, audit/idempotency/readback regardless of PIN. No forced PIN reset authorized.


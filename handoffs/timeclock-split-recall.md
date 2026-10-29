# Timeclock + Split / Recall — Current Handoff

**Last verified:** 2026-10-29  
**Status:** Testing / Blocked — core Timeclock backend and Discord control plane are deployed; PR #22 extension visual candidate is unmerged and now behind consolidated; several Timeclock management paths still need real acceptance and two verified backend defects require repair.

## Source

- Primary application repository: `Tawgod/Lightspeed`
- Authoritative application branch: `integration/hobby-corner-consolidation@f50c3309824986633c3ba37a95e6eb43aae15a3c`
- Timeclock backend source: `timeclock/server.js` blob `c7473821801a54bfa7976c6dc059b1b4bd722a16`
- Current Chrome overlay PR: [#22](https://github.com/Tawgod/Lightspeed/pull/22), `feature/extension-launchers-shared-ui-20261027@f9e8f0af75306bd17b0ebf9d6d6d36eef7a6b1b2`; **open, draft, unmerged**
- PR #22 comparison to current consolidated on 2026-10-29: **2 commits ahead / 7 behind**, merge base `24e9834a6aaaec2fae5e656a65939e93b63143cf`. The current consolidated `extension/content.js` blob is still the same as the merge-base blob (`50553435918f00cf431b167177287be079bd5ee4`), so its owned content-script baseline has not itself changed, but the branch still requires current-base reconciliation before release integration.
- Discord repository: `Tawgod/Hobby-Corner-Discord-Bot:main@ce54862f67d678f8a1cb77302e520c59fb0c7118`
- Discord Timeclock UI source: `main.py` blob `9e01fd4edec32f89088850595e3abec068eac616`; this blob is identical at deployed commit `7c3af0eee516e52f3e767dbbbb7c03dd3a64d4f9`.
- Superseded / retired application branches: `feature/order-split-poc`, `feature/product-scanner-foundation`, `special-orders-foundation-2026-10-02`, `special-orders-foundation-livebase-2026-10-02`. Do not resume development from them.
- PR #26 owns Scanner/Toolkit popup/shared-navigation work. PR #31 owns PO Companion shared popup/manifest integration. PR #22 must not add a second navigation implementation to `extension/content.js`.

## Requirements and decisions preserved from this conversation

- PostgreSQL is the authoritative Timeclock data store; timestamps are stored as UTC and employee/admin time displays should use America/Chicago Central time, 12-hour AM/PM presentation.
- Retain long-term Timeclock history (original requirement: approximately five years).
- Workweek is Sunday-Saturday. Pay periods are 1-15 and 16-end-of-month.
- Employee view should show current clock status, clock-in time, elapsed/today total, current pay-period total, recent seven days, and current plus prior three Sunday-Saturday weeks.
- Automatic clock-out occurs at exactly 14 hours, creates an AUTO CLOCK-OUT event, and requires review.
- Corrections require actor/time/before/after/reason audit information.
- Payroll remains external/manual (Payroll4Free historically referenced). Timeclock should support payroll review/finalization concepts without becoming the payroll/PTO balance authority.
- PTO balance/accrual remains authoritative in the payroll program. Hobby Corner only records whether requested time off is **PTO or unpaid** and, for PTO requests, how many hours the employee wants to use.
- Only eligible/full-time employees may request PTO. Eligibility is a Timeclock employee flag administered by name; non-eligible employees can still request unpaid time off.
- Discord is optional for basic Timeclock identity. A Lightspeed-backed employee can be assigned a unique 4-digit PIN by employee record/name and use the store Timeclock without a Discord account.
- Discord remains the current employee self-service surface for time-off requests and open-shift claiming; employees without Discord do not yet have equivalent scheduling/time-off self-service.
- Managers need to create a missing time entry when an employee forgot to clock in/out, with overlap validation and audit.
- Managers need store hours, assigned shifts and open/additional-hours shifts. Open shifts can be claimed by employees.
- When posting an open/additional-hours shift, Admin can optionally select a Discord role to notify; the announcement should include date/time and direct employees to `/hc timeclock -> Open Shifts`.
- Approved time off can optionally create an open coverage shift.
- The next scheduling UX requirement is an employee **My Schedule** view and manager weekly schedule view; this has not been implemented.
- Timeclock employee identity is shared infrastructure. Scanner, Core Operations and future employee-facing tools must reuse Timeclock-backed identity/session/permission contracts instead of creating a second login system.
- Split / Recall / Partial Pickup must preserve sale identification, eligible-order lookup, Retrieve to Register, completion behavior and existing mutation contracts while UI work remains visual-only.

## Implemented

### Core Timeclock backend

- Employee table keyed to Lightspeed user identity with optional Discord identity.
- Unique 4-digit PIN stored only as keyed HMAC hash using `TIMECLOCK_PIN_PEPPER`; plaintext PIN is not stored.
- Lightspeed roster sync from the current users endpoint; employees can be matched by Lightspeed ID then normalized name.
- Non-Discord onboarding: `POST /api/timeclock/admin/assign-pin` accepts employee ID directly or a linked Discord user; duplicate PINs are rejected and assignment is audited.
- Clock in/out, current status, daily total, current pay-period total, recent seven days and weekly summaries.
- 14-hour automatic close with `AUTO_CLOCK_OUT`, `AUTO_CLOCK_OUT_14H` audit and `needs_review=true`.
- Review queue and audited correction endpoint with overlap protection.
- Entry browser endpoint supporting date/current-pay-period lookup and optional employee filter. See verified bug below for the employee-filter path.
- PostgreSQL schema includes `pay_periods`, `time_adjustments`, `audit_log`, `time_off_requests`, `store_hours` and `shifts`.
- PTO eligibility flag and audited Admin setter.
- Time-off request records start/end date, PTO vs unpaid, requested PTO hours when applicable, reason and review state.
- Manager time-off approve/deny flow with optional manager note and optional creation of one open coverage shift.
- Store-hours read/update endpoints.
- Assigned shift/open shift creation and concurrency-safe open-shift claiming.
- Optional `notification_role_id` stored on shifts.
- Admin route exists for manual missed-entry creation; see verified defect below.
- Shared active-employee authorization endpoints used by Scanner/staff-auth infrastructure.

### Discord Timeclock control plane

The deployed `main.py` includes:

- `/hc timeclock` button panel with staff and Admin controls.
- Employee roster listing with PIN/PTO/Discord linkage state.
- Employee-name picker for **Set / Reset PIN**; Discord link is not required.
- Optional Discord linking for employees who use Discord.
- Employee-name PTO eligibility picker with Eligible / Not Eligible actions.
- Time-off request modal with PTO/unpaid choice and required requested PTO hours when PTO is selected.
- Manager pending time-off review with Approve / Deny / Approve + Post Shift.
- Store-hours editor.
- Assigned-shift creation.
- Open/additional-hours shift creation with optional Discord role selector and channel announcement.
- Open-shift list/claim flow.
- Entry browser and selectable entries that prefill the correction modal.
- Create Missed Entry modal (UI exists; backend route currently broken by missing function).
- Central-time 12-hour formatting/parsing for management entry/correction workflows.
- Guild-only command synchronization; global commands are cleared to prevent duplicate slash commands.

### Shared employee login integration

- Timeclock is the current employee/PIN identity authority documented in `SHARED_STAFF_AUTH_PERMISSIONS.md`.
- `services/scannerTimeclockIdentity.js` uses backend-only service authentication to Timeclock.
- `services/staffAuthGateway.js` issues short-lived signed staff sessions and rechecks active employee status.
- Product Scanner already consumes Timeclock identity.
- Special Orders / Ordering / Preorders / GW Preorders use the shared Timeclock-backed staff-auth path for normal employee login; the old Special Orders key remains server-side as fallback rather than a separate employee identity system.
- New employee-facing tools should consume this shared identity contract, including Product Manager, PO Companion and Consignment when their auth is implemented.

### Split / Recall extension behavior

Current consolidated `extension/content.js` contains:

- Timeclock launcher/overlay.
- Recall / Split Order launcher on Sell / webregister.
- Split / Partial Pickup launcher on fulfillment/pickup routes.
- Sale reference extraction and order lookup.
- Eligible open-order search/list.
- Retrieve to Register.
- Embedded Split workflow and completion-message handling.
- `hct-` namespaced injected elements and owned inline styling.

PR #22 adds only navy/blue/gray visual styling changes plus focused tests/workflow; it does not intentionally change business logic, API contracts, manifest, popup or navigation.

## Tested

### Automated / source

- PR #22 regression run `40725000899` passed at `f9e8f0af75306bd17b0ebf9d6d6d36eef7a6b1b2`; fresh rerun job `122964857630` also passed. Coverage includes JS syntax, Timeclock PIN/API anchors, sale extraction, eligible-order retrieval, Retrieve to Register, completion messages, `hct-` namespacing and no global stylesheet injection.
- Current consolidated repository contains Scanner Timeclock auth regression tests plus historical Timeclock integration smoke/14-hour auto-close scripts.
- No dedicated automated regression suite currently proves the PTO/time-off/store-hours/shifts/manual-entry/entry-browser management paths end to end.
- Source audit on 2026-10-29 verified the current backend/Discord feature presence and identified the defects listed below.

### Browser / employee acceptance

Verified in other coordinated work:
- Core Operations staff PIN/header login has had real browser acceptance for valid PIN, invalid PIN rejection, refresh/session restoration and sign-out.
- This does **not** substitute for Timeclock scheduling/PTO/entry-management acceptance.

Still unverified for this workstream:
- Real Timeclock clock-in/out with current consolidated extension in a loaded store profile.
- Real Discord PTO request/approval/open-shift claim workflow against production data.
- Manual missed-entry creation.
- Employee-filtered entry browsing.
- Assigned shift/store-hours workflows.
- Non-Discord onboarding followed by actual store clock-in.
- PR #22 Sell/webregister and fulfillment/pickup acceptance.
- Keyboard/focus/close behavior and native Chrome 100/125/200% zoom.
- Host Lightspeed CSS collision/isolation.
- Full Split/Recall/Partial Pickup/Retrieve-to-Register store workflow on PR #22.

### Runtime / deployment verification

- Railway `timeclock` production service is live from `Tawgod/Lightspeed:integration/hobby-corner-consolidation`, root `/timeclock`, latest deployment `16f7d019-9267-4196-b85e-0d4c2b15f121` **SUCCESS** at commit `f50c3309824986633c3ba37a95e6eb43aae15a3c`.
- Railway `lightspeed-api` latest deployment `6d1d3cd4-dcd1-4827-b07a-8b36bf926df2` **SUCCESS** at the same consolidated commit.
- Railway `special-orders-test` latest deployment `b327d98a-e178-495b-ad72-2936dccaee0a` **SUCCESS** at the same consolidated commit.
- Railway `Hobby-Corner-Discord-Bot` is live from `main`; latest successful deployment `3a8e9375-aad7-4c47-9721-66790febaeae` uses commit `7c3af0eee516e52f3e767dbbbb7c03dd3a64d4f9`. Current `main` is three commits ahead only in `rewards_service.py`; `main.py` is byte-identical to the deployed commit. Startup logs confirm Discord connection and guild-only `/hc` command sync.
- Railway Postgres is live with a 5 GB `postgres-volume` mounted at `/var/lib/postgresql/data`; Timeclock uses `DATABASE_URL`.

## Deployed

- **Timeclock backend:** deployed, current consolidated commit `f50c3309824986633c3ba37a95e6eb43aae15a3c`.
- **Discord Timeclock control panel:** deployed; current Timeclock `main.py` is the same blob as the successful deployed commit.
- **Shared staff-auth bridge used by current Core Operations/Scanner infrastructure:** deployed as part of consolidated services where mounted/configured.
- **PR #22 visual overlay changes:** **not merged, not packaged, not published**. Existing consolidated Timeclock/Split content script remains the released/deployed source basis.
- No Chrome extension release is authorized by this handoff.

## Known bugs / unresolved implementation issues

1. **Manual missed-entry backend is broken:** current deployed `POST /api/timeclock/admin/entries` calls `createManualTimeEntry(...)`, but `timeclock/server.js` contains no function definition or import for `createManualTimeEntry`. The Discord Create Missed Entry UI therefore has no working backend implementation at current source.
2. **Employee-filtered entry browsing has malformed SQL:** `listTimeEntries()` builds the employee condition without the required PostgreSQL `$N` bind-placeholder prefix. Date/current-period browsing without employee filter can work; employee filtering should be considered broken until fixed/tested.
3. PR #22 is now **7 commits behind** current consolidated, despite older documentation saying 0 behind. Its owned `extension/content.js` base has not changed, but branch/current-base reconciliation is still required before coordinated release integration.
4. No PIN brute-force/rate limiter exists on the raw Timeclock clock-in/status PIN resolver. Staff-auth/Scanner login paths have their own limiter, but the direct extension Timeclock endpoint remains a separate security-hardening item.
5. Time-off review does not currently guard against re-reviewing an already APPROVED/DENIED request.
6. Shift creation/claiming currently has no schedule-overlap/conflict validation and no validation that end time is after start time.
7. Approve + Post Shift creates one coverage shift only; a multi-day absence does not automatically generate affected shifts per day.
8. Approved time off is not automatically reconciled against already assigned shifts.
9. Open-shift claiming is immediate; no optional manager approval workflow exists.
10. Employee time-off request / open-shift claim endpoints identify the employee by linked Discord ID, so non-Discord employees have basic Timeclock access but no equivalent self-service scheduling portal yet.
11. No time-off cancellation flow, My Requests view, or employee My Schedule view exists.
12. No PTO accrual/balance ledger is intentionally implemented; payroll remains authoritative. This is a design decision, not a defect.
13. No payroll-finalization snapshot/post-payroll adjustment workflow is implemented despite the earlier requirement.
14. Weekly overtime policy/reporting (default 40 hours, configurable) is not verified as implemented in current source.
15. Current time aggregation assigns work according to the clock-in date/pay-period query; shifts spanning midnight/pay-period boundaries have not been proven to split correctly.
16. Corrections currently update `time_entries` in place while preserving before/after audit and `time_adjustments`; a stricter append-only correction model remains an architectural improvement.
17. Five-year retention is a requirement but no explicit retention/archival policy or automated Drive archive is implemented/verified.
18. Discord Timeclock management has practical 25-option select limits and does not yet provide full pagination for every employee/request/open-shift list.
19. PR #22 does not implement an explicit Escape-key close/focus trap; real keyboard acceptance remains pending.

## Unimplemented / planned requirements

- Employee **My Schedule** view.
- Manager weekly schedule/calendar with Sunday-Saturday view, store hours, open shifts, approved time off and coverage gaps.
- Time-off request status/history/cancellation self-service.
- Automatic identification of assigned shifts affected by approved time off, with optional posting of those exact shifts as open.
- Multi-day coverage-shift generation.
- Shift collision/overlap validation and store-hours boundary warnings with manager override.
- Optional manager approval for shift pickup if desired.
- Full-day vs partial-day/time-range time-off requests if later required.
- PTO policy/balance integration is deliberately deferred to payroll; do not duplicate payroll's PTO ledger unless the architecture changes.
- Payroll finalization snapshot and post-payroll adjustment handling.
- Configurable weekly overtime calculations/review.
- Better employee-name dropdown filtering in the entry browser rather than requiring employee ID.
- Mark-reviewed-without-correction flow.
- Duplicate/ghost employee merge tool with preview/audit.
- PIN brute-force/rate limiting for direct Timeclock endpoints.
- Robust midnight/pay-period boundary splitting.
- Automated employee/manager Discord notifications for request approval/denial and other schedule events beyond the current open-shift role announcement.

## Shared dependencies

- `SHARED_STAFF_AUTH_PERMISSIONS.md`: Timeclock is the employee/PIN identity authority. Do not create parallel employee/password systems.
- Shared Lightspeed services PR #32/#33: future consumers should use the shared operation/permission contract; PR #32/#33 are not merged/deployed.
- Product Scanner: uses Timeclock identity and active employee checks; current Scanner business permissions remain a separate policy decision.
- Special Orders / Ordering / Preorders / GW: current employee login is Timeclock-backed via shared staff-auth.
- Product Manager: employee-specific saved profiles/drafts should key to verified employee ID; future hosted auth should reuse Timeclock staff sessions.
- PO Companion: must reuse Timeclock employee authorization and PR #26 shared extension navigation.
- Consignment: future staff auth should reuse the same Timeclock identity; store-credit writes remain separately guarded.
- Shared Chrome surfaces: PR #26 popup/navigation, PR #31 manifest/popup/PO feature, PR #22 `content.js`. Do not create competing navigation.
- Split/Recall uses `lightspeed-api` routes and current Lightspeed sale/fulfillment APIs.
- Railway Postgres is the durable store for Timeclock state.
- Discord bot is the current manager/self-service control surface for PTO/scheduling.
- Rewards/customer synchronization is separate; Timeclock identity must not be conflated with customer identity.

## Invoice Reconciliation dependency

Invoice Reconciliation is a future shared feature documented in `FEATURE_INVOICE_RECONCILIATION.md`. Relevant constraints for this workstream:

- Reuse Timeclock-backed employee identity/authorization for employee review actions.
- Invoice/PO/tracking status shown to staff is informational and separate from employee time/scheduling.
- The feature may, only after approval, create a new **OPEN** supplier PO or update an existing PO through the shared audited gateway.
- Preserve primary supplier while proposing secondary supplier associations.
- Maintain verified supplier shipping-sender aliases and tracking relationships; Special Orders may display **On the way**.
- **Never receive products, write received quantities as invoice quantities, or change inventory-on-hand.**
- Do not add a separate authentication system, Lightspeed API client, product matching engine or extension navigation registry for invoice work.

## Shared files / integration surfaces affected

- `timeclock/server.js`
- `extension/content.js`
- `routes/orderSplit.js`
- `routes/orderSplitExecute.js`
- `services/scannerTimeclockIdentity.js`
- `services/scannerTimeclockGateway.js`
- `services/staffAuthGateway.js`
- `services/scannerSessions.js`
- Discord bot `main.py`
- Railway `timeclock`, `lightspeed-api`, `special-orders-test`, Discord bot and Postgres services
- Chrome extension release queue and shared navigation/manifest integration owned across PR #22/#26/#31

## Remaining blockers

- Repair and test the two verified backend defects: undefined `createManualTimeEntry` and malformed employee-filter SQL placeholder.
- Run end-to-end acceptance for PTO/time-off, PTO eligibility, store hours, assigned/open shifts, role notifications, shift claiming, non-Discord PIN onboarding and entry corrections.
- Reconcile PR #22 onto the then-current consolidated branch and rerun its preservation regression.
- Real loaded-extension Sell/webregister + fulfillment/pickup acceptance for Timeclock/Split/Recall, including PIN, keyboard/focus/close, native 100/125/200% zoom, host CSS isolation and Retrieve to Register.
- Full extension release-queue reconciliation with PR #26/#31 and any approved Consignment launcher.
- Implement or explicitly defer remaining payroll/scheduling requirements listed above.

## Decisions needed

- Whether open-shift pickup should be immediate (current behavior) or require manager approval.
- Whether non-Discord employees need a non-Discord self-service schedule/time-off UI, or whether only store clocking must work without Discord.
- Whether time off needs partial-day time ranges in addition to date ranges + requested PTO hours.
- Weekly overtime configuration/reporting policy and payroll-finalization workflow.
- Employee retention/archive policy for the five-year requirement.
- Whether direct Timeclock endpoints should move behind the same rate-limited signed-session flow used by shared staff-auth.
- Future per-employee write permissions remain a shared policy decision; do not silently repurpose Scanner flags or Discord roles into production Lightspeed write grants.

## Recommended next action

1. Start the replacement Timeclock/Split conversation from this handoff and current consolidated source.
2. Fix the two verified backend defects on a fresh branch from current consolidated and add focused regression tests before any UI expansion.
3. Run an end-to-end Discord/Timeclock acceptance pass for PTO, shifts, store hours, non-Discord onboarding, entry browse/correction and open-shift role notifications.
4. Then build the missing My Schedule / manager weekly schedule layer.
5. Separately rebase/reconcile PR #22 and perform the real Chrome Split/Recall/Timeclock acceptance required by the extension release queue.
6. Only after those gates should PR #22 be considered for the coordinated extension release-testing branch.

## Restrictions / safety

- Do not develop from retired branches.
- Do not reset live employee PINs or change employee/PTO eligibility records merely for testing without explicit authorization.
- Do not mutate live Lightspeed sales/orders except under an explicitly approved controlled Split/Recall test.
- Do not rotate `TIMECLOCK_PIN_PEPPER` without a PIN migration/reset plan.
- Do not merge production-connected branches, apply database migrations, change Railway credentials, deploy production changes or publish/package a Chrome extension without explicit authorization.
- Do not introduce a second employee/auth system, duplicate Lightspeed client, competing product matcher or competing extension navigation.
- Keep payroll PTO balances external unless the user explicitly changes that architecture.

## Documentation

- `HOBBY_CORNER_PROJECT.md`
- `HOBBY_CORNER_CHAT_TRANSITION.md`
- `ROADMAP.md`
- `LIGHTSPEED_SHARED_SERVICES.md`
- `SHARED_STAFF_AUTH_PERMISSIONS.md`
- `CHROME_EXTENSION_INTEGRATION.md`
- `CHROME_EXTENSION_RELEASE_QUEUE.md`
- `FEATURE_INVOICE_RECONCILIATION.md`
- `handoffs/README.md`
- `handoffs/TEMPLATE.md`

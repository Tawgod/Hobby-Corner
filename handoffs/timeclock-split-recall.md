# Timeclock + Split / Recall — Current Handoff

**Last verified:** 2026-10-29  
**Status:** Testing — extension visual candidate PR #22 draft; core Timeclock backend deployed via consolidated source.

## Source
- Repository: `Tawgod/Lightspeed`; authoritative integration branch `integration/hobby-corner-consolidation@f50c3309824986633c3ba37a95e6eb43aae15a3c`.
- Current Chrome overlay PR: [#22](https://github.com/Tawgod/Lightspeed/pull/22), `feature/extension-launchers-shared-ui-20261027@f9e8f0af75306bd17b0ebf9d6d6d36eef7a6b1b2`; **open/draft/unmerged** and 7 commits behind current consolidated at the 2026-10-29 archival audit.
- Existing Timeclock source: `timeclock/server.js`; shared backend identity: `services/scannerTimeclockIdentity.js`, `services/staffAuthGateway.js`, `services/scannerSessions.js`. Sales workflow: `routes/orderSplit.js`, `routes/orderSplitExecute.js`.
- PR #22 touches only `extension/content.js`, launcher-specific tests and CI; PR #26 owns separate popup/nav surfaces.

## Implemented
- Existing Timeclock employee PIN verification, active-staff rechecks, signed short-lived session gateway; current Scanner approval/review behavior is granted to all active employees by `scannerEffectivePermissions()`, not driven by stored scanner flags (separate future permission decision).
- Existing Split/Recall sale lookup, fulfillment/partial pickup, eligible-order retrieval and Retrieve-to-Register behavior preserved.
- PR #22 changes navy/blue/gray overlays and borders only; no new identity, business mutation or Lightspeed API contract.

## Tested
- PR #22 head regression workflow `40725000899` **SUCCESS** at `f9e8f0af75306bd17b0ebf9d6d6d36eef7a6b1b2`, including JS syntax, PIN/sale/fulfillment call anchors, namespaced content styling and launcher preservation.
- Native loaded-extension Sell/fulfillment/PIN/zoom/focus/partial pickup end-to-end employee testing **not yet verified**.
- Railway `timeclock` and `lightspeed-api` source the consolidated integration branch and both latest production deployments are **SUCCESS at `f50c3309824986633c3ba37a95e6eb43aae15a3c`**. This verifies the deployed backend baseline; PR #22 overlay appearance remains unmerged/unreleased.

## Deployed
- Core Timeclock backend: deployed from consolidated integration branch at `f50c3309824986633c3ba37a95e6eb43aae15a3c`; exact feature workflow acceptance still varies and needs real loaded-extension checks.
- PR #22 overlay appearance: **not merged, not packaged or released**.

## Shared dependencies
- Shared Timeclock session/employee identity contract `SHARED_STAFF_AUTH_PERMISSIONS.md`; Phase 1/2 shared-services PR #32/#33 unmerged.
- PR #26 Scanner popup/nav, PR #31 PO Companion popup/manifest, Core Ops PR #24 and shared UI PR #27 merged.
- Planned Invoice Reconciliation: employees viewing shipment/tracking in Special Orders must not infer physical stock receipt; only future separately approved supplier PO create/update operations, never receiving.

## Shared files / integration surfaces affected
- `extension/content.js` overlay styles from PR #22, existing Timeclock backend and order split route contracts unchanged.
- Chrome shared extension manifest/popup is integration-owned; no duplicate navigation.

## Remaining blockers
- Real store Chrome employee PIN (valid, invalid, expired and deactivated), native zoom 100/125/200, keyboard focus/close, real Sell/fulfillment state, Retrieve-to-Register, Split/Recall and host CSS isolation.
- Full extension release-queue reconciliation and explicit extension release approval.

## Decisions needed
- Whether to enforce stored `scanner_can_lookup`/`scanner_can_approve` flags in future, and employee role/write policy; not a PR #22 visual change.
- Release grouping for PR #22 content overlay with PR #26/31 shared popup work.

## Recommended next action
- Run real browser acceptance in an isolated extension profile; preserve the current deployed backend and coordinate the next shared extension release.

## Restrictions / safety
- No production role change, live employee/PIN data reset, sale mutation, extension package or production deployment without explicit approval.

## Documentation
- `SHARED_STAFF_AUTH_PERMISSIONS.md`, `CHROME_EXTENSION_INTEGRATION.md`, `CHROME_EXTENSION_RELEASE_QUEUE.md`, `FEATURE_INVOICE_RECONCILIATION.md`.

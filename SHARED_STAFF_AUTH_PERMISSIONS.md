# Hobby Corner Staff Authentication and Permission Contract

**Last source verification:** 2026-10-29  
**Owner:** Shared Lightspeed Services + Timeclock; feature workflows consume this contract.  
**Status:** Phase 2 permission contract **implemented in development**, existing operations remain unchanged.  
**References:** `Tawgod/Lightspeed:integration/hobby-corner-consolidation`, Phase 2 draft PR #33, `LIGHTSPEED_SHARED_SERVICES.md`, `handoffs/lightspeed-shared-services.md`

## Verified current behavior (authoritative source, not a proposed rule)

- **Timeclock is the active employee/PIN identity authority.** `timeclock/server.js` verifies a four-digit PIN against a server-side hash and active employee record. The trusted `/api/timeclock/integrations/scanner/authorize` call rechecks active employee status by ID.
- `services/scannerTimeclockIdentity.js` is the backend-to-Timeclock bridge. It sends a backend-only service secret; browser clients do not receive this credential.
- `services/staffAuthGateway.js` issues 15-minute signed sessions and calls the Timeclock bridge for fresh active-employee verification on privileged requests. Session presence alone does not authorize a mutation.
- **Current Scanner integration:** `scannerEffectivePermissions()` grants `canLookup=true` and `canApprove=true` to **every active employee**. The `employees.scanner_can_lookup` and `employees.scanner_can_approve` columns/admin API exist, but the current `scannerEffectivePermissions()` does **not use those column values**. Changing that is a separate policy/behavior change requiring feature acceptance.
- Current Core Operations employees have been observed able to create/edit items; the user has confirmed per-employee restrictions are not currently in place. **Do not silently change that business policy through Phase 2.**
- Current `services/lightspeed/policy.js` is a new contract in PR #32, **not used by deployed feature routes**. It requires a trusted verifier and an explicit permission checker; all writes additionally need construction-time write gates.
- The current Scanner `canApprove` capability is for staging/review in the existing workflow; it is **not permission to mutate production products, sale balances, inventory or store credit**.

## Phase 2 shared gateway operation matrix

**Implementation candidate:** `Tawgod/Lightspeed:feature/shared-lightspeed-services-phase2-reads-20261029/services/lightspeed/permissions.js`

| Operation | Shared mode | Current employee gate in new candidate | Production write allowed? |
| --- | --- | --- | --- |
| `customers.search` | Read | Active Timeclock identity + verified `canLookup=true` | N/A |
| `products.exact` | Read | Same | N/A |
| `inventory.read` | Read | Same | N/A |
| `purchase-orders.read` | Read | Same | N/A |
| `sales.read` | Read | Same | N/A |
| `fulfillments.read` | Read | Same | N/A |
| `store-credit.read` | Read | Same | N/A |
| `products.create`, `products.update` | Write | Separate exact-operation backend grant required | **No, by default** |
| `inventory.adjust`, `purchase-orders.write` | Write | Separate exact-operation backend grant required | **No, by default** |
| `sales.write`, `store-credit.write` | Write | Separate exact-operation backend grant required | **No, by default** |
| `consignment.write`, `admin.manage` | Write | Separate exact-operation backend grant required | **No, by default** |

Operations not listed are **denied**, not inferred from role names. Service-to-service requests need an independently verified identity **and** a separate exact-operation service grant.

This is the new gateway's proposed contract; **do not interpret it as already-enforced permissions across current feature routes**.

## Architecture and rules for every new tool chat

1. Use the existing Timeclock PIN/employee system. Do not create a second user table, browser-side password, persistent client token, or trust a `role` or employee ID submitted in a request body.
2. The backend verifies the signed session and checks Timeclock's current employee state for every privileged request. Invalid/expired/revoked sessions must fail closed. User-customizable profiles/drafts should be keyed by **verified employee ID**, not the device or tab; employee profiles do not automatically confer business permissions.
3. UI affordances may hide or disable controls, but the **server** must enforce read/write permissions. Do not call a Scanner review button a production Lightspeed write.
4. Only the shared gateway owns the canonical Lightspeed operation matrix. If a new operation is needed, add it here and test it before publishing feature code.
5. Record separate results for **authentication**, **operation permission**, **write-gate**, **idempotency/audit**, and **readback** checks. Unknown vendor writes remain blocked pending reconciliation.
6. Do not require new restrictions on existing active employees without explicit store policy and regression acceptance. The phase-2 matrix starts with current verified lookup behavior, but all **new shared production writes** stay denied until their specific grants are designed.
7. Keep current Scanner isolated test writer and RMS migration service credentials/authorization separate.

## Operational permissions to decide later (not implemented)

- Which verified employees may create, edit or archive live products?
- Which employees may adjust stock, create/receive POs, alter sale/work-order records, post store credit, or authorize consignment payouts?
- Whether Scanner's persisted `scanner_can_lookup` and `scanner_can_approve` columns should become enforced, rather than current all-active behavior.
- Employee offboarding/session invalidation and how long draft backups remain available for employee-owned Product Manager cleanup work.

These questions should not block safe read-service development. They **do block enabling new production mutations**.

## Verification

- Source reviewed: `services/staffAuthGateway.js`, `services/scannerTimeclockIdentity.js`, `timeclock/server.js`, `services/lightspeed/{policy,staffAdapter}.js`.
- Unit tests added to Phase 2 PR #33: `tests/shared-lightspeed-permissions.test.mjs`, including active vs inactive, unverified flags, forged role, missing grants, service caller restrictions and valid/invalid signed-session adapter behavior.
- No Railway credential or active employee records changed. Current production permission behavior is **not changed** by this documentation or development candidate.

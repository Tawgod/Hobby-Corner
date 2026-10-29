# Purchase Order Companion — Current Handoff

**Last verified:** 2026-10-29  
**Status:** In Development — backend read-only candidate; Chrome acceptance and release blocked

## Source
- Repository: `Tawgod/Lightspeed`.
- Authoritative application: `integration/hobby-corner-consolidation@f50c3309824986633c3ba37a95e6eb43aae15a3c` (project matrix and Git comparison).
- Active draft PR: [#31](https://github.com/Tawgod/Lightspeed/pull/31), `feature/po-companion-consolidated-20261028@a4ef5475cfa4a3cc44e1903898944d4dd8d0d832`. GitHub reports open/draft/mergeable=true, but **24 commits ahead and 7 behind** current consolidated at this audit; must reconcile again before merge.
- Superseded draft PR: [#13](https://github.com/Tawgod/Lightspeed/pull/13) `feature/po-companion-consolidated-v2@cbec8c63db20ed61a9a77846984e9496b9b7412c` — open, nonmergeable, do not merge. Earlier `feature/po-companion-readonly-foundation` also obsolete.
- Dependencies: [#26](https://github.com/Tawgod/Lightspeed/pull/26) Scanner/Toolkit shared popup+navigation (open, unmerged), merged PR #24 Core Ops and #27 shared UI. Historical PR #16/#23 provide design/navigation provenance, not a second independent registry.
- Shared-service work: PR #32 (review) and stacked PR #33 (draft) open, unmerged; shared source is not deployed.

## Responsibilities and requirements
- The PO Companion is a **compact, manually launched supplier-site side panel** associated with the PO selected in Lightspeed. Display actual PO lines, product names, ordered quantity, supplier-specific SKU and UPC with one-click **exact string** copy (including leading zeros), warnings, and per-line checkbox expanding RP, RQ, supplier Cost and MSRP.
- Persist proposed edits, selected lines, identifier mode and review state per PO **and supplier** across panel collapse/reopen or switching; prevent cross-PO/cross-supplier draft contamination. Provide a separate employee-permission-controlled review/approval flow, with clear comparison of verified current versus proposed values. No approval/write until separately designed, tested and authorized.
- Integrate with current Toolkit popup, shared navy/blue shaded UI and original orange/blue Hobby Corner logos, shared `hc-ui` classes and **PR #26** navigation. Do not replace Scanner, Timeclock, Split/Recall, Special Orders or other working popup actions. Supplier-site overlay must remain isolated from host DOM/CSS and dismissible; keyboard/zoom responsive.
- Use the **existing Timeclock-backed employee identity and signed sessions**, recheck active lookup permissions server-side, fail closed for unknown/disabled employees, do not expose PIN or bearer token to supplier-page DOM. Never infer approval from a successful read-only login. No parallel employee credentials/auth system.
- Reuse current Lightspeed API and Ordering PO read logic and Special Orders supplier/product mappings. Do not reinstate legacy 2.0 consignment read implementation or create a competing PO writer/navigation/product matcher.
- Future Invoice Reconciliation is **planned, not implemented here**: link PO Companion, Ordering, Scanner, Product Manager and Special Orders to verified supplier invoices, preorder confirmations, tracking and email attachments. After explicit invoice approval, shared backend may **create a new OPEN supplier PO** or update an existing compatible PO; proposed invoiced quantity/unit cost and 90%+ nonambiguous product-match candidates need line-level review. Attach a secondary non-primary supplier without replacing the primary, support verified warehouse/sender aliases, multi-shipment/partial tracking linked to invoice/PO, and show linked Special Orders **On the way** with evidence/last-verified time. **Never receive stock, change on-hand inventory, mark PO RECEIVED, promise ETA, or mark a customer order READY** based solely on invoices/shipping emails. Product Manager invoice dropdown is not an employee profile. Details: `FEATURE_INVOICE_RECONCILIATION.md`.

## Implemented
- PR #31 carries PO overlay `extension/po-companion/panel.js`, review HTML/CSS/JS and background messaging, selected PO launch via `extension/popup.html`/`popup.js`, exact SKU/UPC string handling and local draft state, shared UI/nav/brand assets from coordinated PR #26.
- `routes/poCompanionRead.js` exposes `GET /api/scanner/purchase-orders/:id` behind signed Scanner/Timeclock `verifyEmployee` and live authorization recheck in `services/scannerTimeclockGateway.js`; `server.js` uses server-only Lightspeed 2026-04 `purchase_orders` and `line_items` GET and PostgreSQL supplier-specific SKU/product mapping. Missing supplier/product mappings produce warnings. Route performs no PO/product/order writes.
- The **extension's** `HCT_PO_LOGIN` / `HCT_PO_LOAD` are deliberately fail-closed. There is **no authenticated live panel-to-endpoint interaction** yet. Rendering and saved-draft behavior with real data therefore remain unverified.
- Historical PR #13 unique useful presentation/copy/review/draft features are selectively present in PR #31. Its local navigation JSON and old 2.0 endpoint are intentionally superseded. **PR #13 can be closed as superseded when manager coordinates archival, but it was not closed in this audit.**

## Tested
- PR #31 head `a4ef5475...`: [PO read-only regression #40730813762](https://github.com/Tawgod/Lightspeed/actions/runs/40730813762) SUCCESS and [Scanner integration #40730814092](https://github.com/Tawgod/Lightspeed/actions/runs/40730814092) SUCCESS.
- Synthetic checks cover lookup denial, supplier missing, UPC and supplier SKU with leading zeros and shared popup safeguards. This does **not** prove real PO shape/pagination/identifier, clipboard, browser or live permission behavior.
- **Not tested:** Chrome against representative real POs/suppliers, manual PIN and permission denial/revocation, exact clipboard copy into supplier sites, draft persistence across sessions/PO switching, keyboard/zoom at 100/125/200%, before/after review fidelity, approved/denied roles or a full real Lightspeed live GET.
- Back-end 2026-04 current list and line-items use `page_size=1000` without proven cursor/pagination completion. PO lines/IDs and supplier mapping need tenant-specific verification. Missing original RP/RQ/MSRP comparisons remain an approval blocker.

## Deployed
- **PR #31: NOT merged, deployed, packaged, published or Chrome-released.**
- Railway Hobby Corner production environment checked 2026-10-29: `special-orders-test` latest deployment `b327d98a-e178-495b-ad72-2936dccaee0a` SUCCESS; `lightspeed-api` `6d1d3cd4-dcd1-4827-b07a-8b36bf926df2` SUCCESS; `timeclock` `16f7d019-9267-4196-b85e-0d4c2b15f121` SUCCESS (all created 2026-10-28). These are separate consolidated-branch services, **not PR #31 deployments**; deployment commit SHA not independently verified here.
- No live Lightspeed data edits, receiving, approvals, stock changes, credential or database changes were performed during this audit.

## Shared dependencies
- `LIGHTSPEED_SHARED_SERVICES.md`, PR #32/#33: target shared API/transport, canonical PO readers, audited authorization, durable idempotency and PostgreSQL. Integrate by adapting this feature's read response; never duplicate cross-feature client or write gateway.
- `SHARED_STAFF_AUTH_PERMISSIONS.md`: authorized Timeclock operations must remain independently enforced; staff lookup does not grant product/PO mutations.
- Scanner shared matcher and supplier SKU resolver; Ordering's existing 2026-04 PO routes and Special Orders linkage; Product Manager employee-specific draft/profile concept distinct from invoice dropdown; future Invoice Reconciliation document and shipping aliases.
- Chrome: `CHROME_EXTENSION_INTEGRATION.md`, `CHROME_EXTENSION_RELEASE_QUEUE.md`, PR #26 shared nav and popup, PR #22 Timeclock/Split, PR #30 Consignment launcher. Reconcile all active release-queue entries before **any** Chrome version bump/package/publish.
- PostgreSQL holds operational mappings and future reviewed invoice/tracking/audit entities. Avoid overlapping customer synchronization, Rewards, Discord and Consignment/credit integrations; no cross-workstream actions should be inferred from PO reads.

## Shared files / surfaces
- `extension/manifest.json`, `extension/popup.html`, `extension/popup.js`, `extension/po-companion/{panel.js,background.js,review.html,review.css,review.js,navigation.js}`, `extension/shared-ui/{hc.css,clipboard.mjs,navigation.mjs,navigation.css,assets/*}`.
- `routes/poCompanionRead.js`, `services/scannerTimeclockGateway.js`, `server.js`, `tests/po-companion-read.test.mjs`, `tests/po-companion-consolidated.test.mjs`, `.github/workflows/po-companion-readonly.yml`.

## Known bugs / blockers / decisions needed
1. Branch is **7 commits behind** current consolidated; rebase/selective reconcile PR #26 and latest PR #24/#27 changes, then rerun full scanner/core ops/PO regression. Do not merge PR #13.
2. Implement secure extension-owned employee PIN/session and PO load flow, no token/PIN exposed on supplier page. Confirm bearer session expiry/revocation and authorization.
3. Verify live X-Series PO read endpoints and pagination, supplier/product ID mapping, ambiguous/duplicate local products, correct line quantity and original field values with controlled real POs; prevent incomplete list being mistaken for PO not found.
4. Test per-PO/supplier draft save/reopen and read-only review. Address any mismatch between saved draft key and review context (currently review derives supplier key from context while live PO resolve derives from returned local supplier).
5. Perform manual loaded-Chrome, focus/zoom, copy fidelity and supplier site tests before merge request; no valid Chrome screenshots/acceptance evidence yet.
6. Choose integration timing of shared-service PR #32/#33, and location/ownership of future invoice/tracking read display. For any write/approval, require separate user authorization and test tenant verification first.

## Recommended next action
- Reconcile #31 with current consolidated/PR #26 and the PR #32/#33 shared read contracts, then implement **extension-owned, read-only authentication and PO loading** and test representative real POs in Chrome with permission denial and draft/copy checks. Keep approval and all Lightspeed writes disabled.

## Restrictions / safety
- No production merge, extension release/version/package, Railway deploy, credential change, operational DB mutation, employee/customer data update, receiving or Lightspeed PO/product/order write without appropriate explicit authorization. Invoice Reconciliation must **never** change inventory-on-hand or receive products.
- PR #31 remains **In Development / not release READY**.

## Documentation
- `Tawgod/Hobby-Corner:main/HOBBY_CORNER_PROJECT.md`; `HOBBY_CORNER_CHAT_TRANSITION.md`; `LIGHTSPEED_SHARED_SERVICES.md`; `SHARED_STAFF_AUTH_PERMISSIONS.md`; `ROADMAP.md`; `FEATURE_INVOICE_RECONCILIATION.md`; `CHROME_EXTENSION_INTEGRATION.md`; `CHROME_EXTENSION_RELEASE_QUEUE.md`.
- `Tawgod/Lightspeed:feature/po-companion-consolidated-20261028/docs/PO_COMPANION_CONSOLIDATED_20261028.md`; PR #31 and superseded PR #13.

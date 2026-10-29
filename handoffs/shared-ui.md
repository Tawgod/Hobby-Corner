# Shared Addon UI / UX Coordination — Current Handoff

**Last verified:** 2026-10-29  
**Status:** Testing (shared foundation and core navigation merged; tool-by-tool/extension acceptance incomplete)

## Source
- Repository: `Tawgod/Lightspeed`.
- Authoritative application branch: `integration/hobby-corner-consolidation`.
- Verified head: `f50c3309824986633c3ba37a95e6eb43aae15a3c`.
- **Merged:** PR #24 (Core Operations consistent branding/navigation), PR #27 (selective shared UI foundation), both on consolidated.
- **Active UI consumer candidates:** PR #26 Scanner/Toolkit `feature/scanner-consignment-nav-alignment-20261028@0b3e6f110932efea94dc23c23903cc97ee20e541`; PR #22 Timeclock/Split content-script UI `@f9e8f0af75306bd17b0ebf9d6d6d36eef7a6b1b2`; PR #28 Product Manager `@e8938dee17718a2d9e30a38b03121cc7893600d0`; PR #29 Avery Labels `@a000c084d8d3f3bd818dda6d4ef244885e3bb11e`; PR #30 Consignment `@647a8f6cc4b5844c43e07b88cc256fc9ca6623d8`; PR #31 PO Companion `@a4ef5475cfa4a3cc44e1903898944d4dd8d0d832`.
- **Superseded/historical:** PR #16 shared UI draft remains **open, unmerged**, but all valuable work is accounted for by consolidated + PR #27/#26; safe to *close as superseded* when release coordinator authorizes, not merge. PRs #21/#23 predecessor to #24; #19 predecessor to #26; #11/#25 superseded by #30; #13 superseded by #31; #18 by #28; #20 by #29.

## Ownership and original/later requirements
This workstream owns UI/UX consistency across Special Orders, Ordering, GW/regular Preorders, Timeclock, Product Scanner, PO Companion, Consignment, Product Manager, Split/Recall, Chrome extension popup, and linked staff surfaces. **It does not own business-service writes, permissions or transactional logic.**
- Visual hierarchy, simple/minimal-density layouts, concise navigation, progressive disclosure, distinct shaded windows/sections, consistent typography/spacing/buttons/forms/tables/status badges/warnings/dialogs/drawers/popups/loading/error/empty states.
- Accessible labels/alt text, WCAG 2.2 AA target, keyboard/tab/focus/escape/return focus and screen-reader feedback; responsive real browser at 100%, 125%, 200% zoom. No color-only status meanings.
- Employee scanner/keyboard usability, immediate feedback, approval staging vs authorization vs actual write, destructive confirmation, error recovery and preservation of permission gates.
- **Copy/paste fidelity:** preserve leading-zero SKU/UPC, whitespace, punctuation, line breaks and original content; formatted HTML copy where supported with sanitization and exact plain-text fallback. Do not silently normalize text.
- **Approved beta styling:** dark navy header/nav, blue primary actions, cool gray-blue shaded canvas and separated panels (less pure white), orange accents and original owner-supplied Hobby Corner orange-symbol/blue-wordmark images. **Consignment Manager beta is the preferred visual benchmark.** Respect logo aspect ratios, avoid recreation/unauthorized logo changes.
- **Later navigation requirement:** every tool should expose a consistent, accessible directory of *verified* applicable tool links (including active-page indicator), with beta/test routes visibly distinguished; no broken, speculative, role-bypassing or parallel navigation registry.
- Incremental, opt-in scoped adoption; no wholesale replacement of working UI or host Lightspeed DOM/CSS; shared component foundations used consistently.

## Implemented
- `shared-ui/hc.css` (same blob `c98ec1a8` already consolidated before #27): scoped tokens/buttons/forms/tables/nav/badges/modals/dialogs/responsive/focus patterns.
- PR #24 merged web core-ops shared navigation and branding integration for four operational pages with compatibility CSS. Additional per-feature visual improvements remain separate.
- PR #27 merged `shared-ui/clipboard.mjs`, `shared-ui/RECONCILIATION_20261028.md`, `tests/shared-ui-reconciliation.test.mjs`, and `.github/workflows/shared-ui-reconciliation.yml`. No duplicate CSS, demo gallery/old README/changelog, or duplicate logo assets introduced.
- Exact clipboard code Git blob `24867110` in PR #27 and PR #26's vendored `extension/shared-ui/clipboard.mjs`. The scanner-specific `hc-beta.css` and popup adapter are intentionally bundled/scoped for extension operation rather than injected globally.
- Existing Consignment Manager beta visually demonstrates original branding, tables, side panel, status markers and better shading. PR #30 is current development candidate, not the historical PR #11/#25.
- Reviewed and documented navigation inconsistencies from owner screenshots: original hardcoded page-specific links, absent logos/insufficient separation. Coordinated replacement web nav through PR #24; extension nav remains PR #26-owned.

## Tested
- Shared reconciliation PR #27 automated CI PASS: runs `40736210328` and `40736202118`; confirms scoped CSS, four web CSS references, separated extension styling and exact whitespace/leading-zero clipboard.
- PR #26 mocked Chromium navigation/zoom/keyboard PASS `40725500639`; scanner UI/integration earlier passes `40724981558` / `40724995019`. **Not real loaded Chrome employee acceptance**.
- PR #22 source CI PASS `40725000899`; PR #30 Consignment browser/safety and other consumer CI documented in current manager matrix.
- **Remaining manual/browser:** real hosted pages and actual Chrome extension, navigation clickthrough, logo render on all relevant screens, focus/keyboard screen readers, responsive 100/125/200% native zoom, permission error/empty/loading states, clipboard pasting into destination apps, supplier scanning/PIN, Split/Recall, actual PO read-only interactions, and label physical print checks.
- No full WCAG certification or all-surfaces screenshot acceptance recorded.

## Deployed
- **Merged and source present:** shared foundation #27 and web navigation #24 on consolidated.
- **Railway:** latest verified SUCCESS deployments of `special-orders-test`, `timeclock`, `lightspeed-api` on `integration/hobby-corner-consolidation@f50c3309824986633c3ba37a95e6eb43aae15a3c`, dated 2026-10-28 20:20 UTC. This establishes backend/web deployment of that commit; not independent confirmation of every UI screen's actual browser rendering or staff acceptance.
- **Consignment:** previous isolated beta deployed historically, but current PR #30 has **not** deployed. Production Consignment UI not approved.
- **Extension:** PR #26/#22/#31 pending; **no verified new Chrome package/version, store-computer installation or Web Store publication** attributable to shared UI work. PR #27 merge does not ship extension assets automatically.
- **Other feature UI PRs #28/#29/#30/#31:** not merged/deployed; existing tools, where deployed, are not their new UI candidate.

## Shared dependencies
- **Core Operations:** PR #24 merged shared navigation; validate user-visible links/auth/warnings.
- **Product Scanner / Toolkit:** PR #26 owns popup and scanner navigation/packaged CSS/assets; coordinate with PR #22 `extension/content.js` and PR #31 popup/manifest/PO Companion; no extension release until consolidated cross-feature testing and release queue.
- **Consignment:** current PR #30 and old isolated beta; do not promote beta route to an unconditional production link. Store credit remains gated and idempotent, not a UI-driven write.
- **Product Manager:** current PR #28 includes employee-specific saved profiles; shared layout preferences must be associated with verified Timeclock employee IDs, **not** a second identity system.
- **Staff identity:** `timeclock/server.js`, `services/staffAuthGateway.js` and `SHARED_STAFF_AUTH_PERMISSIONS.md`; current Scanner all-active lookup/review policies are distinct from production Lightspeed product write grants. UI badges/buttons are not server authorization.
- **Canonical Lightspeed services:** PR #32 phase 1 / stacked PR #33 phase 2 shared reads and explicit permission matrix are **unmerged, undeployed**; do not build feature-specific duplicate Lightspeed clients.
- **Durable storage:** Railway PostgreSQL/shared audit/idempotency for business records, not browser-only UI state when business review must persist. Respect data minimization and customer/employee privacy.
- **Invoice Reconciliation (Planned):** shared employee-independent Product Manager `Invoice Updates` selector, Scanner UPC/SKU/supplier-cost proposals, Special Orders verified `On the way` status, PO Companion linked invoice/PO/tracking review, secondary supplier aliases and shipping-sender mappings. Full approval may create a new **OPEN** supplier PO or update an existing PO via shared backend; invoice UI must *never* receive stock, alter on-hand or present shipping as physical receipt. See `FEATURE_INVOICE_RECONCILIATION.md`. No implementation or product write authorized.
- Rewards/Discord/customer synchronization are operational integrations; preserve navigation boundaries and do not trigger customer communications merely through UI indicators.

## Shared files / integration surfaces affected
- Consolidated: `shared-ui/hc.css`, `shared-ui/clipboard.mjs`, `shared-ui/core-ops-compat.css`, `shared-ui/RECONCILIATION_20261028.md`, `tests/shared-ui-reconciliation.test.mjs`, `.github/workflows/shared-ui-reconciliation.yml`, `special-orders.html`, `ordering.html`, `preorders.html`, `gw-preorders.html`, routed web wordmark assets.
- Pending extension consumers: `extension/popup.html`, `popup.js`, `popup-beta.css`, `extension/product-scanner/review.html`, `review.js`, `hc-beta.css`, `extension/shared-ui/navigation.*`, `clipboard.mjs`, `extension/content.js` (PR #22 ownership).
- Brand originals must remain faithful; avoid repeated binary copies absent packaging need.

## Known bugs / unfinished UI / unimplemented requirements
1. Cross-tool visual consistency and complete verified navigation are not yet accepted across all tools. Host and popup styling still have distinct implementation constraints; verify links from all pages, not merely CSS imports.
2. Real Chrome extension release/testing remains blocked by #26/#22/#31 coordination, Timeclock PIN, supplier scanning, permissions and keyboard/zoom.
3. Product Manager #28, Avery #29, Consignment #30, PO Companion #31 each require own browser/integration/authorization acceptance; Consignment current branch not deployed.
4. Underlying future Invoice Reconciliation UI is Planned only; shared invoice selector, product/supplier resolution, shipping/tracking states are not implemented.
5. Historical PR #16 remains open as superseded, but **contains no unpreserved useful runtime requirement**: old demo showcase and gallery assets intentionally omitted, old tests/docs replaced; preserve history, do not merge old branch.
6. Semantic HTML status, error clarity, screen-reader and 200%-zoom usability have not been comprehensively certified across all tools; confirm field labels and clipboard target behavior.
7. No separate source-proven universal navigation registry across every standalone app and extension surface yet; unify the **contract** without creating an unsafe single hardcoded route registry shared across incompatible runtime environments.

## Technical decisions
- Use the original beta navy/blue/orange visual direction with deliberate shading and negative space; Consignment Manager as visual reference.
- One scoped design foundation per appropriate runtime: web `hc.css` and approved adapters, extension local bundled scoped components; avoid global selectors and Lightspeed host CSS collisions.
- Keep ownership boundaries: PR #24 core web, PR #26 popup/scanner, PR #22 content script, PR #30 Consignment, PR #31 PO Companion. PR #27 is already merged and is no longer a pending merge candidate.
- Never infer write approval from visible primary action; distinguish preview/staged/review/approved/applied states.
- Source-of-truth hierarchy: GitHub current source, Railway actual deployments, business/manager records, then prior chat history.

## Decisions needed
- Owner/release coordinator approval for retiring/closing PR #16 (safe technically; do not close automatically during archival audit).
- Confirmation of cross-tool navigation destinations and whether beta tools should be exposed to all authenticated staff; do not expose unverified/unauthorized destinations.
- Feature-specific browser acceptance and explicit extension packaging/release approval; additional staff privilege policy for any new business writes.

## Recommended next action
1. Treat PR #24/#27 as merged; refresh screenshots of deployed core operations and ensure Consignment-standard branding/navigation/visual hierarchy, including link clickthrough and 100/125/200% zoom.
2. Work with PR #26/#22/#31/#30 owners to create **one** current-base Chrome release-testing candidate after functional and auth gates, with release queue reconciliation. No packaging until authorized.
3. Run real employee testing for scanner/Timeclock, keyboard/accessibility, copy/paste and stable navigation, and report per-surface implemented/tested/deployed.
4. After confirming no historical source dependency (already audited), close PR #16 as superseded with explicit disposition, when authorized.
5. Maintain this handoff and the master manager matrix as current; feature chats own business workflow changes.

## Restrictions / safety
- No production deployment, extension packaging/version bump/publish, destructive operation, credential changes or live Lightspeed customer/product/inventory/store-credit writes from UI coordination without explicit approval.
- Never alter Timeclock roles/permissions based on UI alone. Invoice reconciliation must never physically receive or alter inventory-on-hand.
- Do not merge superseded PRs or overwrite newer consolidated source.

## Documentation
- `Tawgod/Hobby-Corner:main/HOBBY_CORNER_PROJECT.md` (Current Authoritative Development Matrix)
- `HOBBY_CORNER_CHAT_TRANSITION.md`, `handoffs/README.md`, `handoffs/TEMPLATE.md`
- `SHARED_ADDON_UI_UX.md`, `CHROME_EXTENSION_INTEGRATION.md`, `CHROME_EXTENSION_RELEASE_QUEUE.md`
- `LIGHTSPEED_SHARED_SERVICES.md`, `SHARED_STAFF_AUTH_PERMISSIONS.md`, `ROADMAP.md`, `FEATURE_INVOICE_RECONCILIATION.md`
- `Tawgod/Lightspeed:integration/hobby-corner-consolidation/shared-ui/RECONCILIATION_20261028.md`
- GitHub PRs #24, #27, #26, #22, #28, #29, #30, #31, #32, #33 and linked CI runs.

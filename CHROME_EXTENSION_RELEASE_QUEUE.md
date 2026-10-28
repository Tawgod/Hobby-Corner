# Hobby Corner Chrome Extension Release Queue

**Purpose:** This file is the shared cross-chat release queue for the Hobby Corner Toolkit Chrome extension.

Any development conversation that changes or plans to change the Chrome extension must use this file so extension work from one chat is not accidentally omitted when another chat prepares the next release. It must also read `CHROME_EXTENSION_INTEGRATION.md`, which defines the shared extension architecture, navigation, UI, permissions, ownership, messaging, and cross-feature integration rules.

## Mandatory release rule

Before any Chrome extension version bump, ZIP/package build, distribution-page update, Railway rollout that serves a new extension package, or Chrome Web Store submission:

1. Read this file from `Tawgod/Hobby-Corner:main`.
2. Read `Tawgod/Hobby-Corner:main/CHROME_EXTENSION_INTEGRATION.md` and reconcile shared-file/navigation/UI/permission conflicts.
3. Inspect the authoritative extension source on `Tawgod/Lightspeed:integration/hobby-corner-consolidation`.
4. Review all queue entries whose status is `QUEUED`, `READY`, `IN DEVELOPMENT`, or `BLOCKED`.
5. Include every compatible `READY` item in the release.
6. For every item not included, record an explicit defer/block reason before releasing.
7. Check for active extension-related branches/PRs and reconcile them with this queue. A chat must not assume this file is complete if GitHub shows newer extension work.
8. Only after the queue and shared integration contract are reconciled may the extension version be bumped and packaged.
9. After release, update each shipped entry with release version, consolidated commit, test result, and release date.

**No extension release is considered complete until this file has been updated.**

## Queue status definitions

- `QUEUED` — requested for a future extension release; implementation may not be complete.
- `IN DEVELOPMENT` — actively being implemented.
- `READY` — implementation is complete enough to be included in the next compatible release and has required test evidence.
- `BLOCKED` — cannot ship yet; reason must be recorded.
- `DEFERRED` — intentionally excluded from a specific release; reason and target must be recorded.
- `INCLUDED` — merged into the release candidate but not yet verified as released.
- `RELEASED` — shipped in a verified extension version.

## Required fields for every queue entry

Each entry must contain:
- Feature/system
- Source conversation or project area
- Status
- Requested behavior
- Authoritative implementation branch/commit or PR, when available
- Extension files/components affected
- Backend dependencies, if any
- Test status
- Target release, if known
- Defer/block reason, if applicable
- Released version/commit/date, when shipped

## Current queue

### Purchase Order Companion
- **Shared navigation audit follow-up (2026-10-28):** Draft PR #13 now has compact `More Hobby Corner tools` navigation on PO supplier panel plus current-page-aware navigation in separate review window. Both consume `extension/po-companion/navigation.json`, matched to PR #23's six verified destinations, with `Consignment Manager (Beta)` explicitly labeled. Added source-level regression test at `tests/po-companion-navigation.test.mjs`; automated CI/browser verification still pending. Feature documentation commit `cbec8c63`; latest code commit `52bf25ef`. PR #23 remains draft; central navigation registry still needed. PO Companion remains **IN DEVELOPMENT** and blocked from release until PO auth/data, PR reconciliation and browser acceptance. No packaging, deployment or production write.
- **Shared UI integration (2026-10-27):** Draft PR #13 `feature/po-companion-consolidated-v2` now includes version-locked `extension/shared-ui/hc.css`, shared clipboard helper, original icon/wordmark from draft shared foundation PR #16, shared hc-ui component classes in supplier panel and review window. Feature-local sizing remains. Latest implementation documentation commit `b75ecf02`. JS parse smoke checks passed (panel/background/review); browser/zoom/keyboard/copy/auth tests pending. **IN DEVELOPMENT**; do not release until PR #16 compatibility, pending queue entries, supplier PO API, employee permissions and real browser testing reconcile. No version bump, package, merge, Railway deployment or Lightspeed write.
- **UI alignment update (2026-10-27):** Consolidated PR #13 branch received shaded teal/slate panel and separate review-window styling, stronger sectional hierarchy, accessible focus states and live status announcements. Commits `d99405da`, `0c15bbfe`, `0b23046f`. Implementation remains UI-only, not browser-tested or release-ready; no manifest version bump/package/deployment.
- **Source conversation:** Purchase Order Companion
- **Status:** `IN DEVELOPMENT`
- **Current reconciled development branch:** `Tawgod/Lightspeed:feature/po-companion-consolidated-v2`, draft PR [#13](https://github.com/Tawgod/Lightspeed/pull/13) (created from the current consolidated branch 2026-10-27; selective UI port, not an old-branch merge).
- **Reconciliation:** Old `feature/po-companion-readonly-foundation` measured 133 commits behind and 19 ahead on 2026-10-27; obsolete backend implementation not copied because current Ordering uses Lightspeed `/api/2026-04/purchase_orders` and `/line_items`. Existing scanner UI, permissions, and supplier-host access retained.
- **Implemented on new branch:** Opt-in supplier-site compact panel scaffold, SKU/UPC rendering/copy widgets, expand/collapse draft fields, isolated review popup, fail-closed worker and new popup PO selection controls. Live line fetch and PIN collection intentionally disabled; approval disabled.
- **Testing:** GitHub source reconciliation completed; automated tests/browser and live authenticated PO checks still pending.
- **Requested behavior:** Add the compact right-side supplier website companion for Purchase Orders, showing PO items, supplier-specific SKU/UPC with one-click copy, product name, quantity and warnings; per-item checkbox reveals RP, RQ, Cost and MSRP while preserving draft values; approval/review remains in a separate popup with employee permissions managed through Timeclock.
- **Authoritative base:** `Tawgod/Lightspeed:integration/hobby-corner-consolidation`
- **Affected area:** Chrome extension supplier-site/PO workflow plus Timeclock-backed permissions and review flow.
- **Backend dependencies:** Lightspeed PO data and Timeclock permissions. Verify current implementation state before release.
- **Test status:** Not yet release-verified.
- **Target release:** Next compatible Chrome extension release after implementation is verified.
- **Current shipping blocker:** Authenticated read-only PO contract for 2026-04 API, supplier mapping and Timeclock authorization remain to be implemented/tested against real responses; panel shell not release-ready. No version bump or package authorized.
- **Historical defer reason for next scanner test build:** The PO Companion branch `feature/po-companion-readonly-foundation` is 119 commits behind consolidated, not release-verified, and needs selective integration/Chrome compatibility testing before shipping. Target: next compatible extension release after testing.
- **Release rule:** Do not silently omit this item from a future extension release. If it is not ready when another extension release is prepared, mark it `DEFERRED` or `BLOCKED` with the reason and leave it in this queue.

### Scanner SKU and role diagnostics
- **Status:** `INCLUDED` in v0.3.24 unpacked **test** build; not Chrome Web Store released; role-based approvals remain fail-closed.
- **Source:** Product Scanner, Lightspeed PR #10, branch `feature/scanner-sku-role-diagnostics`.
- **Behavior:** Default General SKU from supplier reorder code. Prefer uniquely exact matched Lightspeed SKU and preserve manual edits. Support verified role-name/group shapes and log safe diagnostics.
- **Affected:** extension/product-scanner/review.js, special-orders-adapter.js, scanner gateway and Timeclock role resolver.
- **Backend dependencies:** Actual Manager/Owner role remains unverified against live API; scanner eligibility must remain read-only when no role is verified.
- **Tests:** GitHub Actions runs 38771768365 (UI) and 38771744909 (integration) passed on feature branch. Verify consolidated tests before shipping.
- **Packaged version:** v0.3.24 unpacked preview; PR #10 merged into consolidated commit `718fa7aca466f23f0d5a97b6ed3c24e42e3eb3a6`. Test package branch `release/scanner-v0.3.24-test` commit `5849953f478338658bcadd87efe2b2867abc9d04`.
- **Packaging tests:** GitHub Actions run `38917194872` succeeded October 16, 2026; artifact `Hobby-Corner-Scanner-v0.3.24-unpacked-preview` (ID `12052559386`).
- **Release status:** Built October 16, 2026 for manual testing, **not published or production extension download replaced**. Browser role validation still pending.
- **Release restriction:** No Chrome Web Store publication or automatic privilege override.

### Chrome Web Store release work
- **Status:** DEFERRED.
- **Source:** `feature/chrome-web-store-release`; branch diverged from consolidated source.
- **Behavior:** Publishing scripts and release documentation.
- **Affected:** Packaging workflow / manifest / release script.
- **Reason:** Packaging/publishing branch outdated; needs reconciliation and store submission authorization before inclusion.
- **Target:** Later store publication after separate review.

### Consignment Manager launcher
- **Source conversation:** Consignment program development, October 19, 2026.
- **Status:** `IN DEVELOPMENT`.
- **Requested behavior:** A lightweight Chrome extension popup link opening the full Consignment Manager, not an embedded management application.
- **Authoritative development branch:** `Tawgod/Lightspeed:feature/consignment-layout-foundation`; draft PR #11; popup implementation commit `420e9f717a221800e7863cfacfffbdbb26a841a7`.
- **Affected extension file:** `extension/popup.html` only; no new host permissions or background activity.
- **Backend dependency:** Accessible, validated /consignment management route (beta: separate Hobby Corner Integration Test Railway project). Product matching, customer identity and Lightspeed product/credit writes not available in beta.
- **Test status:** UI smoke/browser test not yet recorded. Existing extension release v0.3.24 test packaging must be reconciled before shipping.
- **Target release:** Next compatible extension release after review and test approval.
- **Block/defer reason:** Do not publish or package directly from this consignment branch. First reconcile Purchase Order Companion, scanner v0.3.24 and current authoritative consolidated extension source, then test the launcher and determine permanent route. A beta-only URL may not be suitable for production extension release.
- **Released version/commit/date:** Not released.


### Scanner permissions — active Timeclock employees
- **Source:** Product Scanner and shared employee login, October 20, 2026.
- **Status:** `IN DEVELOPMENT` — tested backend change, not merged or deployed.
- **Request:** Any employee able to authenticate with an active Timeclock PIN can review scanner products and stage preorder drafts, without waiting for Lightspeed role verification.
- **Implementation:** `Tawgod/Lightspeed:feature/scanner-timeclock-employee-access`; Timeclock server authorization + scanner review display; PR pending.
- **Affected:** `timeclock/server.js`, `extension/product-scanner/review.js`, scanner employee-access regression tests.
- **Backend:** Recheck `employees.active` on every request; do not grant access to disabled staff or anonymous users. Existing actual Lightspeed product create/update routes remain disabled.
- **Tests:** CI workflow `39454453842` passed; real PIN/browser test pending.
- **Target:** Next coordinated extension/backend release, after queue reconciliation.
- **Release restriction:** No merge/deployment or Chrome extension packaging performed here.


### Product Scanner — duplicate verification, completeness and current-product safety
- **Source:** Product Scanner development, October 27, 2026.
- **Status:** `IN DEVELOPMENT`; no release package prepared.
- **Requested behavior:** Prevent duplicate unsafe product creation, surface missing UPC/weight/picture accurately, require supplier capture to stay on one individual product page, and move toward controlled approval without enabling writes.
- **Implementation:** `Tawgod/Lightspeed:feature/scanner-duplicate-safety-review-20261027`, PR #14.
- **Affected files:** `routes/specialOrderProducts.js`, `extension/product-scanner/review.js`, `extension/product-scanner/special-orders-adapter.js`, `extension/product-scanner/completeness.js`; tests and audit document.
- **Backend dependencies:** Both Special Orders local and Lightspeed remote duplicate checks must succeed. Invalid or partial remote results now block verification. Permission policy pending reconciliation with PR #12.
- **Tests:** Scanner UI regression run 40532962645 passed. Live employee/browser acceptance, API lookup failure tests, real product fields, and staging still need confirmation.
- **Target:** Next compatible extension release after acceptance and full queue reconciliation.
- **Block/defer reason:** No release until browser-tested; controlled approval product-write workflow not implemented. Existing PO Companion and consignment launcher entries must be considered independently.
- **Released version/commit/date:** Not released.


### Product Scanner — employee new-product review inbox
- **Source:** Product Scanner next phase, October 27, 2026.
- **Status:** `IN DEVELOPMENT` (not released, not deployed).
- **Requested behavior:** Employees can submit a scanned new-product proposal into a persistent review inbox, identify supplier and source URL, view pending proposals, and require a separate controlled approval step before any Lightspeed write.
- **Implementation:** `Tawgod/Lightspeed:feature/scanner-review-queue-foundation-20261027`; PR #15.
- **Affected extension files:** `extension/product-scanner/review.html`, `extension/product-scanner/review.js`; backend `services/scannerProductReviewQueue.js`, `services/scannerTimeclockGateway.js`, `server.js`.
- **Backend dependencies:** Existing scanner Timeclock login and duplicate-match endpoints. **Blocked on reconciling PR #14's remote-match fail-closed changes before deploying.** PR #12 basic employee permissions do not grant final product-write approval.
- **Test status:** Scanner CI run `40539225636` passed; browser acceptance, live database persistence and real employee testing pending.
- **Target release:** Next compatible extension release after browser acceptance and complete release queue reconciliation.
- **Defer reason:** Approval-to-Lightspeed writes, idempotent write recovery and reviewer privilege policy are not implemented. No Chrome ZIP/version change permitted yet.
- **Released version/commit/date:** Not released.

### Shared Addon UI / UX — beta Chrome adoption
- **Feature/system:** Shared Addon UI / UX Coordination.
- **Source conversation:** Shared Addon UI / UX Coordination, October 27, 2026.
- **Status:** `QUEUED` — shared kit implemented in an isolated feature branch, but **no extension screen has adopted it yet**.
- **Requested behavior:** Use the owner-approved navy/blue design, shaded panels, original orange/blue Hobby Corner logos, consistent status/approval patterns and exact copy/paste handling across Chrome popup, Product Scanner and later PO Companion/Consignment launchers.
- **Authoritative base:** `Tawgod/Lightspeed:integration/hobby-corner-consolidation`; foundation branch `feature/shared-addon-ui-beta-foundation-20261027`, draft PR [#16](https://github.com/Tawgod/Lightspeed/pull/16).
- **Extension files/components affected now:** None. Future integration may update `extension/popup.html`, `extension/popup.css`, `extension/product-scanner/review.html`, `extension/product-scanner/review.css`, and extension-owned shared asset copies after branch reconciliation.
- **Backend dependencies:** None for CSS/branding; do not alter any product/order/permission backend semantics.
- **Tests:** Shared UI foundation automated checks 5/5 PASS, CI run [40544824489](https://github.com/Tawgod/Lightspeed/actions/runs/40544824489). Chrome browser/role/scanner/keyboard acceptance pending. Any feature-level browser test must be performed after adopting the CSS.
- **Target release:** Next compatible release **after** coordinated merging/testing. No extension version bump, ZIP, distribution change, or Chrome Web Store submission now.
- **Block/defer reason:** Shared design source alone is not extension-integrated or release-tested; active PRs #11–#15 can change target screens. Reconcile those PRs and the full queue before importing styling. Do not replace popup/scanner HTML wholesale.
- **Released version/commit/date:** None.

## Released / historical extension items

Use this section to preserve shipped queue history when useful. Do not delete an entry just because it shipped; mark it `RELEASED` and record the version/commit/date so future chats can distinguish released work from pending work.

## Shared integration contract

All extension development chats must also follow `Tawgod/Hobby-Corner:main/CHROME_EXTENSION_INTEGRATION.md`.

That document is authoritative for cross-feature extension coordination, including shared popup/content/manifest ownership, navigation consistency, shared UI/UX, backend destinations, employee authorization, message contracts, content-script safety, permissions, and regression expectations. Feature-specific implementation notes belong in feature docs/branches; release state belongs in this queue.

## Chat handoff rule

When any development chat finishes or queues Chrome extension work, it must either:
- update this file directly, or
- provide a manager handoff containing a queue entry suitable for this file.

When any development chat starts preparing a Chrome extension release, it must first state which queue entries were found and how each will be handled in that release.


## October 16, 2026 release reconciliation
- v0.3.24 test package includes consolidated scanner changes from merged PR #10; no product writes or automatic grant for unknown Lightspeed roles.
- Purchase Order Companion remains `DEFERRED`: `feature/po-companion-readonly-foundation` is far behind consolidated, and no acceptance tests verify a compatible release.
- Chrome Web Store release branch remains `DEFERRED`: its workflow/scripts have diverged and publishing wasn't requested.
- Historical scanner branches `feature/scanner-fields-create-preview` and `feature/scanner-review-auto-lookup` are behind consolidated with no pending unique implementation to ship. `feature/scanner-secure-match-gateway` contains old smoke scripts only, not new UI.
- Package archive: https://github.com/Tawgod/Lightspeed/actions/runs/38917194872. This is an unpacked extension artifact, not a Chrome Web Store submission.

## October 27, 2026 — coordinated scanner beta release reconciliation (pre-package)
- **User request:** Enable controlled product creation testing and integrate all compatible pending Scanner changes and approved shaded navy/blue Hobby Corner UI.
- **Current authoritative source:** `Tawgod/Lightspeed:integration/hobby-corner-consolidation`. PR #14 (fail-closed remote lookup, completeness, single-product capture) **merged** at `4a69d25ae3cf6fef2209e94e395f5ed05df0b7ff`. Browser acceptance remains pending.
- **Reconciled candidate:** `feature/scanner-integrated-beta-20261027`, PR #17, based on latest consolidated code. Contains selectively reconciled PR #15 product proposal review inbox and PR #12 active Timeclock employee scanner access (these older PRs are still open, not separately merged). Does not grant automatic production product-write permission.
- **UI adoption:** Owner-approved PR #16 foundation design was selectively adopted into **Scanner and extension toolbar popup** (navy/blue, shaded panels, local original store wordmark/icon, accessible focus styles). PR #16 itself remains a separate draft foundation; its remaining showcase/shared-library work is **DEFERRED** from this specific beta release because it does not modify additional extension screens and awaits visual/browser acceptance.
- **Controlled test creation:** PR #17 includes a new **one-shot isolated test-tenant-only** create route, never active unless `SCANNER_TEST_CREATION_ENABLED=true`, `SCANNER_TEST_TENANT_CONFIRMATION=ISOLATED_TEST_TENANT`, a distinct `SCANNER_TEST_LIGHTSPEED_DOMAIN` different from production and separate `SCANNER_TEST_LIGHTSPEED_TOKEN` are present. Stored proposal, explicit confirmation, fresh dual-source duplicate search, isolated test-store SKU check and audit/reconciliation are required. No production write endpoint is enabled. Current Railway service lacks these test-specific variables, so actual test writes are **BLOCKED pending dedicated test tenant configuration**. No credential requested or stored in extension.
- **PO Companion:** PR #13 / `feature/po-companion-consolidated-v2` remains **DEFERRED** from this scanner test package: draft/read-only foundation, no live supplier-site browser acceptance or employee approval flow. The obsolete `feature/po-companion-readonly-foundation` is not authoritative. Do not omit from the later coordinated release.
- **Consignment launcher:** PR #11 / `feature/consignment-layout-foundation` remains **DEFERRED** from this scanner test package: draft beta-route integration has not been verified with the production extension and must not point employees to an unapproved beta URL.
- **Store publication:** `feature/chrome-web-store-release` remains **DEFERRED**; no Web Store submission authorized. Historical scanner branches `feature/scanner-fields-create-preview`, `feature/scanner-review-auto-lookup`, `feature/scanner-secure-match-gateway`, `feature/scanner-sku-role-diagnostics` already have their relevant changes in consolidated or are obsolete; no standalone duplicate release items.
- **Release scope:** Plan unpacked **v0.3.25 Scanner + Popup beta preview** based on PR #17 *after combined CI succeeds*. No version bump or package yet at the time of this reconciliation record; no production extension distribution replacement.
- **Release blocking tests:** Real active employee PIN/browser and single-product supplier scanning; isolated test tenant create; Chrome focus/navigation/branding, supplier fields and preorder staging. Do not label beta as production deployed until these pass.

## October 27, 2026 — scanner v0.3.25 beta build and deployment verification
- **Scanner integration:** PR #14 merged `4a69d25ae3cf6fef2209e94e395f5ed05df0b7ff`; PR #17 merged `61016a92971bceead57f07f1a09aa47461d1d343` into `integration/hobby-corner-consolidation`. PR #12 and #15 closed as superseded by merged #17; their compatible scanner changes are included.
- **Extension preview version:** `0.3.25`, built from `release/scanner-v0.3.25-beta-20261027` at `5c304d4d01b2b15afd13dc8f90960c78536d85f6`. GitHub Actions [40549569151](https://github.com/Tawgod/Lightspeed/actions/runs/40549569151) **SUCCESS**, artifact ID `12754687005`, `Hobby-Corner-Toolkit-v0.3.25-scanner-UI-beta-unpacked`; built **2026-10-27**, artifact expires 2026-11-26.
- **Shipped in beta ZIP:** Scanner active Timeclock employee editing/proposals, protected supplier matching, UPC/weight/image completeness, single-product supplier capture, persisted new-product proposals, isolated-test-only creation UI, navy/blue shaded Scanner and toolbar popup UI, original local Hobby Corner wordmark/icon, existing preorder staging and other toolkit features.
- **Railway backend:** All three connected services (`lightspeed-api`, `timeclock`, `special-orders-test`) reported successful deployment of `61016a9`. However, `special-orders-test` runtime log reports **scanner gateway disabled because `SCANNER_SERVICE_SECRET` was missing/empty at startup** even though variable NAME exists in Railway. This is a **BLOCKER for employee/browser testing**; restore and verify matching Timeclock/Scanner service secret through secure Railway configuration. Do not overwrite an unreadable secret blindly.
- **Test creation:** The backend has an opt-in **isolated test Lightspeed tenant** writer, intentionally disabled by default. No `SCANNER_TEST_CREATION_ENABLED`, `SCANNER_TEST_LIGHTSPEED_DOMAIN`, `SCANNER_TEST_LIGHTSPEED_TOKEN`, or `SCANNER_TEST_TENANT_CONFIRMATION` variables were configured at verification time. **No live-store product creation has been enabled or performed**. An actual test product cannot be created until test-store credentials and a domain different from production are securely configured.
- **Consolidated manifest:** Remains `0.3.23` for the normal extension download; v0.3.25 is **unpacked beta artifact only**, not automatic update, not Chrome Web Store released. Browser acceptance is pending.
- **Included vs deferred:** All compatible pending Scanner changes plus Scanner/toolbar UI adoption included in beta. PR #16 underlying shared UI foundation remains open/draft; later common screens unchanged. PO Companion PR #13 deferred (draft, employee-side acceptance missing), Consignment PR #11 deferred (beta route not approved for production launcher), Chrome Web Store publishing branch deferred. None silently omitted.
- **Release status:** `INCLUDED` in v0.3.25 beta preview; **NOT production extension released**, **NOT browser accepted**, **NOT test-create verified**. Remaining blocker: restore scanner auth secret, configure dedicated Lightspeed test tenant, then perform store employee acceptance.


## October 27, 2026 — Shared UI adoption status correction

- The earlier `Shared Addon UI / UX — beta Chrome adoption` entry that said no extension screen had adopted the design is now superseded by the coordinated Scanner beta reconciliation below.
- **Scanner and the extension toolbar popup HAVE adopted the approved navy/blue shaded Hobby Corner UI** through merged PR #17 / consolidated commit `61016a92971bceead57f07f1a09aa47461d1d343`.
- The integrated beta uses local copies of the approved Hobby Corner branding/assets and preserves existing Scanner/Popup behavior and permission safeguards.
- PR #16 remains the reusable shared foundation and is still open/draft; it is **not itself merged or deployed**.
- v0.3.25 remains an unpacked beta preview only, not the production extension release.
- Browser/employee acceptance and the scanner authentication/runtime blocker remain outstanding before production release.
- PO Companion PR #13 and Consignment PR #11 remain separate/deferred and must adopt/reconcile shared UI independently when their feature work is ready.

### Scanner shared UI component adoption — 2026-10-27
- **Status:** `IN DEVELOPMENT` — not merged, deployed or packaged; PR [#19](https://github.com/Tawgod/Lightspeed/pull/19), branch `feature/scanner-shared-ui-adoption-20261027`.
- **Source:** Draft shared foundation PR #16 at `feature/shared-addon-ui-beta-foundation-20261027` and `SHARED_ADDON_UI_UX.md`; application base `integration/hobby-corner-consolidation`.
- **Change:** Existing navy/blue Scanner and popup beta styling from merged PR #17 preserved. Scanner now opts into shared namespaced panel, inset, button, form and status classes without changing IDs; shared `clipboard.mjs` copied verbatim into `extension/shared-ui/` and used by Copy Product Data to retain exact text, whitespace and leading zero codes.
- **Affected files:** `extension/product-scanner/review.html`, `extension/product-scanner/review.js`, `extension/shared-ui/clipboard.mjs`, `tests/scannerSharedUiAdoption.test.js`; scanner UI CI and adoption documentation.
- **Tests:** Regression checks added; Chrome browser/zoom/keyboard/PIN acceptance pending; no data writes or backend permission changes.
- **Next compatible release:** After PR #19 tests and full queue reconciliation. PR #16 remains draft, PO Companion PR #13 and Consignment PR #11 remain explicitly deferred pending feature acceptance.
- **Release restriction:** No extension ZIP/version update or Web Store submission is authorized by this change. Previous v0.3.25 beta artifact is unaffected.

- **PR #19 verification update (2026-10-27):** GitHub Actions scanner integration [run 40563269131](https://github.com/Tawgod/Lightspeed/actions/runs/40563269131) PASSED after regression test corrections. Implementation head `eb210aa742db608355c963c5b8e6af3a673944e4`; remains not merged, not deployed, not packaged and Chrome browser acceptance pending.


### Timeclock + Split / Recall shared UI alignment
- **Source:** Manager UI adoption audit, 2026-10-27.
- **Status:** `IN DEVELOPMENT`.
- **Implementation:** `Tawgod/Lightspeed:feature/extension-launchers-shared-ui-20261027`, draft PR #22.
- **Affected:** Chrome-injected Timeclock launcher/overlay and Split / Recall launcher/overlay in `extension/content.js`.
- **Change type:** Visual only — navy/blue palette, shaded panel/background separation and shared border tones.
- **Safety:** Existing IDs, event handlers, PIN flow, order detection, API calls and Split execution logic preserved. No extension version bump/package/release.
- **Tests pending:** Chrome Sell/fulfillment browser acceptance, keyboard focus/close behavior, 100/125/200% zoom, Timeclock PIN flow, Split/Recall workflow and Lightspeed host CSS-collision check.
- **Target:** Next coordinated extension release after acceptance and full queue reconciliation.

### Scanner/Toolkit Consignment UI consistency + shared navigation — 2026-10-28
- **Status:** `IN DEVELOPMENT` — not merged, not deployed, not packaged.
- **Owner/source:** `Tawgod/Lightspeed:feature/scanner-consignment-nav-alignment-20261028`, PR [#26](https://github.com/Tawgod/Lightspeed/pull/26); base `integration/hobby-corner-consolidation`.
- **Dependency coordination:** Reconciles Scanner UI PR #19 with PR #23's drafted core-operations navigation contract, using original PR #16 design tokens and Consignment PR #11 visual reference. Does **not** merge or supersede unfinished #16/#23/#11 work.
- **Affected extension files:** `extension/product-scanner/review.html` and `review.js`; `extension/popup.html` and `popup.js`; `extension/shared-ui/navigation.mjs`, `navigation.css`, `clipboard.mjs`; scanner UI workflow and tests.
- **Behavior:** Current-page highlighting, navy nav, responsive More menu with keyboard Escape/focus; links to verified declared routes Special Orders, Ordering, Preorder Campaigns, GW Preorders, plus Product Scanner and Toolkit bundled pages. No speculative beta/unfinished routes displayed. Existing Timeclock and Split/Recall embedded controls unchanged; no Lightspeed writes enabled.
- **Tests:** GitHub Actions [40719605947](https://github.com/Tawgod/Lightspeed/actions/runs/40719605947) PASS. Visual screenshots, browser zoom, PIN and click-through acceptance pending.
- **Release coordination:** PR #22 Timeclock/Split launcher, PR #13 PO Companion, PR #11 Consignment and PR #16 shared foundation remain separately open and must be explicitly reconciled before packaging. Current beta v0.3.25 unaffected; no extension version bump/ZIP/Chrome Web Store publication.


## October 28, 2026 — Shared extension integration reconciliation

Authoritative consolidated head checked during this reconciliation: `Tawgod/Lightspeed:integration/hobby-corner-consolidation` at `24e9834a6aaaec2fae5e656a65939e93b63143cf`.

### Supersession / overlap map
- **PR #19 Scanner shared UI components** → predecessor to **PR #26**, which explicitly reconciles #19 and adds current shared Scanner/Toolkit navigation. Do not merge #19 independently without comparison to #26/current consolidated.
- **PR #21 core-ops shared UI** → predecessor to **PR #24**, which combines the newer core-ops navigation and UI consistency work. Do not merge #21 independently without reconciliation.
- **PR #23 core-ops navigation** → incorporated by **PR #24**. Treat #24 as the current coordinated core-ops UI/navigation candidate.
- **PR #22 Timeclock + Split/Recall UI** remains active and touches `extension/content.js` only. It does not directly conflict with PR #26's popup/navigation files, but its base is older than current consolidated and must be rebased/reconciled before merge/package.
- **PR #13 PO Companion** conflicts at shared surfaces with PR #26 because it changes `extension/manifest.json`, `popup.html`, `popup.js`, and maintains feature-local navigation/shared UI copies. Rebase and migrate it to the shared extension navigation contract before merge.
- **PR #11 Consignment** still contains an older `extension/popup.html` launcher change that conflicts conceptually with PR #26's coordinated popup/navigation. Preserve Consignment backend/UI work, but do not merge that popup change wholesale. PR #25 is the newer Consignment navigation/UI alignment work.
- **PR #20 Avery labels** is backend-served/standalone UI work and does not currently modify extension shared files.

### Current coordinated shared-surface candidates
- Core operations UI/navigation: PR #24.
- Scanner/Toolkit popup/navigation: PR #26.
- Timeclock + Split/Recall content-script UI: PR #22, pending rebase/reconciliation.
- Consignment navigation/UI: PR #25 on top of Consignment branch, with extension launcher still requiring shared-entry-point reconciliation.
- PO Companion: PR #13, blocked on shared popup/navigation/manifest reconciliation.

No extension version bump, package, distribution update, or Chrome Web Store release is authorized by this reconciliation.

# Product Scanner / Toolkit — Current Handoff

**Last verified:** 2026-10-29  
**Status:** Testing / Blocked for coordinated Chrome extension release integration. The PR remains unmerged and is behind the latest consolidated branch.

## Source
- Repository: `Tawgod/Lightspeed`
- Authoritative application base: `integration/hobby-corner-consolidation@f50c3309824986633c3ba37a95e6eb43aae15a3c` (live GitHub comparison, 2026-10-29).
- Current PR: [#26](https://github.com/Tawgod/Lightspeed/pull/26), `feature/scanner-consignment-nav-alignment-20261028@0b3e6f110932efea94dc23c23903cc97ee20e541`. **Diverged: 7 commits ahead / 7 behind** consolidated; merge base `24e9834a6aaaec2fae5e656a65939e93b63143cf`. Do not describe the earlier 0-behind comparison as current.
- Superseded UI PR #19: compatible shared panel/form classes, exact-text clipboard helper and regression test documented as incorporated into #26; do not merge #19 independently. Pre-reconciliation backup: `backup/scanner-pr26-before-reconcile-20261028`.
- Historical Scanner branches: `feature/scanner-integrated-beta-20261027`, `feature/scanner-duplicate-safety-review-20261027`, `feature/scanner-fields-create-preview`, `feature/scanner-review-auto-lookup` previously compared as zero ahead of consolidated. `feature/scanner-shared-ui-adoption-20261027` contains older PR #19 UI work; do not wholesale merge. **Needs targeted comparison:** `feature/scanner-review-queue-foundation-20261027` (review service/gateway/staging), `feature/scanner-timeclock-employee-access` (active staff lookup and review backend), and `feature/scanner-secure-match-gateway` (old smoke checks). Earlier audit found unique commits in these stale branches, but does not prove functional content is missing from consolidated. Preserve until verified.

## Responsibilities and requirements
- Own Product Scanner supplier-page product identification/capture, physical barcode/UPC and supplier SKU matching, duplicate-safe lookup, completeness warnings (UPC, weight, image), SKU preservation including leading zeros, single-product capture, review/proposal and preorder staging, and appropriate employee access; Toolkit popup and Scanner-specific shared navigation/UI integration.
- Staff may authenticate through **existing Timeclock** PIN identity. Active vs inactive employee, fail-closed server-side permission, review/approval vs production write authorization must be distinguished. No parallel auth/employee database.
- Existing General SKU default is supplier reorder code unless a unique verified existing product SKU is appropriate; preserve manual SKU overrides and exact copy formatting. Never manufacture duplicate products from unverified matches or assume a numeric suffix, variant, pack or bundle represents the same product.
- Employee review/preorder proposal permissions must not silently grant Lightspeed product creation/update privileges. Preserve the isolated **test-tenant-only** one-shot writer with environment and duplicate gates; production writes disabled.
- Use approved navy/blue/gray-blue Hobby Corner shared UI, original assets, accessible labels/focus/live statuses, current-page navigation, responsive More menu and correct Beta/Test labels. Reuse canonical navigation; no feature-local copy of shared popup/navigation/manifest.
- Future **Invoice Reconciliation bridge (Planned, NOT implemented):** Scanner contributes supplier UPC/SKU, product/cost evidence and supplier-specific price proposals to the **shared invoice-scoped** backend workflow. Product Manager shows one chosen invoice's unresolved updates, not employee-specific invoice profiles. Invoice PDF/email/tracking ingestion and durable proposal/approval records belong to shared services, **not** a Scanner-only email worker, matcher, PO writer or credentials. After separate authorized full-invoice approval, create a new **OPEN** supplier PO or update an existing one; preserve secondary supplier associations and primary supplier, verified warehouse/shipping sender aliases, many-to-many tracking links for Special Orders **On the way**. **Never receive stock, mark it ready/allocated, or modify inventory-on-hand**. 90%+ match is an auto-staged candidate, not an automatic mutation. Scanner invoice bridge is QUEUED for a later extension release.
- No unrelated development, releases or live changes authorized by this handoff.

## Implemented
- Existing consolidated Scanner product matching/duplicate checking, Timeclock identity and review foundations as documented in shared architecture; implementation scope in specific historic review/employee branches still needs selective confirmation.
- PR #26 UI implementation: updates to Scanner review page and Toolkit popup, active-tool highlight, responsive accessible More navigation (current Toolkit link remains primary), shared nav CSS/module, source-preserving clipboard helper, Scanner UI/navigation regression tests and mocked Chromium browser test.
- Core operations PR #24 and shared foundation PR #27 **merged** into consolidated; do not describe them as open dependent merges. Shared services PR #32 Phase 1 and stacked PR #33 Phase 2 are **implemented/tested in branches, not merged, not deployed or used by Scanner consumers**. Phase 2 includes unmounted operation permission registry, canonical read services; new writes default-denied.

## Tested
- **Previously passed CI at PR #26 head**: Scanner integration [40724995019](https://github.com/Tawgod/Lightspeed/actions/runs/40724995019); Scanner UI/clipboard [40724981558](https://github.com/Tawgod/Lightspeed/actions/runs/40724981558); mocked Chromium popup/review navigation, keyboard/layout and simulated 100/125/200% zoom [40725500639](https://github.com/Tawgod/Lightspeed/actions/runs/40725500639). Browser artifact `scanner-chrome-layout-screenshots` (nine screenshots). These **were not rerun** after the latest consolidated merge.
- **Manual real loaded-extension acceptance NOT VERIFIED**: valid active PIN, invalid/deactivated PIN, supplier product-page capture, Chrome host permission prompts, duplicate-safe matching, barcode/SKU/UPC exactness, preorder/proposal queue staging/review, navigation click-through, keyboard/focus and native 100/125/200% browser zoom. The mocked browser run does not establish these.
- Cross-feature combined PR #22 + #26 + #31 popup/manifest/content script regression not yet verified. No new tests or employee actions performed in this documentation audit.

## Deployed
- **PR #26: NOT merged, NOT deployed, NOT released as Chrome extension.** Previous v0.3.24/v0.3.25 unpacked Scanner previews are historical test artifacts, not evidence of live PR #26 publication.
- Railway `Hobby Corner` production environment read on 2026-10-29: `lightspeed-api`, `timeclock`, `special-orders-test` each live, source `Tawgod/Lightspeed:integration/hobby-corner-consolidation`, latest deployment SUCCESS 2026-10-28. `lightspeed-api` deployment `6d1d3cd4-dcd1-4827-b07a-8b36bf926df2` explicitly reports commit `f50c3309824986633c3ba37a95e6eb43aae15a3c`. **This does not deploy PR #26**, nor PR #32/#33.
- Production Railway PostgreSQL has mounted durable volume; no shared-service schema migration verified applied. Separate `Hobby Corner Integration Test` Consignment beta is isolated on older `feature/consignment-layout-foundation` branch, not production integration.

## Shared dependencies
- Timeclock authentication/current active-staff permissions (and Timeclock/Split PR #22), Special Orders product matcher and local/remote duplicate lookup, Ordering/Preorders and proposals, PO Companion PR #31, Product Manager planned invoice context, shared UI and merged core operations navigation, Consignment beta launcher (PR #30) and credit-policy isolation.
- Shared Lightspeed gateway PR #32/#33, durable PostgreSQL audit/idempotency and operation-specific policy; no new standalone scanner API client/auth/matching engine.
- Supplier, customer, and external context may eventually involve Discord/Rewards/customer synchronization, but Scanner should not directly modify these systems. No live dependency or integration verified for Scanner-to-Rewards.
- Invoice Reconciliation: `FEATURE_INVOICE_RECONCILIATION.md`; no receiving, on-hand adjustment or unapproved PO/supplier changes.

## Shared files / integration surfaces affected
- PR #26: `extension/popup.html`, `extension/popup.js`, `extension/product-scanner/review.html`, `extension/product-scanner/review.js`, `extension/shared-ui/navigation.mjs`, `navigation.css`, `clipboard.mjs`, Scanner CI workflows and tests.
- Extension cross-feature surfaces (do not wholesale overwrite): `extension/manifest.json`, `popup.css`, `content.js`, message contracts, employee authorization, host permissions and release/version files.
- PR #22 owns `extension/content.js`; PR #31 includes PO feature files plus popup/manifest changes and should consume PR #26 shared nav. PR #30 does not authorize importing legacy Consignment popup launcher. Shared UI PR #27 must not introduce duplicate clipboard assets.

## Remaining blockers and known issues
1. **Rebase/selectively reconcile PR #26 onto latest consolidated `f50c330`**, preserving merged PR #24/#27 behavior; 7 behind/7 ahead as checked. No merge was performed.
2. Investigate whether historical Scanner review queue and active Timeclock employee branch contain functional behavior/tests not in current consolidated source; do not lose review proposals, staging/audit or deactivated employee guards. Prior audit showed divergent old branches, not proof of missing features.
3. Run Scanner integration, UI, clipboard, shared navigation and browser tests at updated PR head. Full real Chrome employee/supplier/manual acceptance remains required.
4. Coordinate PR #22 Timeclock/Split overlay and PR #31 read-only PO Companion/manifest/popup with #26 on a separate coordinated release-testing branch, verifying beta Consignment route before adding launcher. Reconcile every release queue entry (READY, QUEUED, IN DEVELOPMENT, BLOCKED) with explicit include or defer rationale.
5. Real role/privilege behavior, permissions, variant/pack duplicates, test-tenant write gates and preorder/review workflow not comprehensively validated in employee browser context.
6. Future invoice Scanner bridge not started. PO create/update and supplier alias/tracking linking remain shared-service plans, not implemented features; preserve the explicit no-receive/no-inventory rule.

## Decisions needed
- Staff/browser test operator and isolated supplier/test tenant data for real Chrome acceptance.
- Review/employee branch feature parity and integration strategy after live code diff.
- Cross-feature release scope and whether verified Consignment launcher is included; explicit approval required to version, package, publish or production deploy.
- Invoice bridge sequencing after shared backend invoice queue and shared gateway authorization/read contracts are accepted.

## Recommended next action
1. Selectively compare old review queue / Timeclock employee Scanner branches against `f50c330` and PR #26; document unique code/tests and preserve or explicitly defer.
2. Reconcile PR #26 against current consolidated; rerun CI, then loaded Chrome staff/supplier acceptance with zero production writes.
3. Prepare coordinated integration tests with PR #22 and PR #31 only after isolated acceptance. Keep Invoice Reconciliation in future queue, not current extension package.

## Restrictions / safety
- This was a read-only source/deployment audit plus GitHub documentation update. No application PR merged, no Railway or Lightspeed record changed, no credentials accessed, no product/order/inventory/employee/customer write made, no Chrome extension bumped/packaged/published.
- Production product and PO writes disabled; isolated test writer separately guarded; never receive products or alter inventory quantities from invoice feature.
- Preserve all prior branches and Git history. Do not interpret successful CI or production Railway status as PR #26 deployment.

## Documentation
- `HOBBY_CORNER_PROJECT.md`, `HOBBY_CORNER_CHAT_TRANSITION.md`, `handoffs/README.md`, `handoffs/TEMPLATE.md`, `LIGHTSPEED_SHARED_SERVICES.md`, `SHARED_STAFF_AUTH_PERMISSIONS.md`, `ROADMAP.md`, `FEATURE_INVOICE_RECONCILIATION.md`, `CHROME_EXTENSION_INTEGRATION.md`, `CHROME_EXTENSION_RELEASE_QUEUE.md`, `SHARED_ADDON_UI_UX.md`.
- PR #26 `docs/scanner-navigation-consignment-alignment-20261028.md`, related PRs #19/#22/#24/#27/#30/#31/#32/#33 and GitHub Actions references above.

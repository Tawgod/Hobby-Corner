# Hobby Corner Chrome Extension Release Queue

**Purpose:** This file is the shared cross-chat release queue for the Hobby Corner Toolkit Chrome extension.

Any development conversation that changes or plans to change the Chrome extension must use this file so extension work from one chat is not accidentally omitted when another chat prepares the next release.

## Mandatory release rule

Before any Chrome extension version bump, ZIP/package build, distribution-page update, Railway rollout that serves a new extension package, or Chrome Web Store submission:

1. Read this file from `Tawgod/Hobby-Corner:main`.
2. Inspect the authoritative extension source on `Tawgod/Lightspeed:integration/hobby-corner-consolidation`.
3. Review all queue entries whose status is `QUEUED`, `READY`, `IN DEVELOPMENT`, or `BLOCKED`.
4. Include every compatible `READY` item in the release.
5. For every item not included, record an explicit defer/block reason before releasing.
6. Check for active extension-related branches/PRs and reconcile them with this queue. A chat must not assume this file is complete if GitHub shows newer extension work.
7. Only after the queue is reconciled may the extension version be bumped and packaged.
8. After release, update each shipped entry with release version, consolidated commit, test result, and release date.

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
- **Source conversation:** Purchase Order Companion
- **Status:** `DEFERRED`
- **Requested behavior:** Add the compact right-side supplier website companion for Purchase Orders, showing PO items, supplier-specific SKU/UPC with one-click copy, product name, quantity and warnings; per-item checkbox reveals RP, RQ, Cost and MSRP while preserving draft values; approval/review remains in a separate popup with employee permissions managed through Timeclock.
- **Authoritative base:** `Tawgod/Lightspeed:integration/hobby-corner-consolidation`
- **Affected area:** Chrome extension supplier-site/PO workflow plus Timeclock-backed permissions and review flow.
- **Backend dependencies:** Lightspeed PO data and Timeclock permissions. Verify current implementation state before release.
- **Test status:** Not yet release-verified.
- **Target release:** Next compatible Chrome extension release after implementation is verified.
- **Specific defer reason for next scanner test build:** The PO Companion branch `feature/po-companion-readonly-foundation` is 119 commits behind consolidated, not release-verified, and needs selective integration/Chrome compatibility testing before shipping. Target: next compatible extension release after testing.
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

## Released / historical extension items

Use this section to preserve shipped queue history when useful. Do not delete an entry just because it shipped; mark it `RELEASED` and record the version/commit/date so future chats can distinguish released work from pending work.

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

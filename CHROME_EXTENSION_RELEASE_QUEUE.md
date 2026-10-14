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
- **Status:** `QUEUED`
- **Requested behavior:** Add the compact right-side supplier website companion for Purchase Orders, showing PO items, supplier-specific SKU/UPC with one-click copy, product name, quantity and warnings; per-item checkbox reveals RP, RQ, Cost and MSRP while preserving draft values; approval/review remains in a separate popup with employee permissions managed through Timeclock.
- **Authoritative base:** `Tawgod/Lightspeed:integration/hobby-corner-consolidation`
- **Affected area:** Chrome extension supplier-site/PO workflow plus Timeclock-backed permissions and review flow.
- **Backend dependencies:** Lightspeed PO data and Timeclock permissions. Verify current implementation state before release.
- **Test status:** Not yet release-verified.
- **Target release:** Next compatible Chrome extension release after implementation is verified.
- **Release rule:** Do not silently omit this item from a future extension release. If it is not ready when another extension release is prepared, mark it `DEFERRED` or `BLOCKED` with the reason and leave it in this queue.

## Released / historical extension items

Use this section to preserve shipped queue history when useful. Do not delete an entry just because it shipped; mark it `RELEASED` and record the version/commit/date so future chats can distinguish released work from pending work.

## Chat handoff rule

When any development chat finishes or queues Chrome extension work, it must either:
- update this file directly, or
- provide a manager handoff containing a queue entry suitable for this file.

When any development chat starts preparing a Chrome extension release, it must first state which queue entries were found and how each will be handled in that release.


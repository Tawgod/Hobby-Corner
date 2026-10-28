# Hobby Corner Chrome Extension Integration

**Purpose:** This document is the shared cross-system integration contract for the Hobby Corner Toolkit Chrome extension.

Use it together with `CHROME_EXTENSION_RELEASE_QUEUE.md`.

- `CHROME_EXTENSION_INTEGRATION.md` defines **how extension features coexist and share common extension surfaces**.
- `CHROME_EXTENSION_RELEASE_QUEUE.md` defines **what is waiting to ship, what is ready, and what must be reconciled before a release**.

Any development conversation that creates, modifies, integrates, or plans Chrome-extension functionality must read both documents before changing shared extension files.

## Authoritative source

Repository: `Tawgod/Lightspeed`

Authoritative base branch:

`integration/hobby-corner-consolidation`

Do not build new extension work from retired feature branches. Feature branches should start from the current consolidated branch and remain short-lived.

Before implementation:
1. Read this document.
2. Read `CHROME_EXTENSION_RELEASE_QUEUE.md`.
3. Inspect the current consolidated extension source.
4. Inspect active extension-related branches and pull requests.
5. Determine which shared files/components the proposed work touches.
6. Reconcile overlapping work before editing shared extension surfaces.

## Shared extension surfaces

The following files/components are cross-system integration points and must not be treated as feature-private:

- `extension/manifest.json`
- `extension/popup.html`
- `extension/popup.css`
- `extension/popup.js`
- `extension/content.js`
- shared navigation data/components
- shared UI / branding assets and styles
- shared authentication / employee identity behavior
- shared message/event contracts between content scripts, popups, embedded frames, and backend services
- extension packaging/version/release files

A feature branch that changes any of these must document the change in the release queue and identify possible conflicts with other active extension work.

## Current extension systems

The extension currently coordinates or launches functionality for:

- Split / Recall / Partial Pickup
- Special Orders
- Product Scanner
- Purchase Order Companion
- Consignment Manager launcher
- Timeclock
- Avery / Purchase Order labels
- ZIP / USPS customer-address helpers
- shared Hobby Corner navigation
- shared Addon UI / UX

Future extension features should be added to this list when development starts.

## Ownership and integration rule

Feature-specific code should stay modular whenever practical.

Feature folders may own their internal HTML, CSS, JavaScript, and tests, but shared entry points remain integration-owned.

Examples:
- Product Scanner owns `extension/product-scanner/*`.
- Purchase Order Companion owns `extension/po-companion/*`.
- A feature must not replace `popup.html`, `popup.js`, `content.js`, or `manifest.json` wholesale merely to add its launcher.
- Shared entry-point changes should be minimal and preserve existing launchers, permissions, routes, and message handlers.

When two active branches touch the same shared file, reconcile the changes explicitly against the consolidated branch before merge.

## Shared navigation contract

Every employee-facing extension surface that provides navigation to other Hobby Corner tools should use the same destination set and naming.

Canonical tool destinations currently include:

- Special Orders
- Product Scanner
- Purchase Order Companion
- Consignment Manager
- Split / Recall
- Timeclock

A destination may be hidden when it is unavailable in the current context, but it must not be silently renamed, duplicated, or pointed to a different environment by one feature.

Beta/test destinations must be visibly labeled as Beta/Test.

Feature-local navigation files, such as `extension/po-companion/navigation.json`, are not independently authoritative. They must remain synchronized with this central contract and the consolidated extension.

If the navigation list becomes machine-consumed across multiple features, create one shared registry under the consolidated extension and migrate consumers to it rather than maintaining separate copies.

## Shared UI / UX contract

The approved shared Addon UI / UX work is the visual foundation for employee-facing extension interfaces.

Authoritative design documentation:
- `Tawgod/Hobby-Corner:main/SHARED_ADDON_UI_UX.md`

Current shared implementation work must be reconciled from the active shared-UI branch/PR recorded in the release queue before adoption.

Rules:
- Reuse shared styling/components rather than creating independent design systems.
- Preserve feature-specific layout where necessary.
- Maintain accessible focus, keyboard, status, and contrast behavior.
- Do not alter backend semantics while applying shared styling.
- Use Hobby Corner branding consistently.
- Avoid wholesale replacement of popup/scanner/feature HTML when selective integration is sufficient.

## Backend/service contract

The extension must use the currently verified Hobby Corner service destinations from the consolidated source and Railway configuration.

Do not hard-code a new test/temporary backend into a production-targeted extension change without recording it in the release queue.

Current major backend ownership:
- Lightspeed API / Split / Recall / address helpers: `lightspeed-api`
- Timeclock and employee authorization: `timeclock`
- Special Orders functions: `special-orders-test` until the project manager changes its role/name
- Consignment and other beta services: use only when explicitly marked/tested and never silently promote a beta URL

Verify actual Railway configuration before changing backend destinations.

## Employee identity and authorization

Employee authentication/authorization is shared infrastructure.

Do not create a feature-specific parallel employee identity system when Timeclock-backed identity/permissions can be reused.

Requirements:
- Fail closed when authorization cannot be verified.
- Recheck active employee status where required by the owning backend.
- Do not infer Manager/Owner privileges from UI labels alone.
- Product/order write capabilities require their own explicit authorization and testing even if an employee can authenticate.

Any feature changing shared employee authorization must identify all dependent extension systems in the release queue.

## Content-script safety

`extension/content.js` runs inside Lightspeed and can affect core staff workflows.

Changes must:
- avoid MutationObserver feedback loops;
- be idempotent when Lightspeed re-renders;
- avoid replacing native Lightspeed nodes unnecessarily;
- use unique `hct-` IDs/data attributes;
- cleanly remove/recreate overlays and launchers;
- avoid global event collisions;
- preserve existing launcher behavior;
- fail without preventing Lightspeed itself from loading.

A content-script change is not release-ready until it has been tested on the relevant real Lightspeed screens.

## Messaging / overlay contract

Shared custom messages/events should use the `HCT_` prefix.

Before adding a new message:
- search the consolidated source for existing message names;
- document sender, receiver, payload, and expected lifecycle;
- avoid reusing a message name with a different payload.

Embedded overlays/iframes must:
- validate message origin when receiving cross-origin messages;
- provide a user-visible close path;
- not trap the employee on a blocked screen;
- show friendly success/error states for staff;
- keep raw technical output behind a troubleshooting/details control once testing is complete.

## Manifest and permissions

New permissions and host permissions affect the entire extension.

Before adding one:
- confirm it is required;
- prefer the narrowest permission/host scope;
- document the reason in the release queue;
- inspect active branches/PRs for manifest conflicts;
- test that existing extension functions still load.

No feature branch should bump the extension version merely to mark local development progress. Version bumping belongs to the coordinated release process.

## Testing expectations

A feature may be implemented without being release-ready.

At minimum, extension work should record:
- source/static tests;
- feature-specific automated tests where available;
- browser acceptance status;
- real Lightspeed screen(s) tested;
- backend environment used;
- authorization behavior;
- write/read-only status;
- known unverified behavior.

Shared-file changes should also test unaffected neighboring features where practical.

## Development handoff

When a development chat creates or changes extension work, it must:

1. Update `CHROME_EXTENSION_RELEASE_QUEUE.md` when permissions allow, otherwise provide a manager-ready queue entry.
2. Record affected shared files.
3. Record active branch/PR/commit.
4. Note dependencies or conflicts with other extension work.
5. Note tests performed and tests still required.
6. Do not package, version, publish, or deploy the extension unless the full release gate is being performed.

## Release gate

Before preparing any extension release:

1. Read this document.
2. Read and reconcile `CHROME_EXTENSION_RELEASE_QUEUE.md`.
3. Inspect `integration/hobby-corner-consolidation`.
4. Inspect active extension-related branches and PRs.
5. Reconcile every shared-file conflict.
6. Include every compatible READY item.
7. Explicitly defer/block every item that will not ship.
8. Run coordinated regression/browser tests.
9. Only then bump the extension version and package/publish.
10. Update the release queue after the release with version, consolidated commit, test result, and release date.

No Chrome extension release is complete until both the integration contract and release queue have been reconciled.

## Current coordination hotspots

As of 2026-10-28, active work that can overlap shared extension surfaces includes:
- Purchase Order Companion
- Product Scanner
- Consignment Manager launcher
- Shared Addon UI / UX
- Split / Recall and core toolkit navigation
- Timeclock-backed employee authorization
- Chrome Web Store / packaging work

These areas must coordinate rather than independently replacing popup, content-script, manifest, navigation, shared styling, or authorization behavior.


## Central Git handoff

Extension development conversations must also publish their latest manager handoff to the appropriate stable file under:

`Tawgod/Hobby-Corner:main/handoffs/`

Use `handoffs/README.md` and `handoffs/TEMPLATE.md`. This does not replace the release queue: extension work must update both its handoff file and `CHROME_EXTENSION_RELEASE_QUEUE.md` when applicable.

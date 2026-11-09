# Cross-Project Integration — Current Handoff

**Last verified:** 2026-11-09  
**Status:** In Development / Blocked for cross-system rollout

## Source
- Project contract: `Tawgod/Hobby-Corner:main/HOBBY_CORNER_INTEGRATION_CONTRACT.md`
- Canonical production Lightspeed base: `Tawgod/Lightspeed:integration/hobby-corner-consolidation`
- Shared services Phase 1/2: draft PRs #32 and #33 (stacked)
- Employee Administration: draft PR #34, `feature/employee-admin-security-foundation-20261106`
- Web navigation: `feature/unified-hierarchical-navigation-20261109` (13 ahead / 0 behind consolidated when checked)
- Navigation integration issue: [#36](https://github.com/Tawgod/Lightspeed/issues/36)
- Chrome release gate: `CHROME_EXTENSION_RELEASE_QUEUE.md` and `CHROME_EXTENSION_INTEGRATION.md`
- Owner-visible runtime: Railway projects `Hobby Corner` production and `Hobby Corner Integration Test` test

## Implemented
- Inspected shared source, cross-feature PR/branch inventory and production/test Railway services. Documented source-of-truth ordering and shared identity, exact permission and hierarchy contracts.
- Read-only Admin integration inventory candidate in PR #34: `services/security/adminIntegrationCatalog.js`, `GET /api/integrations` in `routes/employeeAdmin.js`. Only independently verified admin users may read it. Entries identify source owners, intended nesting and operation IDs and are marked **permissionEnforcement: not-integrated**, **settingsAdapter: not-connected**. This does not activate any tool.
- Source-owned integration and navigation metadata tests: `tests/employee-admin-integrations.test.mjs`, added to Shared Lightspeed foundation workflow.
- Current navigation branch mismatch recorded and tracked in GitHub issue #36 rather than editing another development conversation's shared navigation files or creating a second navigation registry.

## Tested
- **Previous admin foundation** CI passed at functional source `81a78d933711836b395c0d50e2dabcb118165ee0`: shared foundation `42669190828`, Scanner `42669190918`.
- **New integration candidate test status: NOT VERIFIED.** The new workflows `42672182306` (Shared Lightspeed) and `42672182349` (Scanner) reported failure, but the connector returned zero jobs and no failure log/step details. Do not mark this integration candidate tested or deploy it until the workflow problem is diagnosed and the tests pass.
- Real browser: previous isolated admin staging synthetic Owner Google Authenticator login and brief tab-switch UX accepted; not representative real employee or delegated manager acceptance.
- No production feature or cross-system CI acceptance claimed.

## Deployed
- Production Railway project `Hobby Corner`: `store-map`, `lightspeed-api`, `special-orders-test`, `timeclock`, `Hobby-Corner-Discord-Bot`, `migration-test-bsi117`, `Hobby-Corner-Rewards`, `Postgres` all **online/SUCCESS**, 0 active warnings/criticals at check.
- Isolated `Hobby Corner Integration Test`: `staff-security-staging`, `consignment-beta`, `Postgres` all online/SUCCESS. Admin staging service still previous deployment `41a3ee7d-6fb9-4ac1-9f5f-a27120f95256` from `21a44f4f06ebaacec3d005344faa89f8907feb46`.
- **This integration batch was not deployed anywhere.** No production employee identity, PIN, Lightspeed data, tool grants or Chrome extension changed.

## Shared dependencies
- Canonical Timeclock employee roster and non-mutating read API; shared signed session + bound passkey/TOTP.
- Shared Lightspeed gateway Phase 1/2, audited exact operations, employee active-state and store-device trust.
- Navigation branch must align owner-approved Special Orders parent, nested Purchasing, Preorder Campaigns > GW, Store Tools and conditional Admin link.
- Every candidate tool must define owner, permission IDs, actual availability, write audit, API base, and regression tests before enabling its integration.
- Chrome extension popup/manifest/content release is separate and still blocked by its coordinated queue.

## Shared files / integration surfaces affected
- `Tawgod/Lightspeed` draft PR #34: `services/security/adminIntegrationCatalog.js`, `routes/employeeAdmin.js`, `tests/employee-admin-integrations.test.mjs`, `.github/workflows/shared-lightspeed-foundation.yml`.
- No shared extension files edited. No web navigation source edited.
- `Tawgod/Hobby-Corner:main/HOBBY_CORNER_INTEGRATION_CONTRACT.md`; this handoff and the master project index updated.

## Remaining blockers
- Integration workflows failed without accessible job details. Must independently diagnose/rerun before any merge or staging promotion.
- Real Owner commissioning and delegated staff authorization unavailable. Do not adopt synthetic Owner 901 as production identity.
- Non-mutating Timeclock directory endpoint and onboarding provisioning unmounted. Tool-permission grants candidate not enforced on live Scanner/PO/etc.
- Web nav branch #36 needs reconciliation and tests; current separate Purchasing and sibling GW hierarchy contradict owner decisions.
- Extension queue items remain unshipped; no package or version bump.
- Configuration settings registry is metadata only; actual adapters and deployment-state synchronization unimplemented.

## Decisions needed
- No immediate decisions to continue non-destructive development.
- Later: explicit authorization for production migrations, Owner enrollment/identity proof, tool-by-tool permission switch, Chrome release and session policy defaults.

## Recommended next action
1. Investigate integration CI failures/no-jobs before promoting the new metadata endpoint.
2. Align web navigation on existing branch per issue #36, keeping admin link conditional on trusted backend grants.
3. Stage the non-mutating Timeclock directory and Admin grant adapters in an isolated setup with no real employee data.
4. Integrate exact tool operations per service behind feature flags, with rollback and real employee browser testing.
5. Obtain explicit approval before production writes, merges or any extension release.

## Restrictions / safety
No production merge, Railway rollout, employee data change, Lightspeed write, or Chrome extension package/release occurred. Treat the new integration registry as development-only metadata, not an active entitlement system.

## Documentation
- `HOBBY_CORNER_INTEGRATION_CONTRACT.md`
- `HOBBY_CORNER_PROJECT.md`
- `handoffs/employee-admin-security.md`
- `CHROME_EXTENSION_RELEASE_QUEUE.md`
- `CHROME_EXTENSION_INTEGRATION.md`
- `Tawgod/Lightspeed:feature/employee-admin-security-foundation-20261106/docs/EMPLOYEE_ADMIN_FOUNDATION.md`

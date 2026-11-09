# Hobby Corner — Cross-Project Integration Contract

**Verified:** 2026-11-09  
**Status:** In Development / coordination (not a production release authorization)  
**Owner of this contract:** Hobby Corner Manager / Deployment Coordination  
**Runtime source of truth:** GitHub code + Railway LIVE deployment, not plans or screenshots

## Source branches and release order
- Consolidated production base: `Tawgod/Lightspeed:integration/hobby-corner-consolidation`.
- Shared Lightspeed backend/security: PR #32 (Phase 1); PR #33 (Phase 2 stacked onto #32). They are not a release just because tests pass.
- Employee Administration: draft PR #34 on `feature/employee-admin-security-foundation-20261106`, stacked on Phase 1. The isolated staging Admin is a **synthetic 901 read-only** deployment, not the new PR head and not actual Owner commissioning.
- Unified web navigation: `feature/unified-hierarchical-navigation-20261109` (13 commits ahead of consolidated at verification); **not automatically part of PR #34**.
- Chrome extension candidates and releases remain governed by `CHROME_EXTENSION_RELEASE_QUEUE.md` and `CHROME_EXTENSION_INTEGRATION.md`. No version/package/manifest/popup changes are authorized by this file.

## Shared employee identity and authorization
1. Timeclock is the canonical live employee identity and active-status source. Do not create per-tool employee databases or infer identity from a browser-supplied employee ID, IP, display name, Owner title or presence on a verified computer.
2. The shared signed employee session is the common authenticated principal. A backend must independently verify it and fail closed. Each tool enforces the **exact operation grant**, including employee active status, and remains responsible for additional Lightspeed-side safety checks.
3. Admin admission always requires an active bound employee session, independent recent enrolled passkey or Authenticator proof, and the exact `admin.read` grant. Sensitive changes require a fresh strong reauthentication and an auditable operation. No employee without explicit grant sees the Admin route as a navigational option; hiding it alone is not security.
4. Owner must be commissioned by separately verified current Timeclock identity and dedicated passkey verification. The staging synthetic Owner 901 **is not** the real production Owner.
5. Delegated managers may be granted `employees.onboard`, specific approved tool settings and scoped employee-tool grants without `employees.directory.read`, `employees.private.read`, Timeclock history, PIN reset, admin delegation, audits or security access.
6. The signed-session-bound `canUseEmployeeTool({context,toolOperation})` candidate on PR #34 is not yet wired to Scanner/other live endpoints; do not silently switch production tools until an end-to-end tested implementation and rollback exist.
7. User-authorized Chrome extension changes require source + queue reconciliation before packaging. The extension is never an independent authorization source.

## Navigation contract (requested by Owner)
- Main **Special Orders** dashboard is the single parent for fulfillment/orders; do **not** create a separate generic `Orders & Fulfillment` page.
- **Purchasing/Ordering** is nested under Special Orders, not a separate top-level group.
- **Preorder Campaigns** is nested under Special Orders and **GW Preorders** is nested under Preorder Campaigns. GW orders remain preorders.
- The other utilities belong under **Store Tools**. Each page links to the shared navigation, not a feature-private launcher. Links must be verified; beta/staging links visibly identified.
- **Employee Administration** is visible only when the signed-in employee has independent backend-confirmed `admin.read` and can pass the admin factor gate. Never assume a privileged navigation item is the same as permission to use the destination.
- Design/implementation ownership of shared web nav stays with `feature/unified-hierarchical-navigation-20261109`. Do not make an independent competing nav system in the Admin branch. Extension popup navigation stays in the coordinated Chrome queue.
- **Resolved in development source 2026-11-09:** `feature/unified-hierarchical-navigation-20261109` now implements this exact nesting. Admin link is conditional on a fresh same-origin backend `GET /api/admin/navigation-access` result with authenticated `admin.read`; the backend resolver is **not yet connected**, so the link intentionally remains hidden. No deployment implied.

## System ownership and onboarding
| System | Canonical owner | Shared integration | Current gate |
| --- | --- | --- | --- |
| Employee / PIN / clock | Timeclock | Signed staff session, verified active status | Production no-sync roster route not deployed; browser access must be scope-filtered |
| Shared Lightspeed gateway | lightspeed-api | Audited exact read/write operation and idempotency | Phase 1 / Phase 2 source consolidation and deployment review |
| Special Orders / Purchasing / Preorders / GW | Special Orders | Shared account, nested navigation, exact tool grants | Source/permissions and navigation reconciliation |
| Product Manager / Scanner | Lightspeed shared gateway | Product identity, read/draft/create scopes | Real tool enforcement + Chrome release queue |
| PO Companion | Lightspeed + purchasing | Safe PO read/draft/create; no receipt/stock mutation from approval | Shared navigation and extension source conflicts |
| Consignment | Consignment beta | Staff verified session and read/manage scopes | Beta status, never silently promote to production |
| Timeclock UI | Timeclock | Self-clock permission must remain usable | Legacy employee-route and permission compatibility |
| Employee Administration | Shared security | Independent factor, delegated grants, audited settings registry | Real Owner commissioning, Timeclock adapter, migrations, browser acceptance |
| Chrome extension | Consolidated extension / release queue | Canonical destinations, verified identities and API calls | Reconcile all queued/ready/blocked items before any package |

## Integration order, with independent verification per gate
1. **Contract/CI:** inventory the current branches, PRs, Railway services and their deployed SHAs. Publish one capability list and ownership map; prevent a candidate or beta status from appearing deployed. (Initial read-only contract added to Admin draft PR #34; no actual tool enforcement change.)
2. **Shared auth:** consolidate Phase 1/2 and Admin dependencies in an integration candidate without replacing current production Timeclock or Scanner routes. Test unauthenticated, revoked employee, expired sessions, factor/session binding and privileged operation scopes. No implicit Owner/bootstrap.
3. **Staging-only admin DB:** use isolated disposable schemas and an explicitly verified synthetic role/grant fixture; test onboarding requests/Owner review, delegation, revocation and audit. No real employee records in synthetic staging.
4. **Timeclock read:** release a reviewed *non-mutating* roster endpoint before connecting admin directory. The existing GET employee endpoint that triggers Lightspeed sync is not an acceptable admin read path.
5. **Shared web navigation:** land source alignment and navigate between Special Orders dashboard, nested Purchasing/Preorders/GW, Store Tools and permission-conditional Admin link. Avoid another navigation registry.
6. **Tools:** integrate permission checks one tool at a time behind flags, with actual staff-browser tests and a rollback path. Preserve existing operational access; verify no unintended Lightspeed writes.
7. **Live Owner/employee lifecycle:** independently commission real Owner; enforce PIN/reset privileges, manager onboarding and private record isolation; roll out only after explicit production approval.
8. **Chrome extension:** reconcile release queue, active PRs, authoritative consolidated source, tested compatible items, documented deferrals, then separately authorize packaging and release.

## Verification rules
- Report **Implemented**, **Tested** and **Deployed** independently for every tool and feature.
- Do not interpret an API metadata registry as applied configuration or permission enforcement.
- CI success validates tests on a particular SHA only. Railway deployment SHA and health independently establish live state.
- No production writes, merges or Chrome extension release without explicit approval.
- Update `handoffs/cross-project-integration.md` and relevant feature-specific handoffs on significant changes.

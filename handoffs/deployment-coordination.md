# Deployment and Release Coordination — Current Handoff

**Last verified:** 2026-10-29  
**Status:** Maintenance / Testing — production baseline healthy; pending feature releases gated.

## Source
- Repository: `Tawgod/Lightspeed`; authoritative branch `integration/hobby-corner-consolidation`, verified head `f50c3309824986633c3ba37a95e6eb43aae15a3c` (manager registry and Railway commit evidence).
- Coordination repository: `Tawgod/Hobby-Corner:main`; stable handoff `handoffs/deployment-coordination.md`.
- Merged: PR #27 (shared foundation; squash `cab74b667999a1f607dd82c4c51c298fd0e5d25a`), PR #24 (core navigation; squash `d40c1890a250d1d68348fff1377e08c5e190f24e`). A no-source-change push `61b344a60643409df5f4dfeab1273203c8d1d937` retriggered Railway after automatic deployment did not show; later integrations advanced head to `f50c330`. Do not mistake older deployment snapshots for current state.
- Current unmerged candidates checked: #22 `f9e8f0a`, #26 `0b3e6f1`, #28 `e8938de`, #29 `a000c08`, #30 `647a8f6`, #31 `a4ef547`, #32 `7c20b3d` (ready for review), #33 `bbfe24f` (draft stacked on #32).
- Superseded: PRs #16/#21/#23 by #27/#24; #19 by #26; #18 by #28; #20 by #29; #11/#25 by #30; #13 by #31. Some predecessor PRs remain open: do not merge or close solely for cleanup. Old extension beta `release/scanner-v0.3.25-beta-20261027` is not a verified production Chrome release.

## Implemented
- Coordinated GitHub PR/release audit, explicit safe merge sequencing and production deployment authorizations, shared extension integration/queue policy.
- PR #27's unique shared exact-text / sanitized-rich clipboard helper and regression tests merged; PR #24's Consignment-inspired original-logo navy navigation across Special Orders, Ordering, Preorders and GW Preorders, with responsive More menu and Beta/Test label, merged while retaining current Timeclock-backed PIN/header sessions. Legacy workbook importer relocated to lower Special Orders page.
- PR #24 manually accepted in store browser before merge: valid/invalid PIN, session restoration, sign-out, navigation and native zoom per PR record. Original PR #21/#23 functionality selectively preserved; no separate competing nav.
- Recovery of Railway deployment triggers via empty-tree Git commit `61b344a` after PR #27 had deployed but PR #24 was absent from Railway. The GitHub push correctly started three new builds; later successful rollouts verified.
- Shared Lightspeed architecture Phase 1 PR #32 and stacked Phase 2 PR #33 exist in development only (no deployed shared consumer conversion). Employee identity remains Timeclock-authoritative.

## Tested
- Prior PR #27 shared UI CI passed and clipboard Git blob matched PR #26's extension copy (`248671105dd11dd9403fd10226567ed55a8dbe8a`).
- PR #24 final-head CI passed: core navigation, Scanner regression and shared UI; browser smoke/auth tests and owner-reported real Chrome PIN, session and zoom acceptance. Browser acceptance is PR-specific, not blanket approval for later extension changes.
- Current Railway live environment read on 2026-10-29: seven services ONLINE with SUCCESS latest deployments, no active critical/warning notifications or staged deployment work. This verifies Railway deployment status, not end-to-end real employee workflows.
- PR #32 CI `40911078591` passed; PR #33 CI `40920253500` passed per latest manager/shared-services records; no live vendor/tenant consumer acceptance.
- No fresh physical Avery print or real loaded-Chrome extension acceptance performed in this handoff audit.

## Deployed
- Railway production environment `c562fbb2-8431-4beb-834d-6938b3a2ad10`, project `f7e91de7-43f6-472e-b4ca-46b0623f8e0e`.
- `lightspeed-api` deployment `6d1d3cd4-dcd1-4827-b07a-8b36bf926df2`, `timeclock` `16f7d019-9267-4196-b85e-0d4c2b15f121`, `special-orders-test` `b327d98a-e178-495b-ad72-2936dccaee0a`: all SUCCESS, ONLINE, all at **`f50c3309824986633c3ba37a95e6eb43aae15a3c`**, created 2026-10-28 20:20 UTC. PR #24/#27 effects therefore incorporated into the deployed consolidated head; this is newer than the earlier `61b344a` success.
- Railway `Hobby-Corner-Discord-Bot`, `Hobby-Corner-Rewards`, `Postgres` and `migration-test-bsi117` latest deployments also SUCCESS/ONLINE; those services are not represented as redeployed by PR #24.
- Earlier PR #27 Special Orders rollout failed once but succeeded on replacement; earlier Railway deployment incident resolved. No pending deployment at this verification.
- PRs #22/#26/#28/#29/#30/#31/#32/#33 **not merged/deployed**; historical isolated Consignment beta is a different deployed branch and does not establish PR #30 promotion.
- No coordinated production Chrome extension package/version or Web Store release verified. The prior 0.3.25 unpacked scanner beta is not production publication.

## Shared dependencies
- `LIGHTSPEED_SHARED_SERVICES.md` and `SHARED_STAFF_AUTH_PERMISSIONS.md`: share one Lightspeed client/gateway and durable Postgres audit/idempotency, retain Timeclock PIN/session verification; authorize operations server-side. Phase 2 PR #33 stacks on Phase 1 PR #32, whose migrations require separate review/approval; employee-specific Product Manager profiles are keyed by verified employee ID, not a parallel auth system.
- Chrome extension: `CHROME_EXTENSION_INTEGRATION.md` and `CHROME_EXTENSION_RELEASE_QUEUE.md`; PR #26 owns popup/shared nav, PR #22 content script and PR #31 PO Companion manifest/popup components. Acceptance of all plus approved Consignment launcher decision must precede a single current-base release candidate; do not invent beta routes.
- Product Scanner matching, Special Orders / Ordering / Preorders, PO Companion authenticated PO read, Consignment credit safety, Rewards/Discord customer notifications, and durable PostgreSQL records all require feature-local acceptance and cross-API safeguards.
- Invoice Reconciliation: **Planned only** inside existing Product Manager, Scanner, Ordering/PO Companion and Special Orders. Email/PDF ingestion, verified supplier/sender aliases and tracking, staged >=90% product matches with review, secondary supplier association, employee-independent invoice dropdown, and approved create of NEW **OPEN** PO or update existing PO. **Never receive products, mark a PO received, or change stock on hand**. Show verified tracking as informational **On the way**, not customer availability. Depend on shared services #32/#33 and idempotent, permission-controlled PO writes.

## Shared files / integration surfaces affected
- Core pages: `special-orders.html`, `ordering.html`, `preorders.html`, `gw-preorders.html`, `shared-ui/core-ops-compat.css`, wordmark asset, selected server routing and tests.
- Common extension conflict surfaces: `extension/manifest.json`, `extension/popup.html`, `extension/popup.js`, `extension/content.js`, `extension/shared-ui/*`; employee session/permissions, `server.js`, shared Lightspeed service modules and Postgres migration assets.
- Deployment coordination does not independently own feature-specific business implementations.

## Remaining blockers
- Real loaded-extension Chrome employee/Scanner/Timeclock/Split/PO acceptance (#26/#22/#31); joint popup/manifest/authorization validation; Consignment launcher decision; full READY/QUEUED/BLOCKED Chrome queue reconciliation.
- PO Companion live read/auth; Product Manager authenticated/live-read and saved profiles; Avery physical print; Consignment isolated DB, staff auth, read-only matching, sale/return and exactly-once credit; migration/production Postgres backup and recovery validation.
- #32/#33 production schema migrations, tenant API parity and conversion of first read-only consumer remain unapproved/unverified. No standalone invoice feature PR exists.
- Recheck fresh CI/branch comparisons prior to each future merge; historical status alone is insufficient.

## Decisions needed
- Separate approval for every production-connected integration merge (may auto-deploy Railway), test/production data migration, and extension version/package/publication.
- Extension Consignment launcher target and all release acceptance; timing of shared-gateway consumer migration; future Invoice Reconciliation suppliers/mailbox, test tenant and approved PO writes.

## Recommended next action
1. Confirm the stable Railway baseline and protect it; no deployment required for handoff.
2. Complete PR #32 foundation and stacked PR #33 gateway read-only review, schema backup/testing before any integration.
3. Carry out per-tool real Chrome/print/PO/Consignment acceptance and recheck current PR bases.
4. Only after #26/#22/#31 acceptance and Consignment launcher decision, prepare one extension release candidate, fully reconcile queue, request release authorization.
5. Keep invoice reconciliation specified but unimplemented until shared service dependency and write gates are approved.

## Restrictions / safety
- No merge, deploy, production DB or Lightspeed data write, employee/customer change, secret change, volume deletion, or Chrome version/package/publish performed in this handoff audit.
- Railway SUCCESS is not proof of feature/browser acceptance; never silently equate git merge with live deployment.
- No inventory receive or stock movement from invoice reconciliation. Preserve API contracts, idempotency and staff auth; do not deploy unverified changes.

## Documentation
- `HOBBY_CORNER_PROJECT.md`, `HOBBY_CORNER_CHAT_TRANSITION.md`, `handoffs/README.md`, `handoffs/TEMPLATE.md`, `ROADMAP.md`, `LIGHTSPEED_SHARED_SERVICES.md`, `SHARED_STAFF_AUTH_PERMISSIONS.md`, `FEATURE_INVOICE_RECONCILIATION.md`, `CHROME_EXTENSION_INTEGRATION.md`, `CHROME_EXTENSION_RELEASE_QUEUE.md`, `BRANCH_AND_DEPLOYMENT_POLICY.md`, and feature-specific stable handoffs.

## Continuing conversation and RMS integration boundary — owner-confirmed 2026-10-29

- This **Deployment Coordination** chat remains active with Hobby Corner Manager, Shared UI / UX Coordination, Shared Lightspeed Services and the separately active RMS Item Migration chat. All other old tool chats were archived by owner report; their handoffs/branches/PRs remain in scope for release gating.
- Keep RMS Item Migration **independent** from the normal production feature release train; a tool may adapt verified product identity, mapping or collision-check code only with source/consumer review, tests and owner coordination. Sharing a helper does **not** authorize migration-branch merges or production bulk imports.
- Preserve environment boundaries, rollback and least-privilege credentials. No RMS on-hand stock import, migration-only writer adoption, test data promotion or other destructive action without explicit approval.
- Continue honoring `CHROME_EXTENSION_RELEASE_QUEUE.md`, shared feature readiness and separate approvals for production-connected merges, Railway deploys and Chrome packaging.


## Shared Lightspeed foundation hardening milestone — 2026-10-29

- PR #32 candidate head `0082eacc5acde5bde52bdc5e70924f3edaf6d778`, final-head CI `40955180232` **PASS**. PR #33 stacked candidate head `b2d97d327f92ec4f42bb3f531d61654c31a8b626`, final-head CI `40955195986` **PASS**.
- Hardened default-read-only transport (mutation verbs require trusted opt-in), HTTP write uncertainty, bounded JSON/UTF-8 response handling and stricter API targets); JSON fingerprint/replay safety and mutable payload race prevention; DB-only read-only pending/unknown-key inspection; PostgreSQL audit immutability and post-write audit-failure regression tests.
- Both PRs remain **unmerged, unmounted, no production DB migration and no real tenant verification**. Neither is authorization to enable API writes. PR #33 remains stacked on the former Phase 1 base and requires explicit ancestry reconciliation after PR #32 approval.
- Release coordination: verify independent PostgreSQL backup/restore decision, schema review, vendor/test-tenant read contracts, auth scopes, unknown-key manual reconciliation runbook and browser consumer acceptance; seek explicit approval before any production-connected merge or deployment.


## Staff security launch gate — 2026-10-30

- Review `STAFF_SECURITY_BASELINE.md` and `SHARED_STAFF_AUTH_PERMISSIONS.md` before any shared auth, public routing or extension release.
- Four-digit Timeclock PIN must not authorize internet-facing tools alone. Legacy Timeclock clock/status paths currently bypass the new signed staff session; an authenticated backend plus Chrome migration and real store acceptance are prerequisites.
- PR #32/PR #33 include an **unmounted** staff-access assurance policy candidate, automated security checks passing (`41091313029` / `41091370610`); neither branch is approved for production integration on this basis.
- Do not close the Timeclock legacy route until the replacement extension/UI and employee clocking have passed end-to-end tests. Also verify proxy IP handling, per-account/source throttles, true IdP/MFA/device proof, origin bypass, timeclock-offline behavior, employee offboarding/revocation and alerts.
- No Railway variables/edge policy/extension package/PINs/production authentication were changed in this audit. Production enforcement and release need explicit approval.


### Login security and Timeclock migration launch gate — 2026-10-30

- Staff security design: `STAFF_SECURITY_BASELINE.md`; PIN-only name/clocking route remains a priority risk and must be migrated together with Chrome content-script changes before claiming internet-safe tool authentication.
- Unmounted shared policy plus independent employee/source durable throttle candidate in PR #32 `59fe71f1` and stacked #33 `6519590b`; final-head PostgreSQL/Node CI runs `41093074109` and `41093089253` **PASS**.
- Never apply `db/hc_staff_auth_throttle.sql` to Railway without approved migration/backup. Verify public/raw Railway origin bypass, proxy IP trust, WAF/IdP MFA, registered device proof, lockout availability, Timeclock backend and extension compatibility before activation.
- No live access policy, employee PIN, Railway credential, Timeclock backend, extension ZIP or deployment changed.


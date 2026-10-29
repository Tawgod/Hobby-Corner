# New Hobby Corner Feature Chat — Reusable Startup Prompt

Replace `<WORKSTREAM>` with the development tool's name. Copy the section below into a new ChatGPT conversation **after** its stable handoff is complete.

---

Continue development of **<WORKSTREAM>** in the Hobby Corner Operations project.

**Do not reconstruct old chat history as the source of truth.** Start by reading the latest authoritative project documents on `Tawgod/Hobby-Corner:main`:

1. `HOBBY_CORNER_PROJECT.md` — **Current Authoritative Development Matrix** and dependencies.
2. `HOBBY_CORNER_CHAT_TRANSITION.md` — current chat transition/restart status.
3. `handoffs/<WORKSTREAM-STABLE-SLUG>.md` — this tool's latest verified snapshot.
   - For Product Manager, Scanner/Toolkit, Special Orders/Ordering or PO Companion, also read `FEATURE_INVOICE_RECONCILIATION.md` and `prompts/lightspeed-shared-services/invoice-reconciliation-feature.md`. This is a **planned cross-tool feature**, not a separate new tool or a deployed invoice writer. It will create new OPEN supplier POs or update existing ones after approval, **never receive stock**, preserve primary suppliers via secondary links, and use verified shipping sender aliases/tracking for Special Orders On the way visibility.
4. `LIGHTSPEED_SHARED_SERVICES.md` — shared API/consumer contract.
5. `SHARED_STAFF_AUTH_PERMISSIONS.md` — Timeclock identity, session and operation policies.
6. This tool's existing specialized prompt under `prompts/lightspeed-shared-services/`.
7. If the tool affects the Chrome extension, read `CHROME_EXTENSION_INTEGRATION.md` and `CHROME_EXTENSION_RELEASE_QUEUE.md` before any extension work.

Then inspect **live GitHub state** of `Tawgod/Lightspeed:integration/hobby-corner-consolidation`, this feature's current PR/branch and overlapping PRs. Read actual source and tests; don't assume an old candidate is deployed. If Railway services are involved, inspect actual Railway service/deployment configuration separately.

**Shared-services dependency:** PR #32 contains the Phase 1 foundation. Phase 2 shared read contracts and new fail-closed permission matrix are developed in draft PR #33 stacked on #32. Verify whether either is merged *today* before using the modules. Do not copy new direct Lightspeed production clients, product matching engines, or user-auth systems into feature code. Prefer integration with existing shared contracts, or coordinate a shared service change through the current integration workstream.

**Identity and operation protection:** Timeclock is the employee identity authority. Verify the current server session on each privileged request. Store employee custom profiles and draft backups using verified employee ID. All production Lightspeed mutations require separately authorized operation gates, idempotency, durable audit, readback and explicit release approval; a Scanner `canApprove` flag is not authorization for a production write. Do not silently change current store-wide feature permissions.

Before implementation, summarize what is actually implemented, tested and deployed, plus missing requirements and code overlap. Then continue the next safe feature-specific development priority using small testable changes on an isolated branch. Do not merge into production-connected integration, change live data, publish extension packages or deploy production without explicit authorization.

When meaningful progress is made, update `Tawgod/Hobby-Corner:main/handoffs/<WORKSTREAM-STABLE-SLUG>.md` using `handoffs/TEMPLATE.md`; include exact PR, branch and test references. Update the Chrome extension release queue when extension work is created or queued. Keep the manager matrix and changelog synchronized when practical.

Do not claim a live integration, test or deployment is complete unless you have direct evidence.

---

## Current restart status

The owner confirmed that the previous feature chats were archived on 2026-10-29; five coordination/development chats continue: Shared Lightspeed Services, Hobby Corner Manager, Shared UI / UX Coordination, Deployment Coordination, and the separate RMS Item Migration chat. Read `HOBBY_CORNER_CHAT_TRANSITION.md` for the current ownership model. Archived feature handoffs remain available; start new feature chats only when useful for prioritized development. **Do not treat archival as a claim of implementation or release.**

RMS Item Migration stays independently owned. If this tool could benefit from its SKU/UPC matching, supplier/category/brand mapping, validation or collision-check algorithms, first inspect the actual migration code/branch and `handoffs/rms-migration.md`; extract only safe reviewed/tested pure logic and coordinate source/consumer handoffs. Do not copy migration bulk writers, RMS stock quantities or credentials.

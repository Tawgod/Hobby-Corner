# Hobby Corner Development Handoffs

This directory is the central Git-backed handoff location for Hobby Corner development conversations.

## Purpose

Feature/development chats should write their current manager handoff directly into this directory instead of requiring the owner to copy and paste status back into the Hobby Corner Manager conversation.

Git history provides the historical record, so each system handoff file should normally contain the **latest authoritative snapshot**, not an ever-growing chat transcript.

## File naming

Use one stable lowercase kebab-case file per workstream, for example:

- `core-operations.md`
- `product-scanner.md`
- `timeclock-split-recall.md`
- `po-companion.md`
- `consignment.md`
- `product-manager.md`
- `avery-labels.md`
- `shared-ui.md`
- `deployment-coordination.md`
- `railway-security.md`

Create a new file only for a genuinely distinct workstream. Reuse the existing file for later updates.

## Required workflow

At the end of significant development, reconciliation, testing, deployment, or blocker discovery:

1. Read `Tawgod/Hobby-Corner:main/HOBBY_CORNER_PROJECT.md`.
2. Read any relevant shared coordination documents such as:
   - `CHROME_EXTENSION_INTEGRATION.md`
   - `CHROME_EXTENSION_RELEASE_QUEUE.md`
   - `SHARED_ADDON_UI_UX.md`
3. Update the appropriate file in this `handoffs/` directory on `main`.
4. Replace the previous snapshot with the current authoritative handoff rather than appending duplicate history.
5. Include exact repository, branch, PR, commit/deployment references when known.
6. Update the Chrome extension release queue as well when extension work is involved.
7. Do not claim a merge, deployment, test, or documentation update unless it actually occurred.

If GitHub write access is unavailable, return a complete manager-ready handoff in the chat and explicitly state that the Git handoff file could not be updated.

## Required handoff fields

Every handoff should include:

- System / feature
- Last verified date
- Status: Planned / In Development / Testing / Deployed / Blocked / Maintenance
- Repository
- Current authoritative branch
- Current PR(s)
- Superseded PR(s) / branches, if relevant
- Implemented
- Tested
- Deployed
- Shared dependencies
- Files/shared surfaces affected
- Remaining blockers
- Decisions needed
- Recommended next action
- Release/deployment restrictions
- Documentation references

Use `TEMPLATE.md` as the starting structure.

## Manager behavior

The Hobby Corner Manager conversation should read the relevant file(s) in this directory when reconciling project state. Significant verified changes should then be reflected in the Current Authoritative Development Matrix in `HOBBY_CORNER_PROJECT.md`.

The handoff files are coordination snapshots, not replacements for source code, PR descriptions, CI results, Railway state, or the master project registry.

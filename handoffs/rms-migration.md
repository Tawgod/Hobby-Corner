# RMS Migration / Legacy Importer — Current Handoff

**Last verified:** 2026-10-29  
**Status:** Testing / Maintenance; not a live general-purpose staff importer.

## Source
- Runtime/bridge repository: `Tawgod/Hobby-Corner-Discord-Bot:main@ce54862f67d678f8a1cb77302e520c59fb0c7118`.
- Active unmerged branches in Discord-Bot: `product-migration-colab@ee68894f5393f5a1a8537ac47b3e24f6dd182193`, `rms-history-read-bridge-20261026@065d8cd87c24efcf3e1085398afa26a454c00397`, `feature/rms-readonly-reporting@e5898f58d0ea22b385651676f3e4f31f447a798f`.
- Legacy Apps Script repo: `Tawgod/Lightspeed-Importer:main@190c7a7d2bf9ebb119e98c00d625b70a6fa3869a` and `ChatGPT@8c519084b10b14bef990384680db60438872c9d0`. Distinct branch histories; do not merge blindly.
- Private recovery/schema-only branch `backup/hobby-corner-postgres-source-schema-20261029` is **not** a dump of live records.

## Implemented
- Legacy RMS source import and product/category/supplier/customer mapping scripts exist; Rewards source has `rms_customer_staging`, `rms_transaction_staging`, identity bridge tables/job tracking.
- Separate migration/read bridge branches preserve staged reporting work but their latest feature tests and production use are not established by this handoff.
- Continued `LS: importer` Sheet remains a historical business workflow; migration code should reuse shared product identity/validation when feasible.

## Tested
- No fresh full-catalog rehearsal or physical inventory parity test this turn. Source branch heads and file presence verified.
- Migration bridge/reward runtime latest deployment SUCCESS from main; **that does not establish** migration branch deployment or completion.
- Known required checks: full-catalog collision preflight, category/supplier/brand review, leading zero retention, primary/secondary supplier fidelity, dry-run counts, no RMS on-hand stock import, rollback/reconciliation.

## Deployed
- Legacy import scripts are not a new Railway production application. Branches above are not verified deployed; main Discord/Rewards services deployed separately.
- Migration-specific Railway Bun test function exists; direct Lightspeed actions must be treated as sensitive until retired or tightly controlled.

## Shared dependencies
- `LIGHTSPEED_SHARED_SERVICES.md`, planned read-only Product and supplier contracts (PR #32/#33 unmerged), source-specific migration test approvals.
- Invoice Reconciliation must **not** use RMS historical invoice rows to trigger live PO writes. Future invoice sender alias matching must be verified against current supplier identities, not assumed from legacy labels.

## Shared files / integration surfaces affected
- `Tawgod/Lightspeed-Importer:*.gs`, Discord-Bot `migration/*` and `rms_bridge/*`, and shared supplier/product identity data. Any live importer branch needs its own handoff before cutover.

## Remaining blockers
- Final migration scope/collision review, larger controlled rehearsal, supplier/category mapping, data recovery and cutover audit, legacy credential removal.
- No validated independent PostgreSQL full data backup; source archive is only database DDL reference.

## Decisions needed
- Which importer functions remain operationally necessary after January 2027 cutover and which legacy credentials may be retired.

## Recommended next action
- Use read-only source counts and collision fixtures to decide branch consolidation; preserve both legacy histories until full migration rehearsal and reconciliation are signed off.

## Restrictions / safety
- No bulk Lightspeed writes, RMS stock quantity imports, branch deletion, secret exposure or production rollout without explicit authorization.

## Documentation
- `ROADMAP.md`, `RAILWAY_VARIABLE_SECURITY_AUDIT.md`, `BRANCH_AND_DEPLOYMENT_POLICY.md`, `FEATURE_INVOICE_RECONCILIATION.md`.

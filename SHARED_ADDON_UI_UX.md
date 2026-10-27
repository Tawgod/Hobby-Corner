# Hobby Corner Shared Addon UI / UX Standard

Status: **In Development — specification only**  
Established: 2026-10-27  
Owner: Shared Addon UI / UX Coordination  
Source of truth for implementation: `Tawgod/Lightspeed:integration/hobby-corner-consolidation`  
Release authority: `CHROME_EXTENSION_RELEASE_QUEUE.md`

## Scope and boundaries
Applies to Special Orders, Ordering, Preorders, Timeclock, Product Scanner, PO Companion, Consignment, Product Manager, Split/Recall, and extension popup/embedded views. This workstream owns shared interface patterns, wording, and usability, **not** order, product, employee, purchasing or payment business logic. Never use a visual change to bypass role checks, duplicate detection, review gates, or Lightspeed write restrictions. Existing behavior remains authoritative until each screen is tested.

## Source inspection and current limitations (2026-10-27)
Inspected `extension/popup.html`, `extension/popup.css`, `extension/popup.js`, `extension/product-scanner/review.html`, `review.css` and `review.js` on the consolidated branch, plus the project registry and extension release queue. The popup uses Arial and predominantly neutral/dark buttons with inline teal link styling; scanner uses system UI, teal action buttons, separate layout rules, and mixed inline status colors. Scanner already implements PIN sign-in, read-only restrictions, validation status, and live-region semantics worth preserving. Other named app interfaces have not yet been inspected at source level; their proposed adoption remains **unverified**. The extension queue lists deferred PO Companion, consignment launcher, scanner permission work, and an unpacked scanner test build. No extension packaging or release is authorized by this document.

## Design decisions — baseline v0.1 (proposed for incremental adoption)
1. **Foundations:** system-ui font stack; base 14px body, 12px metadata, 16–18px subsection titles, 20–24px page title. Respect browser text scaling; line-height 1.4–1.6. Spacing scale 4/8/12/16/24/32px. Border radius 6px controls, 10px panels. Prefer CSS custom properties instead of inline styles.
2. **Colors & contrast:** shared semantic tokens `--hc-bg`, `--hc-surface`, `--hc-text`, `--hc-muted`, `--hc-border`, `--hc-primary`, `--hc-primary-text`, `--hc-danger`, `--hc-warning`, `--hc-success`, `--hc-focus`. Initial light palette: background #f3f5f8, surface #fff, text #182230, muted #526273, border #c7d0d8, primary #116b69, primary text #fff. Verify WCAG contrast in tested contexts. Semantic meaning must also appear as text/icon, never color alone; define dark-mode values before enabling dark mode.
3. **Layout:** compact popup 390px with one task per section; desktop app max readable content width, stacked panels below 900px; embedded Lightspeed controls scoped under an extension root to avoid host CSS collisions. Side panels must not obscure Lightspeed's critical native actions and must have dismiss and return-focus behaviors.
4. **Buttons:** one primary action per decision region; secondary neutral, tertiary text-link, destructive red with explicit confirmation. Loading = disabled + in-progress wording, not silent button disappearance. Distinguish `Preview`, `Stage`, `Request approval`, `Approve`, `Apply to Lightspeed`. Never label a preview or staged operation as completed.
5. **Forms:** persistent labels, optional/required qualifiers, format hints before submission, field-level errors near fields, preserved draft inputs on failed checks. Validate identifiers such as SKU/UPC before any mutable action. Currency shows units/precision. Enter submits only the intended form; scanner input may auto-search but must not auto-write.
6. **Tables:** sticky headers where necessary; readable numeric alignment, explicit units, row-level actions, sorting controls with direction and fallback, searchable/filterable views for larger lists. Preserve selection/filter state after review; never conflate selected and approved.
7. **Status and warnings:** consistent `Loading`, `No results`, `Saved draft`, `Needs review`, `Ready for approval`, `Approved`, `Failed` states. Errors say what failed, what was and was not saved, and a safe next action. Use `role=status` for ordinary changes and `role=alert` sparingly for blocking errors; never rely on emoji or color alone.
8. **Dialogs and approvals:** show exact item, operation, changed fields and count before approval; differentiate employee staging from authorized approval and actual Lightspeed write. Confirm destructive/irreversible work explicitly. Avoid accidental double submissions using busy states and idempotency protections owned by backend workstreams. An unverified permission state stays blocked.
9. **Navigation:** shared tool names `Special Orders`, `Ordering`, `Preorders`, `Timeclock`, `Product Scanner`, `PO Companion`, `Consignment`, `Product Manager`, `Split / Recall`. Use contextual links and a clear way back; never deep-link to a beta-only route as if production.
10. **Keyboard/scanner:** support tab order, visible focus, escape-to-dismiss, focus restoration, scan field activation, buffered scanner input where supported, feedback for invalid/duplicate scans, and safe handling of fast repeated scans. Do not trap focus except within open modal dialogs.
11. **Accessibility:** semantic HTML, programmatic labels, WCAG 2.2 AA as acceptance target, 44px minimum target size where practical, keyboard-only completion, error summaries, visible focus, sufficient contrast, and reduced-motion preferences.
12. **Reusable implementation:** add a namespaced shared tokens/base stylesheet and small reusable status, button, form-field, modal and table patterns **only after** dependency inventory; adopt screen-by-screen via additive CSS or small modules, not a framework rewrite. Avoid global selectors that can alter Lightspeed.

## Cross-workstream adoption register
| Interface | Audit | Adoption priority | Constraints |
| --- | --- | --- | --- |
| Chrome extension popup | Source inspected | High | Preserve existing launchers; queue any extension changes |
| Product Scanner | Source inspected | High | Preserve PIN access, matching, read-only product writes, staged preorder review |
| Split / Recall | Registry + popup integration reviewed; screen not inspected | High | Protect sale context and existing execution controls |
| Special Orders | Registry reviewed; screen not inspected | High | Preserve customer/product identity and status flows |
| Ordering | Not yet source-verified | Medium | Do not alter supplier or PO logic |
| Preorders | Scanner integration identified; main screens not inspected | Medium | Keep staging distinct from publishing/approval |
| Timeclock | Registry/scanner sign-in reviewed; screen not inspected | High | PIN privacy and role checks |
| Purchase Order Companion | Queue/spec reviewed; deferred, no current UI inspected | Medium | Supplier-side panel; no Lightspeed writes until approved |
| Consignment | Queue/spec reviewed; beta interface not inspected | Medium | Beta route and credit flow must stay gated |
| Product Manager | Requirements in project conversations; source not inspected | Medium | Approval gates for bulk product edits |

## First implementation sequence
- **Audit:** inventory actual HTML/CSS/JS/routes and capture representative screens for all ten areas; compare responsive, focus, permission, and empty/error states. Check branch/PR differences against consolidated source before editing.
- **Foundation:** build CSS tokens and a small component specimen/test page on a non-deployed feature branch; measure existing button, status, form, and panel regressions.
- **Pilot:** apply tokens to popup and Product Scanner separately with screenshot, keyboard, scanner, and authentication tests; no action-logic changes.
- **Expansion:** improve Split/Recall and Special Orders, then roll into Ordering/Preorders/Timeclock and emerging PO, Consignment, Product Manager screens as those features mature.
- **Release coordination:** queue any Chrome-extension file changes, reconcile all pending queue items and active branches/PRs before packaging; obtain explicit release authorization.

## Acceptance gates
Before marking each interface **Testing**: visual comparison at normal/zoomed widths; keyboard-only task; logical screen-reader status; permission denied/unverified; empty/loading/error states; duplicate rapid click/scan; draft preservation; zero unexpected Lightspeed writes. Only mark **Deployed** after Railway and/or extension version verification. Track each interface as Implemented / Tested / Deployed independently.

## Manager decisions and dependencies
- Proposed standard is documented; not yet applied to live screens.
- Choose pilot implementation branch after branch and PR reconciliation.
- Confirm whether shared assets should be imported across backend-served pages or published per application bundle, accounting for extension CSP and independent Railway deployments.
- Maintain screen-level review ownership in each feature workstream; UI coordination may propose interaction changes but cannot approve transactional or employee-permission changes.

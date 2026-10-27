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

## Visual proposal and project-wide design principles (2026-10-27)
Reference: Shared Addon UI / UX Design System visual proposal in the Shared Addon UI / UX Coordination conversation (2026-10-27). The visual is a concept, not an implemented UI, and sample customer/order/product details are illustrative only.

### Nonnegotiable design principles
- **Visual hierarchy:** Primary task/action appears first; readable titles, contrast, whitespace, and progressive disclosure.
- **Consistency:** Reuse common navigation, tokens, typography, button meaning, layout and state semantics across all tools.
- **Minimal density:** Prefer concise labels and one clear next action; move optional detail into tabs, drawers, dropdowns or secondary pages; do not conceal essential warnings or approval details.
- **Clarity and feedback:** State what an action will do, show in-progress status, and acknowledge success/failure; never imply a saved write happened when it did not.
- **Accessibility:** WCAG 2.2 AA target, verified contrast, meaningful alternate text, keyboard-only use, visible focus, and accessible modal/focus behavior.
- **Copy/paste fidelity:** Default to preserving exact source values and formatting, including line breaks, punctuation, leading-zero product IDs, and rich text when needed. Offer separate plain-text and formatted-copy options when supported; use Clipboard API MIME types text/plain and text/html thoughtfully, sanitize HTML and never silently rewrite SKU, UPC, price, description, or manual text. Provide paste previews and editable confirmations before committing external data.

### Visual proposal interpretation
The shared concept illustrates one navigation system, a spacious task dashboard, a record-detail view, reusable drawer, form controls, status treatments, modal confirmations, and loading/error/empty states. Treat palette and sample components as design direction, not as permissions, application routes or actual data. Before committing token values, check contrast and validate on browser popup, Lightspeed overlay and standalone apps. Existing proposed baseline teal palette remains in effect until explicit palette decision; the visual's blue palette is a candidate, not an automatic production change.

### Cross-team adoption contract
Each feature chat should consult this file before introducing new employee-facing UI. Identify and reuse its shared patterns where technically feasible, preserve business logic/permissions, explain any justified deviations, test keyboard and error behavior, and record implementation/test/deployed states separately. UI coordination owns style and interaction consistency; individual feature owners own action semantics and release validation.

## Beta visual direction approved — 2026-10-27

Decision from store owner: **Adopt the proposed blue/navy UI direction for beta**, reducing stark white and improving visual separation of adjacent windows and sections. User-supplied orange/blue Hobby Corner logos are approved design references for beta interfaces. This decision supersedes the earlier tentative teal-vs-blue palette question **for beta visual work only**; production rollout requires separately verified tests and release approval.

### Beta appearance specification
- Deep navy main header and sidebar, blue primary actions, orange brand accents (use orange sparingly for logo, highlights and suitable non-status embellishment; warnings must remain semantically distinct).
- Cool gray/slate page background (`#e5edf4` candidate), shaded cards/panels (`#f6f9fc` or pale gray-blue candidate), slightly darker section headers; narrow borders and subtle shadows separate cards. Avoid contiguous pure-white panels blending into one region.
- Consistent 12–16px inner spacing and 12–20px inter-panel gaps; visible grouping with clear headings. Keep large white text-entry regions where needed for readability.
- Distinguish **page background**, **workspace/card**, **nested group**, **selected tab** and **overlay/drawer** by elevation/shading rather than gratuitous saturated colors. Ensure dense grids and nested panels still read cleanly at zoomed widths.
- Preserve semantic badges with non-color text labels and WCAG 2.2 AA contrast targets. Focus rings must remain visible on dark and light surfaces. Never sacrifice contrast to add shading.
- The three supplied source designs comprise an orange circular icon and orange-circle/blue-wordmark full logos (including a BMP/JPEG duplicate). Prefer horizontal full logo in wide app header, orange symbol in compact popup/favicon-style spaces, and a restrained lockup in narrower sidebars. Preserve logo proportions and colors; do not stretch, redraw, add gradients or replace with generated approximations in production assets.
- UI concept from the October 27 beta preview is **illustrative only**: sample customer identities, data, quantities, statuses, system health and version strings are placeholders, not production facts. Do not hardcode them.
- Copy/paste fidelity rules from this file continue unchanged. In particular preserve source formatting and IDs during paste; keep rich-text editing scoped to safe, sanitized display fields.
- **Rollout:** Beta visual components and tokens may be developed in an isolated branch/test page. The existing extension release queue still governs Chrome code and releases. No production system, extension release, or Lightspeed business function is approved for modification by this decision.

### Beta validation checklist
1. Side-by-side panel/card contrast at 100%, 125% and 200% browser zoom.
2. Full logo, icon-only logo, long navigation titles and narrow viewport layout.
3. Dark sidebar/header focus states and screen-reader text.
4. Existing light/dark Lightspeed host pages: extension CSS must not leak or collide.
5. Error, success, pending and destructive patterns readable without color.
6. Paste rich-text/plain-text, multiline descriptions, leading-zero UPC/SKU strings, and clipboard copy output.

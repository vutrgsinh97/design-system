# TASK-028 — Final desktop integration and fixed archive

- Status: completed on 2026-10-09.
- Owner: root.

## Integration and review

- Reviewed TASK-010–027 reports, public desktop/root exports, and the mobile entry. Integrated shared primitives and desktop-only Tabs, Tooltip, List, Menu, Table, Tree, Combobox, SplitPane, Toast, Progress, and EmptyState. Existing root/desktop imports remain available; mobile does not export these desktop-only components.
- Added public per-component subpaths and CSS-preserving ESM output. Added Radix Tabs, Tooltip, DropdownMenu, and Toast dependencies alongside the existing Dialog dependency; React and React DOM remain peers.
- Added the fictional Developer workspace route at `/developer-workspace`, plus Combobox and SplitPane examples in the Next playground. Browser review covered Tree selection, Menu, Toast, EmptyState, Dialog Escape and focus return to Settings, tab content visibility, Combobox keyboard selection, and SplitPane keyboard resize. The showcase uses static data only.
- Corrected nested TreeItem click propagation, Combobox error description visibility, DialogTrigger focus return, and hidden TabsContent layout before final validation.

## Verification

- Final `pnpm check` passed: package build, all typechecks, 15 test files / 59 behavior tests, icon bundle isolation, and direct-import JS/CSS isolation for desktop components. Tests cover controlled state, keyboard/focus, Dialog, Menu, Combobox, Tree, SplitPane limits and listener cleanup.
- Production builds passed after integration: `pnpm --filter next-example build`, `pnpm --filter next-mobile-example build`, and `pnpm --filter vite-example build`. The mobile build is a compatibility regression check only.
- Browser interaction review passed for the desktop playground. No full screen-reader or assistive-technology audit was conducted.
- `git diff --check` passed. No consumer app, registry, Git remote, or external service was changed. The playground server was stopped; nothing listens on port 3004.

## Bundle impact

The measurements are unminified isolated fixture output, including CSS imported by each fixture; they are comparison signals, not production download sizes. The Button fixture is 1,223 B JS / 9,297 B CSS versus baseline 1,223 B JS / 7,971 B CSS before the new theme tokens. It excludes Dialog, Menu, Tree, and unrelated component CSS. FormField is 2,904 B JS / 10,089 B CSS versus baseline 2,819 B / 8,007 B. New isolated fixtures: Dialog 91,831 B JS / 3,374 B CSS; Tabs 63,062 / 3,993; Tooltip 134,559 / 3,243; Menu 212,931 / 4,542; Table 2,137 / 4,030; List 5,623 / 4,676; Tree 7,591 / 5,127; Combobox 7,450 / 4,979; SplitPane 7,323 / 4,032; Toast 88,772 / 4,970; Progress 2,011 / 3,817; EmptyState 1,206 / 3,566. Icon-only fixture includes 1 of 578 icons and is 931 B JS.

## Fixed package build

- Archive: `release-candidates/company-ui-react-web-0.1.0.tgz` (29,254 bytes).
- SHA-256: `d0e40fb774668a34b2ff54283313a49ae9437e70c5cd7706c43f23bc53e5d4ed`.
- Archive inspection passed: all 75 public export targets resolve; 33 JS, 33 TypeScript declaration, and 33 CSS files are included. The archive was created after package and example checks; the final subsequent edit was only to the bundle-check script, and that stricter script passed in the final `pnpm check`.
- This is a local installation candidate, not a published release. `CONSUMER-GUIDE.md` documents how to copy it into a consumer's versioned vendor directory.

## Limits

- Consumer Devtool Control and Tauri packaging were not run or changed here. The consumer must install the archive and run its own typecheck, frontend build, and Tauri packaging check.
- Data loading, Git integration, terminal behavior, and persistence remain consumer-owned. Full screen-reader verification is still needed before treating this as an accessibility certification.

# TASK-022: Desktop SplitPane và ResizeHandle

- Status: implemented; root integration pending
- Owner: gpt-6-luna

## Changed files

- `packages/ui-react-web/src/desktop/components/SplitPane/index.tsx`: added a two-pane component with controlled/uncontrolled pixel size, normalized min/max bounds, optional collapse/restore, ARIA separator keyboard handling and global pointer move/up/cancel listeners with cleanup on cancel, pointer-up and unmount.
- `packages/ui-react-web/src/desktop/components/SplitPane/SplitPane.module.css`: added horizontal/vertical layouts, resize cursor and focus style, collapsed panel handling, and reduced-motion accommodation.
- `tests/ui-react-web/TASK-022/split-pane.test.tsx`: tests pointer clamps in both orientations, keyboard resizing and bounds, collapse/restore callbacks, and pointer listener cleanup on cancellation and unmount.

## Verification

- `pnpm exec vitest run tests/ui-react-web/TASK-022/split-pane.test.tsx`: passed (6 tests).
- `pnpm --filter @company/ui-react-web typecheck`: passed.
- No full build or browser review was run per task scope. Pointer listeners and state are exercised in JSDOM; actual drag cursor, pane layout and focus appearance still need browser verification at integration.

## API and bundle impact

Proposed additions to `src/desktop/index.ts`: `SplitPane`, `ResizeHandle`, `SplitPaneProps`, `ResizeHandleProps`. Proposed package subpaths: `./desktop/split-pane` and root alias `./split-pane`. No mobile export.

```tsx
<SplitPane
  orientation="horizontal"
  size={320}
  minSize={180}
  maxSize={560}
  onSizeChange={setSidebarWidth}
  collapsible
  onCollapseChange={setSidebarCollapsed}
  first={<Sidebar />}
  second={<Editor />}
/>
```

`orientation="horizontal"` means side-by-side panes and an x-axis drag (vertical visual separator); `vertical` means stacked panes and a y-axis drag. Size values are pixels for the first pane. Arrow keys resize by 10 px, Shift+Arrow by 50 px, Home/End set bounds, and Enter toggles collapse when enabled. `ResizeHandle` is the separator rendered internally by `SplitPane`; it requires the SplitPane context if explicitly used. No dependencies, storage, editor or terminal behavior were added. Bundle size is unmeasured; expected JS consists only of this component and React.

## Open issues

- Root must add public exports and run integrated bundle/build checks.
- Browser review should confirm usability of the 6 px separator hit area at desktop density and validate assistive technology behavior for the multi-pane `aria-controls` reference.

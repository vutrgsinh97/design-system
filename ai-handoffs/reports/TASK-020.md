# TASK-020: Desktop Tree và TreeItem

- Status: implemented; root integration pending
- Owner: gpt-6-luna

## Changed files

- `packages/ui-react-web/src/desktop/components/Tree/index.tsx`: added generic nested Tree/TreeItem with controlled and uncontrolled expanded/selected IDs, callbacks, nested ARIA groups, treeitem level/state, keyboard navigation, disclosure controls, icon/metadata/loading slots and no filesystem assumptions.
- `packages/ui-react-web/src/desktop/components/Tree/Tree.module.css`: token-based desktop indentation and row height, hover/selected/focus states, long-label truncation and compact density.
- `tests/ui-react-web/TASK-020/tree.test.tsx`: tests controlled callbacks, collapsed/expanded child rendering, pointer and keyboard selection, Arrow/Home/End navigation, disabled/collapsed keyboard handling, async loading and long names.

## Verification

- `pnpm exec vitest run tests/ui-react-web/TASK-020/tree.test.tsx`: passed (3 tests).
- `pnpm --filter @company/ui-react-web typecheck`: passed.
- Full build, example builds, browser accessibility review and bundle measurement were not run per task scope; root owns the integrated gate. JSDOM verifies focus ownership and keyboard state but does not verify the visible focus outline or ellipsis rendering.

## API and bundle impact

Proposed additions to `src/desktop/index.ts`: `Tree`, `TreeItem`, `TreeProps`, `TreeItemProps`. Proposed package subpaths: `./desktop/tree` and root alias `./tree`. Do not add mobile exports.

```tsx
<Tree
  aria-label="Workspace"
  expandedIds={expandedIds}
  selectedId={selectedId}
  onExpandedIdsChange={setExpandedIds}
  onSelectedIdChange={setSelectedId}
>
  <TreeItem id="workspace" label="Workspace" icon={<FolderIcon />}>
    <TreeItem id="source" label="src" metadata="3 items" />
  </TreeItem>
  <TreeItem id="loading" label="Dependencies" hasChildren loading />
</Tree>
```

Tree uses a single focus target with `aria-activedescendant`; item roles expose `aria-level`, `aria-expanded`, `aria-selected`, `aria-disabled`, and `aria-busy`. ArrowUp/Down, Home/End move the active item; ArrowRight expands or enters a child; ArrowLeft collapses or moves to the parent; Enter/Space select. The disclosure button is removed from the tab sequence so keyboard focus stays in the tree; it remains pointer-operable and has a descriptive accessible name. Icons are decorative; metadata remains exposed alongside the item label. No new dependencies or icons imports were added; production bundle impact is unmeasured.

## Open issues

- Root must add public desktop exports and isolated subpaths, then run integrated bundle/build checks.
- Browser screen reader review should confirm nested tree/group naming and disclosure button behavior in the target desktop browsers.

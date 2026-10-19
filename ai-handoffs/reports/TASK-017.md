# TASK-017: Desktop List và ListItem

- Status: implemented; root integration pending
- Owner: gpt-6-luna

## Changed files

- `packages/ui-react-web/src/desktop/components/List/index.tsx`: added static semantic `ul/li` List/ListItem with leading icon, primary/secondary content, badge, trailing actions, and optional controlled or uncontrolled single selection. Selection uses native list semantics and `aria-current`; keyboard selection supports ArrowUp/Down/Left/Right, Home, End, Enter and Space with roving focus. Actions do not trigger row selection.
- `packages/ui-react-web/src/desktop/components/List/List.module.css`: token-based hover, selected and focus-visible states, long-text truncation, disabled rows/actions layout, and desktop-only compact row height.
- `tests/ui-react-web/TASK-017/list.test.tsx`: tests native static semantics, content slots/truncation class, disabled and active trailing actions, controlled callback/keyboard behavior, disabled-item skipping and compact scope.

## Verification

- `pnpm exec vitest run tests/ui-react-web/TASK-017/list.test.tsx`: passed (4 tests).
- `pnpm --filter @company/ui-react-web typecheck`: passed.
- No full build or browser visual check run in this task. JSDOM verifies keyboard focus and behavior but not painted truncation or compact row height; corresponding CSS rules use ellipsis and `--ds-row-height` under the desktop compact container.

## API and bundle impact

Proposed additions to `src/desktop/index.ts`: `List`, `ListItem`, `ListProps`, `ListItemProps`. Proposed package subpaths: `./desktop/list` and root alias `./list`. Do not add mobile exports.

```tsx
<List aria-label="Sources" selectionMode="single" value={selected} onValueChange={setSelected}>
  <ListItem value="api" leadingIcon={<SourceIcon />} primary="API service" secondary="services/api" badge={<Badge>Running</Badge>} trailingActions={<Button iconOnly aria-label="More actions" icon={<MoreIcon />} />} />
  <ListItem value="web" primary="Web app" disabled />
</List>
```

Static lists omit `selectionMode` and retain list/listitem semantics. Single-select mode is controlled with `value`/`onValueChange` or uncontrolled with `defaultValue`; it marks the current row with `aria-current` and moves focus with arrow/Home/End keys. No dependency or icon registry import was added; expected JS cost is React component code only. CSS/runtime bundle size has not been measured.

## Open issues

- Root must add desktop/root exports and measure isolated bundle cost during integration.
- Verify visual truncation, compact row height, and focus indication in a browser at the integrated gate.

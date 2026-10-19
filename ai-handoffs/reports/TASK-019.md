# TASK-019: Desktop Table composable

- Status: completed
- Owner: gpt-6-luna

## Changed files

- `packages/ui-react-web/src/desktop/components/Table/index.tsx`: added ref-forwarding `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHeaderCell`, `TableCell`, and `TableActions` components using native `table` semantics. Rows accept controlled `selected` and `disabled` props; disabled rows expose `aria-disabled` and `inert`.
- `packages/ui-react-web/src/desktop/components/Table/Table.module.css`: added token-based table surfaces, headers, selected/disabled/hover rows, wrapping for long content, keyboard focus styling for actions, and opt-in compact desktop density.
- `tests/ui-react-web/TASK-019/table.test.tsx`: added behavior tests for native semantics, selected/disabled rows, long content, keyboard action activation and compact container usage.

## Verification

- `pnpm exec vitest run tests/ui-react-web/TASK-019/table.test.tsx`: passed, 4 tests.
- `pnpm --filter @company/ui-react-web typecheck`: passed.
- Scoped TypeScript check for the component and test passed:
  `pnpm exec tsc --noEmit --jsx react-jsx --module ESNext --moduleResolution Bundler --target ES2022 --strict --skipLibCheck packages/ui-react-web/src/styles/css-modules.d.ts packages/ui-react-web/src/desktop/components/Table/index.tsx tests/ui-react-web/TASK-019/table.test.tsx`.
- `git diff --check` on owned paths passed.
- Full build, bundle check, browser inspection and tarball inspection were not run; root owns those integration gates.

## API and bundle impact

- Root should export the seven named components and their prop types from the desktop entry, and add `./desktop/table` (optionally `/table` alias to match package conventions). Do not add mobile exports.
- No dependencies or shared files changed. No Git/Project-specific data model or DataGrid behavior was added.
- Bundle size was not measured. The component imports only the package theme CSS and its local module CSS.

## Open issues

- Row selection is controlled by the consumer through `selected`; this component does not own selection state or add a selection checkbox column.
- Browser visual verification of compact sizing and narrow/long-content layout remains for root's integration gate.

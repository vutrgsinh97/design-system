# TASK-018: Desktop Menu và DropdownMenu

- Status: completed
- Owner: gpt-6-luna

## Changed files

- `packages/ui-react-web/src/desktop/components/Menu/index.tsx`: added composable `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, and `DropdownMenuSeparator` wrappers around the existing Radix Dropdown Menu primitives. Items support shortcut hints and a destructive flag; Radix props including controlled `open`/`onOpenChange`, `asChild`, disabled state, positioning and callbacks remain available.
- `packages/ui-react-web/src/desktop/components/Menu/Menu.module.css`: added scoped surface, item, separator, shortcut, highlighted/disabled/destructive states, compact desktop sizing and reduced-motion-aware entry animation.
- `tests/ui-react-web/TASK-018/dropdown-menu.test.tsx`: added behavior tests for menu roles, trigger/pointer selection, controlled open callback, keyboard navigation/Home/End, disabled items, typeahead, Escape and focus return.

## Verification

- `pnpm exec vitest run tests/ui-react-web/TASK-018/dropdown-menu.test.tsx`: passed, 4 tests.
- `pnpm --filter @company/ui-react-web typecheck`: passed.
- Scoped TypeScript check for the component and test passed:
  `pnpm exec tsc --noEmit --jsx react-jsx --module ESNext --moduleResolution Bundler --target ES2022 --strict --skipLibCheck packages/ui-react-web/src/styles/css-modules.d.ts packages/ui-react-web/src/desktop/components/Menu/index.tsx tests/ui-react-web/TASK-018/dropdown-menu.test.tsx`.
- `git diff --check` on owned paths passed.
- Full build, bundle check, browser inspection and tarball inspection were not run; root owns those integration gates.

## API and bundle impact

- Root should export the five named components and their prop types from the desktop entry and add an isolated `./desktop/menu` subpath (optionally `/menu` alias to match package conventions). Do not add mobile exports.
- No dependency or manifest changes; the package already has `@radix-ui/react-dropdown-menu`.
- The component imports only `@radix-ui/react-dropdown-menu` from its own folder. Bundle size was not measured; root should add a menu-only fixture to verify it does not pull in Dialog, Tabs, Tooltip, Toast or unrelated CSS.
- Submenus are not exposed because no submenu API was explicitly requested.

## Open issues

- Browser visual inspection of compact sizing and popup placement remains for root's integration gate.

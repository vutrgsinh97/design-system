# Desktop component contract (TASK-010)

This contract applies to the Devtool Control desktop UI tasks. Existing `@company/ui-react-web` consumers must keep working.

## Scope and public API

- New components live in `packages/ui-react-web/src/desktop/components/<Name>/`. Root adds named exports to `src/desktop/index.ts` (and therefore the legacy root entry), plus isolated `./desktop/<name>` and root alias subpaths in `package.json`. New components are not exported from `src/mobile/index.ts`.
- Existing shared primitives stay in `src/primitives`. Keep their current props and default appearance. Agent edits to shared CSS must not change mobile defaults. `src/mobile/**` is read-only for this project, except compatibility checks.
- Controlled APIs prefer a value/open/size prop, matching `defaultValue`/`defaultOpen`/`defaultSize` where useful, plus `onValueChange`/`onOpenChange`/`onSizeChange`. Define callback behavior for both pointer and keyboard. Do not expose data models for Git, filesystem, processes or terminal.
- Keep native semantic elements where practical and forward refs to focusable controls. Interactive component entries use `'use client'` where browser behavior requires it.

## Tokens and density

- `src/styles/theme.css` defines additive semantic tokens: hover, selected, pending, spacing, icon size, control/row heights, content/metadata/mono typography. They have light/dark defaults; no previous token is removed.
- Desktop compact is opt-in at a desktop container: `<div data-ds-platform="desktop" data-ds-density="compact">`. This scopes the compact control and row height tokens. Existing apps without those attributes keep their current sizes; mobile containers keep their visual tokens.
- Component CSS uses `var(--ds-*)` and scoped `.ds-*` selectors. Focus uses an outline/box shadow that does not change layout. State is conveyed by label/icon/selection semantics as well as color. Respect `prefers-reduced-motion`.

## Behavior dependencies

- Existing Dialog uses `@radix-ui/react-dialog`.
- The package now includes separate Radix primitives for Tabs, Tooltip, DropdownMenu and Toast. Import each only from its own component folder; package entrypoints and small component bundles must not pull in unrelated Radix modules.
- For Tree, Combobox and SplitPane, use a focused native implementation with behavior tests; request root review before adding any other dependency. Luna does not edit package manifests or lockfile.

## Tests and integration

- Root configured `pnpm test` using Vitest, jsdom, Testing Library and user-event. Component agents own tests only under `tests/ui-react-web/TASK-###/**`; use behavior tests for controlled callbacks, keyboard/focus, limits and cleanup, not snapshot-only tests.
- `pnpm check` runs build, typecheck, tests and bundle isolation. Do not run two clean/build commands concurrently. Root runs `pnpm check`, all three example builds and package tarball inspection at the wave gates.
- Component agents own only their brief's source folders, own test folder and report. Propose exports and API/dependency implications in the report; root integrates shared files and playground after review.

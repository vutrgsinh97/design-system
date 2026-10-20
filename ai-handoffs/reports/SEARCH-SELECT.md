# SEARCH-SELECT: Desktop select with search, infinite scroll and create

- Status: completed
- Owner: Claude (side session)

## Changed files

- `packages/ui-react-web/src/desktop/hooks/useListHighlight.ts` — new internal (not exported) hook: controlled/uncontrolled highlighted key plus ArrowUp/ArrowDown wrap-around over enabled keys.
- `packages/ui-react-web/src/desktop/components/Combobox/index.tsx` — uses the hook instead of its inline highlight state and `moveHighlight`. Public API and behaviour unchanged; `tests/ui-react-web/TASK-021/combobox.test.tsx` passes untouched.
- `packages/ui-react-web/src/desktop/components/SearchSelect/{index.tsx,SearchSelect.module.css}` — new `'use client'` component. `<button aria-haspopup="listbox">` trigger styled like the Select primitive (`--ds-control-height`, hover, focus, invalid, disabled). The popup (`--ds-z-dropdown`, `--ds-shadow-md`) has a `role="combobox"` search input that gets focus and points at the listbox with `aria-activedescendant`. ArrowUp/Down, Enter, Esc (closes and focuses the trigger), Tab (closes), click outside. An IntersectionObserver sentinel calls `onLoadMore`. A create row appears when the trimmed query matches no label.
- `packages/ui-react-web/src/desktop/index.ts`, `packages/ui-react-web/package.json` — export `SearchSelect` and its types; add the `./desktop/search-select` subpath.
- `apps/vite-example/src/fixtures/desktop-search-select-only.tsx`, `apps/vite-example/scripts/check-bundle.mjs` — subpath isolation check, including that no `@radix-ui/` module is bundled and that Button-only bundles don't pull in SearchSelect.
- `tests/ui-react-web/SearchSelect/search-select.test.tsx` — 8 tests: ARIA, mouse and keyboard selection, Esc/Tab, onQueryChange, create row show/hide/Enter/createLabel, onLoadMore through a mocked IntersectionObserver, and the loading/empty/error/disabled states.
- `apps/next-example/app/SelectComboboxShowcase.tsx`, `select-combobox-showcase.module.css`, `page.tsx` — "Select & Combobox" section on the Components page: native Select, Combobox and SearchSelect side by side, each with a one-line "when to use". State switcher: results/loading/empty/error/disabled. SearchSelect has 500 fake rows (30 per page with a 400 ms delay), search and create.
- `.changeset/desktop-search-select.md` — minor.

## Verification

- `pnpm check` exits 0: build, typecheck (all apps), vitest 20 files and 79 tests, bundle checks.
- Browser (next-example dev, `/`): opening focuses the search input. Scrolling the list loaded 30 → 120 rows. Typing a new name and pressing Enter created the row and selected it. Arrow keys and Enter selected the expected row and returned focus to the trigger. Esc closed the popup and focused the trigger. The loading, empty, error (red border, `aria-invalid`, alert text) and disabled states render. Computed z-index is 1400 and the shadow is `--ds-shadow-md`.
- Not run: `next build` for the two Next apps and the Vite production build (REVIEW.md lists these; `pnpm check` only typechecks the apps). Not checked: a screen reader, an accessibility inspector, and dark theme.

## API and bundle impact

- New public: `SearchSelect`, `SearchSelectProps<T>`, `SearchSelectOption`, `SearchSelectOptionRenderState`, and the `@vutrgsinh97/ui-react-web/desktop/search-select` subpath.
- Additions beyond the brief's props: native button props pass through to the trigger (needed for `aria-label`/`aria-labelledby`/`id`), plus `ref`, `className`/`rootClassName`, `loadingContent` and `searchPlaceholder` (the search input's placeholder and accessible name).
- `ref` is a normal prop (React 19), so the generic `T` is preserved. No `forwardRef`.
- When `query` is omitted, the query is held internally. Options are never filtered by the component.
- Subpath-only bundle: 10.3 KB JS and 9.1 KB CSS, unminified, no new dependencies, no Radix. Combobox: 7.6 KB JS, unchanged.

## Open issues

- `shortcut:` the popup is always `position: absolute` below the trigger, with no viewport collision handling or portal. It can be clipped inside `overflow: hidden` containers.
- No clear/reset button (the `onValueChange(null, null)` path exists in the type but no UI triggers it). No type-ahead on the closed trigger.
- If the selected option is not among the loaded options and was never seen by this instance, the trigger shows the placeholder. The consumer must include it in `options`.
- Esc inside a Radix Dialog: not tested whether the dialog also closes.
- Default strings mix English ("No results", "Search…") with the Vietnamese create label `Thêm "{query}"` required by the brief.

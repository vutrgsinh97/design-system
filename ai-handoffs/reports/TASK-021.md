# TASK-021: Desktop Combobox single-select

- Status: completed
- Owner: gpt-6-luna

## Changed files

- `packages/ui-react-web/src/desktop/components/Combobox/index.tsx`: added a controlled single-select Combobox with controlled `value`/`onValueChange` and `query`/`onQueryChange`; optional controlled highlight and open state; composed data options with optional `renderOption`; loading, error, and empty content; native input props and forwarded input ref; listbox/option semantics; active descendant; keyboard selection; and outside-dismissal listener cleanup.
- `packages/ui-react-web/src/desktop/components/Combobox/Combobox.module.css`: added token-based input, popup, option, highlighted/selected/disabled and state-message styles, plus compact desktop sizing.
- `tests/ui-react-web/TASK-021/combobox.test.tsx`: added behavior coverage for controlled query/highlight/value, keyboard navigation and selection, disabled options, composition rendering, consumer-updated async results, loading/empty/error, pointer selection, Escape and focus retention.

## Verification

- `pnpm exec vitest run tests/ui-react-web/TASK-021/combobox.test.tsx`: passed, 4 tests.
- `pnpm --filter @company/ui-react-web typecheck`: passed.
- Scoped TypeScript check for the component and test passed:
  `pnpm exec tsc --noEmit --jsx react-jsx --module ESNext --moduleResolution Bundler --target ES2022 --strict --skipLibCheck packages/ui-react-web/src/styles/css-modules.d.ts packages/ui-react-web/src/desktop/components/Combobox/index.tsx tests/ui-react-web/TASK-021/combobox.test.tsx`.
- `git diff --check` on owned paths passed.
- Full build, bundle check, browser inspection and tarball inspection were not run; root owns those integration gates.

## API and bundle impact

- Root should export `Combobox`, `ComboboxProps`, `ComboboxOptionData`, and `ComboboxOptionRenderState` from the desktop entry and add `./desktop/combobox` (optionally `/combobox` alias). Do not add mobile exports.
- API requires controlled `value`, `onValueChange`, `query`, `onQueryChange`, and consumer-supplied `options`. The consumer filters or fetches results and updates `options`, `loading`, and `error`; the component does no I/O. `onValueChange` includes the selected option object. Selection also calls `onQueryChange(option.label)` so the closed input displays the selected label when the consumer accepts the controlled query update.
- `highlightedValue` and `open` can be controlled; when omitted, those states are internal. `renderOption(option, state)` allows custom option composition without changing listbox semantics.
- No new dependencies. Bundle size was not measured; the implementation uses React hooks and local CSS only.
- Accessibility tradeoff: options use the active-descendant model, keeping DOM focus on the input for keyboard use and after selection. Mouse selection prevents the option from stealing input focus. The component does not implement typeahead or viewport collision placement; filtered/async results and labels remain consumer responsibilities.

## Open issues

- Browser visual inspection of popup placement, compact sizing and long result lists remains for root's integration gate.

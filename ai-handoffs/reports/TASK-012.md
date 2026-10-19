# TASK-012: Input, Textarea, Label và FormField

- Status: completed
- Owner: gpt-6-luna

## Changed files

- `packages/ui-react-web/src/primitives/Input/Input.module.css`: added readonly surface styling and opt-in compact desktop sizing for regular and adorned inputs; kept existing default and mobile sizes.
- `packages/ui-react-web/src/primitives/Textarea/Textarea.module.css`: added opt-in compact desktop sizing; existing mobile and default sizing stay intact.
- `packages/ui-react-web/src/primitives/Label/Label.module.css`: reduced label typography only inside a compact desktop container.
- `packages/ui-react-web/src/composites/FormField/FormField.module.css`: added compact desktop spacing and floating input sizing.
- `packages/ui-react-web/src/composites/FormField/index.tsx`: assigns independent hint/error IDs, describes both messages, and renders both when supplied; the error continues to set `aria-invalid`.
- `tests/ui-react-web/TASK-012/form-controls.test.tsx`: added behavior coverage for controlled changes, default values, refs, disabled/readonly/invalid state, focus, label association, descriptions, Textarea association, and floating label placeholders.

## Verification

- `pnpm exec vitest run tests/ui-react-web/TASK-012/form-controls.test.tsx`: passed, 7 tests.
- `pnpm --filter @company/ui-react-web typecheck`: passed.
- Initial focused Vitest invocation failed to resolve an overly deep relative import; corrected the test imports and reran successfully.
- Full `pnpm check`, consumer builds, browser visual verification, and bundle/tarball inspection were not run; root owns those integration gates.

## API and bundle impact

- No public props, exports, dependencies, or package files changed. No SearchField was added because the current visual adornment API does not require a clear action.
- Compact density is activated only under `[data-ds-platform='desktop'][data-ds-density='compact']`; existing default and mobile sizing remain unchanged.
- When a consumer supplies both `hint` and `error`, FormField now renders and associates both messages instead of hiding the hint while an error is present. This is additive accessible feedback with no prop/API break.
- No bundle size was measured. Changes add CSS in the existing Input, Textarea, Label, and FormField modules and no runtime dependency.

## Open issues

- Select/Combobox behavior and a dedicated SearchField remain out of scope as specified by TASK-012.
- Root should run the full integration checks and confirm compact styling in the final desktop showcase.

# TASK-016: Checkbox và Badge states

- Status: completed
- Owner: gpt-6-luna

## Changed files

- `packages/ui-react-web/src/primitives/Checkbox/index.tsx`: added optional controlled `indeterminate` prop. A callback ref synchronizes the native `HTMLInputElement.indeterminate` property while preserving forwarded refs and controlled `checked`/`onChange`; mixed state is exposed as `aria-checked="mixed"`.
- `packages/ui-react-web/src/primitives/Checkbox/Checkbox.module.css`: added compact desktop sizing while preserving existing default and mobile dimensions.
- `packages/ui-react-web/src/primitives/Badge/index.tsx`: added `error` and `pending` variants, mapped legacy `danger` to the error status identity, and exposes normalized `data-variant` for styling/inspection.
- `packages/ui-react-web/src/primitives/Badge/Badge.module.css`: added error/pending token styling, distinct status marker shapes so status presentation is not color-only, and compact desktop sizing.
- `tests/ui-react-web/TASK-016/checkbox-badge.test.tsx`: added controlled, indeterminate, keyboard, disabled, variant, alias, light/dark, and compact-context behavior coverage.

## Verification

- `pnpm exec vitest run tests/ui-react-web/TASK-016/checkbox-badge.test.tsx`: passed, 5 tests.
- Scoped TypeScript check for Checkbox, Badge and this test file passed:
  `pnpm exec tsc --noEmit --jsx react-jsx --module ESNext --moduleResolution Bundler --target ES2022 --strict --skipLibCheck packages/ui-react-web/src/styles/css-modules.d.ts packages/ui-react-web/src/primitives/Checkbox/index.tsx packages/ui-react-web/src/primitives/Badge/index.tsx tests/ui-react-web/TASK-016/checkbox-badge.test.tsx`.
- `pnpm --filter @company/ui-react-web typecheck`: blocked by an unrelated error in `src/desktop/components/List/index.tsx:114` (`Property 'closest' does not exist on type 'EventTarget'`). No file outside TASK-016 ownership was changed.
- Full `pnpm check`, example builds, bundle checks, browser visual verification, and tarball inspection were not run; root owns the integration gate.

## API and bundle impact

- Suggested public API: add optional `CheckboxProps.indeterminate?: boolean`; extend `BadgeProps.variant` with `'error' | 'pending'`. Preserve `'danger'` as a supported alias for `'error'`. Root owns exports and manifest integration; no shared export or package file was edited here.
- No runtime dependencies added. Checkbox remains a native input. The status marker uses CSS only.
- Default and mobile control sizing remain unchanged. Compact sizing is scoped to the desktop compact container.
- Bundle size was not measured. Badge adds only local CSS and small variant/data-attribute logic; Checkbox adds a callback ref to synchronize native indeterminate state.

## Open issues

- The full package typecheck currently fails in the separate List component noted above; root should rerun after that owner fixes it.
- Browser visual/accessibility inspection and integrated public import/bundle verification remain for root's gate.

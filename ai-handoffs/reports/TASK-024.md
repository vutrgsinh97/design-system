# TASK-024: Desktop Progress và EmptyState

- Status: implemented; root integration pending
- Owner: gpt-6-luna

## Changed files

- `packages/ui-react-web/src/desktop/components/Progress/index.tsx`, `Progress.module.css`: added accessible determinate/indeterminate progressbar, range validation/clamping, optional visible label/percentage, compact height and reduced-motion behavior.
- `packages/ui-react-web/src/desktop/components/EmptyState/index.tsx`, `EmptyState.module.css`: added generic optional icon/title/description/action composition with heading/description associations, long-copy wrapping and compact spacing.
- `tests/ui-react-web/TASK-024/feedback.test.tsx`: tests progress ARIA range/value and indeterminate state, clamp/invalid range, compact scope, EmptyState label/description, decorative icon and action, and long description.

## Verification

- `pnpm exec vitest run tests/ui-react-web/TASK-024/feedback.test.tsx`: passed (5 tests).
- `pnpm --filter @company/ui-react-web typecheck`: passed.
- Full build, example builds and browser visual/accessibility review were not run per task scope. Compact behavior is verified as opt-in container scope. Reduced motion is implemented in CSS (`prefers-reduced-motion`) for the indeterminate indicator; JSDOM does not evaluate the rendered animation or media query.

## API and bundle impact

Proposed additions to `src/desktop/index.ts`: `Progress`, `ProgressProps`, `EmptyState`, `EmptyStateProps`. Proposed package subpaths: `./desktop/progress`, `./progress`, `./desktop/empty-state`, and `./empty-state`. No mobile exports.

```tsx
<Progress label="Indexing sources" value={completed} max={total} showValue />
<Progress aria-label="Loading workspace" />

<EmptyState
  icon={<FolderIcon />}
  title="No sources yet"
  description="Add a source to show its files here."
  action={<Button>Add source</Button>}
/>
```

Progress accepts a numeric value in the inclusive `min`/`max` range (defaults 0/100); omitting `value` creates an indeterminate bar with no `aria-valuenow`. A finite `max` greater than `min` is required. Supply `label` or `aria-label` for a useful accessible name. EmptyState is a named section when a title is present; its icon is decorative and action remains consumer-provided. No runtime dependencies or animation framework were added. Bundle size has not been measured.

## Open issues

- Root must add public exports/subpaths and run bundle/build checks.
- Browser review should verify reduced-motion presentation and how the title heading level fits each consumer layout.

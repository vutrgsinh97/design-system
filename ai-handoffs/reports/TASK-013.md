# TASK-013: Desktop Dialog layout slots

- Status: completed
- Owner: gpt-6-luna

## Changed files

- `packages/ui-react-web/src/desktop/components/Dialog/index.tsx`: added ref-forwarding `DialogHeader`, `DialogBody`, and `DialogFooter` layout slots while preserving the existing Radix exports and `DialogContent` prop/ref behavior.
- `packages/ui-react-web/src/desktop/components/Dialog/Dialog.module.css`: made slotted content a bounded flex layout; the body owns overflow scrolling and header/footer remain fixed in the available dialog height. Existing un-slotted content continues to scroll as before.
- `tests/ui-react-web/TASK-013/dialog.test.tsx`: covered controlled open callbacks, accessible title/description, Escape dismissal, focus return and focus containment, long body structure, footer presence, and close behavior.

## Verification

- `pnpm exec vitest run tests/ui-react-web/TASK-013/dialog.test.tsx`: passed (2 tests).
- `pnpm --filter @company/ui-react-web typecheck`: passed.
- `pnpm check` and app production builds were not run; root owns the integrated gate. jsdom does not calculate CSS layout, so body scrolling/footer placement was validated with DOM structure assertions and the scoped CSS rules rather than a real browser geometry check.

## API and bundle impact

- Added named exports `DialogHeader`, `DialogBody`, and `DialogFooter` with `HTMLAttributes<HTMLDivElement>` props and forwarded refs. No dependency or Radix behavior changes.
- Root should add these three names to `src/desktop/index.ts`. Existing `./dialog` and `./desktop/dialog` subpaths already target this component module; no package manifest or new subpath changes are needed.
- Runtime cost is three lightweight div wrappers; no bundle measurement was run in this task.

## Open issues

- None.

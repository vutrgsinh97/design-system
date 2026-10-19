# TASK-033: Playground component coverage

- Status: approved by the user's “ok chốt” in this chat for the proposed scope
- Owner: root

## Goal

Make the existing web playground show the public component slots and states identified in the source audit. This is showcase and documentation work only; do not change package component behavior or add business logic.

## Evidence and approved decisions

- `packages/ui-react-web/src/desktop/index.ts` exports `CardFooter`, `TableActions`, `ToastAction`, and `PromiseToast`. The first three have no rendered examples in the existing playground; `PromiseToast` is shown in `apps/next-example/app/ModalToastShowcase.tsx` but is absent from `COMPONENT-INVENTORY.md`.
- `Checkbox` supports `indeterminate`; `Select` supports `invalid` and native `disabled`; `TreeItem` supports `loading` and `disabled`. Existing playground examples do not show those states.
- Add examples for these slots/states to the existing desktop Next.js playground. Keep example data local and fictional. Do not call real APIs or introduce business workflows.
- Keep the mobile playground as a separate app. Improve README instructions for finding/running it; do not merge the apps or hardcode a link to a guessed port.
- Update the component inventory for `PromiseToast`.

## Scope

- Playground files: `apps/next-example/app/primitives/PrimitiveGallery.tsx`, `apps/next-example/app/DesktopCollectionsShowcase.tsx`, `apps/next-example/app/ModalToastShowcase.tsx`, and `apps/next-example/app/developer-workspace/page.tsx` or another existing showcase file only if necessary to show Tree loading/disabled.
- Documentation: root `README.md` and `COMPONENT-INVENTORY.md`.
- Task/report files: `ai-handoffs/tasks/TASK-033.md`, `ai-handoffs/reports/TASK-033.md`.
- Preserve all existing uncommitted work; do not change package source, package exports, dependencies, or Git state.

## Acceptance and verification

- Every named slot/state above has a discoverable rendered example in the web playground. `ToastAction` has the required `altText`; Table actions remain inside a `TableCell`; Tree disabled/loading states use the existing props.
- README clearly says desktop and mobile playgrounds run as separate apps and gives their commands. Inventory accurately lists `PromiseToast` as a desktop export.
- Run `pnpm check` and the Next.js example production builds. Browser use and starting a dev server require separate user authorization under the personal instructions; do not do either without it.

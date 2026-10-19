# TASK-032: Promise-aware desktop Toast

- Status: completed
- Owner: root

## Changed files

- `ai-handoffs/tasks/TASK-032.md`: approved scope, evidence, and checks.
- `packages/ui-react-web/src/desktop/components/Toast/PromiseToast.tsx` and `PromiseToast.module.css`: observe a consumer-owned Promise and render pending, success, or error UI.
- `packages/ui-react-web/src/desktop/components/Toast/index.tsx` and `packages/ui-react-web/src/desktop/index.ts`: export `PromiseToast` and its props from the existing desktop Toast paths and barrel.
- `tests/ui-react-web/TASK-032/promise-toast.test.tsx`: cover indefinite pending display, settlement, timed dismissal, manual dismissal, and replacement of the Promise.
- `apps/next-example/app/ModalToastShowcase.tsx`: add success and failure demos with simulated tasks.
- `apps/vite-example/src/fixtures/desktop-promise-toast-only.tsx` and `apps/vite-example/scripts/check-bundle.mjs`: check the new bundle and keep plain Toast free of PromiseToast and Spinner.
- `CONSUMER-GUIDE.md` and `packages/ui-react-web/README.md`: document the UI-only contract and usage.
- `.changeset/promise-toast-ui.md`: record the additive public API.

## Verification

- `pnpm exec vitest run tests/ui-react-web/TASK-032/promise-toast.test.tsx` — passed, 4 tests.
- `pnpm --filter @company/ui-react-web typecheck` — passed.
- `pnpm check` — passed: package builds, all typechecks, 68 tests across 18 files, and bundle checks.
- `pnpm --filter next-example build` — passed, optimized Next.js production build.
- `pnpm --filter next-mobile-example build` — passed, optimized Next.js production build.
- `pnpm --filter vite-example build` — passed, Vite production build.
- `node apps/vite-example/scripts/check-bundle.mjs` after adding the new fixture — passed.
- `pnpm --filter vite-example typecheck` after adding the new fixture — passed.
- Manual browser inspection was not run because browser control requires separate user permission under the personal instructions. No service or port was started.

## API and bundle impact

- Added `PromiseToast` and `PromiseToastProps` to `/toast`, `/desktop/toast`, and the desktop barrel. Existing Toast props and statuses remain unchanged. This is an additive minor change.
- The consumer creates the Promise and owns business results and errors. The component only tracks settlement for display, using infinite duration while pending and a finite `resultDuration` (default 4000 ms) after settlement.
- No new dependency. The Vite isolated fixtures measured plain Toast at 88,844 bytes JS / 6,408 bytes CSS and PromiseToast at 90,714 bytes JS / 8,954 bytes CSS. Plain Toast excludes PromiseToast and Spinner modules and Spinner CSS.

## Open issues

- Manual visual and assistive technology inspection in a browser remains unverified.

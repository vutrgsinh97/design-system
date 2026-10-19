# TASK-023: Desktop Toast

- Status: completed
- Owner: gpt-6-luna

## Changed files

- `packages/ui-react-web/src/desktop/components/Toast/index.tsx`: added composed Radix Toast exports: `ToastProvider`, `Toast`, `ToastViewport`, `ToastTitle`, `ToastDescription`, `ToastAction`, and `ToastClose`. Toast supports info/success/error variants, controlled/default visibility through Radix props, customizable timeout, action and close controls. The close control has a default accessible name.
- `packages/ui-react-web/src/desktop/components/Toast/Toast.module.css`: added scoped viewport, surface, variant, action/close focus, compact desktop and reduced-motion-aware animation styles.
- `tests/ui-react-web/TASK-023/toast.test.tsx`: added behavior tests for announcements, focus preservation, action/dismiss callbacks, controlled visibility and auto-dismiss timer cleanup.

## Verification

- `pnpm exec vitest run tests/ui-react-web/TASK-023/toast.test.tsx`: passed, 4 tests.
- `pnpm --filter @company/ui-react-web typecheck`: passed.
- Scoped TypeScript check for the component and test passed:
  `pnpm exec tsc --noEmit --jsx react-jsx --module ESNext --moduleResolution Bundler --target ES2022 --strict --skipLibCheck packages/ui-react-web/src/styles/css-modules.d.ts packages/ui-react-web/src/desktop/components/Toast/index.tsx tests/ui-react-web/TASK-023/toast.test.tsx`.
- `git diff --check` on owned paths passed.
- Full build, bundle check, browser inspection and tarball inspection were not run; root owns those integration gates.
- Reduced-motion behavior is implemented with animation rules inside `prefers-reduced-motion: no-preference`; jsdom does not render CSS media queries, so no computed-style motion assertion was possible in the focused tests.

## API and bundle impact

- Root should export the seven named components and their prop types from the desktop entry and add `./desktop/toast` (optionally `/toast` alias). Do not add mobile exports.
- Composition is explicit: one `ToastProvider`, one `ToastViewport`, and one or more controlled or default-open `Toast` roots. No module-level queue, global registry or imperative `toast()` helper was added.
- `Toast` has `variant: 'info' | 'success' | 'error'`; Radix's `type` controls polite/assertive announcement priority. `ToastAction` uses Radix's required `altText`; activating the action dismisses that toast. `ToastClose` dismisses it and defaults to the accessible label “Dismiss notification”.
- No dependency change; `@radix-ui/react-toast` already exists. Radix owns timeout pause/resume and timer cleanup. Bundle size was not measured; the component imports only its own Radix primitive and local CSS.

## Open issues

- Browser visual review of viewport placement, compact layout and swipe interactions remains for root's integration gate.

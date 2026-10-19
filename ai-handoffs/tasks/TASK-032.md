# TASK-032: Promise-aware desktop Toast

- Status: approved (user said “ok chốt” in this task after confirming that the design system only owns UI and animation)
- Owner: root

## Goal and scope

Add `PromiseToast` to the existing desktop Toast module. A consumer creates and owns the Promise and supplies loading, success, and error content. The component observes settlement, displays a spinner while pending, keeps the pending toast visible, then shows the supplied result and applies a finite dismissal duration. It does not start tasks, interpret results or errors, call APIs, retry, navigate, or own business state.

## Evidence and constraints

- `packages/ui-react-web/src/desktop/components/Toast/index.tsx` exposes Radix Toast with `info`, `success`, `warning`, and `error` statuses. The consumer owns notification state.
- `packages/ui-react-web/src/primitives/Spinner/index.tsx` provides a shared visual spinner.
- The installed Radix Toast implementation skips its close timer for `duration={Infinity}` and restarts the timer when duration changes.
- Preserve the existing Toast API and desktop-only export paths. Avoid a global toast registry or a new dependency.

## Approved behavior

- `PromiseToast` accepts an existing Promise and consumer-supplied loading, success, and error content.
- Pending uses the existing info styling and spinner; fulfilled/rejected use success/error styling.
- A pending toast stays open until settlement or explicit dismissal. Settled toast closes after a configurable finite duration.
- The consumer still handles the original Promise and any business outcome.

## Paths and verification

- Edit the desktop Toast module/CSS, desktop barrel, related documentation, the Next playground example, behavior tests, a Vite fixture and bundle isolation check, and a changeset. The Vite fixture/check were added to verify that plain Toast does not import PromiseToast or Spinner. Record results in `ai-handoffs/reports/TASK-032.md`.
- Test pending, fulfillment, rejection, dismissal, and a changed Promise. Run `pnpm check` and production builds for the three example apps. Do not open a browser or start a service.

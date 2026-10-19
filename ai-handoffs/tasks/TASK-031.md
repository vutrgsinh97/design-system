# TASK-031: Desktop Modal and Toast

- Status: completed
- Owner: root

## Scope

- Add a desktop Modal convenience composition over Dialog with supplied content and footer.
- Extend desktop Toast to four statuses and six viewport positions while keeping its existing API compatible.
- Add light motion with reduced-motion support, a playground example, docs, and behavior tests.

## Acceptance

- Modal keeps app actions outside the package and supports focus return when opened from a trigger.
- Toast can be placed in each top/bottom and left/center/right viewport position.
- `pnpm check` and all example production builds pass. Record results in `reports/TASK-031.md`.

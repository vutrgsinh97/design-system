# TASK-010: Desktop foundation contract

- Status: completed
- Owner: root

## Changed files

- `packages/ui-react-web/src/styles/theme.css`: added light/dark hover, selected, pending, spacing, icon, control/row, content/metadata and monospace tokens. Compact control/row tokens are opt-in under `data-ds-platform="desktop" data-ds-density="compact"`; existing defaults remain.
- `package.json`, `pnpm-lock.yaml`, `vitest.config.ts`, `tests/setup.ts`, `tests/ui-react-web/baseline.test.tsx`: added Vitest, jsdom and Testing Library behavior-test harness. React/React DOM are root dev dependencies only; UI package peers remain unchanged.
- `packages/ui-react-web/package.json`, `pnpm-lock.yaml`: added modular Radix dependencies for Tabs, Tooltip, DropdownMenu and Toast. They are not imported by existing entries yet.
- `ai-handoffs/TASK-010-CONTRACT.md`, task briefs, checklist: fixed desktop-only scope, export ownership, test paths and dependency policy.
- `.changeset/devtool-desktop-foundation.md`: recorded the package token/dependency addition.

## Verification

- Baseline `pnpm check` before edits: passed. Button-only 1,223 B JS / 7,971 B CSS; FormField-only 2,819 B JS / 8,007 B CSS.
- `pnpm test`: passed after root React dev dependencies were installed (1 test). The initial run failed because root lacked `react/jsx-dev-runtime`; fixed by adding React/React DOM as root dev dependencies.
- Final `pnpm check`: passed, including package builds, all app typechecks, one behavior test and bundle isolation. Button-only 1,223 B JS / 8,868 B CSS; FormField-only 2,819 B JS / 8,904 B CSS. The 897 B CSS increase is the additive shared theme tokens; JS size unchanged.
- `pnpm --filter next-example build`, `pnpm --filter next-mobile-example build`, `pnpm --filter vite-example build`: all passed.

## API and bundle impact

- No existing component prop/export changed. New theme tokens are additive and compact is opt-in only on desktop container.
- New modular Radix packages are available to future desktop components. Existing small component bundles do not import them; each future component must be checked for isolated runtime/CSS cost.
- `pnpm check` now runs `pnpm test` before bundle isolation. UI package React/React DOM remain peer dependencies.

## Open issues

- Luna component tasks still need implementation and behavior tests. No final tarball was created at this foundation gate.

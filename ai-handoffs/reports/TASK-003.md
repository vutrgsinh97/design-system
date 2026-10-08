# TASK-003: Separate desktop and mobile web UI

- Status: completed
- Owner: Codex

## Changed files

- Moved the 14 existing components into `packages/ui-react-web/src/desktop/components/`.
- Added 14 independent mobile web implementations and CSS in `packages/ui-react-web/src/mobile/components/`, plus mobile visual tokens.
- Added explicit `desktop`, `mobile`, and component subpath exports; root and old subpaths remain desktop aliases.
- Added a mobile Next.js playground as a separate workspace app and updated desktop/Vite examples, README, AGENTS, REVIEW, CI, and Changesets.
- Updated Vite production fixture checks for desktop/mobile code and CSS isolation.

## Verification

- `CI=true pnpm check` passed.
- `CI=true NEXT_TELEMETRY_DISABLED=1 pnpm --filter next-example build` passed.
- `CI=true NEXT_TELEMETRY_DISABLED=1 pnpm --filter next-mobile-example build` passed.
- `CI=true pnpm --filter vite-example build` passed.
- `CI=true pnpm --filter @company/ui-react-web pack --pack-destination /private/tmp` passed.
- Parsed Next.js production HTML and linked CSS: desktop app includes desktop CSS only; mobile app includes mobile CSS only.
- No dev server was started.

## API and bundle impact

- New imports: `@company/ui-react-web/desktop` and `@company/ui-react-web/mobile`, plus direct component paths under each.
- Root and previous component subpaths still resolve to desktop.
- Button-only Vite bundles exclude the opposite view, Dialog CSS, and Radix.
- No new runtime dependencies.

## Open issues

- A single Next.js Turbopack app with both route variants linked desktop CSS from the mobile route in a local production build. The examples use two independent apps to guarantee CSS payload isolation; consumers needing both views in one Next.js app should measure route CSS after integration.

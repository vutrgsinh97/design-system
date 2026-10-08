# TASK-002: Document how to open the playground

- Status: completed
- Owner: Codex

## Changed files

- `README.md`: added quick start, Next.js playground and Vite demo URLs, stop instructions, source locations, and build-only verification commands.
- `package.json`: added `dev:playground` as a clear alias for the Next.js demo command.

## Verification

- Root script and README commands checked against the existing Next.js and Vite app scripts.
- `CI=true pnpm check` and `CI=true NEXT_TELEMETRY_DISABLED=1 pnpm --filter next-example build` passed.
- No dev server was started for this documentation update.

## API and bundle impact

No package API, dependencies, or bundle output changed.

## Open issues

None.

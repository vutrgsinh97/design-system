# TASK-001: Organize components by folder

- Status: completed
- Owner: Codex

## Changed files

- Moved all 14 components to `packages/ui-react-web/src/components/<Name>/index.tsx` with colocated `<Name>.module.css`.
- Updated the public root barrel and package subpath exports to point to the new built files.
- Updated `README.md`, `REVIEW.md`, and `AGENTS.md` to document and preserve the layout.

## Verification

- `CI=true pnpm check` passed, including TypeScript and Button-only Vite production bundle.
- `CI=true NEXT_TELEMETRY_DISABLED=1 pnpm --filter next-example build` passed.
- `CI=true pnpm --filter vite-example build` passed.
- `CI=true pnpm --filter @company/ui-react-web pack --pack-destination /private/tmp` passed; tarball contains JS, declarations, and CSS in the new folders.
- Verified every package export resolves to a built file.

## API and bundle impact

- Public root and subpath import names are unchanged.
- Button-only bundle remains 725 bytes JS and 3248 bytes CSS with React externalized; Dialog and Radix are absent.
- No dependency changes.

## Open issues

None.

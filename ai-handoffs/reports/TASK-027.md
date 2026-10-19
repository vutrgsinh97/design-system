# TASK-027: Consumer guide for Tauri + React + TypeScript

- Status: completed
- Owner: gpt-6-luna

## Changed files

- `CONSUMER-GUIDE.md`: documented local directory and tarball installation, theme/CSS and icon imports, public component APIs, generic composition, controlled state, accessibility, bundle performance, and package update workflow. No consumer source was changed.

## Verification

- Typechecked the guide's combined TSX examples with `pnpm exec tsc -p <temporary-tsconfig> --pretty false` against the built public declarations for `@company/ui-react-web/desktop` and `@company/icons-react/archive`: passed. Temporary files were removed after the check.
- `git diff --check -- CONSUMER-GUIDE.md`: passed.
- No package build, test suite, Tauri build, or consumer integration was run; this task only changes documentation, and root owns package integration gates.

## API and bundle impact

- No API or bundle changes. All component, CSS, and icon references use package export-map paths and currently exported desktop names. The guide recommends direct package subpaths for isolated imports and explicit icon subpaths for tree shaking.
- Root appended the delivered archive `release-candidates/company-ui-react-web-0.1.0.tgz` and SHA-256 `d0e40fb774668a34b2ff54283313a49ae9437e70c5cd7706c43f23bc53e5d4ed` to the guide after TASK-028 checks.

## Open issues

- No documentation blocker remains; consumer integration is outside this repository task.

# TASK-011: Button và hiển thị nền

- Status: completed
- Owner: gpt-6-luna

## Changed files

- `packages/ui-react-web/src/primitives/Button/Button.module.css`: moved button gap and content font to shared tokens with existing-value fallbacks; added opt-in desktop compact sizing for default `md` buttons; disabled transitions/spinner animation under reduced motion.
- `packages/ui-react-web/src/primitives/Text/index.tsx`, `Text.module.css`: added `success`, `warning`, and `pending` tones while retaining existing tones; use shared content/metadata typography tokens and allow long content to wrap.
- `packages/ui-react-web/src/primitives/Divider/Divider.module.css`: spacing uses the shared token with the existing margin as fallback.
- `packages/ui-react-web/src/primitives/Spinner/Spinner.module.css`: `md` spinner uses icon-size token only within desktop compact containers; reduced-motion mode stops rotation.
- `packages/ui-react-web/src/desktop/components/Alert/index.tsx`, `Alert.module.css`: semantic `status`/`alert` role by default, visually hidden textual status label, compact padding, tokenized typography and long-text wrapping. Caller-provided role is preserved.
- `tests/ui-react-web/TASK-011/components.test.tsx`: keyboard focus, icon-only naming, loading disabled state, compact opt-in, alert announcement text and semantic elements.

## Verification

- `pnpm exec vitest run tests/ui-react-web/TASK-011/components.test.tsx`: passed (4 tests).
- `pnpm --filter @company/ui-react-web typecheck`: passed.
- An initial `pnpm test -- tests/...` invocation ran the whole suite because of argument forwarding; besides assertion matchers unavailable in the current harness, it surfaced unresolved import and style-computation failures in other agents' TASK-012/TASK-013 suites. Replaced this task's matcher usage and reran only TASK-011 successfully. Those other suites were not changed or re-run.
- `pnpm check`, example builds, browser accessibility review, and bundle-size checks were not run; root owns the integrated gate and should run it after all agents finish.

## API and bundle impact

- Existing Button variants, sizes, props, defaults, refs and native attributes are unchanged. Compact styling is additive and requires the desktop density container attribute; existing and mobile defaults are preserved.
- Text's `tone` union is widened additively. Alert keeps the existing `variant` API; default roles are new semantic metadata, and an explicitly supplied `role` wins.
- No dependencies, exports, manifests or shared tokens were changed. No runtime imports were added, so no expected JS bundle increase; CSS bundle impact was not measured.

## Open issues

- Alert's default `danger` variant announces “Error”; caller-supplied `role="alert"` or `role="status"` remains supported.
- Integrated package/app checks and production bundle measurement remain for root's gate.

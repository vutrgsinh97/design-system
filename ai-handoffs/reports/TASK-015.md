# TASK-015: Desktop Tooltip

- Status: completed
- Owner: gpt-6-luna

## Changed files

- `packages/ui-react-web/src/desktop/components/Tooltip/index.tsx`: added client-side Radix Tooltip provider/root/trigger/content wrappers, optional shortcut hint, portal rendering, and disabled-child hover suppression for `asChild` native controls.
- `packages/ui-react-web/src/desktop/components/Tooltip/Tooltip.module.css`: added scoped tooltip styling, constrained width and word wrapping for long content, and reduced-motion overrides.
- `tests/ui-react-web/TASK-015/tooltip.test.tsx`: covered hover/focus opening, Escape dismissal, trigger `aria-describedby`, disabled triggers, click activation, shortcut content, controlled open, and long content.

## Verification

- `pnpm exec vitest run tests/ui-react-web/TASK-015/tooltip.test.tsx`: passed (3 tests).
- `pnpm --filter @company/ui-react-web typecheck`: passed.
- `git diff --check -- packages/ui-react-web/src/desktop/components/Tooltip tests/ui-react-web/TASK-015 ai-handoffs/reports/TASK-015.md`: passed.
- Full `pnpm check`, production builds, and a real-browser layout check were not run; root owns the integrated gate. jsdom verifies interaction and ARIA behavior but does not measure rendered layout or reduced-motion effects.

## API and bundle impact

- Root should export `TooltipProvider`, `Tooltip`, `TooltipTrigger`, `TooltipContent`, and `TooltipContentProps` from the desktop entry point. Add isolated `./desktop/tooltip` and root alias `./tooltip` package subpaths if desired, per the desktop component contract.
- Uses the already-installed `@radix-ui/react-tooltip` dependency only in this component module; no manifest changes or new dependency requested. No bundle measurement was run.
- Tooltip trigger behavior follows Radix controlled/uncontrolled `open`, `defaultOpen`, and `onOpenChange`. `TooltipContent` accepts optional `shortcut` content and preserves other Radix content props.

## Open issues

- None.

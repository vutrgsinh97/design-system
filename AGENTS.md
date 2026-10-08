# Agent instructions

Read `README.md` and `REVIEW.md` before editing this repository. Read the assigned brief in `ai-handoffs/tasks/` when one is supplied. Do not edit files outside that brief's scope without recording the reason in the report.

The public React package is `packages/ui-react-web`. Keep each component under either `src/desktop/components/<Name>/` or `src/mobile/components/<Name>/`, with its `index.tsx` and `<Name>.module.css`. Do not import one view implementation from the other. Preserve separate desktop/mobile entry points, ESM output, per-component CSS, `peerDependencies` for React, and the `'use client'` boundary on components that require the browser. Run `pnpm check` after package changes. If dependencies cannot be installed, report exactly which checks were not run.

Write the outcome to `ai-handoffs/reports/<task-id>.md` using the report template. Include changed paths, tests and command results, API or bundle implications, and open issues. Do not mark an item complete based on configuration alone when the brief calls for a production build.

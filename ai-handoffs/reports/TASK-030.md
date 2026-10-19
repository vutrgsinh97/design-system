# TASK-030: Desktop Panel composite

- Status: completed on 2026-10-09.
- Owner: root.

## Changed files

- `packages/ui-react-web/src/desktop/components/Panel/`: added compound Panel shell, header, icon-only Back button, title, right actions, content, optional footer, and token-based CSS.
- `packages/ui-react-web/src/desktop/index.ts`, `packages/ui-react-web/package.json`: exposed Panel through root/desktop barrels and `/panel`, `/desktop/panel` subpaths. Mobile entry was not changed.
- `apps/next-example/app/PanelShowcase.tsx`, `panel-showcase.module.css`, `page.tsx`: added minimal, header-actions, and footer variants at `/#panel` with demo callbacks.
- `tests/ui-react-web/TASK-030/panel.test.tsx`: added accessible title, optional-slot, keyboard, callback, default button-type, ref, and disabled behavior checks.
- `apps/vite-example/src/fixtures/desktop-panel-only.tsx`, `desktop-panel-minimal-only.tsx`, `apps/vite-example/scripts/check-bundle.mjs`: checked isolated Panel import and that Button-only imports exclude Panel JS/CSS.
- `README.md`, `packages/ui-react-web/README.md`, `COMPONENT-INVENTORY.md`, `CONSUMER-GUIDE.md`, `.changeset/desktop-panel-composite.md`: documented API, scope, local preview archive, and release note.
- `ai-handoffs/tasks/TASK-030.md`: recorded brief and acceptance.

## Verification

- `pnpm check`: passed; 16 test files, 62 tests. Panel direct-import fixtures passed, including a minimal Panel that excludes Button JS/CSS. Button-only fixture remained 1,223 B JS / 9,297 B CSS and excludes Panel. Panel-with-Back fixture is 3,310 B JS / 10,769 B CSS; minimal Panel is 1,607 B JS / 3,832 B CSS, unminified.
- `pnpm --filter next-example build`, `pnpm --filter next-mobile-example build`, `pnpm --filter vite-example build`: all passed. Mobile build was compatibility only.
- Browser QA on `http://localhost:3004/#panel`: visually checked all three variants and distinct footer, confirmed Back button accessible name and consumer callback. The app's demo status changed after clicking Back.
- `git diff --check`, relative documentation links, and JavaScript syntax check passed after the final changes.
- Preview tarball `release-candidates/company-ui-react-web-0.1.0-panel-preview-v2.tgz`: 30,786 B, SHA-256 `06d244feaca67951d4b1f59f216645c5c537a3355369408270c7ddf26337ca70`. All 77 public export targets resolve; archive includes 35 JS, 35 declaration, 34 CSS files, including Panel assets.

## API and bundle impact

- Additive desktop-only API. `PanelBackButton` reuses the shared Button primitive and requires `aria-label`. Navigation and all right/footer actions remain consumer-owned. No new runtime dependency or mobile implementation.
- PanelBackButton lives in a separate module. A minimal Panel import excludes Button JS/CSS (1,607 B JS / 3,832 B CSS); the Back variant includes the shared Button (3,310 B JS / 10,769 B CSS). Unrelated desktop modules stay out of both direct imports.
- The v2 preview tarball is an installable local artifact, not a registry release; the earlier preview remains for comparison. It retains internal version `0.1.0`; filename and checksum distinguish it from the earlier pre-Panel candidate.

## Open issues

- Consumer applications should verify their own route navigation and production bundle. The demo does not implement app navigation or data saving.

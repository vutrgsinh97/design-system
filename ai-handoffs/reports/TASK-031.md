# TASK-031: Desktop Modal and Toast

- Status: completed on 2026-10-09.
- Owner: root.

## Changed files

- `packages/ui-react-web/src/desktop/components/Modal/`: added a controlled/uncontrolled convenience Modal over the existing Dialog with title, description, arbitrary content, footer, optional trigger and close control.
- `packages/ui-react-web/src/desktop/components/Dialog/Dialog.module.css`, `src/desktop/components/Toast/`: added token-based entrance/exit motion, four Toast statuses, and six fixed viewport positions.
- `packages/ui-react-web/src/styles/theme.css`, `src/desktop/index.ts`, `package.json`: added overlay/motion tokens, types, barrel exports, and direct `/modal` and `/desktop/modal` exports.
- `apps/next-example/app/ModalToastShowcase.tsx`, `modal-toast-showcase.module.css`, `page.tsx`: added interactive Modal and Toast examples at `/#modal-toast`.
- `tests/ui-react-web/TASK-031/modal-toast.test.tsx`, `apps/vite-example/src/fixtures/desktop-modal-only.tsx`, `apps/vite-example/scripts/check-bundle.mjs`: added interaction and bundle-isolation checks.
- `README.md`, `packages/ui-react-web/README.md`, `CONSUMER-GUIDE.md`, `COMPONENT-INVENTORY.md`, `.changeset/desktop-modal-toast.md`, `ai-handoffs/README.md`, `tasks/TASK-031.md`: documented usage, scope, and release impact.

## Verification

- `pnpm check`: passed; 17 test files, 64 tests. Direct Modal fixture includes Dialog and excludes Toast. Button-only fixture excludes Modal; no unrelated desktop/mobile component was pulled in.
- `pnpm --filter next-example build`, `pnpm --filter next-mobile-example build`, `pnpm --filter vite-example build`: passed after package changes. The Next desktop app was rebuilt once more after the final showcase refactor; it passed.
- Browser QA against a temporary production server at `http://127.0.0.1:3004/#modal-toast`: visually checked delete Modal content and footer, closing it, and a warning Toast at top-left. The server and temporary browser tab were stopped after QA.
- `git diff --check`: passed. `import.meta.resolve('@company/ui-react-web/modal')` resolves the public path to `dist/desktop/components/Modal/index.js`. Raw Node ESM import is unavailable because this UI package imports CSS; production Next/Vite builds and the direct-import Vite fixture passed.

## API and bundle impact

- Additive desktop API: `Modal`, `ModalProps`, `ToastStatus`, `ToastPosition`, and optional `Toast.status` / `ToastViewport.position`. Existing `Toast.variant` and Dialog APIs remain available. No new runtime dependency or mobile implementation.
- Motion uses shared `--ds-motion-*` tokens and is skipped when `prefers-reduced-motion: reduce` is active. Toast status colors and Modal overlay use shared semantic tokens.
- Unminified direct-import bundle from the Vite isolation check: Modal 95,345 B JS / 5,926 B CSS; Dialog 91,831 B JS / 4,792 B CSS; Toast 88,844 B JS / 6,408 B CSS. Radix dependencies account for most JS. Direct Modal import does not include Toast.

## Open issues

- `next dev` could not start its FSEvent watcher in this sandbox; production `next start` worked for browser QA. Consumer applications own action handlers and the Toast notification list/lifecycle.

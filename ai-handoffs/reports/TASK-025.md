# TASK-025 report — Developer workspace showcase

## Delivered

- Added `/developer-workspace` in `apps/next-example/app/developer-workspace/` as a desktop-only, fictional developer workspace.
- The view includes project/source navigation with the public `Tree`, file status list with `List`, content/editor placeholder, `Tabs` for Editor / Changes / Preview, a bottom output panel, and responsive desktop sizing.
- Menu actions, workspace settings `Dialog`, save/review notifications via `Toast`, density toggle, and empty-state toggle are interactive. Keyboard behavior is provided by native buttons and the package Tree/List/Tabs/Menu/Dialog primitives.
- Preview demonstrates regular, compact, loading/indeterminate progress, empty, and long code-content states. All repository and process information is static sample data; no Git, terminal, process, or remote service is connected.
- Uses the existing `@company/ui-react-web/desktop` public entry only. No dependency, package export, token, manifest, layout, or navigation changes are needed. Root can add the route link during integration.

## Verification

- `pnpm --filter next-example exec tsc --noEmit --incremental false` — passed.
- `pnpm --filter next-example typecheck` — TypeScript emitted no source diagnostic, but exited with TS5033 because the sandbox denied writing `apps/next-example/tsconfig.tsbuildinfo`; the non-incremental check above avoids that generated file and passes.
- No production build run, per task instruction; route production build remains for the root integration gate.
- Browser/assistive-technology verification not run in this subtask.

## API and bundle notes

- Public API used: `Badge`, `Button`, `Dialog` family, `DropdownMenu` family, `EmptyState`, `List` / `ListItem`, `Progress`, `Tabs` family, `Toast` family, and `Tree` / `TreeItem` from `@company/ui-react-web/desktop`.
- No new library exports or dependencies. These component imports are confined to the new route's client boundary; Next's bundler can include the selected components for this route only. Bundle size was not measured.
- Component CSS is imported by the package components; route layout styling is locally scoped in `workspace.module.css`.

## Limitations

- UI actions that imply project/source creation, review, save, or copy report a demo notification only.
- The editor is display-only and contains fictional source text. Bottom panel tabs and collapse affordance are presentation-only; no real checks/comments are implemented.

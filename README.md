# Internal Design System

One Git repository for shared UI packages. The first package is `@company/ui-react-web`, which is intended for Next.js and Vite React applications. The `@company` scope is a placeholder: replace it with the npm scope owned by your organization before publishing.

## Layout

| Path | Purpose |
| --- | --- |
| `packages/ui-react-web` | React web components, types, CSS, package exports |
| `packages/ui-react-web/src/desktop/components/<Name>` | Desktop implementation and CSS for each component |
| `packages/ui-react-web/src/mobile/components/<Name>` | Independent mobile web implementation and CSS |
| `packages/ui-react-web/src/mobile/styles` | Mobile visual tokens; shared semantic colors remain in `src/styles` |
| `apps/next-example` | Desktop Next.js playground and integration check |
| `apps/next-mobile-example` | Mobile web Next.js playground and integration check |
| `apps/vite-example` | Vite integration check |
| `apps/vite-example/scripts/check-bundle.mjs` | Checks desktop/mobile bundle isolation and excludes Dialog from Button-only builds |
| `ai-handoffs` | Task briefs and reports for agents |
| `REVIEW.md` | Pull request and release review checklist |

The current scope is desktop web and mobile web. Both live in the same React package, with separate implementations and entry points. A consumer installs only `@company/ui-react-web`.

## Quick start: open the playground

Requirements: Node.js 22 and pnpm 11. Run these commands from the repository root:

```sh
pnpm install
pnpm dev:playground
```

Open the URL printed by Next.js in the terminal (normally [http://localhost:3000](http://localhost:3000)). This starts the desktop playground in `apps/next-example`. If port 3000 is occupied, use the URL Next.js prints instead. Press `Ctrl+C` in the terminal to stop both the app and package watcher.

To view the independent mobile web playground, stop the desktop command and run:

```sh
pnpm dev:mobile
```

Open the URL printed by Next.js (normally [http://localhost:3000](http://localhost:3000)). The mobile demo is `apps/next-mobile-example/app/page.tsx`; it includes touch-sized controls and a bottom-aligned Dialog. For the smaller desktop Vite demo, stop the current command and run `pnpm dev:vite`, then open Vite's printed URL (normally [http://localhost:5173](http://localhost:5173)).

Both apps depend on the local package through `workspace:*`. The dev command builds the UI package first, then polls its source and rebuilds JS, types, and CSS when files change. Refresh the browser if your dev server does not pick up a rebuilt package file automatically.

To verify the package without starting a server:

```sh
pnpm check
pnpm --filter next-example build
pnpm --filter next-mobile-example build
pnpm --filter vite-example build
```

## Use this package in another repository

Run `pnpm add /absolute/path/to/design-system/packages/ui-react-web` in the consumer. pnpm 11 links a local directory, so the app sees rebuilt files while `pnpm --filter @company/ui-react-web dev` runs in this repository. Restore the registry dependency and lockfile before committing the consumer. Run `pnpm --filter @company/ui-react-web pack` to verify the actual published files.

## Consumer API

Import the view that the consumer app needs:

```tsx
import { Button as DesktopButton } from '@company/ui-react-web/desktop'
import { Button as MobileButton } from '@company/ui-react-web/mobile'
```

Each view also has direct component entry points such as `@company/ui-react-web/desktop/button` and `@company/ui-react-web/mobile/button`. The original root import (`@company/ui-react-web`) and existing `@company/ui-react-web/button` paths remain desktop aliases for compatibility. New code should use the explicit view path.

The package does not detect the viewport or switch implementations automatically. The consumer chooses desktop or mobile at an app/route entry boundary. Importing both views into one entry can load both implementations. The playground uses two independent Next.js apps because, in this workspace, a single Next.js Turbopack app with desktop and mobile routes also linked desktop CSS from the mobile route. Separate apps produced isolated CSS. Vite production fixtures verify that a Button-only build for either view excludes the other view, Dialog CSS, and Radix.

Both views import their own CSS modules. Shared semantic colors are in `src/styles/theme.css`; mobile has additional visual tokens in `src/mobile/styles/mobile.css`. Consumers can override `--ds-*` and `--ds-mobile-*` CSS variables. React and React DOM remain peer dependencies; the package does not bundle React. The desktop and mobile Dialog entries preserve the `'use client'` directive.

## Release

1. Review changes using `REVIEW.md` and run `pnpm check`.
2. Add a changeset with `pnpm changeset`.
3. Merge the release changeset, then run `pnpm version-packages`.
4. Configure the real package scope, private registry, and CI publishing credentials.
5. Inspect `pnpm --filter @company/ui-react-web pack` before `pnpm release`.

No publish workflow is enabled until the registry and package scope are set. The repository currently has one releaseable package.

## Component policy

- Use native HTML for simple controls. Keep semantic HTML, keyboard access, and focus visibility.
- Use a behavior library only where it removes meaningful accessibility complexity. Dialog currently uses Radix.
- Keep CSS local to each component. Avoid importing one stylesheet containing every component.
- Keep public props consistent: `variant`, `size`, `disabled`, `className`, and standard HTML attributes where applicable.
- Verify Button-only desktop and mobile production bundles before each release.
- Keep desktop and mobile implementations independent; share only tokens, types, or logic that is genuinely platform-neutral.

## Next components

The starter set covers Button, form controls, Card, text, status feedback, and Dialog. Add Tooltip, Popover, Tabs, Toast, Table, Pagination, and date input only when a consumer needs them; each interactive component needs keyboard, focus, and bundle checks before release.

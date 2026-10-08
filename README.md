# Internal Design System

One Git repository for shared UI packages. The first package is `@company/ui-react-web`, which is intended for Next.js and Vite React applications. The `@company` scope is a placeholder: replace it with the npm scope owned by your organization before publishing.

## Layout

| Path | Purpose |
| --- | --- |
| `packages/ui-react-web` | React web components, types, CSS, package exports |
| `packages/ui-react-web/src/components/<Name>` | One folder per component, with `index.tsx` and `<Name>.module.css` |
| `apps/next-example` | Next.js integration and SSR check |
| `apps/vite-example` | Vite integration check |
| `apps/vite-example/scripts/check-bundle.mjs` | Proves a Button-only Vite build excludes Dialog and Radix |
| `ai-handoffs` | Task briefs and reports for agents |
| `REVIEW.md` | Pull request and release review checklist |

Add Vue, Angular, React Native, or Flutter packages when a real consumer needs them. Shared tokens can be extracted into a separate package at that point. The React web package remains the only package a React consumer installs.

## Quick start: open the playground

Requirements: Node.js 22 and pnpm 11. Run these commands from the repository root:

```sh
pnpm install
pnpm dev:playground
```

Open the URL printed by Next.js in the terminal (normally [http://localhost:3000](http://localhost:3000)). The playground is `apps/next-example`: it shows Button variants, form controls, status components, and a Dialog you can open and close. If port 3000 is occupied, use the URL Next.js prints instead. Press `Ctrl+C` in the terminal to stop both the app and package watcher.

For the smaller Vite demo, stop the Next.js command and run:

```sh
pnpm dev:vite
```

Open the URL printed by Vite (normally [http://localhost:5173](http://localhost:5173)). The Vite page is in `apps/vite-example/src/App.tsx`; the fuller Next.js playground is in `apps/next-example/app/page.tsx`.

Both apps depend on the local package through `workspace:*`. The dev command builds the UI package first, then polls its source and rebuilds JS, types, and CSS when files change. Refresh the browser if your dev server does not pick up a rebuilt package file automatically.

To verify the package without starting a server:

```sh
pnpm check
pnpm --filter next-example build
pnpm --filter vite-example build
```

## Use this package in another repository

Run `pnpm add /absolute/path/to/design-system/packages/ui-react-web` in the consumer. pnpm 11 links a local directory, so the app sees rebuilt files while `pnpm --filter @company/ui-react-web dev` runs in this repository. Restore the registry dependency and lockfile before committing the consumer. Run `pnpm --filter @company/ui-react-web pack` to verify the actual published files.

## Consumer API

```tsx
import { Button, Input, Dialog } from '@company/ui-react-web'
```

The root import is tree-shakeable in the verified Vite and Next.js production builds. Every component also has an explicit subpath such as `@company/ui-react-web/button`. Components import their own CSS module; the small theme token file is shared. A consumer may override `--ds-*` variables or set `data-ds-theme="dark"` on a parent element.

`react` and `react-dom` are peer dependencies. The library build preserves individual ESM modules and the `'use client'` directive for Dialog. The package does not bundle React.

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
- Verify a Button-only production bundle before each release.

## Next components

The starter set covers Button, form controls, Card, text, status feedback, and Dialog. Add Tooltip, Popover, Tabs, Toast, Table, Pagination, and date input only when a consumer needs them; each interactive component needs keyboard, focus, and bundle checks before release.

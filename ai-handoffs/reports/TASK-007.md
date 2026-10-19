# TASK-007: Icon gallery in the desktop playground

- Status: completed
- Owner: Codex

## Changed files

- `apps/next-example/app/icons/{page.tsx,IconGallery.tsx,icons.module.css,types.ts}`: added a searchable icon gallery with original and tinted previews, three preview sizes, paged results, and a copy-import action.
- `apps/next-example/app/icons/catalog.ts`: reads SVG names from the icon source directory on the server and sends only icon metadata to the client.
- `apps/next-example/app/icons/svg/[name]/route.ts`: serves individual source SVGs to the gallery without importing the full generated React icon set.
- `apps/next-example/app/layout.tsx` and `globals.css`: added playground navigation and shared theme tokens for both routes.
- `README.md` and `packages/icons-react/README.md`: documented the gallery URL and its development-only role.

## Verification

- `pnpm --filter next-example typecheck`: passed.
- `pnpm --filter next-example build`: passed.
- `pnpm check`: passed.
- `git diff --check`: passed.
- Browser check: `/icons` showed the current 578 SVG files; search for `arrow-down` returned 16 matches, tint preview rendered them in the selected color, and Copy import placed `import { ArrowDownIcon } from '@company/icons-react/arrow-down'` on the browser clipboard.
- HTTP check: `/icons` returned 200 and `/icons/svg/archive` returned 200 with `image/svg+xml`.

## API and bundle impact

- No published package API or dependency changed. The route belongs only to `apps/next-example`.
- The client receives icon names and component names. SVG preview files are requested individually, and only 72 result cards render initially; more appear on demand. The gallery does not import all generated React components.

## Open issues

- All 578 current SVG sources use explicit paint colors rather than `currentColor`. Tint in the gallery is a preview only; generated React icons still preserve those source colors. A deliberate monochrome conversion rule is needed if the icons should inherit Button or theme color.

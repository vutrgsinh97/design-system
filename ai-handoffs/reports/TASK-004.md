# TASK-004: Shared primitives and composable UI

- Status: completed
- Owner: Codex

## Changed files

- `packages/ui-react-web/src/primitives/*`: moved 11 base controls from desktop/mobile trees to one shared implementation per control; retained only small mobile touch and spacing adjustments in local CSS. Added `Label`.
- `packages/ui-react-web/src/composites/FormField/*`: added a shared composition that connects Label to its control and wires hint/error accessibility attributes.
- `packages/ui-react-web/src/{desktop,mobile}/components/Card/*`: added `CardHeader`, `CardTitle`, `CardContent`, and `CardFooter` slots; Card remains a flexible container.
- `packages/ui-react-web/src/mobile/components/Dialog/index.tsx`: scopes portal content as mobile so shared controls inside the portal receive mobile styling.
- `packages/ui-react-web/src/mobile/styles/mobile.css`: maps shared semantic tokens to the mobile palette within a mobile container.
- `packages/ui-react-web/src/{desktop,mobile}/index.ts` and `packages/ui-react-web/package.json`: preserved root, desktop, mobile, and component subpaths while mapping primitive exports to shared files; exposed Label, FormField, and Card slots.
- `apps/next-example`, `apps/next-mobile-example`, `apps/vite-example`: updated demos to show Card composition and FormField; adjusted layout spacing.
- `apps/vite-example/scripts/check-bundle.mjs` and `src/fixtures/form-field-only.tsx`: verify shared Button implementation, FormField dependencies, and Dialog isolation.
- `README.md`, `packages/ui-react-web/README.md`, `REVIEW.md`, `AGENTS.md`: documented and aligned the new source architecture and mobile scope requirement. `AGENTS.md` needed an update because its prior per-view control rule conflicted with the user's new architecture.
- `.changeset/shared-primitives-compositions.md`: records the public API and mobile styling change as a major release.

## Verification

- `pnpm check`: passed (package build, all typechecks, Vite bundle assertions).
- `pnpm --filter @company/ui-react-web pack --pack-destination /private/tmp`: passed; inspected tarball contents for JS, declarations, CSS, and package metadata.
- `pnpm --filter next-example build`: passed.
- `pnpm --filter next-mobile-example build`: passed.
- `pnpm --filter vite-example build`: passed.
- `git diff --check`: passed.
- No dev server was started.

## API and bundle impact

- Existing root, `/desktop`, `/mobile`, and direct primitive imports still resolve. `/mobile/button` and other mobile primitive paths now resolve to shared primitive JS. Mobile primitive palette and touch adjustments require `data-ds-platform="mobile"` on an ancestor; the mobile Dialog applies it to portal content itself.
- New public exports: `Label`, `FormField`, `CardHeader`, `CardTitle`, `CardContent`, `CardFooter`. Direct `/label`, `/form-field`, and view-prefixed paths are available.
- React and React DOM remain peers; no new runtime dependency.
- Vite unminified isolated bundles: shared Button 728 bytes JS / 4,955 bytes CSS; FormField 1,809 bytes JS / 3,974 bytes CSS. Button-only builds exclude Dialog and Radix; FormField-only excludes Card and Dialog. Desktop and mobile Dialog bundles remain isolated.

## Open issues

- Manual visual and keyboard review in a browser remains to be done when a playground is next run. Production builds and static bundle checks passed, but they do not prove visual appearance or interaction behavior.

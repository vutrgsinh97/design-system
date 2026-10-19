# TASK-005: Configurable Button primitives

- Status: completed
- Owner: Codex

## Changed files

- `packages/ui-react-web/src/primitives/Button/*`: added five semantic variants, three sizes, icon placement or accessible icon-only mode, loading, and full-width props. Button colors now resolve through CSS custom properties rather than literal colors in the component.
- `packages/ui-react-web/src/config/button-colors.css`, `src/styles/theme.css`, and `src/mobile/styles/mobile.css`: added editable Button palette and semantic danger tokens for light, dark, and mobile scopes.
- `packages/ui-react-web/src/{desktop,mobile}/index.ts` and `package.json`: exported Button prop types and the palette stylesheet.
- `apps/next-example/app/ButtonShowcase.tsx`, `page.tsx`, and `globals.css`: added a playground gallery for variants, sizes, icons, loading, disabled, full-width, and theme switching.
- `packages/ui-react-web/scripts/watch.mjs`: preserved existing `dist` files during watched rebuilds so the running playground does not temporarily lose package imports.
- `README.md`, `packages/ui-react-web/README.md`, and `.changeset/configurable-button-primitives.md`: documented the Button API, palette overrides, and release change.

## Verification

- `pnpm check`: passed (package build, typechecks, and isolated bundle assertions).
- `pnpm --filter next-example build`: passed.
- `pnpm --filter next-mobile-example build`: passed.
- `pnpm --filter vite-example build`: passed.
- `pnpm --filter next-example typecheck`: passed after the final playground layout adjustment.
- `pnpm --filter @company/ui-react-web pack --pack-destination /private/tmp`: passed; tarball contains `dist/config/button-colors.css`.
- `git diff --check`: passed.
- Visually checked the live Next playground in light and dark themes, including icon-only accessibility name and full-width layout. Triggered a watched rebuild while the playground was open and confirmed it remained available.

## API and bundle impact

- Public Button API adds `variant` (`primary`, `secondary`, `outline`, `ghost`, `danger`), `size` (`sm`, `md`, `lg`), `startIcon`, `endIcon`, `iconOnly`, `icon`, `loading`, and `fullWidth`; native button props still pass through. Icon-only mode requires `aria-label`.
- Consumers can override `--ds-button-*` CSS properties at runtime in a theme or container. Default light, dark, and mobile values are defined in the package. There are no literal text/background colors in Button JSX or its module CSS.
- No new runtime dependency. Isolated Button-only Vite output: 1,223 bytes unminified JS and 7,971 bytes unminified CSS; Dialog and Radix remain absent from this bundle.

## Open issues

None.

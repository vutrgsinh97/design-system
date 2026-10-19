# @vutrgsinh97/icons-react

React icon components generated from the SVG files in `assets/svg`. This package is separate from `@vutrgsinh97/ui-react-web`: apps that choose icons install it explicitly, while Button continues to accept any React element through `icon`, `startIcon`, or `endIcon`.

The two `example-*` SVGs are temporary examples, not the product icon set. Remove them when the real Figma exports arrive.

To inspect the complete source set visually, run `pnpm dev:playground` from the repository root and open `/icons` on the printed local URL. The gallery is a development-only route in `apps/next-example`; it reads SVGs from this package without importing every React icon into consumer bundles.

## Add icons

1. Export icons from Figma as individual SVG files and place them in `assets/svg`. Subfolders are allowed.
2. Use descriptive filenames. The generator converts folders and filenames to kebab-case subpaths, so `navigation/arrow-left.svg` becomes `@vutrgsinh97/icons-react/navigation-arrow-left` and `NavigationArrowLeftIcon`. Colliding normalized names stop the build.
3. For a monochrome icon that should follow Button or theme colors, use `currentColor` for its relevant `fill` or `stroke` attributes. Preserve explicit colors for multicolor artwork. Keep `viewBox` in each SVG.
4. From the repository root, run `pnpm --filter @vutrgsinh97/icons-react build`. The build runs SVGR and SVGO, then emits ESM JavaScript and TypeScript declarations. Generated files under `src/icons` and `dist` are ignored by Git; commit the original SVGs.

Example:

```tsx
import { ExamplePlusIcon } from '@vutrgsinh97/icons-react/example-plus'
import { Button } from '@vutrgsinh97/ui-react-web/button'

<Button startIcon={<ExamplePlusIcon />}>Add item</Button>
```

Only explicit icon subpaths are public. There is no root export of all icons or runtime lookup by string name. This keeps unused icons out of ordinary consumer bundles. The root export only provides `IconProps` as a TypeScript type.

SVGs render at `1em` by default and receive `aria-hidden` and `focusable="false"`; pass SVG props to adjust them when an icon itself needs an accessible name. An icon inside Button is decorative because Button supplies the accessible label.

## Local development and release

`pnpm dev:playground` starts the icon watcher alongside the UI package and app. Changes under `assets/svg` regenerate and rebuild the icon package. In another repository, link the local package with `pnpm add /absolute/path/to/design-system/packages/icons-react` and run `pnpm --filter @vutrgsinh97/icons-react dev` here. Restore the registry dependency before committing that consumer.

Run `pnpm check` and `pnpm --filter @vutrgsinh97/icons-react pack --pack-destination /private/tmp` before release. Publishing to GitHub Packages runs from the root release workflow; see the root README. Future Vue or other framework wrappers should be generated from the same `assets/svg` source rather than duplicating the SVG library.

# TASK-006: React icon package scaffold

- Status: completed
- Owner: Codex

## Changed files

- `packages/icons-react/assets/svg/*`: added two clearly named temporary SVG examples and the destination for future Figma exports.
- `packages/icons-react/scripts/generate.mjs`: normalizes nested SVG filenames, checks collisions, optimizes SVG through SVGO, generates one typed React component per icon with SVGR, and removes stale generated icon outputs.
- `packages/icons-react/scripts/watch.mjs`: rebuilds icons when SVG sources change during local development.
- `packages/icons-react/scripts/check-bundle.mjs`: confirms importing one icon subpath includes only that icon in a browser JS bundle.
- `packages/icons-react/{package.json,tsconfig.build.json,.gitignore,src/index.ts,README.md}`: defines the separate ESM package, per-icon public exports, React peer dependency, build, and usage instructions.
- `package.json` and `pnpm-lock.yaml`: adds the icon package to workspace build, typecheck, bundle check, and playground watchers; installs SVGR build tools.
- `README.md`, `AGENTS.md`, `REVIEW.md`: documents the new package and its import and review policy.
- `.changeset/icon-source.md`: records the new package API for release.

## Verification

- `pnpm install`: passed.
- `pnpm check`: passed (both package builds, all app and package typechecks, UI bundle checks, and icon-only bundle check).
- `pnpm --filter next-example build`: passed.
- `pnpm --filter next-mobile-example build`: passed.
- `pnpm --filter vite-example build`: passed.
- `pnpm --filter @company/icons-react pack --pack-destination /private/tmp`: passed; tarball contains JS, declarations, package metadata, and README. Raw SVG sources and build tooling are excluded.
- `pnpm --filter @company/icons-react exec node -e "import('@company/icons-react/example-plus').then(m=>console.log(Object.keys(m)))"`: passed; default and named exports resolve.
- Started the icon watcher, touched one sample SVG, and observed an automatic successful rebuild.
- `git diff --check`: passed.

## API and bundle impact

- New `@company/icons-react` package exposes one subpath per source SVG, such as `/example-plus`, plus root `IconProps` type. Each subpath exports a default component and a named component such as `ExamplePlusIcon`.
- The package has no runtime dependency; React is a peer dependency. SVGR and SVGO are build-only dependencies.
- A browser bundle importing only `example-arrow-right` contained 557 bytes of unminified JS and exactly one of two available icon modules. `@company/ui-react-web` remains independent of this icon package.

## Open issues

- The two `example-*` SVGs are placeholders. Replace them with the user's Figma exports when supplied, then inspect special cases such as multicolor icons, gradients, and names that normalize to the same subpath.

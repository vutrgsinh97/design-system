# TASK-008: Primitive catalog and Input adornments

- Status: completed
- Owner: Codex

## Changed files

- `packages/ui-react-web/src/primitives/Input/{index.tsx,Input.module.css}`: added token-driven visual prefix/suffix slots while keeping the forwarded ref and native input attributes on the actual input.
- `apps/next-example/app/primitives/{page.tsx,PrimitiveGallery.tsx,primitives.module.css}`: added a browsable catalog for all 12 existing primitives, including disabled, error, and dark preview examples.
- `apps/next-example/app/layout.tsx`: linked the catalog from playground navigation.
- `README.md` and `packages/ui-react-web/README.md`: documented the catalog, Input API, and future visual composer architecture.
- `.changeset/input-adornments-catalog.md`: recorded the public Input API addition.

## Verification

- `pnpm check`: passed, including package builds, all app typechecks, icon isolation, Button-only and FormField-only bundle checks.
- `pnpm --filter next-example build`: passed; `/primitives` is a statically rendered route.
- `git diff --check`: passed.
- Browser preview was not run because the previously stopped playground was not available at `192.168.1.32:3000` during this task; no server was started or stopped.

## API and bundle impact

- `InputProps` now exposes optional `prefix` and `suffix` React nodes. The native HTML `prefix` attribute is intentionally replaced by the visual slot. No new runtime dependencies were added.
- Input continues to render only `<input>` without adornments. With adornments it renders a visual wrapper, while `ref`, native attributes, and className stay on the input. The wrapper's focus, invalid, disabled, and color styling uses design tokens.
- The catalog is playground-only and is not exported from the package.

## Open issues

- The future drag-and-drop Card composer requires explicit layout/content primitives and a serializable component registry/code generator. It is intentionally not part of this milestone.

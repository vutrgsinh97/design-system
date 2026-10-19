# TASK-009: Floating label for Input fields

- Status: completed
- Owner: Codex

## Changed files

- `packages/ui-react-web/src/composites/FormField/{index.tsx,FormField.module.css}`: added `labelPlacement="floating"` for a single-line Input while retaining the existing outside label by default. The real label remains associated with the input ID; CSS follows focus and populated state without React state.
- `apps/next-example/app/primitives/PrimitiveGallery.tsx`: added empty, prefilled, error, and disabled examples.
- `README.md` and `packages/ui-react-web/README.md`: documented the API and usage limits.
- `.changeset/floating-form-field.md`: recorded the public API addition.

## Verification

- `pnpm check`: passed (package builds, all app typechecks, icon isolation, Button-only and FormField-only bundle checks).
- `pnpm --filter next-example build`: passed; `/primitives` rendered as a static route.
- `pnpm --filter next-mobile-example build`: passed.
- `pnpm --filter vite-example build`: passed.
- `git diff --check`: passed.
- Browser check using a temporary production server on port 3101: empty label appeared inside the input; focus moved it to the border; typed value kept it afloat after blur; clearing the value and blurring returned it inside. Clicking the label focused the input. Prefilled, error, disabled, and dark theme examples rendered correctly. The temporary server was stopped after verification.

## API and bundle impact

- Added optional `FormFieldProps.labelPlacement: 'outside' | 'floating'`; the default is `outside`, preserving existing consumers. The floating variant is intended for a single-line Input.
- No runtime dependency added. FormField-only bundle measured 2,819 bytes JS and 8,007 bytes CSS after the change; Button-only remained 1,223 bytes JS and 7,971 bytes CSS.
- Floating state uses CSS `:focus-within` and `:placeholder-shown`/`:has()` so it supports controlled and uncontrolled values without a client-only hook. Motion is disabled under `prefers-reduced-motion`.

## Open issues

- Floating labels are documented for single-line Input only. Select and Textarea retain outside labels.

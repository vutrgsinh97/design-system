# TOKENS-PRIMITIVES: Migrate primitives and desktop/mobile content components to foundation tokens

- Status: completed
- Owner: Claude (side session of the token-migration group)

## Changed files

Base check: `src/styles/theme.css` defines `--ds-font-size-md` and `--ds-z-modal` (commit 792af3e), so the migration went ahead.

All in `packages/ui-react-web/src`, `*.module.css` only. No TSX, export or API changes.

- `primitives/{Badge,Button,Checkbox,Input,Label,Radio,Select,Switch,Text,Textarea}/*.module.css`: font shorthands, font-size, line-height, spacing and transition durations now use tokens.
- `primitives/{Divider,Spinner}`: no changes needed. They already use tokens or have only sizes, borders and animation loop timings.
- `composites/FormField/FormField.module.css`: hint/error fonts, floating-label font size, weight and line height, label padding, mobile gap, and the 150ms label transitions.
- `desktop/components/{Card,Panel,Table,List,Tree,Tabs,EmptyState,Alert}/*.module.css`: fonts, line heights and spacing.
- `desktop/components/{SplitPane,Progress}`: no changes. Only sizes, pill radii, `z-index: 1` and animation timing remain.
- `mobile/components/Card/Card.module.css`: spacing and title font.
- `mobile/components/Alert/Alert.module.css`: radius (`0.875rem` → `--ds-radius-lg`, exact), font, padding-top/bottom.
- `.changeset/tokens-primitives-migration.md`: patch changeset.

Not touched (owned by another session): Dialog, Modal, Menu, Tooltip, Toast, PromiseToast, Combobox, mobile Dialog.

### Roundings (every value that is not an exact match)

| Where | Before | After | Difference |
|---|---|---|---|
| Input (×2), Select: `font` line height | 1.35 | `--ds-line-height-snug` 1.4 | 18.9 → 19.6px (+0.7px) |
| List primary/secondary line height | 1.35 | snug 1.4 | +0.7px / +0.6px |
| EmptyState title line height | 1.35 | snug 1.4 | 21.6 → 22.4px (+0.8px) |
| Card title (desktop + mobile) | 1.3 | `--ds-line-height-tight` 1.25 | 23.4 → 22.5px (−0.9px) |
| Panel title | 1.3 | tight 1.25 | 26 → 25px (−1px) |
| Badge compact font size | 0.6875rem | `--ds-font-size-xs` 0.75rem | 11 → 12px (+1px); badge height unchanged at 20px |
| Mobile Alert font size | 0.9375rem | `--ds-font-size-md` 1rem | 15 → 16px (+1px); sm (14px) was equally close, md picked for mobile readability |
| Button transitions | 140ms | `--ds-motion-duration-base` 150ms | +10ms |
| Switch track/thumb transitions | 120ms | `--ds-motion-duration-fast` 100ms | −20ms |
| Switch thumb shadow | `0 1px 3px rgb(0 0 0 / 20%)` | `--ds-shadow-sm` | light 12% tinted, dark 30% black |

FormField's 150ms transitions are exact matches for `--ds-motion-duration-base`.

### Deliberately left hard-coded

- Spacing values with no token within 1px: 0.125, 0.375, 0.625, 0.875, 1.125, 2.25rem and the 0.0625rem hairlines. Examples: Button sm/md padding, Badge padding and gap, Table cell padding-block 0.625rem, the Card header gap 0.375rem, FormField gap 0.375rem and floating-input padding-inline 0.875rem.
- FormField floating padding-block `1.15rem 0.4rem` and compact `0.9rem 0.2rem`. The 0.2rem value is within 1px of space-1, but it is paired with a value that has no token and calibrates the floating label position, so the pair stays together. The label's `translate(-0.25rem, …)` is a transform offset, not spacing.
- Sizes and heights (min-height, width/height, control heights; `--ds-control-height` kept), 999px/50% pill radii, the mobile Card radius 1.5rem (no token), and the Badge danger-dot radius.
- Spinner (650ms) and Progress (1.3s) animation loop durations. They are loop timings, not transition durations.
- Switch thumb `#fff`. `--ds-color-on-primary` is `#102555` in dark, and on the unchecked dark track (`#40506a`) the thumb almost disappears. Checked in the browser with an on-primary clone next to the real switch, so `#fff` stays. Only the shadow moved to `--ds-shadow-sm`.
- Inset 2–3px selection bars (Table, List, Tree) are borders drawn with `box-shadow`, not elevation.

## Verification

- `pnpm check`: passed. Build, typecheck, 19 test files / 71 tests, icon-only bundle check (1 of 578 icons), shared primitive and view-specific composite bundle checks.
- Production builds: `pnpm --filter next-example build`, `pnpm --filter next-mobile-example build` and `pnpm --filter vite-example build` all passed (exit 0).
- Playground comparison (`next-example` dev server on :4817 with the package rebuilt, Components `/` and Primitives `/primitives`): before editing, I recorded the computed styles (font size, weight, line height, padding, margin, gap, radius, box-shadow, transition duration, background, size and bounding box) of every `ds-*` element in light and dark and in default and compact density. After the rebuild I diffed the same snapshots. Every difference comes from a rounding listed above (or the elements below it moving up or down). No other property changed in either theme or density. The Switch was also checked with screenshots in light and dark.
- Not covered by the browser diff: mobile-only (`data-ds-platform='mobile'`) rules and the mobile Card/Alert, because the desktop playground does not render them. Those edits are exact token matches apart from the mobile Alert font size listed above. The mobile playground production build passed.

## API and bundle impact

No public API, export, TSX or dependency changes. The CSS stays per component. Each file only swaps literals for `var(--ds-*)` references to tokens already defined in `theme.css`, so the size change is a few bytes per file. Release: patch changeset.

## Open issues

- Several common spacing values (0.375rem/6px, 0.625rem/10px, 0.875rem/14px) have no token. If the scale gets a `space-1.5`/`space-2.5`/`space-3.5`, or the components move to the existing steps, the remaining literals can be migrated.
- The mobile Card radius (1.5rem) has no radius token. A `--ds-radius-xl` would cover it.
- Choosing md over sm for the mobile Alert font size is a judgment call. Revert to sm if 15→14px is preferred.

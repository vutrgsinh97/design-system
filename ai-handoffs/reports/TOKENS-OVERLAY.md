# TOKENS-OVERLAY: Overlay components on foundation tokens

- Status: completed
- Owner: side session (overlay group of the token migration)

## Changed files

Only `*.module.css` files in the overlay group changed. No TSX, exports or existing tests changed.

- `packages/ui-react-web/src/desktop/components/Dialog/Dialog.module.css`: overlay z `1000` → `--ds-z-overlay`, content z `1001` → `--ds-z-modal`, padding → `--ds-space-6`, exit easing `ease-in` → `--ds-motion-ease-in`.
- `packages/ui-react-web/src/desktop/components/Modal/Modal.module.css`: title size/weight/line height, description and body line height, close glyph font, header/body/footer padding, footer gap and close offsets → tokens.
- `packages/ui-react-web/src/desktop/components/Menu/Menu.module.css`: z `1000` → `--ds-z-dropdown`, content/separator/compact padding, item gap, weights and line heights, enter animation `100ms ease-out` → `--ds-motion-duration-fast` + `--ds-motion-ease-out`.
- `packages/ui-react-web/src/desktop/components/Tooltip/Tooltip.module.css`: z `1100` → `--ds-z-tooltip`, gap, weights, line heights, shortcut font size and padding → tokens.
- `packages/ui-react-web/src/desktop/components/Toast/Toast.module.css`: viewport z `1100` → `--ds-z-toast`, viewport offsets, toast padding, compact gap and padding, weights, sizes and line heights, exit easing → tokens.
- `packages/ui-react-web/src/desktop/components/Combobox/Combobox.module.css`: popup z `1000` → `--ds-z-dropdown`, input/listbox/message/compact padding, popup margin, metadata margin, weights and line heights → tokens.
- `packages/ui-react-web/src/mobile/components/Dialog/Dialog.module.css`: overlay/content z → `--ds-z-overlay`/`--ds-z-modal`, content padding and handle bottom margin → `--ds-space-8`/`--ds-space-5`. The mobile Dialog already imports `styles/theme.css`, so the tokens resolve in the mobile view.
- `packages/ui-react-web/src/desktop/components/Toast/PromiseToast.module.css`: no change; its only value (`gap: 0.625rem`) has no token.
- `tests/ui-react-web/tokens-overlay.test.tsx` (new): opens a DropdownMenu inside an open Dialog and checks that the menu content's z-index is greater than the dialog content's. jsdom does not load CSS modules or resolve `var()`, so the test reads the `z-index` rule for each rendered element's `ds-*` class from its module file and resolves the token from `theme.css`. Against the old Menu CSS it fails with `expected 1000 to be greater than 1300`.
- `.changeset/tokens-overlay.md` (new): patch changeset.

### Roundings (off by ≤1px)

| File | Value | Token | Effect |
| --- | --- | --- | --- |
| Menu, Combobox, Toast title | line-height `1.35` | `--ds-line-height-snug` (1.4) | +0.7px per 14px line (+0.65px at 13px compact). Menu items and the Combobox input keep their min-heights, so they don't change. Toast is +0.7px. Each Combobox option is +1.3px because its description inherits the line height, so the 3-option playground popup is +3.9px. |
| Modal title | line-height `1.3` | `--ds-line-height-tight` (1.25) | −1px at 20px; modal 215px → 214px |
| Tooltip shortcut | font-size `0.6875rem` (11px) | `--ds-font-size-xs` (12px) | chip +1.8px tall; tooltip 33.6px → 35px |
| Tooltip shortcut | line-height `1.2` | `--ds-line-height-tight` (1.25) | +0.55px at the new 12px size; included in the row above |
| Menu compact content | padding `0.1875rem` (3px) | `--ds-space-1` (4px) | compact menu +2px tall, +2px wide |
| Dialog, Toast exit; Menu enter | `ease-in` / `ease-out` keywords | `--ds-motion-ease-in` / `--ds-motion-ease-out` | Animation curve only, with no layout change. `ease-in` is (0.42,0,1,1) vs (0.4,0,1,1). `ease-out` changes more: (0,0,0.58,1) vs (0.2,0,0,1), on the 100ms menu enter. |

### Left as is (no exact or ≤1px token)

- 6px/10px item and button paddings (`0.375rem`, `0.625rem`), 2px chip padding (`0.125rem`), Toast/PromiseToast gaps `0.625rem`, Modal header right padding `3.25rem`, mobile handle `-0.875rem` margin.
- Mobile Dialog `1.5rem` corner radius, which is larger than `--ds-radius-lg`, and its custom upward shadow.
- Compact Menu item `0.8125rem` (13px). It is exactly 1px from both `xs` and `sm`, so there is no single nearest token.
- Toast swipe `transition: transform 80ms ease-out`. 80ms is 20ms from `--ds-motion-duration-fast`.
- Sizes (min-height, width/height, max-width), toast enter offset `±0.75rem`, keyframe translate offsets, `var(..., fallback)` fallbacks, and the 0.01ms reduced-motion overrides, as instructed.

## Verification

- `pnpm check`: passed. Build, all typechecks, 20 test files / 72 tests, and bundle checks.
- `npx vitest run tests/ui-react-web/tokens-overlay.test.tsx`: passed. With `Menu.module.css` temporarily reverted to `HEAD`, it failed as expected (`1000` vs `1300`).
- `git diff --check`: clean.
- Playground (`next-example` dev server on the built package; Components page, plus `/primitives` for Tooltip). I measured computed styles and bounding boxes for the Modal, Dialog, Menu, Toast, Combobox popup and Tooltip twice: once with the new CSS and once with the `HEAD` CSS rebuilt into `dist`. The only differences were the z-index values and the roundings in the table above. In dark (`data-ds-theme="dark"`), the Modal (214px, header padding 24/52/16/24), Toast (71.19px) and Menu (74px) matched the light measurements and used the dark surface color.
- Not checked: screenshots in dark mode. The browser pane was hidden, so captures came back blank, and dark was verified through computed styles only. The compact-density roundings and the mobile Dialog were not opened in a browser; the mobile changes are exact token matches (32/20px padding, 20px margin). I could not observe the Menu enter animation because the pane reported `animation: ease 0s`.

## API and bundle impact

- No public API or dependency changes. CSS output now references `var(--ds-*)` tokens that are already in `theme.css`. Bundle checks passed.
- Stacking change: Dialog/Modal overlay 1000 → 1200 and content 1001 → 1300; Menu/Combobox 1000 → 1400; Toast 1100 → 1500; Tooltip 1100 → 1600. Consumer UI that relied on sitting between the old values (for example a custom element at z 1050 above dialogs) now renders below them.

## Open issues

- The Combobox popup grows about 1.3px per two-line option from the 1.35 → 1.4 rounding. If that is unwanted, keep `1.35` for Combobox options or add a token.
- Compact Menu font size (13px) has no token.

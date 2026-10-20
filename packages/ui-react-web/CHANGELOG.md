# @vutrgsinh97/ui-react-web

## 1.0.0

### Major Changes

- 8575f28: Share React web primitives across desktop and mobile, add Label and FormField, and expose composable Card sections. Mobile primitive visual styles now require `data-ds-platform="mobile"` on an ancestor.

### Minor Changes

- 8575f28: Add configurable Button color tokens, outline variant, icon placement and icon-only actions, and full-width support. The playground now previews variants, sizes, states, and light/dark theme switching.
- 8575f28: Add a composable desktop Modal over Dialog, four Toast statuses, six Toast viewport positions, and token-controlled entrance and exit motion.
- 8575f28: Add a composable desktop Panel with optional icon-only Back button, header actions, and footer, plus isolated public imports.
- e09f9c9: Add a desktop `SearchSelect` (`@vutrgsinh97/ui-react-web/desktop/search-select`): a button-triggered select with a search input in its popup, optional infinite scroll and an optional "create" row. Data, filtering, loading and creation stay with the consumer.
- 8575f28: Add opt-in desktop density tokens and a modular desktop component suite for developer workspaces, including Tabs, Tooltip, List, Menu, Table, Tree, Combobox, SplitPane, Toast, Progress, and EmptyState. Preserve shared primitive and mobile compatibility while adding isolated public subpaths.
- 8575f28: Add an optional floating label placement to FormField for single-line Input controls.
- 792af3e: Add foundation token scales: font sizes (`xs`–`2xl`), font weights, line heights, `space-5`/`space-8`, shadows (`sm`/`md`/`lg`), a z-index scale that keeps dropdowns, toasts and tooltips above modals, and motion durations and easings. Add `data-ds-theme="auto"` to follow the OS color scheme. Existing tokens (`--ds-font-size-content`, `--ds-font-size-metadata`, `--ds-shadow-popover`, modal and toast motion tokens) keep their values and now alias the new scales.
- 8575f28: Add visual prefix and suffix slots to the shared Input primitive while preserving native input props and ref behavior.
- 8575f28: Add a desktop PromiseToast that displays pending, success, and error feedback for a consumer-owned Promise.
- efae458: Add independent desktop and mobile web component entry points while retaining desktop aliases for existing imports.

### Patch Changes

- d1c621c: Overlay components (Dialog, Modal, DropdownMenu, Tooltip, Toast, Combobox and the mobile Dialog) now use the foundation tokens for z-index, typography, spacing and motion. Fixes a DropdownMenu opened inside a Dialog rendering behind it. Rounded to the nearest token: 1.35 line heights become 1.4 (+0.7px per line at 14px), the Modal title line height becomes 1.25 (−1px), the Tooltip shortcut becomes 12px (was 11px), and compact Menu padding becomes 4px (was 3px).
- 15f869d: Primitives, FormField and the desktop Card, Panel, Table, List, Tree, Tabs, SplitPane, Progress, EmptyState and Alert styles (plus mobile Card and Alert) now use the foundation font, spacing, radius, shadow and motion tokens instead of hard-coded values. A few values moved slightly to the nearest token: input/select/list/empty-state line height 1.35 → 1.4, card and panel title line height 1.3 → 1.25, compact Badge text 11px → 12px, mobile Alert text 15px → 16px, Button transitions 140ms → 150ms and Switch transitions 120ms → 100ms.

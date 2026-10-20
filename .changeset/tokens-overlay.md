---
"@vutrgsinh97/ui-react-web": patch
---

Overlay components (Dialog, Modal, DropdownMenu, Tooltip, Toast, Combobox and the mobile Dialog) now use the foundation tokens for z-index, typography, spacing and motion. Fixes a DropdownMenu opened inside a Dialog rendering behind it. Rounded to the nearest token: 1.35 line heights become 1.4 (+0.7px per line at 14px), the Modal title line height becomes 1.25 (−1px), the Tooltip shortcut becomes 12px (was 11px), and compact Menu padding becomes 4px (was 3px).

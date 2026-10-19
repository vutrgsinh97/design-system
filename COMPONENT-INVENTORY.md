# Desktop component inventory

Inventory of the desktop API exported by `@vutrgsinh97/ui-react-web/desktop`. `ready` means the export and documented behavior are implemented and covered by the root G1/G2/G3 checks (typecheck, tests, bundle-isolation checks, and example production builds). `partial` means the exported component intentionally covers a smaller scope than a full-featured control. Final browser interaction review and package tarball inspection are recorded in `ai-handoffs/reports/TASK-028.md`; a full assistive-technology audit remains separate. The later Panel and PromiseToast additions are verified in `ai-handoffs/reports/TASK-030.md` and `ai-handoffs/reports/TASK-032.md`.

All imports below are public package entry points. Each named component is available from the desktop umbrella path; component subpaths are listed where the package manifest provides them. Components without a listed subpath use the umbrella import. The root `@vutrgsinh97/ui-react-web` barrel also re-exports the desktop API.

| Component(s) | Status | Public import path | Variants and states | Limits / notes |
| --- | --- | --- | --- | --- |
| Button | ready | `@vutrgsinh97/ui-react-web/desktop`; `/desktop/button` | primary, secondary, outline, ghost, danger; sm/md/lg; loading, disabled, full width, start/end icon, icon-only | Icon-only use requires an accessible label. Compact density is opt-in. |
| Input | ready | desktop; `/desktop/input` | Native input types/attributes; invalid, disabled, read-only; prefix/suffix; compact | Prefix and suffix are decorative and hidden from assistive technology, not interactive slots. |
| Textarea | ready | desktop; `/desktop/textarea` | Native textarea attributes; invalid, disabled; compact | Uses outside labels; no floating-label mode. |
| Checkbox | ready | desktop; `/desktop/checkbox` | Unchecked, checked, disabled, indeterminate; controlled or native uncontrolled | Indeterminate is set on the native input and reflected accessibly; mobile default remains unchanged. |
| Radio | ready | desktop; `/desktop/radio` | Native checked/disabled states and group keyboard behavior | Grouping and values follow native radio inputs. |
| Switch | ready | desktop; `/desktop/switch` | Native checkbox checked/disabled states with switch semantics | No additional switch-group or persistence behavior. |
| Select | ready | desktop; `/desktop/select` | Native options, disabled, invalid | Native select only; no searchable/custom popup. |
| Label | ready | desktop; `/desktop/label` | Native label attributes and ref | Consumer supplies associated control or `htmlFor`. |
| FormField | ready | desktop; `/desktop/form-field` | Outside or floating label; hint/error; disabled and invalid control relationships | Floating placement supports one single-line Input. Select and Textarea use outside labels. |
| Badge | ready | desktop; `/desktop/badge` | neutral, primary, success, warning, error, pending; legacy danger alias | Content is supplied by the consumer; status meaning should also be conveyed in text. |
| Text | ready | desktop; `/desktop/text` | p/span/div; default, muted, danger, success, warning, pending tones; sm/md/lg | Typographic primitive; does not enforce content semantics beyond selected element. |
| Spinner | ready | desktop; `/desktop/spinner` | sm/md/lg; customizable accessible label | Status text is exposed accessibly; visual animation respects reduced motion. |
| Divider | ready | desktop; `/desktop/divider` | Native horizontal rule | Horizontal separator only. |
| Card, CardHeader, CardTitle, CardContent, CardFooter | ready | desktop; `/desktop/card` | Composable semantic slots | Generic composition; no fixed image, form, or data model. |
| Panel, PanelHeader, PanelBackButton, PanelTitle, PanelActions, PanelContent, PanelFooter | ready | desktop; `/desktop/panel` | Optional icon-only Back, right header actions, flexible content, optional footer; heading level h1/h2/h3; compact | Consumer owns Back navigation and action behavior. Panel does not set a fixed width or route state. |
| Alert | ready | desktop; `/desktop/alert` | info, success, warning, danger; status/alert role | Consumer provides content; not a dismissible notification system. |
| Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose, DialogHeader, DialogBody, DialogFooter | ready | desktop; `/desktop/dialog` | Controlled/uncontrolled open state; focus trap/return; Escape; scrollable body slot | Uses Radix Dialog. Consumer provides trigger and content; no workflow-specific dialog behavior. |
| Modal | ready | desktop; `/modal`, `/desktop/modal` | Title, optional description, arbitrary content and footer; optional trigger and close button | Convenience composition over desktop Dialog; no workflow or API action is built in. |
| Tabs, TabsList, TabsTrigger, TabsContent | ready | desktop; `/desktop/tabs` | Controlled/uncontrolled selection; keyboard navigation; disabled tab; horizontal overflow | No close-tab API. |
| TooltipProvider, Tooltip, TooltipTrigger, TooltipContent | ready | desktop; `/desktop/tooltip` | Hover/focus, controlled/uncontrolled visibility, optional shortcut | Uses Radix Tooltip; content is informational, not an interactive menu. |
| DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator | ready | desktop; `/desktop/menu` | Keyboard navigation/typeahead; disabled, shortcut, destructive items; Escape and focus return | Uses Radix DropdownMenu; submenu API is not included. |
| Table, TableHeader, TableBody, TableRow, TableHeaderCell, TableCell, TableActions | partial | desktop; `/desktop/table` | Native semantic table composition; selected/disabled row; action slot | No built-in selection engine, sorting, pagination, column management, or virtualized DataGrid. |
| List, ListItem | partial | desktop; `/desktop/list` | Static list or single selection; controlled/uncontrolled value; keyboard movement; leading icon, secondary text, badge, trailing actions | Intentionally a list, not an ARIA listbox; no multi-select or data-loading layer. |
| Tree, TreeItem | partial | desktop; `/desktop/tree` | Controlled/uncontrolled expanded IDs and selected ID; keyboard navigation; disabled/loading/has-children metadata | Consumer supplies tree hierarchy and data. No filesystem, Git, or project discovery behavior. |
| Combobox | partial | desktop; `/desktop/combobox` | Controlled value/query; open/highlight state; disabled options; custom option renderer; loading/error/empty states | Consumer owns data fetching and filtering. No built-in async request lifecycle or popup collision engine. |
| SplitPane, ResizeHandle | partial | desktop; `/desktop/split-pane` | Two panes; horizontal/vertical; controlled/uncontrolled pixel size; min/max and optional collapse; pointer/keyboard resize | Two panes only; no persistence or multi-pane layout manager. |
| ToastProvider, Toast, ToastViewport, ToastTitle, ToastDescription, ToastAction, ToastClose | ready | desktop; `/toast`, `/desktop/toast` | info/success/warning/error; six viewport positions; controlled open state; action/close; timed dismissal; polite/assertive announcement mode | Explicit Radix composition, not an imperative global queue; caller manages notification lifecycle. |
| PromiseToast | ready | desktop; `/toast`, `/desktop/toast` | Loading spinner and supplied content while pending; success/error content after settlement; configurable result duration | Observes a consumer-owned Promise for UI feedback only. The consumer starts the task and handles its business result or error. |
| Progress | partial | desktop; `/desktop/progress` | Determinate/indeterminate; min/max; optional label/value; clamped value | Consumer supplies progress value and meaning; no task state management. |
| EmptyState | partial | desktop; `/desktop/empty-state` | Optional icon, title, description, action | Generic presentation only; consumer owns action and recovery behavior. |

## Shared behavior and package notes

- Desktop compact sizing is opt-in through a containing element with `data-ds-platform="desktop"` and `data-ds-density="compact"`. Default desktop and mobile sizing remains unchanged without those attributes.
- Components use scoped CSS and shared semantic tokens. The theme stylesheet is available at `@vutrgsinh97/ui-react-web/theme.css`.
- Radix-backed components use component-specific modules for Dialog, Tabs, Tooltip, DropdownMenu, and Toast. Direct component subpaths were checked for bundle isolation; the umbrella import exposes the full desktop API, while production bundlers can remove unused ESM exports when configured for tree shaking.
- `@vutrgsinh97/ui-react-web/mobile` does not export the desktop-only workspace components. Shared primitives remain available through the mobile entry with mobile styling opt-in as documented in the README.

# @vutrgsinh97/ui-react-web

Internal React web UI package for Next.js and Vite. Published to GitHub Packages; see the root README for install and release steps.

```tsx
import { Button, FormField, Input, Card, CardHeader, CardTitle, CardContent } from '@vutrgsinh97/ui-react-web'

<Card>
  <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
  <CardContent><FormField label="Name"><Input /></FormField><Button>Save</Button></CardContent>
</Card>
```

Controls under `src/primitives` are shared by desktop and mobile web. Card, Alert, and Dialog have separate desktop/mobile implementations. Import mobile compositions from `@vutrgsinh97/ui-react-web/mobile` and set `data-ds-platform="mobile"` on the mobile route/container to enable mobile control styles. Direct paths such as `/button`, `/label`, `/form-field`, `/desktop/card`, and `/mobile/card` are available. The root path remains the desktop composite alias.

See the workspace [README](../../README.md) for playground commands, local development, publishing, and bundle verification.

## Button

The shared Button offers `primary`, `secondary`, `outline`, `ghost`, and `danger` variants, three sizes, optional start/end icons, icon-only actions, loading, and full width. Change its palette in `src/config/button-colors.css` or override `--ds-button-*` variables on a consumer container at runtime. Icon-only buttons require `aria-label`.

## Input

`Input` supports optional visual `prefix` and `suffix` nodes, plus native input props and a forwarded input ref. Important units belong in the visible label because adornments are hidden from assistive technology. Interactive suffix actions should be a separate composite. The default control height is 40px on desktop and 44px in a mobile platform container; width follows the parent layout. Theme colors use `--ds-color-*` tokens.

```tsx
<FormField label="Weight (kg)"><Input suffix="kg" inputMode="decimal" /></FormField>
```

The playground's `/primitives` route shows all currently available shared primitives and their states.

## Floating label

For a single-line Input, use `FormField labelPlacement="floating"` to place the label inside the empty control and move it onto the border on focus or after a value is entered. The label is connected with `htmlFor` and `id`; `value` and `defaultValue` both work without extra state. Other controls continue to use the default outside label.

```tsx
<FormField label="Project name" labelPlacement="floating"><Input name="projectName" /></FormField>
```

## Desktop workspace components

The desktop entry and direct `desktop/<component>` subpaths provide Tabs, Tooltip, List, DropdownMenu, Table, Tree, Combobox, SplitPane, Toast, Progress, and EmptyState. These additions are desktop-only; the mobile entry keeps its current API. A container with `data-ds-platform="desktop" data-ds-density="compact"` opts into compact control and row sizes. See the workspace [component inventory](../../COMPONENT-INVENTORY.md) and [consumer guide](../../CONSUMER-GUIDE.md) for public imports, controlled props, local tarball installation, and limitations.

## Desktop Panel

`Panel` composes a header and content with optional slots. Omit `PanelBackButton`, `PanelActions`, or `PanelFooter` when the screen does not need them. Back is an icon-only Button with a required accessible name; the consumer supplies its `onClick` navigation. Header actions and footer contents are ordinary React children, so the package does not impose Save/Cancel behavior or a fixed panel width.

```tsx
import { Button } from '@vutrgsinh97/ui-react-web/button'
import { Panel, PanelHeader, PanelBackButton, PanelTitle, PanelActions, PanelContent, PanelFooter } from '@vutrgsinh97/ui-react-web/desktop/panel'

<Panel aria-labelledby="settings-title">
  <PanelHeader>
    <PanelBackButton aria-label="Go back" onClick={onBack} />
    <PanelTitle id="settings-title">Settings</PanelTitle>
    <PanelActions><Button variant="ghost">Share</Button></PanelActions>
  </PanelHeader>
  <PanelContent>Any content can go here.</PanelContent>
  <PanelFooter><Button>Save</Button></PanelFooter>
</Panel>
```

The component is desktop-only for now and uses shared semantic CSS tokens. Set `data-ds-platform="desktop" data-ds-density="compact"` on a container for tighter header/content/footer spacing. The root and desktop barrels also export the same Panel API.

## Desktop Modal and Toast

`Modal` is a convenience composition over desktop `Dialog`. Pass `title`, optional `description`, arbitrary `children`, and an optional `footer`. Use `open`/`onOpenChange` for controlled state or supply `trigger` for the standard Radix focus-return path. The package does not execute Save, Delete, or other app actions. Import it from `/modal` or `/desktop/modal`; the lower-level `/dialog` API remains available.

`Toast` remains a separate, non-modal notification. Set `status` to `info`, `success`, `warning`, or `error`, and set `position` on `ToastViewport` to any top/bottom × left/center/right combination. The previous `variant` prop still works. The consumer owns the notification state and can use `duration`, `ToastAction`, or `ToastClose`. Import from `/toast` or `/desktop/toast`.

`PromiseToast` in the same desktop Toast entry observes a Promise supplied by the consumer. It shows a spinner and the supplied loading content while pending, then success or error content and a timed dismissal. The consumer starts and handles the task; this component only owns notification UI state. See the [consumer guide](../../CONSUMER-GUIDE.md) for usage.

Both use shared color and motion tokens. Their entrance and exit motion is disabled when the user prefers reduced motion. Try the examples at `/#modal-toast` in the Next.js playground.

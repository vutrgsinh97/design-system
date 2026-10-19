# Devtool Control UI: Tauri + React + TypeScript

This guide integrates the desktop UI packages into a Tauri frontend. The examples use pnpm and the package names `@company/ui-react-web` and `@company/icons-react`. The `@company` scope is a placeholder; use the exact package files and versions delivered with your application. No registry publishing is required.

## Install a fixed package build

Keep the UI package archive in a versioned local folder such as `vendor/` (or place it beside the consumer during development). Install the UI package from that local tarball:

```sh
pnpm add ./vendor/company-ui-react-web-0.1.0-panel-preview-v2.tgz
```

If the app uses the companion icon package, install its matching tarball separately:

```sh
pnpm add ./vendor/company-icons-react-0.1.0.tgz
```

For active local development, a directory dependency is also supported:

```sh
pnpm add ../design-system/packages/ui-react-web
pnpm add ../design-system/packages/icons-react
```

Use the directory form only while developing against that checkout. For a repeatable application build, install the delivered tarball and commit `package.json` and `pnpm-lock.yaml`. Keep React and React DOM installed by the Tauri app itself; the UI package declares them as peers. The UI components require React 19. Build a Windows, macOS, or Linux Tauri bundle from the normal frontend build script after installing the packages; Tauri does not need a separate UI runtime integration.

After changing the pinned UI package, update the local tarball and dependency entry, then run `pnpm install` to refresh the lockfile. Review the resulting package diff and rebuild the frontend and Tauri app. Do not replace the local archive with a moving branch or registry range in a release build.

## Load the theme and apply a desktop theme

Import the shared theme once from the frontend entry point, before the app styles that override it. Each component also imports its own CSS, so this shared import supplies the semantic color, typography, radius, and spacing defaults without requiring an all-components stylesheet.

```tsx
// src/main.tsx
import '@company/ui-react-web/theme.css'
import './theme-overrides.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

Set `data-ds-theme="dark"` on the app container to use the built-in dark token values. Compact sizing is opt-in on a desktop container:

```tsx
<div data-ds-platform="desktop" data-ds-density="compact">
  <App />
</div>
```

You can brand semantic tokens in your own CSS without editing the package. Keep overrides on an app-owned selector so they do not leak into other embedded surfaces:

```css
/* src/theme-overrides.css */
.devtool-shell {
  --ds-color-primary: #7657d6;
  --ds-color-primary-hover: #6044bd;
  --ds-color-focus: #7657d6;
  --ds-color-surface: #fff;
}

.devtool-shell[data-ds-theme='dark'] {
  --ds-color-surface: #171a24;
}
```

The Button color configuration derives its defaults from these semantic tokens. If you need a separate Button palette, `@company/ui-react-web/button-colors.css` is also a public stylesheet subpath; import it once and override its `--ds-button-*` variables in the app stylesheet.

## Import only public entry points

For a regular desktop app, import components and types from the desktop entry:

```tsx
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  FormField,
  Input,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@company/ui-react-web/desktop'
```

The legacy package root has the same desktop exports. For a small isolated import, the package also provides public subpaths such as `@company/ui-react-web/button`, `@company/ui-react-web/desktop/dialog`, and `@company/ui-react-web/desktop/combobox`. Do not import files from `src/` or `dist/` directly; those paths are package internals.

The icon package is separate and exposes one import per icon. For example:

```tsx
import { ArchiveIcon } from '@company/icons-react/archive'
```

The icons package has no runtime registry of all icons. Import only the icon subpaths used by the app. If you do not install it, the UI controls still work: `Button` accepts any React node for `icon`, `startIcon`, or `endIcon`.

## Compose generic controls

The UI package provides general-purpose pieces. Compose app-specific screens in the consumer; pass ordinary labels, React children, and data rather than adding product workflow behavior to the design system.

```tsx
import { useState } from 'react'
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  FormField,
  Input
} from '@company/ui-react-web/desktop'
import { ArchiveIcon } from '@company/icons-react/archive'

export function WorkspaceCard() {
  const [name, setName] = useState('')

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workspace</CardTitle>
      </CardHeader>
      <CardContent>
        <FormField label="Workspace name" hint="Shown in the window title">
          <Input
            value={name}
            onChange={(event) => setName(event.currentTarget.value)}
            autoComplete="off"
          />
        </FormField>
      </CardContent>
      <CardFooter>
        <Button
          variant="primary"
          startIcon={<ArchiveIcon />}
          onClick={() => console.info('Save workspace', name)}
        >
          Save
        </Button>
      </CardFooter>
    </Card>
  )
}
```

Native input attributes such as `value`, `defaultValue`, `onChange`, `disabled`, and `aria-*` are forwarded. `FormField` connects its label, hint, and error text to its child control. Keep state in the consumer when the app needs to react to a value change.

## Compose an optional Panel shell

The desktop `Panel` exposes a header, content, and optional footer. Add `PanelBackButton` only when the screen has a back action, and add `PanelActions` only when the header needs controls. The back button renders only a left-arrow icon; its accessible label and navigation callback come from the app. Panel width is controlled by its parent layout.

```tsx
import { Button } from '@company/ui-react-web/button'
import { Panel, PanelHeader, PanelBackButton, PanelTitle, PanelActions, PanelContent, PanelFooter } from '@company/ui-react-web/desktop/panel'

export function SettingsPanel({ onBack }: { onBack: () => void }) {
  return (
    <Panel aria-labelledby="settings-panel-title">
      <PanelHeader>
        <PanelBackButton aria-label="Go back" onClick={onBack} />
        <PanelTitle id="settings-panel-title">Settings</PanelTitle>
        <PanelActions><Button variant="ghost">Share</Button></PanelActions>
      </PanelHeader>
      <PanelContent>Place your form, list, or other components here.</PanelContent>
      <PanelFooter><Button>Save changes</Button></PanelFooter>
    </Panel>
  )
}
```

Remove `PanelBackButton`, `PanelActions`, or `PanelFooter` from that composition for simpler layouts. No Back, Share, or Save behavior is built into the Panel.

## Controlled dialogs and event props

Radix-based components preserve controlled and uncontrolled state APIs. To synchronize with a Tauri command or app-level state, own the state and handle the `on*Change` callback in React:

```tsx
import { useState } from 'react'
import {
  Button,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@company/ui-react-web/desktop'

export function ConfirmDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Show details</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ready to continue?</DialogTitle>
          <DialogDescription>This example leaves the app action to its consumer.</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <p>Place the relevant app-owned explanation or form here.</p>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild><Button variant="secondary">Cancel</Button></DialogClose>
          <Button onClick={() => setOpen(false)}>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

`defaultOpen` is available when the component should manage its initial state internally. `onOpenChange` runs for pointer and keyboard dismissal, including Escape. Other controlled APIs include `Tabs value/onValueChange`, `SplitPane size/onSizeChange`, and `Combobox value/onValueChange` plus controlled `query/onQueryChange`; see their exported TypeScript props for the full contract.

### Modal and floating notifications

Use `Modal` when an interaction needs a title, supplied content, and action footer. A single Modal can render information or a destructive confirmation; the application owns what the buttons do:

```tsx
import { Button } from '@company/ui-react-web/button'
import { Modal } from '@company/ui-react-web/modal'

<Modal
  open={open}
  onOpenChange={setOpen}
  title="Delete project?"
  description="This action cannot be undone."
  footer={<><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button variant="danger" onClick={handleDelete}>Delete</Button></>}
>
  <p>Project Atlas and its data will be removed.</p>
</Modal>
```

For a small notification that does not block the page, use Toast. Mount one viewport under a provider; choose its position and give each notification a status. Other positions are `top-left`, `top-center`, `bottom-left`, `bottom-center`, and `bottom-right`.

```tsx
import { ToastProvider, Toast, ToastTitle, ToastDescription, ToastClose, ToastViewport } from '@company/ui-react-web/toast'

<ToastProvider>
  <Toast open={open} onOpenChange={setOpen} status="success" duration={4000}>
    <div><ToastTitle>Saved</ToastTitle><ToastDescription>Changes stored.</ToastDescription></div>
    <ToastClose />
  </Toast>
  <ToastViewport position="top-right" />
</ToastProvider>
```

Available statuses are `info`, `success`, `warning`, and `error`. The earlier `variant` prop remains supported. Colors and motion durations come from `--ds-*` tokens; `prefers-reduced-motion` disables the animation. Toast is a Radix composition, so the caller manages the notification list and lifecycle.

For feedback while an existing task runs, use `PromiseToast` inside the same provider. The consumer starts and handles the Promise; the component only displays a spinner while it is pending and changes to the supplied success or error content after settlement. Pending feedback stays visible until the task settles or the user dismisses it. The result auto-dismisses after `resultDuration` milliseconds (4000 by default). Pass a new `key` for each task when rendering a list of notifications.

```tsx
import { PromiseToast, ToastProvider, ToastViewport } from '@company/ui-react-web/toast'

<ToastProvider>
  {task && (
    <PromiseToast
      key={task.id}
      promise={task.promise}
      loading="Saving changes…"
      success="Changes saved"
      error="Could not save changes"
      onOpenChange={(open) => { if (!open) removeTask(task.id) }}
    />
  )}
  <ToastViewport position="top-right" />
</ToastProvider>
```

The component does not start the task or interpret its result. The consumer must still handle the Promise for its own data, navigation, and error handling.

## Accessibility and keyboard use

- Give icon-only buttons an explicit `aria-label`. Use a visible text label for important actions where space allows.
- Keep a real label on each input. `FormField` creates the association and connects hints and errors through `aria-describedby`.
- Provide both `DialogTitle` and `DialogDescription` when the dialog has a title and explanatory text. Radix handles focus entry, focus containment, Escape dismissal, and focus return.
- Keep native disabled controls disabled. For `Tooltip` and `DropdownMenu`, compose triggers with `asChild` so the underlying button keeps its native keyboard and click behavior.
- Tabs use arrow-key navigation; menus use standard menu keyboard behavior. Use visible focus indicators and do not rely on color alone to communicate selection or errors.
- Keep tooltip text supplemental; the action's accessible name must still make sense when the tooltip is closed.

## Bundle and runtime notes

React and React DOM are peer dependencies and should not be duplicated in the Tauri frontend. The component package ships ESM with per-component CSS. Prefer package subpaths when importing a single component. ESM tree shaking can remove unused named exports from the desktop barrel, but verify the production Vite bundle for your app, especially after adding Radix-based Dialog, Tooltip, Tabs, DropdownMenu, or Toast components. The icon package's per-icon subpaths also allow unused icons to stay out of the bundle.

Import `theme.css` globally once; component CSS is loaded through component imports. Avoid copying package CSS into the app or importing internal CSS module files. Do not dynamically resolve icon names from a string: import an explicit icon subpath to retain tree shaking.

## Update the pinned build

When the design-system release provides a replacement archive, update the local tarball file and versioned dependency, run `pnpm install`, review the lockfile changes, and run the consumer's typecheck, tests, frontend production build, and Tauri packaging check. Keep a known-good prior archive available for rollback until the replacement build has passed those checks. The current verified Panel preview archive is `release-candidates/company-ui-react-web-0.1.0-panel-preview-v2.tgz` (SHA-256 `06d244feaca67951d4b1f59f216645c5c537a3355369408270c7ddf26337ca70`). The earlier `release-candidates/company-ui-react-web-0.1.0.tgz` predates Panel and remains available for comparison. Copy the Panel preview archive into the consumer's versioned `vendor/` directory before using the install command above. This preview archive retains internal package version `0.1.0` and is pinned by its local file checksum; it has not been published to a registry.

# TASK-014: Desktop Tabs

- Status: implemented; root export and integrated bundle gate pending
- Owner: gpt-6-luna

## Changed files

- `packages/ui-react-web/src/desktop/components/Tabs/index.tsx`: added client-side Radix Tabs wrappers with forwarded refs and controlled/uncontrolled state support.
- `packages/ui-react-web/src/desktop/components/Tabs/Tabs.module.css`: added token-based desktop styles, selected/disabled states, focus-visible outline, compact sizing and horizontal scrolling for overflowing tabs.
- `tests/ui-react-web/TASK-014/tabs.test.tsx`: tests controlled selection, associations, keyboard arrows/Home/End, disabled tabs, and overflowing tab list.

## Verification

- `pnpm exec vitest run tests/ui-react-web/TASK-014/tabs.test.tsx`: passed (3 tests).
- `pnpm --filter @company/ui-react-web typecheck`: passed.
- `pnpm check`, example builds, browser visual/accessibility review and isolated production bundle measurement were not run; root owns the integrated gate. JSDOM does not verify painted focus outline or actual scroll behavior; styles provide `:focus-visible` outline and the tablist uses native `overflow-x: auto`.

## API and bundle impact

Proposed public exports for `src/desktop/index.ts`: `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`.

Example:

```tsx
<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList aria-label="Open documents">
    <TabsTrigger value="readme">README.md</TabsTrigger>
    <TabsTrigger value="settings" disabled>Settings</TabsTrigger>
    <TabsTrigger value="source">main.ts</TabsTrigger>
  </TabsList>
  <TabsContent value="readme">...</TabsContent>
  <TabsContent value="settings">...</TabsContent>
  <TabsContent value="source">...</TabsContent>
</Tabs>
```

The wrappers import only `@radix-ui/react-tabs`, which is already a UI package dependency per root; no manifest changes were made. Add isolated `./desktop/tabs` and root `./tabs` export-map paths, and export the four components from the desktop entrypoint. No mobile export is proposed. Production bundle cost has not been measured; verify that a tabs-only consumer includes Tabs runtime and excludes unrelated Radix packages/components.

## Open issues

- Root must add public exports/subpaths and run bundle isolation/integrated build checks.
- Overflow is handled by horizontal native scrolling, including browser focus scrolling; no tab close behavior is imposed.

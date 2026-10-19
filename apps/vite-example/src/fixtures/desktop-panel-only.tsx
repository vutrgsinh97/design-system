import { Panel, PanelHeader, PanelBackButton, PanelTitle, PanelContent, PanelFooter } from '@vutrgsinh97/ui-react-web/desktop/panel'

export function PanelOnly() {
  return (
    <Panel>
      <PanelHeader><PanelBackButton aria-label="Go back" /><PanelTitle>Settings</PanelTitle></PanelHeader>
      <PanelContent>Content</PanelContent>
      <PanelFooter>Footer</PanelFooter>
    </Panel>
  )
}

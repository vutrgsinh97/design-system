import { Panel, PanelHeader, PanelTitle, PanelContent } from '@company/ui-react-web/desktop/panel'

export function PanelMinimalOnly() {
  return (
    <Panel>
      <PanelHeader><PanelTitle>Settings</PanelTitle></PanelHeader>
      <PanelContent>Content</PanelContent>
    </Panel>
  )
}

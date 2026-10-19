'use client'

import { useState } from 'react'
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Combobox, SplitPane, Text } from '@vutrgsinh97/ui-react-web/desktop'
import type { ComboboxOptionData } from '@vutrgsinh97/ui-react-web/desktop'
import styles from './desktop-workspace-controls.module.css'

const allOptions: ComboboxOptionData[] = [
  { value: 'web', label: 'Web app', description: 'apps/web', metadata: 'React' },
  { value: 'api', label: 'API service', description: 'services/api', metadata: 'Java' },
  { value: 'docs', label: 'Documentation', description: 'apps/docs', metadata: 'Next.js' }
]

type ResultMode = 'results' | 'empty' | 'loading' | 'error'

export function DesktopWorkspaceControlsShowcase() {
  const [query, setQuery] = useState('')
  const [value, setValue] = useState<string | null>(null)
  const [mode, setMode] = useState<ResultMode>('results')
  const [compact, setCompact] = useState(false)
  const options = mode === 'results' ? allOptions.filter(option => option.label.toLowerCase().includes(query.toLowerCase())) : []

  return (
    <Card className="demo-card">
      <CardHeader><CardTitle>Search and resize a workspace</CardTitle></CardHeader>
      <CardContent>
        <div className={styles.controls}>
          <Text tone="muted" size="sm">Search results and pane sizes are controlled by the consumer. Use arrow keys in the list and on the resize handle.</Text>
          <Button size="sm" variant="outline" onClick={() => setCompact(current => !current)}>{compact ? 'Comfortable density' : 'Compact density'}</Button>
        </div>
        <div data-ds-platform="desktop" data-ds-density={compact ? 'compact' : 'default'} className={styles.catalog}>
          <div className={styles.search}>
            <label htmlFor="workspace-source-search">Source</label>
            <Combobox
              id="workspace-source-search"
              value={value}
              onValueChange={setValue}
              query={query}
              onQueryChange={setQuery}
              options={options}
              loading={mode === 'loading'}
              error={mode === 'error' ? 'Could not load sources' : undefined}
              emptyContent="No matching sources"
              placeholder="Search sources"
            />
            <div className={styles.modes} aria-label="Combobox demo states">
              {(['results', 'empty', 'loading', 'error'] as const).map(nextMode => (
                <Button key={nextMode} size="sm" variant={mode === nextMode ? 'secondary' : 'ghost'} onClick={() => { setMode(nextMode); setQuery(''); setValue(null) }}>
                  {nextMode}
                </Button>
              ))}
            </div>
            <Text size="sm" tone="muted">Selected: {value ?? 'none'}</Text>
            <Combobox aria-label="Disabled source search" value={null} onValueChange={() => {}} query="" onQueryChange={() => {}} options={[]} disabled placeholder="Unavailable search" />
          </div>
          <div className={styles.resizers}>
            <div>
              <h3>Side by side</h3>
              <SplitPane className={styles.split} defaultSize={170} minSize={100} maxSize={300} collapsible first={<div className={styles.pane}><strong>Sources</strong><span>Drag the handle or use arrow keys.</span></div>} second={<div className={styles.pane}><Badge variant="success">Ready</Badge><p>Preview area with enough text to show how long content remains within its panel.</p></div>} />
            </div>
            <div>
              <h3>Stacked</h3>
              <SplitPane className={styles.split} orientation="vertical" defaultSize={88} minSize={64} maxSize={170} first={<div className={styles.pane}><strong>Editor</strong><span>First panel</span></div>} second={<div className={styles.pane}><strong>Output</strong><span>Second panel</span></div>} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

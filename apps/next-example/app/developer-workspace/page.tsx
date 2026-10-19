'use client'

import { useState } from 'react'
import {
  Badge,
  Button,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  EmptyState,
  List,
  ListItem,
  Progress,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  Tree,
  TreeItem,
} from '@vutrgsinh97/ui-react-web/desktop'
import styles from './workspace.module.css'

const files = [
  { name: 'Button.tsx', path: 'src/components', status: 'Modified', tone: 'warning', icon: 'TS' },
  { name: 'Button.test.tsx', path: 'src/components', status: 'Added', tone: 'success', icon: 'TS' },
  { name: 'tokens.css', path: 'src/styles', status: 'Modified', tone: 'warning', icon: 'CSS' },
  { name: 'README.md', path: 'root', status: 'Unchanged', tone: 'neutral', icon: 'MD' },
]

export default function DeveloperWorkspacePage() {
  const [selectedFile, setSelectedFile] = useState('Button.tsx')
  const [selectedTreeId, setSelectedTreeId] = useState<string | null>('button')
  const [empty, setEmpty] = useState(false)
  const [compact, setCompact] = useState(false)
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('Workspace saved locally')
  const [settingsOpen, setSettingsOpen] = useState(false)

  function notify(message: string) {
    setToastMessage(message)
    setToastOpen(false)
    window.setTimeout(() => setToastOpen(true), 0)
  }

  return (
    <ToastProvider swipeDirection="right">
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
      <main className={styles.workspace} data-ds-platform="desktop" data-ds-theme="dark" data-ds-density={compact ? 'compact' : 'comfortable'}>
        <header className={styles.topbar}>
          <div className={styles.brand}><span className={styles.brandMark}>⌘</span><span>Devspace</span><span className={styles.breadcrumb}>/</span><strong>orbit-ui</strong></div>
          <div className={styles.topActions}>
            <span className={styles.branch}><span aria-hidden="true">⑂</span> feature/button-states</span>
            <DialogTrigger asChild><Button variant="ghost" size="sm">Settings</Button></DialogTrigger>
            <Button variant="secondary" size="sm" onClick={() => notify('Changes saved in this demo')}>Save changes</Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="ghost" size="sm" aria-label="Workspace actions">•••</Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end" aria-label="Workspace actions" data-ds-theme="dark">
                <DropdownMenuItem onSelect={() => notify('Share action previewed')}>Copy share link <span>⌘C</span></DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setCompact(value => !value)}>Toggle compact density</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem destructive onSelect={() => notify('Demo workspace reset')}>Reset demo workspace</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className={styles.frame}>
          <aside className={styles.sidebar} aria-label="Project and source navigation">
            <div className={styles.sideHeading}><span>PROJECT</span><button aria-label="Add project" onClick={() => notify('Project creation is not connected in this demo')}>＋</button></div>
            <div className={styles.projectCard}><span className={styles.projectIcon}>O</span><span><strong>orbit-ui</strong><small>Design system</small></span><span className={styles.chevron}>⌄</span></div>
            <div className={styles.sideHeading}><span>SOURCES</span><button aria-label="Add source" onClick={() => notify('Source picker is not connected in this demo')}>＋</button></div>
            <Tree aria-label="Project files" defaultExpandedIds={['src', 'components', 'styles']} selectedId={selectedTreeId} onSelectedIdChange={(id) => { setSelectedTreeId(id); const names: Record<string, string> = { button: 'Button.tsx', 'button-test': 'Button.test.tsx', input: 'Input.tsx', tokens: 'tokens.css', readme: 'README.md' }; if (id && names[id]) setSelectedFile(names[id]) }}>
              <TreeItem id="src" label="src" icon="▸" hasChildren>
                <TreeItem id="components" label="components" icon="▸" hasChildren>
                  <TreeItem id="button" label="Button.tsx" icon="TS" metadata="M" />
                  <TreeItem id="button-test" label="Button.test.tsx" icon="TS" metadata="A" />
                  <TreeItem id="input" label="Input.tsx" icon="TS" />
                </TreeItem>
                <TreeItem id="styles" label="styles" icon="▸" hasChildren>
                  <TreeItem id="tokens" label="tokens.css" icon="CSS" metadata="M" />
                </TreeItem>
              </TreeItem>
              <TreeItem id="readme" label="README.md" icon="MD" />
              <TreeItem id="indexing" label="design-tokens.json" icon="JS" loading />
              <TreeItem id="archived" label="legacy-theme.css" icon="CSS" disabled metadata="Unavailable" />
            </Tree>
            <div className={styles.sidebarFoot}><span className={styles.avatar}>AL</span><span><strong>Alex Lee</strong><small>Personal workspace</small></span><button aria-label="Account menu" onClick={() => notify('Signed in as Alex Lee')}>⌄</button></div>
          </aside>

          <section className={styles.mainArea} aria-label="Workspace content">
            <div className={styles.filebar}>
              <div className={styles.filebarTitle}><span className={styles.fileIcon}>TS</span><span>{selectedFile}</span><span className={styles.dirtyDot} aria-label="Unsaved changes" /></div>
              <div className={styles.filebarActions}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button variant="ghost" size="sm">File actions ▾</Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end" data-ds-theme="dark">
                    <DropdownMenuItem onSelect={() => notify('Copy file path action previewed')}>Copy file path</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setSelectedFile('Button.test.tsx')}>Open related test</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => notify('File marked for review')}>Mark for review</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button size="sm" onClick={() => notify('Review request created in demo')}>Request review</Button>
              </div>
            </div>

            <Tabs defaultValue="editor" className={styles.editorTabs}>
              <TabsList aria-label="Workspace views">
                <TabsTrigger value="editor">Editor</TabsTrigger>
                <TabsTrigger value="changes">Changes <span className={styles.tabCount}>3</span></TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="editor" className={styles.editorContent}>
                {empty ? <EmptyState className={styles.empty} icon={<span>⌕</span>} title="Nothing to show here" description="This simulated workspace has no open file. Choose a file from the project tree to continue." action={<Button size="sm" onClick={() => setEmpty(false)}>Open Button.tsx</Button>} /> : (
                  <div className={styles.codeWrap}>
                    <div className={styles.codeMeta}><span>src / components / {selectedFile}</span><span>TypeScript · UTF-8 · LF</span></div>
                    <pre className={styles.code} aria-label={`${selectedFile} preview`}><code>{[
                      ['1', 'import { forwardRef } from \'react\''],
                      ['2', 'import styles from \'./Button.module.css\''],
                      ['3', ''],
                      ['4', 'export type ButtonProps = {'],
                      ['5', '  variant?: \'primary\' | \'secondary\' | \'ghost\''],
                      ['6', '  size?: \'sm\' | \'md\' | \'lg\''],
                      ['7', '  loading?: boolean'],
                      ['8', '}'],
                      ['9', ''],
                      ['10', 'export const Button = forwardRef<HTMLButtonElement, ButtonProps>('],
                      ['11', '  function Button({ variant = \'primary\', size = \'md\', ...props }, ref) {'],
                      ['12', '    return ('],
                      ['13', '      <button {...props} ref={ref} data-variant={variant} data-size={size}'],
                      ['14', '        className={styles.button} />'],
                      ['15', '    )'],
                      ['16', '  }'],
                      ['17', ')'],
                    ].map(([line, code]) => <span className={styles.codeLine} key={line}><span className={styles.lineNumber}>{line}</span><span className={styles.syntax}>{code || ' '}</span></span>)}</code></pre>
                    <div className={styles.editorFooter}><span>⌁ TypeScript</span><span>Ln 14, Col 28</span><span>Spaces: 2</span><span>UTF-8</span></div>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="changes" className={styles.tabPanel}>
                <div className={styles.panelHeading}><strong>Changed files</strong><Badge variant="warning">3 changes</Badge></div>
                <List selectionMode="single" aria-label="Changed files" defaultValue="Button.tsx" onValueChange={setSelectedFile}>
                  {files.map(file => <ListItem key={file.name} value={file.name} leadingIcon={<span className={styles.listFileIcon}>{file.icon}</span>} primary={file.name} secondary={file.path} badge={<Badge variant={file.tone as 'warning' | 'success' | 'neutral'}>{file.status}</Badge>} />)}
                </List>
              </TabsContent>
              <TabsContent value="preview" className={styles.previewPanel}>
                <div className={styles.previewHeader}><div><span className={styles.eyebrow}>COMPONENT PREVIEW</span><h2>Button</h2></div><Button variant="secondary" size="sm" onClick={() => notify('Preview refreshed')}>↻ Refresh</Button></div>
                <p>Explore the current component state using demo data.</p>
                <div className={styles.previewCard}><Button>Primary action</Button><Button variant="secondary">Secondary</Button><Button variant="ghost">Quiet action</Button><Button disabled>Disabled</Button></div>
                <div className={styles.previewCard}><Progress label="Migration progress" value={68} showValue /><Progress aria-label="Background task progress" /></div>
                <div className={styles.previewControls}><Button variant="secondary" size="sm" onClick={() => setEmpty(value => !value)}>{empty ? 'Show content' : 'Show empty state'}</Button><Button variant="ghost" size="sm" onClick={() => setCompact(value => !value)}>{compact ? 'Comfortable density' : 'Compact density'}</Button></div>
              </TabsContent>
            </Tabs>

            <section className={styles.bottomPanel} aria-label="Bottom panel">
              <div className={styles.panelTabs}><button className={styles.panelTabActive}>OUTPUT</button><button>PROBLEMS <span>0</span></button><button>COMMENTS <span>2</span></button><button className={styles.panelCollapse} aria-label="Collapse bottom panel" onClick={() => notify('Bottom panel stays visible in this demo')}>⌄</button></div>
              <div className={styles.outputRows}><p><time>10:42:18</time><span className={styles.outputSuccess}>✓</span> Ready to review <span className={styles.outputMuted}>·</span> No checks are running</p><p><time>10:41:52</time><span className={styles.outputInfo}>i</span> Demo workspace loaded with sample data</p></div>
            </section>
            <footer className={styles.statusbar}><span>● Demo session</span><span>feature/button-states</span><span>Changes: 3 files</span><button onClick={() => setEmpty(value => !value)}>{empty ? 'Empty state: on' : 'Empty state: off'}</button><button onClick={() => setCompact(value => !value)}>{compact ? 'Compact' : 'Comfortable'}</button></footer>
          </section>
        </div>

        <DialogContent aria-describedby="workspace-about-description" data-ds-theme="dark">
            <DialogHeader><DialogTitle>Workspace settings</DialogTitle><DialogDescription id="workspace-about-description">This is a local UI showcase populated with fictional project data.</DialogDescription></DialogHeader>
            <DialogBody><p>Project: <strong>orbit-ui</strong></p><p>Source: <strong>Sample repository</strong></p><p>No repository, terminal, process, or remote service is connected.</p></DialogBody>
            <DialogFooter><DialogClose asChild><Button variant="secondary">Close</Button></DialogClose></DialogFooter>
          </DialogContent>
        <Toast open={toastOpen} onOpenChange={setToastOpen} duration={3000}>
          <div><ToastTitle>Demo notification</ToastTitle><ToastDescription>{toastMessage}</ToastDescription></div><ToastClose />
        </Toast>
        <ToastViewport />
      </main>
      </Dialog>
    </ToastProvider>
  )
}

import { fileURLToPath } from 'node:url'
import { build } from 'vite'

const root = fileURLToPath(new URL('../', import.meta.url))

async function inspect(name) {
  const result = await build({
    configFile: false,
    root,
    logLevel: 'silent',
    build: {
      write: false,
      minify: false,
      cssCodeSplit: true,
      lib: {
        entry: fileURLToPath(new URL(`../src/fixtures/${name}.tsx`, import.meta.url)),
        formats: ['es'],
        fileName: name
      },
      rollupOptions: { external: ['react', 'react-dom', 'react/jsx-runtime'] }
    }
  })

  const files = Array.isArray(result) ? result.flatMap((item) => item.output) : result.output
  const js = files.filter((file) => file.type === 'chunk').map((file) => file.code).join('\n')
  const css = files.filter((file) => file.type === 'asset' && file.fileName.endsWith('.css')).map((file) => String(file.source)).join('\n')
  const modules = files.filter((file) => file.type === 'chunk').flatMap((file) => Object.keys(file.modules))
  return { js, css, modules }
}

function assertSharedButton(bundle, name) {
  if (!bundle.modules.some((path) => path.includes('/dist/primitives/Button/'))) throw new Error(`${name} is missing shared Button`)
  if (!bundle.css.includes('.ds-button')) throw new Error(`${name} is missing Button CSS`)
  if (!/\[data-ds-platform=['"]?mobile['"]?\] \.ds-button/.test(bundle.css)) throw new Error(`${name} is missing scoped mobile Button styles`)
  if (bundle.modules.some((path) => /\/dist\/(desktop|mobile)\/components\/Button\//.test(path))) throw new Error(`${name} still imports a view-specific Button`)
  if (bundle.modules.some((path) => path.includes('@radix-ui/react-dialog')) || bundle.css.includes('.ds-dialog') || bundle.css.includes('.ds-mobile-dialog')) {
    throw new Error(`${name} unexpectedly includes Dialog`)
  }
}

function assertDialog(bundle, view) {
  const expected = view === 'desktop' ? '.ds-dialog' : '.ds-mobile-dialog'
  const unexpected = view === 'desktop' ? '.ds-mobile-dialog' : '.ds-dialog'
  if (!bundle.css.includes(expected) || bundle.css.includes(unexpected)) throw new Error(`${view} Dialog CSS isolation failed`)
  if (!bundle.modules.some((path) => path.includes('@radix-ui/react-dialog'))) throw new Error(`${view} Dialog is missing Radix`)
  const other = view === 'desktop' ? 'mobile' : 'desktop'
  if (bundle.modules.some((path) => path.includes(`/dist/${other}/components/`))) throw new Error(`${view} Dialog imports ${other} components`)
}

const legacy = await inspect('button-only')
const desktopButton = await inspect('desktop-button-only')
const mobileButton = await inspect('mobile-button-only')
const desktopDialog = await inspect('desktop-dialog-only')
const modalOnly = await inspect('desktop-modal-only')
const mobileDialog = await inspect('mobile-dialog-only')
const formField = await inspect('form-field-only')
const tabsOnly = await inspect('desktop-tabs-only')
const tooltipOnly = await inspect('desktop-tooltip-only')
const menuOnly = await inspect('desktop-menu-only')
const tableOnly = await inspect('desktop-table-only')
const listOnly = await inspect('desktop-list-only')
const treeOnly = await inspect('desktop-tree-only')
const comboboxOnly = await inspect('desktop-combobox-only')
const searchSelectOnly = await inspect('desktop-search-select-only')
const splitPaneOnly = await inspect('desktop-split-pane-only')
const toastOnly = await inspect('desktop-toast-only')
const promiseToastOnly = await inspect('desktop-promise-toast-only')
const progressOnly = await inspect('desktop-progress-only')
const emptyStateOnly = await inspect('desktop-empty-state-only')
const panelOnly = await inspect('desktop-panel-only')
const panelMinimalOnly = await inspect('desktop-panel-minimal-only')

for (const [name, bundle] of [['root', legacy], ['desktop', desktopButton], ['mobile', mobileButton]]) {
  assertSharedButton(bundle, name)
  const unrelated = ['Tabs', 'Tooltip', 'Menu', 'Table', 'List', 'Tree', 'Combobox', 'SearchSelect', 'SplitPane', 'Toast', 'Progress', 'EmptyState', 'Panel', 'Modal']
  for (const component of unrelated) {
    if (bundle.modules.some((path) => path.includes(`/dist/desktop/components/${component}/`))) throw new Error(`${name} Button unexpectedly imports ${component}`)
  }
  const unrelatedCss = ['tabs', 'tooltip', 'menu', 'table', 'list', 'tree', 'combobox', 'search-select', 'split-pane', 'toast', 'progress', 'empty-state', 'panel', 'modal']
  for (const cssName of unrelatedCss) {
    if (bundle.css.includes(`.ds-${cssName}`)) throw new Error(`${name} Button unexpectedly includes ${cssName} CSS`)
  }
}
assertDialog(desktopDialog, 'desktop')
assertDialog(mobileDialog, 'mobile')
if (!modalOnly.modules.some((path) => path.includes('/dist/desktop/components/Modal/')) || !modalOnly.css.includes('.ds-dialog')) {
  throw new Error('Modal subpath is missing its composition or Dialog CSS')
}
if (modalOnly.modules.some((path) => path.includes('/dist/desktop/components/Toast/')) || modalOnly.css.includes('.ds-toast')) {
  throw new Error('Modal unexpectedly includes Toast')
}
if (!formField.modules.some((path) => path.includes('/dist/composites/FormField/')) || !formField.modules.some((path) => path.includes('/dist/primitives/Label/'))) {
  throw new Error('FormField does not include its shared composition dependencies')
}
if (formField.modules.some((path) => path.includes('@radix-ui/react-dialog')) || formField.css.includes('.ds-card') || formField.css.includes('.ds-dialog')) {
  throw new Error('FormField unexpectedly includes Card or Dialog')
}
if (!panelMinimalOnly.css.includes('.ds-panel') || panelMinimalOnly.css.includes('.ds-dialog')) {
  throw new Error('Minimal Panel CSS isolation failed')
}
if (toastOnly.modules.some((path) => path.includes('/dist/desktop/components/Toast/PromiseToast')) || toastOnly.modules.some((path) => path.includes('/dist/primitives/Spinner/')) || toastOnly.css.includes('.ds-spinner')) {
  throw new Error('Plain Toast unexpectedly includes PromiseToast or Spinner')
}
if (!promiseToastOnly.modules.some((path) => path.includes('/dist/desktop/components/Toast/PromiseToast')) || !promiseToastOnly.modules.some((path) => path.includes('/dist/primitives/Spinner/')) || !promiseToastOnly.css.includes('.ds-spinner')) {
  throw new Error('PromiseToast subpath is missing its component or Spinner')
}
if (searchSelectOnly.modules.some((path) => path.includes('@radix-ui/'))) {
  throw new Error('SearchSelect unexpectedly bundles Radix')
}
if (panelMinimalOnly.modules.some((path) => path.includes('/dist/primitives/Button/')) || panelMinimalOnly.css.includes('.ds-button')) {
  throw new Error('Minimal Panel unexpectedly includes Button')
}

for (const [name, bundle, expected, unrelated] of [
  ['Tabs', tabsOnly, 'Tabs', ['Tooltip', 'Dialog', 'Menu', 'Toast']],
  ['Tooltip', tooltipOnly, 'Tooltip', ['Tabs', 'Dialog', 'Menu', 'Toast']],
  ['Menu', menuOnly, 'Menu', ['Tabs', 'Dialog', 'Tooltip', 'Toast']],
  ['Table', tableOnly, 'Table', ['Tabs', 'Dialog', 'Tooltip', 'Menu', 'Toast']],
  ['List', listOnly, 'List', ['Tabs', 'Dialog', 'Tooltip', 'Menu', 'Toast']],
  ['Tree', treeOnly, 'Tree', ['Tabs', 'Dialog', 'Tooltip', 'Menu', 'Toast', 'List']],
  ['Combobox', comboboxOnly, 'Combobox', ['Tabs', 'Dialog', 'Tooltip', 'Menu', 'Toast', 'Tree']],
  ['SearchSelect', searchSelectOnly, 'SearchSelect', ['Combobox', 'Tabs', 'Dialog', 'Tooltip', 'Menu', 'Toast', 'Tree']],
  ['SplitPane', splitPaneOnly, 'SplitPane', ['Tabs', 'Dialog', 'Tooltip', 'Menu', 'Toast', 'Tree']],
  ['Toast', toastOnly, 'Toast', ['Tabs', 'Dialog', 'Tooltip', 'Menu', 'Tree']],
  ['Progress', progressOnly, 'Progress', ['Tabs', 'Dialog', 'Tooltip', 'Menu', 'Toast', 'Tree']],
  ['EmptyState', emptyStateOnly, 'EmptyState', ['Tabs', 'Dialog', 'Tooltip', 'Menu', 'Toast', 'Tree']],
  ['Panel', panelOnly, 'Panel', ['Tabs', 'Dialog', 'Tooltip', 'Menu', 'Toast', 'Tree']]
]) {
  if (!bundle.modules.some((path) => path.includes(`/dist/desktop/components/${expected}/`))) throw new Error(`${name} subpath is missing its component`)
  const cssName = name === 'SplitPane' ? 'split-pane' : name === 'SearchSelect' ? 'search-select' : name === 'EmptyState' ? 'empty-state' : name.toLowerCase()
  if (!bundle.css.includes(`.ds-${cssName}`)) throw new Error(`${name} subpath is missing component CSS`)
  for (const other of unrelated) {
    if (bundle.modules.some((path) => path.includes(`/dist/desktop/components/${other}/`))) throw new Error(`${name} unexpectedly imports ${other}`)
  }
  if (bundle.modules.some((path) => path.includes('/dist/mobile/components/'))) throw new Error(`${name} unexpectedly imports mobile components`)
}

for (const [name, bundle] of [['shared Button', desktopButton], ['FormField', formField], ['desktop Dialog', desktopDialog], ['mobile Dialog', mobileDialog], ['Modal', modalOnly], ['Tabs', tabsOnly], ['Tooltip', tooltipOnly], ['Menu', menuOnly], ['Table', tableOnly], ['List', listOnly], ['Tree', treeOnly], ['Combobox', comboboxOnly], ['SearchSelect', searchSelectOnly], ['SplitPane', splitPaneOnly], ['Toast', toastOnly], ['PromiseToast', promiseToastOnly], ['Progress', progressOnly], ['EmptyState', emptyStateOnly], ['Panel', panelOnly], ['minimal Panel', panelMinimalOnly]]) {
  console.log(`${name}: ${Buffer.byteLength(bundle.js)} bytes JS, ${Buffer.byteLength(bundle.css)} bytes CSS`)
}
console.log('Shared primitive and view-specific composite bundle checks passed')

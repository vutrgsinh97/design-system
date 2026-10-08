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
      rollupOptions: {
        external: ['react', 'react-dom', 'react/jsx-runtime']
      }
    }
  })

  const files = Array.isArray(result) ? result.flatMap((item) => item.output) : result.output
  const js = files.filter((file) => file.type === 'chunk').map((file) => file.code).join('\n')
  const css = files.filter((file) => file.type === 'asset' && file.fileName.endsWith('.css')).map((file) => String(file.source)).join('\n')
  const modules = files.filter((file) => file.type === 'chunk').flatMap((file) => Object.keys(file.modules))
  return { js, css, modules }
}

const button = await inspect('button-only')
const dialog = await inspect('dialog-only')

if (!button.css.includes('.ds-button')) throw new Error('Button CSS is missing from Button-only bundle')
if (button.css.includes('.ds-dialog')) throw new Error('Dialog CSS entered the Button-only bundle')
if (button.modules.some((name) => name.includes('@radix-ui/react-dialog'))) throw new Error('Radix entered the Button-only bundle')
if (!dialog.modules.some((name) => name.includes('@radix-ui/react-dialog'))) throw new Error('Dialog bundle is missing Radix')

console.log(`Button only: ${Buffer.byteLength(button.js)} bytes JS, ${Buffer.byteLength(button.css)} bytes CSS`)
console.log(`Dialog only: ${Buffer.byteLength(dialog.js)} bytes JS, ${Buffer.byteLength(dialog.css)} bytes CSS`)
console.log('Vite production tree-shaking check passed')

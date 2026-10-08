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

function assertPlatform(bundle, platform, component) {
  const other = platform === 'desktop' ? 'mobile' : 'desktop'
  const className = platform === 'desktop' ? `.ds-${component}` : `.ds-mobile-${component}`
  const unwantedClass = other === 'desktop' ? `.ds-${component}` : `.ds-mobile-${component}`
  if (!bundle.css.includes(className)) throw new Error(`${platform} ${component} CSS is missing`)
  if (bundle.css.includes(unwantedClass)) throw new Error(`${other} ${component} CSS entered ${platform} bundle`)
  if (bundle.modules.some((name) => name.includes(`/dist/${other}/components/`))) {
    throw new Error(`${other} component JS entered ${platform} bundle`)
  }
}

const legacy = await inspect('button-only')
const desktopButton = await inspect('desktop-button-only')
const mobileButton = await inspect('mobile-button-only')
const desktopDialog = await inspect('desktop-dialog-only')
const mobileDialog = await inspect('mobile-dialog-only')

assertPlatform(legacy, 'desktop', 'button')
assertPlatform(desktopButton, 'desktop', 'button')
assertPlatform(mobileButton, 'mobile', 'button')
assertPlatform(desktopDialog, 'desktop', 'dialog')
assertPlatform(mobileDialog, 'mobile', 'dialog')
for (const [name, bundle] of [['legacy', legacy], ['desktop', desktopButton], ['mobile', mobileButton]]) {
  if (bundle.modules.some((path) => path.includes('@radix-ui/react-dialog'))) {
    throw new Error(`Radix entered ${name} Button-only bundle`)
  }
  if (bundle.css.includes('.ds-dialog') || bundle.css.includes('.ds-mobile-dialog')) {
    throw new Error(`Dialog CSS entered ${name} Button-only bundle`)
  }
}
for (const [name, bundle] of [['desktop', desktopDialog], ['mobile', mobileDialog]]) {
  if (!bundle.modules.some((path) => path.includes('@radix-ui/react-dialog'))) {
    throw new Error(`${name} Dialog bundle is missing Radix`)
  }
}

for (const [name, bundle] of [['desktop Button', desktopButton], ['mobile Button', mobileButton], ['desktop Dialog', desktopDialog], ['mobile Dialog', mobileDialog]]) {
  console.log(`${name}: ${Buffer.byteLength(bundle.js)} bytes JS, ${Buffer.byteLength(bundle.css)} bytes CSS`)
}
console.log('Desktop/mobile bundle isolation check passed')

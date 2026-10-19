import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'

const root = fileURLToPath(new URL('../', import.meta.url))
const iconFiles = (await readdir(join(root, 'dist', 'icons')))
  .filter((name) => name.endsWith('.js')).sort()

if (iconFiles.length === 0) {
  console.log('No SVG icons yet; skipping icon-only bundle check')
  process.exit(0)
}

const iconName = iconFiles[0].slice(0, -3)
const result = await build({
  stdin: {
    contents: `import Icon from '@company/icons-react/${iconName}'; console.log(Icon)`,
    resolveDir: root,
    sourcefile: 'icon-only.tsx',
    loader: 'tsx'
  },
  bundle: true,
  format: 'esm',
  platform: 'browser',
  external: ['react', 'react/jsx-runtime'],
  metafile: true,
  write: false
})

const importedIcons = Object.keys(result.metafile.inputs)
  .filter((path) => path.includes('dist/icons/') && path.endsWith('.js'))
if (importedIcons.length !== 1 || !importedIcons[0].endsWith(`${iconName}.js`)) {
  throw new Error(`Icon-only bundle imported unexpected icons: ${importedIcons.join(', ')}`)
}

console.log(`Icon-only bundle (${iconName}): ${result.outputFiles[0].contents.length} bytes JS; 1 of ${iconFiles.length} icons included`)

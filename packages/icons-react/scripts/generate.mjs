import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { transform } from '@svgr/core'

const root = fileURLToPath(new URL('../', import.meta.url))
const sourceRoot = join(root, 'assets', 'svg')
const targetRoot = join(root, 'src', 'icons')

async function listSvgFiles(directory) {
  const files = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) files.push(...await listSvgFiles(path))
    else if (entry.isFile() && entry.name.toLowerCase().endsWith('.svg')) files.push(path)
  }
  return files.sort()
}

function toKebab(value) {
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function toPascal(value) {
  return value.split('-').map((part) => part[0].toUpperCase() + part.slice(1)).join('')
}

const sourceFiles = await listSvgFiles(sourceRoot)
const names = new Map()
const entries = sourceFiles.map((file) => {
  const pathParts = relative(sourceRoot, file).replace(/\.svg$/i, '').split(sep)
  const normalized = toKebab(pathParts.join('-'))
  if (!normalized) throw new Error(`SVG filename must contain letters or numbers: ${file}`)
  const name = /^\d/.test(normalized) ? `icon-${normalized}` : normalized
  if (names.has(name)) throw new Error(`Duplicate icon name "${name}": ${names.get(name)} and ${file}`)
  names.set(name, file)
  return { file, name, componentName: `${toPascal(name)}Icon` }
})

await rm(targetRoot, { recursive: true, force: true })
await mkdir(targetRoot, { recursive: true })

for (let index = 0; index < entries.length; index += 8) {
  await Promise.all(entries.slice(index, index + 8).map(async ({ file, name, componentName }) => {
    const source = await readFile(file, 'utf8')
    if (!/<svg\b/i.test(source)) throw new Error(`Missing SVG root: ${file}`)
    const code = await transform(source, {
      plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
      typescript: true,
      jsxRuntime: 'automatic',
      icon: true,
      svgProps: { 'aria-hidden': '{true}', focusable: 'false' },
      runtimeConfig: false
    }, { componentName, filePath: file })
    await writeFile(join(targetRoot, `${name}.tsx`), `${code}\nexport { ${componentName} }\n`)
  }))
}

// Keep removed icons out of a previously built package without deleting live imports.
const distIcons = join(root, 'dist', 'icons')
try {
  for (const file of await readdir(distIcons)) {
    const name = file.replace(/\.(?:js|d\.ts)$/, '')
    if (/\.(?:js|d\.ts)$/.test(file) && !names.has(name)) await rm(join(distIcons, file))
  }
} catch (error) {
  if (error.code !== 'ENOENT') throw error
}

console.log(`Generated ${entries.length} React icons from assets/svg`)

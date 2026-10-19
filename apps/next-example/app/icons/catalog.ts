import { readdir } from 'node:fs/promises'
import { join, relative, resolve, sep } from 'node:path'
import type { IconEntry } from './types'

const sourceRoot = resolve(process.cwd(), '../../packages/icons-react/assets/svg')
type IconRecord = IconEntry & { sourcePath: string }

let cached: Promise<IconRecord[]> | undefined
let expiresAt = 0

function toKebab(value: string) {
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function toPascal(value: string) {
  return value.split('-').map((part) => part[0].toUpperCase() + part.slice(1)).join('')
}

async function findSvgFiles(directory: string): Promise<string[]> {
  const files: string[] = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name)
    if (entry.isDirectory()) files.push(...await findSvgFiles(file))
    else if (entry.isFile() && entry.name.toLowerCase().endsWith('.svg')) files.push(file)
  }
  return files
}

async function scan(): Promise<IconRecord[]> {
  const files = await findSvgFiles(sourceRoot)
  const names = new Set<string>()
  return files.map((sourcePath) => {
    const parts = relative(sourceRoot, sourcePath).replace(/\.svg$/i, '').split(sep)
    const normalized = toKebab(parts.join('-'))
    const name = /^\d/.test(normalized) ? `icon-${normalized}` : normalized
    if (!name || names.has(name)) throw new Error(`Invalid or duplicate icon name: ${sourcePath}`)
    names.add(name)
    return { name, componentName: `${toPascal(name)}Icon`, sourcePath }
  }).sort((a, b) => a.name.localeCompare(b.name))
}

export function getCatalog(): Promise<IconRecord[]> {
  if (!cached || Date.now() >= expiresAt) {
    cached = scan()
    expiresAt = Date.now() + 1000
  }
  return cached
}

import { cp, mkdir, readdir } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const source = join(root, 'src')
const output = join(root, 'dist')

async function copyCss(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) await copyCss(path)
    if (entry.isFile() && entry.name.endsWith('.css')) {
      const target = join(output, relative(source, path))
      await mkdir(dirname(target), { recursive: true })
      await cp(path, target)
    }
  }
}

await copyCss(source)

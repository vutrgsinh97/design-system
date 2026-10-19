import { readdir, stat } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const source = join(root, 'assets', 'svg')

async function snapshot(directory = source) {
  const files = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) files.push(...await snapshot(path))
    else if (entry.name.toLowerCase().endsWith('.svg')) {
      const info = await stat(path)
      files.push(`${path}:${info.mtimeMs}:${info.size}`)
    }
  }
  return files.sort().join('\n')
}

async function build() {
  console.log('SVG sources changed; rebuilding icons')
  const child = spawn('pnpm', ['build'], { cwd: root, stdio: 'inherit' })
  return await new Promise((resolve) => child.once('exit', (code) => resolve(code === 0)))
}

let previous = await snapshot()
let busy = false
const timer = setInterval(async () => {
  if (busy) return
  busy = true
  try {
    const current = await snapshot()
    if (current !== previous && await build()) previous = current
  } catch (error) {
    console.error(error)
  } finally {
    busy = false
  }
}, 750)

process.on('SIGINT', () => clearInterval(timer))
process.on('SIGTERM', () => clearInterval(timer))
console.log('Watching SVG sources with polling')

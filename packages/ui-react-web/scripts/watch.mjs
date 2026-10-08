import { access, readdir, stat } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const source = join(root, 'src')
const output = join(root, 'dist', 'index.js')

async function snapshot(dir = source) {
  const files = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) files.push(...await snapshot(path))
    else if (/\.(css|ts|tsx)$/.test(entry.name)) {
      const info = await stat(path)
      files.push(`${path}:${info.mtimeMs}:${info.size}`)
    }
  }
  return files.sort().join('\n')
}

async function build() {
  console.log('Source changed; rebuilding UI package')
  const child = spawn('pnpm', ['build'], { cwd: root, stdio: 'inherit' })
  await new Promise((resolve) => child.once('exit', resolve))
}

try {
  await access(output)
} catch {
  await build()
}

let previous = await snapshot()
let checking = false
let building = false

const timer = setInterval(async () => {
  if (checking || building) return
  checking = true
  try {
    const current = await snapshot()
    if (current !== previous) {
      previous = current
      building = true
      await build()
      building = false
    }
  } catch (error) {
    console.error(error)
  } finally {
    checking = false
  }
}, 750)

function stop() {
  clearInterval(timer)
}

process.on('SIGINT', stop)
process.on('SIGTERM', stop)
console.log('Watching UI package sources with polling')

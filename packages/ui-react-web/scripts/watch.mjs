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

async function run(command, args) {
  const child = spawn(command, args, { cwd: root, stdio: 'inherit' })
  const code = await new Promise((resolve) => child.once('exit', resolve))
  return code === 0
}

async function build(initial = false) {
  console.log('Source changed; rebuilding UI package')
  // The initial build may clean dist before the app starts. Rebuilds leave existing
  // output in place so Next.js never resolves imports while dist is missing.
  if (initial) return run('pnpm', ['build'])
  if (!await run('pnpm', ['exec', 'tsc', '-p', 'tsconfig.build.json'])) return false
  return run('node', ['scripts/copy-css.mjs'])
}

try {
  await access(output)
} catch {
  await build(true)
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
      building = true
      if (await build()) previous = current
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

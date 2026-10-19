import { readFile } from 'node:fs/promises'
import { getCatalog } from '../../catalog'

export async function GET(_request: Request, context: { params: Promise<{ name: string }> }) {
  const { name } = await context.params
  if (!/^[a-z][a-z0-9-]*$/.test(name)) return new Response('Invalid icon name', { status: 400 })

  const icon = (await getCatalog()).find((item) => item.name === name)
  if (!icon) return new Response('Icon not found', { status: 404 })

  const svg = await readFile(icon.sourcePath)
  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff'
    }
  })
}

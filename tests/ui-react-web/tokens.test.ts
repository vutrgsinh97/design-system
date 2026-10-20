import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const src = join(process.cwd(), 'packages/ui-react-web/src')

const declarations = (block: string) =>
  block.split('\n').map((line) => line.trim()).filter((line) => line.startsWith('--'))

describe('theme tokens', () => {
  for (const file of ['styles/theme.css', 'mobile/styles/mobile.css']) {
    it(`keeps the auto dark palette in sync with the dark theme in ${file}`, () => {
      const css = readFileSync(join(src, file), 'utf8')
      const dark = css.match(/^\[data-ds-theme='dark'\] \{\n([\s\S]*?)\n\}/m)?.[1]
      const auto = css.match(/@media \(prefers-color-scheme: dark\) \{\n {2}\[data-ds-theme='auto'\] \{\n([\s\S]*?)\n {2}\}/)?.[1]
      expect(dark).toBeDefined()
      expect(auto).toBeDefined()
      expect(declarations(auto!)).toEqual(declarations(dark!))
    })
  }

  it('stacks dropdowns, toasts and tooltips above modals', () => {
    const css = readFileSync(join(src, 'styles/theme.css'), 'utf8')
    const z = (name: string) => Number(css.match(new RegExp(`--ds-z-${name}: (\\d+);`))?.[1])
    const order = ['sticky', 'overlay', 'modal', 'dropdown', 'toast', 'tooltip'].map(z)
    expect(order.every(Number.isFinite)).toBe(true)
    expect(order).toEqual([...order].sort((a, b) => a - b))
  })
})

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Dialog, DialogContent, DialogTitle } from '../../packages/ui-react-web/src/desktop/components/Dialog/index.js'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../packages/ui-react-web/src/desktop/components/Menu/index.js'

const src = join(process.cwd(), 'packages/ui-react-web/src')
const theme = readFileSync(join(src, 'styles/theme.css'), 'utf8')

// jsdom neither loads CSS modules nor resolves var(), so read the z-index rule for the rendered class and resolve it from theme.css.
const zIndexOf = (element: Element, moduleFile: string) => {
  const className = [...element.classList].find((name) => name.startsWith('ds-'))!
  const css = readFileSync(join(src, moduleFile), 'utf8')
  const value = css.match(new RegExp(`:global\\(\\.${className}\\)\\s*\\{[^}]*?z-index:\\s*([^;]+);`))?.[1].trim()
  const token = value?.match(/^var\((--[\w-]+)\)$/)?.[1]
  return Number(token ? theme.match(new RegExp(`${token}: (\\d+);`))?.[1] : value)
}

describe('overlay z-index tokens', () => {
  it('renders a DropdownMenu opened inside a Dialog above the dialog content', () => {
    render(
      <Dialog open>
        <DialogContent aria-describedby={undefined}>
          <DialogTitle>Settings</DialogTitle>
          <DropdownMenu open>
            <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
            <DropdownMenuContent><DropdownMenuItem>Rename</DropdownMenuItem></DropdownMenuContent>
          </DropdownMenu>
        </DialogContent>
      </Dialog>
    )
    const dialog = screen.getByRole('dialog', { hidden: true })
    const menu = screen.getByRole('menu')
    expect(dialog.classList.contains('ds-dialog__content')).toBe(true)
    expect(menu.classList.contains('ds-menu__content')).toBe(true)
    const dialogZ = zIndexOf(dialog, 'desktop/components/Dialog/Dialog.module.css')
    const menuZ = zIndexOf(menu, 'desktop/components/Menu/Menu.module.css')
    expect(Number.isFinite(dialogZ) && Number.isFinite(menuZ)).toBe(true)
    expect(menuZ).toBeGreaterThan(dialogZ)
  })
})

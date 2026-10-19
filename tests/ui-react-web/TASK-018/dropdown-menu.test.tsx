import { vi } from 'vitest'
import { describe, expect, it } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../../../packages/ui-react-web/src/desktop/components/Menu/index.js'

function MenuFixture({ onRename = vi.fn(), onDelete = vi.fn() }: { onRename?: () => void; onDelete?: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><button type="button">Actions</button></DropdownMenuTrigger>
      <DropdownMenuContent aria-label="Actions">
        <DropdownMenuItem onSelect={onRename} shortcut="⌘R">Rename</DropdownMenuItem>
        <DropdownMenuItem disabled onSelect={() => { throw new Error('disabled action ran') }}>Unavailable</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem destructive onSelect={onDelete}>Delete item</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

describe('DropdownMenu', () => {
  it('opens from the trigger, renders menu semantics, shortcut and separator, and returns focus on Escape', async () => {
    const user = userEvent.setup()
    const onRename = vi.fn()
    render(<MenuFixture onRename={onRename} />)
    const trigger = screen.getByRole('button', { name: 'Actions' })
    await user.click(trigger)

    expect(screen.getByRole('menu', { name: 'Actions' })).toBeTruthy()
    expect(screen.getByRole('menuitem', { name: 'Rename' })).toBeTruthy()
    expect(screen.getByRole('separator')).toBeTruthy()
    expect(screen.getByRole('menuitem', { name: 'Delete item' }).getAttribute('data-destructive')).toBe('')

    await user.keyboard('{Escape}')
    await waitFor(() => expect(document.activeElement).toBe(trigger))
    await user.click(trigger)
    await user.click(screen.getByRole('menuitem', { name: 'Rename' }))
    expect(onRename).toHaveBeenCalledTimes(1)
  })

  it('moves among enabled items with arrow keys and skips disabled items', async () => {
    const user = userEvent.setup()
    render(<MenuFixture />)
    await user.click(screen.getByRole('button', { name: 'Actions' }))
    const rename = screen.getByRole('menuitem', { name: 'Rename' })
    const unavailable = screen.getByRole('menuitem', { name: 'Unavailable' })
    const deleteItem = screen.getByRole('menuitem', { name: 'Delete item' })
    expect(unavailable.getAttribute('aria-disabled')).toBe('true')
    await user.click(unavailable)
    expect(screen.getByRole('menu')).toBeTruthy()
    await user.keyboard('{ArrowDown}')
    expect(document.activeElement).toBe(rename)
    await user.keyboard('{ArrowDown}')
    expect(document.activeElement).toBe(deleteItem)
    expect(document.activeElement).not.toBe(unavailable)
    await user.keyboard('{Home}')
    expect(document.activeElement).toBe(rename)
    await user.keyboard('{End}')
    expect(document.activeElement).toBe(deleteItem)
  })

  it('supports typeahead and invokes the selected item callback', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    render(<MenuFixture onDelete={onDelete} />)
    await user.click(screen.getByRole('button', { name: 'Actions' }))
    await user.keyboard('d')

    const deleteItem = screen.getByRole('menuitem', { name: 'Delete item' })
    await waitFor(() => expect(document.activeElement).toBe(deleteItem))
    await user.keyboard('{Enter}')
    expect(onDelete).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('menu')).toBeNull()
  })

  it('keeps controlled open state and reports changes', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <DropdownMenu open={false} onOpenChange={onOpenChange}>
        <DropdownMenuTrigger asChild><button type="button">Controlled</button></DropdownMenuTrigger>
        <DropdownMenuContent><DropdownMenuItem>One</DropdownMenuItem></DropdownMenuContent>
      </DropdownMenu>
    )
    await user.click(screen.getByRole('button', { name: 'Controlled' }))
    expect(onOpenChange).toHaveBeenCalledWith(true)
    expect(screen.queryByRole('menu')).toBeNull()
  })
})

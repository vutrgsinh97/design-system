import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { List, ListItem } from '../../../packages/ui-react-web/src/desktop/components/List/index.js'

describe('desktop List', () => {
  it('keeps static lists as ul/li and supports long text, badges and disabled trailing actions', async () => {
    const action = vi.fn()
    render(
      <List aria-label="Sources">
        <ListItem
          leadingIcon={<svg aria-hidden="true" />}
          primary="A very long source label that should truncate in a narrow row"
          secondary="/workspaces/example/source"
          badge={<span>Ready</span>}
          trailingActions={<button disabled onClick={action}>Open menu</button>}
        />
      </List>
    )

    expect(screen.getByRole('list', { name: 'Sources' })).toBeTruthy()
    expect(screen.getByRole('listitem')).toBeTruthy()
    expect(screen.getByText(/very long source label/).classList.contains('ds-list__primary')).toBe(true)
    const actionButton = screen.getByRole('button', { name: 'Open menu' }) as HTMLButtonElement
    expect(actionButton.disabled).toBe(true)
    await userEvent.setup().click(actionButton)
    expect(action).not.toHaveBeenCalled()
  })

  it('keeps controlled selection and arrow-key navigation, skipping disabled items', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    const renderList = (value: string) => (
      <List aria-label="Workspace files" selectionMode="single" value={value} onValueChange={onValueChange}>
        <ListItem value="one" primary="One" />
        <ListItem value="disabled" primary="Unavailable" disabled />
        <ListItem value="two" primary="Two" />
        <ListItem value="three" primary="Three" />
      </List>
    )
    const { rerender } = render(renderList('one'))
    const list = screen.getByRole('list', { name: 'Workspace files' })
    const one = screen.getByText('One').closest('li') as HTMLLIElement
    expect(one.getAttribute('aria-current')).toBe('true')

    await user.tab()
    expect(document.activeElement).toBe(one)
    await user.keyboard('{ArrowDown}')
    expect(onValueChange).toHaveBeenCalledWith('two')
    expect(document.activeElement).toBe(screen.getByText('Two').closest('li'))
    expect(one.getAttribute('aria-current')).toBe('true')
    rerender(renderList('two'))
    expect(screen.getByText('Two').closest('li')?.getAttribute('aria-current')).toBe('true')
    expect(list).toBe(screen.getByRole('list', { name: 'Workspace files' }))
    await user.keyboard('{End}')
    expect(onValueChange).toHaveBeenCalledWith('three')
    await user.keyboard('{Home}')
    expect(onValueChange).toHaveBeenLastCalledWith('one')
  })

  it('does not select a row from its disabled trailing action', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    const onAction = vi.fn()
    render(
      <List aria-label="Commands" selectionMode="single" value="row" onValueChange={onValueChange}>
        <ListItem value="row" primary="Row" trailingActions={<button disabled>More actions</button>} />
        <ListItem value="other" primary="Other" trailingActions={<button onClick={onAction}>Open action</button>} />
      </List>
    )
    await user.click(screen.getByRole('button', { name: 'More actions' }))
    expect(onValueChange).not.toHaveBeenCalled()
    await user.click(screen.getByRole('button', { name: 'Open action' }))
    expect(onAction).toHaveBeenCalledOnce()
    expect(onValueChange).not.toHaveBeenCalled()
    expect(screen.getByText('Row').closest('li')?.getAttribute('aria-current')).toBe('true')
  })

  it('applies compact row scope only inside the desktop compact container', () => {
    const { rerender } = render(<List><ListItem primary="File" /></List>)
    const normalRow = screen.getByRole('listitem')
    expect(normalRow.closest('[data-ds-density="compact"]')).toBeNull()

    rerender(<div data-ds-platform="desktop" data-ds-density="compact"><List><ListItem primary="File" /></List></div>)
    const compactRow = screen.getByRole('listitem')
    expect(compactRow.closest('[data-ds-platform="desktop"][data-ds-density="compact"]')).toBeTruthy()
    expect(compactRow.classList.contains('ds-list__item')).toBe(true)
  })
})

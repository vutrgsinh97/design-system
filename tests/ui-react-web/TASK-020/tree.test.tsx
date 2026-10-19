import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tree, TreeItem } from '../../../packages/ui-react-web/src/desktop/components/Tree/index.js'

describe('desktop Tree', () => {
  it('supports controlled expansion and selection with pointer callbacks', async () => {
    const user = userEvent.setup()
    const onExpandedIdsChange = vi.fn()
    const onSelectedIdChange = vi.fn()
    const renderTree = (expandedIds: string[], selectedId: string | null) => (
      <Tree aria-label="Workspace" expandedIds={expandedIds} selectedId={selectedId}
        onExpandedIdsChange={onExpandedIdsChange} onSelectedIdChange={onSelectedIdChange}>
        <TreeItem id="workspace" label="Workspace">
          <TreeItem id="source" label="Source folder" metadata="3 items" />
        </TreeItem>
      </Tree>
    )
    const { rerender, container } = render(renderTree([], null))
    expect(screen.queryByRole('treeitem', { name: /Source folder.*3 items/ })).toBeNull()

    await user.click(screen.getByRole('button', { name: 'Expand Workspace' }))
    expect(onExpandedIdsChange).toHaveBeenCalledWith(['workspace'])
    expect(screen.queryByRole('treeitem', { name: /Source folder.*3 items/ })).toBeNull()
    rerender(renderTree(['workspace'], null))

    const source = container.querySelector('[data-tree-item-id="source"]') as HTMLElement
    expect(source.getAttribute('aria-level')).toBe('2')
    await user.click(source)
    expect(onSelectedIdChange).toHaveBeenCalledTimes(1)
    expect(onSelectedIdChange).toHaveBeenCalledWith('source')
    expect(source.getAttribute('aria-selected')).toBe('false')
    rerender(renderTree(['workspace'], 'source'))
    expect(container.querySelector('[data-tree-item-id="source"]')?.getAttribute('aria-selected')).toBe('true')
  })

  it('navigates visible items with arrows/Home/End and selects on Enter/Space', async () => {
    const user = userEvent.setup()
    const onSelectedIdChange = vi.fn()
    const { container } = render(
      <Tree aria-label="Project" defaultExpandedIds={['root', 'nested']} onSelectedIdChange={onSelectedIdChange}>
        <TreeItem id="root" label="Root">
          <TreeItem id="first" label="First" />
          <TreeItem id="nested" label="Nested">
            <TreeItem id="last" label="Last" />
          </TreeItem>
        </TreeItem>
      </Tree>
    )
    const tree = screen.getByRole('tree', { name: 'Project' })
    await user.tab()
    expect(document.activeElement).toBe(tree)
    await user.keyboard('{ArrowDown}')
    expect(tree.getAttribute('aria-activedescendant')).toBe(container.querySelector('[data-tree-item-id="first"]')?.id)
    await user.keyboard('{End}')
    expect(tree.getAttribute('aria-activedescendant')).toBe(container.querySelector('[data-tree-item-id="last"]')?.id)
    await user.keyboard('{Home}')
    expect(tree.getAttribute('aria-activedescendant')).toBe(container.querySelector('[data-tree-item-id="root"]')?.id)
    await user.keyboard('{Enter}')
    expect(onSelectedIdChange).toHaveBeenCalledWith('root')
    await user.keyboard('{ArrowRight}')
    expect(container.querySelector('[data-tree-item-id="root"]')?.getAttribute('aria-expanded')).toBe('true')
    await user.keyboard('{ArrowLeft}')
    expect(tree.getAttribute('aria-activedescendant')).toBe(container.querySelector('[data-tree-item-id="root"]')?.id)
    await user.keyboard('{ArrowLeft}')
    expect(container.querySelector('[data-tree-item-id="root"]')?.getAttribute('aria-expanded')).toBe('false')
    expect(screen.queryByRole('treeitem', { name: 'First' })).toBeNull()
  })

  it('exposes async loading and truncates long labels without losing their text', () => {
    render(
      <Tree aria-label="Files">
        <TreeItem id="loading" label="Loading branch" hasChildren loading />
        <TreeItem id="long" label="A very long folder name that remains available to assistive technology" metadata="metadata" />
      </Tree>
    )
    const loading = document.querySelector('[data-tree-item-id="loading"]') as HTMLElement
    expect(loading.getAttribute('aria-busy')).toBe('true')
    expect(loading.getAttribute('aria-expanded')).toBe('false')
    expect(screen.getByRole('status').textContent).toBe('Loading…')
    const longLabel = screen.getByText('A very long folder name that remains available to assistive technology')
    expect(longLabel.classList.contains('ds-tree__label')).toBe(true)
    expect(screen.getByRole('treeitem', { name: /very long folder name.*metadata/ })).toBeTruthy()
  })
})

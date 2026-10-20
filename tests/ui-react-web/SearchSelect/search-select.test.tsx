import { useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchSelect, type SearchSelectOption, type SearchSelectProps } from '../../../packages/ui-react-web/src/desktop/components/SearchSelect/index.js'

const options: SearchSelectOption[] = [
  { value: 'alpha', label: 'Alpha', description: 'First' },
  { value: 'beta', label: 'Beta' },
  { value: 'off', label: 'Off', disabled: true }
]

type TestProps = Omit<SearchSelectProps<SearchSelectOption>, 'value' | 'onValueChange' | 'options'> & {
  onValueChange?: SearchSelectProps<SearchSelectOption>['onValueChange']
  options?: SearchSelectOption[]
}

function Controlled({ onValueChange, options: items = options, ...props }: TestProps) {
  const [value, setValue] = useState<string | null>(null)
  return (
    <SearchSelect
      aria-label="Owner"
      options={items}
      value={value}
      onValueChange={(next, option) => { onValueChange?.(next, option); setValue(next) }}
      {...props}
    />
  )
}

describe('SearchSelect', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('exposes button and combobox ARIA and focuses the search input on open', async () => {
    const user = userEvent.setup()
    render(<Controlled placeholder="Pick one" invalid />)
    const trigger = screen.getByRole('button', { name: 'Owner' })
    expect(trigger.textContent).toBe('Pick one')
    expect(trigger.getAttribute('aria-haspopup')).toBe('listbox')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(trigger.getAttribute('aria-invalid')).toBe('true')

    await user.click(trigger)
    const search = screen.getByRole('combobox')
    const listbox = screen.getByRole('listbox', { name: 'Owner' })
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(trigger.getAttribute('aria-controls')).toBe(listbox.id)
    expect(search.getAttribute('aria-controls')).toBe(listbox.id)
    expect(document.activeElement).toBe(search)
    expect(search.getAttribute('aria-activedescendant')).toBe(screen.getByRole('option', { name: /Alpha/ }).id)
    expect(screen.getByRole('option', { name: 'Off' }).getAttribute('aria-disabled')).toBe('true')
  })

  it('selects with the mouse and ignores disabled options', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Controlled onValueChange={onValueChange} />)
    const trigger = screen.getByRole('button', { name: 'Owner' })
    await user.click(trigger)
    await user.click(screen.getByRole('option', { name: 'Off' }))
    expect(onValueChange).not.toHaveBeenCalled()
    await user.click(screen.getByRole('option', { name: 'Beta' }))
    expect(onValueChange).toHaveBeenCalledWith('beta', expect.objectContaining({ label: 'Beta' }))
    expect(trigger.textContent).toBe('Beta')
    expect(screen.queryByRole('listbox')).toBeNull()
    expect(document.activeElement).toBe(trigger)
  })

  it('selects with the keyboard, skipping disabled options and wrapping', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Controlled onValueChange={onValueChange} />)
    const trigger = screen.getByRole('button', { name: 'Owner' })
    trigger.focus()
    await user.keyboard('{ArrowDown}')
    const search = screen.getByRole('combobox')
    await user.keyboard('{ArrowDown}')
    expect(search.getAttribute('aria-activedescendant')).toBe(screen.getByRole('option', { name: 'Beta' }).id)
    await user.keyboard('{ArrowDown}')
    expect(search.getAttribute('aria-activedescendant')).toBe(screen.getByRole('option', { name: /Alpha/ }).id)
    await user.keyboard('{ArrowUp}{Enter}')
    expect(onValueChange).toHaveBeenCalledWith('beta', expect.objectContaining({ value: 'beta' }))
    expect(document.activeElement).toBe(trigger)
  })

  it('closes on Escape returning focus to the trigger, and on Tab', async () => {
    const user = userEvent.setup()
    render(<><Controlled /><button type="button">Next</button></>)
    const trigger = screen.getByRole('button', { name: 'Owner' })
    await user.click(trigger)
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('listbox')).toBeNull()
    expect(document.activeElement).toBe(trigger)

    await user.click(trigger)
    await user.tab()
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  it('reports query changes without filtering options itself', async () => {
    const user = userEvent.setup()
    const onQueryChange = vi.fn()
    render(<Controlled query="" onQueryChange={onQueryChange} />)
    await user.click(screen.getByRole('button', { name: 'Owner' }))
    await user.keyboard('b')
    expect(onQueryChange).toHaveBeenCalledWith('b')
    expect(screen.getAllByRole('option')).toHaveLength(3)
  })

  it('shows a create row only when the query matches no label, and selects it with Enter', async () => {
    const user = userEvent.setup()
    const onCreate = vi.fn()
    const { rerender } = render(<Controlled query="alpha" onQueryChange={() => {}} onCreate={onCreate} />)
    await user.click(screen.getByRole('button', { name: 'Owner' }))
    expect(screen.queryByRole('option', { name: /Thêm/ })).toBeNull()

    rerender(<Controlled query=" Gamma " onQueryChange={() => {}} onCreate={onCreate} options={[]} />)
    const create = screen.getByRole('option', { name: 'Thêm "Gamma"' })
    expect(screen.getByRole('combobox').getAttribute('aria-activedescendant')).toBe(create.id)
    await user.keyboard('{Enter}')
    expect(onCreate).toHaveBeenCalledWith('Gamma')

    rerender(<Controlled query="Gamma" onQueryChange={() => {}} onCreate={onCreate} options={[]} createLabel={(q) => `Create ${q}`} />)
    await user.click(screen.getByRole('button', { name: 'Owner' }))
    expect(screen.getByRole('option', { name: 'Create Gamma' })).toBeTruthy()

    rerender(<Controlled query="Gamma" onQueryChange={() => {}} options={[]} />)
    expect(screen.queryByRole('option')).toBeNull()
  })

  it('calls onLoadMore when the sentinel becomes visible, only while hasMore and not loadingMore', async () => {
    let trigger: ((entries: Array<{ isIntersecting: boolean }>) => void) | undefined
    const observe = vi.fn()
    vi.stubGlobal('IntersectionObserver', class {
      constructor(callback: typeof trigger) { trigger = callback }
      observe = observe
      disconnect() {}
    })
    const user = userEvent.setup()
    const onLoadMore = vi.fn()
    const { rerender } = render(<Controlled hasMore onLoadMore={onLoadMore} />)
    await user.click(screen.getByRole('button', { name: 'Owner' }))
    expect(observe).toHaveBeenCalled()
    act(() => trigger?.([{ isIntersecting: true }]))
    expect(onLoadMore).toHaveBeenCalledTimes(1)

    observe.mockClear()
    rerender(<Controlled hasMore loadingMore onLoadMore={onLoadMore} loadingContent="Loading more" />)
    expect(observe).not.toHaveBeenCalled()
    expect(screen.getByRole('status').textContent).toBe('Loading more')
    expect(screen.getByRole('listbox').getAttribute('aria-busy')).toBe('true')

    rerender(<Controlled hasMore={false} onLoadMore={onLoadMore} />)
    expect(observe).not.toHaveBeenCalled()
  })

  it('shows loading, error and empty states and respects disabled', async () => {
    const user = userEvent.setup()
    const { rerender } = render(<Controlled options={[]} emptyContent="Nothing" />)
    await user.click(screen.getByRole('button', { name: 'Owner' }))
    expect(screen.getByRole('status').textContent).toBe('Nothing')
    rerender(<Controlled options={[]} loading />)
    expect(screen.getByRole('status').textContent).toBe('Loading…')
    rerender(<Controlled options={[]} error="Failed" />)
    expect(screen.getByRole('alert').textContent).toBe('Failed')
    await user.keyboard('{Escape}')

    rerender(<Controlled disabled />)
    const trigger = screen.getByRole('button', { name: 'Owner' })
    expect((trigger as HTMLButtonElement).disabled).toBe(true)
    await user.click(trigger)
    expect(screen.queryByRole('listbox')).toBeNull()
  })
})

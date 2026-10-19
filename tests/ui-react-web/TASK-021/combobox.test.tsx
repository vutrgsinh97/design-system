import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Combobox, type ComboboxOptionData } from '../../../packages/ui-react-web/src/desktop/components/Combobox/index.js'

const options: ComboboxOptionData[] = [
  { value: 'alpha', label: 'Alpha', description: 'First result' },
  { value: 'beta', label: 'Beta', metadata: 'Two' },
  { value: 'disabled', label: 'Disabled result', disabled: true }
]

function ControlledCombobox({ onValueChange = vi.fn() }: { onValueChange?: (value: string, option: ComboboxOptionData) => void }) {
  const [value, setValue] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [highlightedValue, setHighlightedValue] = useState<string | null>(null)
  return (
    <Combobox
      aria-label="Choose source"
      value={value}
      onValueChange={(nextValue, option) => { onValueChange(nextValue, option); setValue(nextValue) }}
      query={query}
      onQueryChange={setQuery}
      highlightedValue={highlightedValue}
      onHighlightedValueChange={setHighlightedValue}
      options={options}
    />
  )
}

describe('Combobox', () => {
  it('supports controlled query, highlight and value with keyboard selection and focus retention', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<ControlledCombobox onValueChange={onValueChange} />)
    const input = screen.getByRole('combobox', { name: 'Choose source' }) as HTMLInputElement
    await user.click(input)
    expect(input.getAttribute('aria-expanded')).toBe('true')
    expect(input.getAttribute('aria-controls')).toBeTruthy()

    await user.keyboard('{ArrowDown}')
    const alpha = screen.getByRole('option', { name: /AlphaFirst result/ })
    expect(input.getAttribute('aria-activedescendant')).toBe(alpha.id)
    await user.keyboard('{ArrowDown}')
    const beta = screen.getByRole('option', { name: /BetaTwo/ })
    expect(input.getAttribute('aria-activedescendant')).toBe(beta.id)
    await user.keyboard('{ArrowDown}')
    expect(input.getAttribute('aria-activedescendant')).toBe(alpha.id)
    await user.keyboard('{ArrowDown}')
    expect(input.getAttribute('aria-activedescendant')).toBe(beta.id)
    await user.keyboard('{Enter}')

    expect(onValueChange).toHaveBeenCalledWith('beta', expect.objectContaining({ label: 'Beta' }))
    expect(input.value).toBe('Beta')
    expect(input.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(input)
  })

  it('lets the consumer update async results from the controlled query and supports option composition', async () => {
    const user = userEvent.setup()
    const onQueryChange = vi.fn()
    const { rerender } = render(
      <Combobox
        aria-label="Filter sources"
        value={null}
        onValueChange={() => {}}
        query=""
        onQueryChange={onQueryChange}
        options={options}
        renderOption={(option, state) => <span>{option.label}{state.highlighted ? ' (active)' : ''}</span>}
      />
    )
    const input = screen.getByRole('combobox', { name: 'Filter sources' })
    await user.type(input, 'bet')
    expect(onQueryChange).toHaveBeenCalled()
    rerender(
      <Combobox aria-label="Filter sources" value={null} onValueChange={() => {}} query="bet" onQueryChange={onQueryChange} options={[options[1]]}
        renderOption={(option) => <span>Custom: {option.label}</span>} />
    )
    expect(screen.getByRole('option', { name: 'Custom: Beta' })).toBeTruthy()
  })

  it('presents empty, loading and error states without fetching results itself', async () => {
    const user = userEvent.setup()
    const common = { 'aria-label': 'Search result', value: null, onValueChange: () => {}, query: '', onQueryChange: () => {}, options: [] as ComboboxOptionData[] }
    const { rerender } = render(<Combobox {...common} />)
    const input = screen.getByRole('combobox', { name: 'Search result' })
    await user.click(input)
    expect(screen.getByRole('status').textContent).toBe('No results')

    rerender(<Combobox {...common} loading loadingContent="Searching sources" />)
    expect(screen.getByRole('status').textContent).toBe('Searching sources')
    expect(screen.getByRole('listbox').getAttribute('aria-busy')).toBe('true')

    rerender(<Combobox {...common} error="Search failed" />)
    expect(screen.getByRole('alert').textContent).toBe('Search failed')
    expect(input.getAttribute('aria-describedby')).toBe(screen.getByRole('alert').id)
    expect(input.getAttribute('aria-invalid')).toBe('true')
    await user.keyboard('{Escape}')
    expect(screen.getByRole('alert').textContent).toBe('Search failed')
  })

  it('supports pointer selection and closes on Escape while keeping focus on the input', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <Combobox aria-label="Pick a source" value={null} onValueChange={onValueChange} query="" onQueryChange={() => {}} options={options} />
    )
    const input = screen.getByRole('combobox', { name: 'Pick a source' })
    await user.click(input)
    await user.click(screen.getByRole('option', { name: /AlphaFirst result/ }))
    expect(onValueChange).toHaveBeenCalledWith('alpha', expect.objectContaining({ label: 'Alpha' }))
    expect(document.activeElement).toBe(input)

    await user.click(input)
    await user.click(screen.getByRole('option', { name: 'Disabled result' }))
    expect(onValueChange).toHaveBeenCalledTimes(1)
    await user.keyboard('{Escape}')
    await waitFor(() => expect(input.getAttribute('aria-expanded')).toBe('false'))
    expect(document.activeElement).toBe(input)
  })
})

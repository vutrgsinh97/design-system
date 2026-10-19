import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Badge } from '../../../packages/ui-react-web/src/primitives/Badge/index.js'
import { Checkbox } from '../../../packages/ui-react-web/src/primitives/Checkbox/index.js'

describe('Checkbox', () => {
  it('supports controlled checked state and reports changes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    function ControlledCheckbox() {
      const [checked, setChecked] = useState(false)
      return <Checkbox checked={checked} onChange={(event) => { onChange(event.target.checked); setChecked(event.target.checked) }}>Track changes</Checkbox>
    }

    render(<ControlledCheckbox />)
    const checkbox = screen.getByRole('checkbox', { name: 'Track changes' }) as HTMLInputElement
    await user.click(checkbox)
    expect(checkbox.checked).toBe(true)
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('reflects indeterminate on the DOM property and aria state, then updates it', () => {
    const { rerender } = render(<Checkbox aria-label="Select all" indeterminate />)
    const checkbox = screen.getByRole('checkbox', { name: 'Select all' }) as HTMLInputElement
    expect(checkbox.indeterminate).toBe(true)
    expect(checkbox.getAttribute('aria-checked')).toBe('mixed')

    rerender(<Checkbox aria-label="Select all" checked />)
    expect(checkbox.indeterminate).toBe(false)
    expect(checkbox.checked).toBe(true)
    expect(checkbox.getAttribute('aria-checked')).toBeNull()
  })

  it('supports Space keyboard toggling and does not toggle when disabled', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<><Checkbox aria-label="Keyboard toggle" onChange={onChange} /><Checkbox aria-label="Unavailable" disabled onChange={onChange} /></>)
    const checkbox = screen.getByRole('checkbox', { name: 'Keyboard toggle' }) as HTMLInputElement
    checkbox.focus()
    await user.keyboard('[Space]')
    expect(checkbox.checked).toBe(true)
    expect(onChange).toHaveBeenCalledTimes(1)

    const disabled = screen.getByRole('checkbox', { name: 'Unavailable' }) as HTMLInputElement
    await user.click(disabled)
    expect(disabled.checked).toBe(false)
    expect(onChange).toHaveBeenCalledTimes(1)
  })
})

describe('Badge', () => {
  it('renders every supported state with readable text and keeps danger as an error alias', () => {
    render(
      <>
        <Badge variant="neutral">Neutral</Badge>
        <Badge variant="success">Ready</Badge>
        <Badge variant="warning">Attention</Badge>
        <Badge variant="error">Failed</Badge>
        <Badge variant="pending">Pending</Badge>
        <Badge variant="danger">Legacy danger</Badge>
      </>
    )

    for (const label of ['Neutral', 'Ready', 'Attention', 'Failed', 'Pending', 'Legacy danger']) {
      expect(screen.getByText(label).textContent).toBe(label)
    }
    expect(screen.getByText('Failed').getAttribute('data-variant')).toBe('error')
    expect(screen.getByText('Legacy danger').getAttribute('data-variant')).toBe('error')
    expect(screen.getByText('Legacy danger').className).toContain('ds-badge--danger')
  })

  it('inherits theme and compact context without changing its status label', () => {
    render(
      <>
        <div data-ds-theme="light" data-ds-platform="desktop" data-ds-density="compact"><Badge variant="success">Light ready</Badge></div>
        <div data-ds-theme="dark" data-ds-platform="desktop" data-ds-density="compact"><Badge variant="pending">Dark pending</Badge></div>
      </>
    )
    expect(screen.getByText('Light ready').closest('[data-ds-density="compact"]')).not.toBeNull()
    expect(screen.getByText('Dark pending').closest('[data-ds-theme="dark"]')).not.toBeNull()
  })
})

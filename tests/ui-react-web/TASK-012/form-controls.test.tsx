import { createRef, useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormField } from '../../../packages/ui-react-web/src/composites/FormField/index.js'
import { Input } from '../../../packages/ui-react-web/src/primitives/Input/index.js'
import { Label } from '../../../packages/ui-react-web/src/primitives/Label/index.js'
import { Textarea } from '../../../packages/ui-react-web/src/primitives/Textarea/index.js'

describe('Input', () => {
  it('keeps controlled values and calls the native change callback', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    function ControlledInput() {
      const [value, setValue] = useState('')
      return <Input aria-label="Search" value={value} onChange={(event) => { onChange(event); setValue(event.target.value) }} />
    }

    render(<ControlledInput />)
    const input = screen.getByRole('textbox', { name: 'Search' })
    await user.type(input, 'workspace')

    expect((input as HTMLInputElement).value).toBe('workspace')
    expect(onChange).toHaveBeenCalled()
  })

  it('preserves defaultValue, refs, readonly, disabled, invalid and focus behavior', async () => {
    const user = userEvent.setup()
    const ref = createRef<HTMLInputElement>()
    render(
      <>
        <Input ref={ref} aria-label="Prefilled" defaultValue="seed" />
        <Input aria-label="Read only" readOnly value="fixed" />
        <Input aria-label="Disabled" disabled />
        <Input aria-label="Invalid" aria-invalid="true" />
      </>
    )

    const prefilled = screen.getByRole('textbox', { name: 'Prefilled' }) as HTMLInputElement
    const readonly = screen.getByRole('textbox', { name: 'Read only' }) as HTMLInputElement
    const disabled = screen.getByRole('textbox', { name: 'Disabled' })
    const invalid = screen.getByRole('textbox', { name: 'Invalid' })
    expect(prefilled.value).toBe('seed')
    expect(ref.current).toBe(prefilled)
    expect(readonly.readOnly).toBe(true)
    expect((disabled as HTMLInputElement).disabled).toBe(true)
    expect(invalid.getAttribute('aria-invalid')).toBe('true')

    await user.click(prefilled)
    expect(document.activeElement).toBe(prefilled)
  })
})

describe('Label and FormField', () => {
  it('associates label, hint and error with controls and supports label-click focus', async () => {
    const user = userEvent.setup()
    render(<FormField label="Source path" hint="Folder containing source files" error="Path is required"><Input /></FormField>)
    const input = screen.getByRole('textbox', { name: 'Source path' })
    const error = screen.getByText('Path is required')
    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(input.getAttribute('aria-describedby')).toContain(error.id)
    expect(input.getAttribute('aria-describedby')).toContain(screen.getByText('Folder containing source files').id)
    await user.click(screen.getByText('Source path'))
    expect(document.activeElement).toBe(input)
  })

  it('preserves an existing description and connects Textarea with a generated id', () => {
    render(<><span id="external-help">External help</span><FormField label="Notes" hint="Optional"><Textarea aria-describedby="external-help" /></FormField></>)
    const textarea = screen.getByRole('textbox', { name: 'Notes' })
    expect(textarea.id).not.toBe('')
    expect(textarea.getAttribute('aria-describedby')).toContain('external-help')
    expect(textarea.getAttribute('aria-describedby')).toContain(screen.getByText('Optional').id)
  })

  it('keeps floating labels associated and inserts an empty placeholder only when needed', () => {
    render(<FormField label="Project name" labelPlacement="floating"><Input defaultValue="Existing" /></FormField>)
    const input = screen.getByRole('textbox', { name: 'Project name' })
    expect(input.getAttribute('placeholder')).toBe(' ')
    expect((input as HTMLInputElement).value).toBe('Existing')
  })

  it('does not replace an explicit floating-label placeholder', () => {
    render(<FormField label="Filter" labelPlacement="floating"><Input placeholder="Type to filter" /></FormField>)
    expect(screen.getByRole('textbox', { name: 'Filter' }).getAttribute('placeholder')).toBe('Type to filter')
  })

  it('forwards Label attributes and ref', () => {
    const ref = createRef<HTMLLabelElement>()
    render(<Label ref={ref} htmlFor="target" title="Field label">Name</Label>)
    expect(ref.current?.htmlFor).toBe('target')
    expect(screen.getByText('Name').getAttribute('title')).toBe('Field label')
  })
})

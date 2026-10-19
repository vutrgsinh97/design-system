import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FormField } from '../../packages/ui-react-web/src/composites/FormField/index.js'
import { Input } from '../../packages/ui-react-web/src/primitives/Input/index.js'

describe('shared form baseline', () => {
  it('connects the label and hint to the native input', () => {
    render(<FormField label="Project name" hint="Shown in the sidebar"><Input name="project" /></FormField>)
    const input = screen.getByRole('textbox', { name: 'Project name' })
    const hint = screen.getByText('Shown in the sidebar')
    expect(input.getAttribute('aria-describedby')).toContain(hint.id)
    expect(input.getAttribute('name')).toBe('project')
  })
})

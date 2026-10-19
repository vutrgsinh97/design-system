import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Alert } from '../../../packages/ui-react-web/src/desktop/components/Alert/index.js'
import { Button } from '../../../packages/ui-react-web/src/primitives/Button/index.js'
import { Divider } from '../../../packages/ui-react-web/src/primitives/Divider/index.js'
import { Spinner } from '../../../packages/ui-react-web/src/primitives/Spinner/index.js'
import { Text } from '../../../packages/ui-react-web/src/primitives/Text/index.js'

describe('TASK-011 components', () => {
  it('keeps icon-only accessible, focusable by keyboard, and loading buttons disabled', async () => {
    const user = userEvent.setup()
    render(
      <>
        <Button iconOnly icon={<span>+</span>} aria-label="Add source" />
        <Button loading>Saving</Button>
      </>
    )

    const iconButton = screen.getByRole('button', { name: 'Add source' })
    await user.tab()
    expect(document.activeElement).toBe(iconButton)
    const loadingButton = screen.getByRole('button', { name: 'Saving' }) as HTMLButtonElement
    expect(loadingButton.disabled).toBe(true)
    expect(loadingButton.getAttribute('aria-busy')).toBe('true')
  })

  it('keeps desktop compact opt-in and does not replace defaults', () => {
    const { rerender } = render(<Button>Run</Button>)
    const button = screen.getByRole('button', { name: 'Run' })
    expect(button.classList.contains('ds-button--md')).toBe(true)
    expect(button.closest('[data-ds-density="compact"]')).toBeNull()

    rerender(<div data-ds-platform="desktop" data-ds-density="compact"><Button>Run</Button></div>)
    expect(screen.getByRole('button', { name: 'Run' }).closest('[data-ds-density="compact"]')).not.toBeNull()
  })

  it('announces alert status in text as well as using a semantic live role', () => {
    render(<Alert variant="danger">A long error message that can wrap across lines.</Alert>)
    expect(screen.getByRole('alert').textContent).toContain('Error: A long error message')
    expect(screen.getByRole('alert').textContent).toContain('wrap across lines.')
  })

  it('renders token-based text tones and keeps status components semantic', () => {
    render(<><Text tone="pending">Waiting</Text><Divider /><Spinner label="Loading files" /></>)
    expect(screen.getByText('Waiting').classList.contains('ds-text--pending')).toBe(true)
    expect(screen.getByRole('separator')).toBeTruthy()
    expect(screen.getByRole('status', { name: 'Loading files' })).toBeTruthy()
  })
})

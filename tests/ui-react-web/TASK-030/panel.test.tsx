import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Panel,
  PanelHeader,
  PanelBackButton,
  PanelTitle,
  PanelActions,
  PanelContent,
  PanelFooter
} from '../../../packages/ui-react-web/src/desktop/components/Panel/index.js'

describe('Panel composition', () => {
  it('renders a titled content panel without optional controls or footer', () => {
    render(
      <Panel aria-labelledby="simple-title">
        <PanelHeader><PanelTitle id="simple-title">Details</PanelTitle></PanelHeader>
        <PanelContent><p>Flexible content</p></PanelContent>
      </Panel>
    )

    expect(screen.getByRole('heading', { name: 'Details', level: 2 })).toBeTruthy()
    expect(screen.getByText('Flexible content')).toBeTruthy()
    expect(screen.queryByRole('button')).toBeNull()
    expect(document.querySelector('.ds-panel__footer')).toBeNull()
  })

  it('keeps back navigation consumer-owned and keyboard operable', async () => {
    const user = userEvent.setup()
    const onBack = vi.fn()
    const onSubmit = vi.fn((event: Event) => event.preventDefault())
    const backRef = createRef<HTMLButtonElement>()

    render(
      <form onSubmit={onSubmit}>
        <Panel>
          <PanelHeader>
            <PanelBackButton ref={backRef} aria-label="Go back" onClick={onBack} />
            <PanelTitle as="h3">Edit profile</PanelTitle>
            <PanelActions><button type="button">Share</button></PanelActions>
          </PanelHeader>
          <PanelContent>Profile fields</PanelContent>
          <PanelFooter><button type="submit">Save</button></PanelFooter>
        </Panel>
      </form>
    )

    const back = screen.getByRole('button', { name: 'Go back' })
    expect(backRef.current).toBe(back)
    expect(back.getAttribute('type')).toBe('button')
    expect(screen.getByRole('heading', { name: 'Edit profile', level: 3 })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Share' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Save' })).toBeTruthy()

    await user.tab()
    expect(document.activeElement).toBe(back)
    await user.keyboard('{Enter}')
    expect(onBack).toHaveBeenCalledTimes(1)
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('forwards disabled and custom button attributes to the optional back control', async () => {
    const user = userEvent.setup()
    const onBack = vi.fn()
    render(<PanelBackButton aria-label="Trở về" disabled data-testid="panel-back" onClick={onBack} />)
    const back = screen.getByRole('button', { name: 'Trở về' })
    expect(back.hasAttribute('disabled')).toBe(true)
    expect(back.getAttribute('data-testid')).toBe('panel-back')
    await user.click(back)
    expect(onBack).not.toHaveBeenCalled()
  })
})

import { useState } from 'react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../packages/ui-react-web/src/desktop/components/Tooltip/index.js'

function withProvider(content: ReactNode) {
  return <TooltipProvider delayDuration={0} skipDelayDuration={0}>{content}</TooltipProvider>
}

describe('desktop Tooltip', () => {
  it('opens on hover and focus, associates the description, and dismisses with Escape', async () => {
    const user = userEvent.setup()
    render(withProvider(<Tooltip>
      <TooltipTrigger asChild><button type="button">Save</button></TooltipTrigger>
      <TooltipContent shortcut="⌘S">Save changes</TooltipContent>
    </Tooltip>))
    const trigger = screen.getByRole('button', { name: 'Save' })
    await user.hover(trigger)
    const tip = await screen.findByRole('tooltip')
    expect(tip.textContent).toContain('Save changes')
    expect(tip.textContent).toContain('⌘S')
    expect(trigger.getAttribute('aria-describedby')).toBe(tip.id)
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('tooltip')).toBeNull())
    await user.unhover(trigger)
    trigger.focus()
    expect(document.activeElement).toBe(trigger)
    expect(await screen.findByRole('tooltip')).toBeTruthy()
  })

  it('does not intercept activation and supports disabled native triggers', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(withProvider(<>
      <Tooltip>
        <TooltipTrigger asChild><button type="button" onClick={onClick}>Run</button></TooltipTrigger>
        <TooltipContent>Run command</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild><button type="button" disabled>Unavailable</button></TooltipTrigger>
        <TooltipContent>Unavailable action</TooltipContent>
      </Tooltip>
    </>))
    const run = screen.getByRole('button', { name: 'Run' })
    await user.click(run)
    expect(onClick).toHaveBeenCalledOnce()
    const disabled = screen.getByRole('button', { name: 'Unavailable' })
    expect(disabled.hasAttribute('disabled')).toBe(true)
    await user.hover(disabled)
    expect(screen.queryByRole('tooltip')).toBeNull()
  })

  it('can be controlled by open and onOpenChange', async () => {
    const onOpenChange = vi.fn()
    function Example() {
      const [open, setOpen] = useState(false)
      return <Tooltip open={open} onOpenChange={(nextOpen) => { onOpenChange(nextOpen); setOpen(nextOpen) }}>
        <TooltipTrigger asChild><button type="button">Help</button></TooltipTrigger>
        <TooltipContent>A long accessible explanation that should wrap within the viewport without widening it.</TooltipContent>
      </Tooltip>
    }
    render(withProvider(<Example />))
    await userEvent.setup().hover(screen.getByRole('button', { name: 'Help' }))
    const tip = await screen.findByRole('tooltip')
    expect(tip.textContent).toContain('long accessible explanation')
    expect(onOpenChange).toHaveBeenCalledWith(true)
  })
})

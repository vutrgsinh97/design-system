import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Dialog, DialogBody, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../../packages/ui-react-web/src/desktop/components/Dialog/index.js'

describe('desktop Dialog', () => {
  it('supports controlled open, Escape dismissal, and focus return', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    function Example() {
      const [open, setOpen] = useState(false)
      return <Dialog open={open} onOpenChange={(nextOpen) => { onOpenChange(nextOpen); setOpen(nextOpen) }}>
        <DialogTrigger>Open details</DialogTrigger>
        <DialogContent><DialogTitle>Details</DialogTitle><DialogDescription>Dialog description</DialogDescription></DialogContent>
      </Dialog>
    }
    render(<Example />)
    const trigger = screen.getByRole('button', { name: 'Open details' })
    await user.click(trigger)
    expect(await screen.findByRole('dialog', { name: 'Details' })).toBeTruthy()
    expect(screen.getByRole('dialog').getAttribute('aria-describedby')).toBeTruthy()
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(onOpenChange).toHaveBeenCalledWith(true)
    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(document.activeElement).toBe(trigger)
  })

  it('keeps the footer outside the scrollable body and supports close controls', async () => {
    const user = userEvent.setup()
    render(<Dialog defaultOpen>
      <DialogContent>
        <DialogHeader><DialogTitle>Long form</DialogTitle><DialogDescription>Review the details</DialogDescription></DialogHeader>
        <DialogBody data-testid="dialog-body">{Array.from({ length: 80 }, (_, index) => <p key={index}>Long content {index}</p>)}</DialogBody>
        <DialogFooter><DialogClose>Cancel</DialogClose><DialogClose>Done</DialogClose></DialogFooter>
      </DialogContent>
    </Dialog>)
    const body = screen.getByTestId('dialog-body')
    expect(body.className).toContain('ds-dialog__body')
    const cancel = screen.getByRole('button', { name: 'Cancel' })
    const done = screen.getByRole('button', { name: 'Done' })
    expect(done.closest('[role="dialog"]')).toBeTruthy()
    done.focus()
    await user.tab()
    expect(document.activeElement).toBe(cancel)
    await user.click(done)
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  })
})

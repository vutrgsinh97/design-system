import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from '../../../packages/ui-react-web/src/desktop/components/Modal/index.js'
import {
  Toast,
  ToastClose,
  ToastProvider,
  ToastTitle,
  ToastViewport
} from '../../../packages/ui-react-web/src/desktop/components/Toast/index.js'

describe('Modal and positioned Toast', () => {
  it('renders consumer content and footer, closes with Escape, and returns focus', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()

    function Example() {
      const [open, setOpen] = useState(false)
      return <Modal
          open={open}
          onOpenChange={setOpen}
          trigger={<button>Open confirmation</button>}
          title="Delete project?"
          description="This action cannot be undone."
          footer={<><button onClick={() => setOpen(false)}>Cancel</button><button onClick={onConfirm}>Delete</button></>}
        >
          <p>Project Atlas and its data will be removed.</p>
        </Modal>
    }

    render(<Example />)
    const trigger = screen.getByRole('button', { name: 'Open confirmation' })
    await user.click(trigger)
    const dialog = screen.getByRole('dialog', { name: 'Delete project?' })
    expect(dialog.getAttribute('aria-describedby')).toBeTruthy()
    expect(screen.getByText('Project Atlas and its data will be removed.')).toBeTruthy()
    await user.click(screen.getByRole('button', { name: 'Delete' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('dialog')).toBeTruthy()
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(document.activeElement).toBe(trigger)
  })

  it('supports all toast statuses and positions while allowing dismissal', async () => {
    const { rerender } = render(
      <ToastProvider>
        <Toast status="warning" defaultOpen><ToastTitle>Check your input</ToastTitle><ToastClose /></Toast>
        <ToastViewport position="top-center" />
      </ToastProvider>
    )
    expect(screen.getByText('Check your input').closest('[data-variant]')?.getAttribute('data-variant')).toBe('warning')
    expect(screen.getByRole('list', { name: 'Notifications' }).getAttribute('data-position')).toBe('top-center')
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }))
    await waitFor(() => expect(screen.queryByRole('status')).toBeNull())

    rerender(
      <ToastProvider>
        <Toast key="error" status="error" defaultOpen><ToastTitle>Failed</ToastTitle></Toast>
        <ToastViewport position="bottom-left" />
      </ToastProvider>
    )
    expect(screen.getByText('Failed').closest('[data-variant]')?.getAttribute('data-variant')).toBe('error')
    expect(screen.getByRole('list', { name: 'Notifications' }).getAttribute('data-position')).toBe('bottom-left')
  })
})

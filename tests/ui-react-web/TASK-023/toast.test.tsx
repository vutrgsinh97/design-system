import { act } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport
} from '../../../packages/ui-react-web/src/desktop/components/Toast/index.js'

describe('Toast', () => {
  it('announces a generic message in the Radix live region without taking focus', async () => {
    const { rerender } = render(<input aria-label="Keep focus" />)
    const input = screen.getByRole('textbox', { name: 'Keep focus' })
    input.focus()

    rerender(
      <>
        <input aria-label="Keep focus" />
        <ToastProvider><ToastViewport /><Toast defaultOpen variant="success"><ToastTitle>Saved</ToastTitle><ToastDescription>Changes stored.</ToastDescription></Toast></ToastProvider>
      </>
    )
    await waitFor(() => expect(screen.getByRole('status').textContent).toContain('Saved'))
    const toast = screen.getByRole('status')
    expect(toast.textContent).toContain('Changes stored.')
    expect(['polite', 'assertive']).toContain(toast.getAttribute('aria-live'))
    expect(document.activeElement).toBe(input)
    expect(screen.getByRole('region', { name: /Notifications/ })).toBeTruthy()
  })

  it('invokes the optional action and dismisses with the close control', async () => {
    const onAction = vi.fn()
    const onOpenChange = vi.fn()
    render(
      <ToastProvider>
        <ToastViewport />
          <Toast defaultOpen onOpenChange={onOpenChange}>
          <ToastTitle>Operation finished</ToastTitle>
          <ToastDescription>It is safe to continue.</ToastDescription>
          <ToastAction altText="Undo the operation" onClick={onAction}>Undo</ToastAction>
          <ToastClose />
        </Toast>
      </ToastProvider>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Undo' }))
    expect(onAction).toHaveBeenCalledTimes(1)
    expect(onOpenChange).toHaveBeenCalledWith(false)
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Undo' })).toBeNull())
  })

  it('supports controlled visibility and reports a dismiss request without hiding itself', async () => {
    const onOpenChange = vi.fn()
    const { rerender } = render(
      <ToastProvider>
        <ToastViewport />
        <Toast open onOpenChange={onOpenChange}><ToastTitle>Controlled message</ToastTitle><ToastClose /></Toast>
      </ToastProvider>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(screen.getByRole('status')).toBeTruthy()

    rerender(<ToastProvider><ToastViewport /><Toast open={false}><ToastTitle>Controlled message</ToastTitle></Toast></ToastProvider>)
    expect(screen.queryByRole('button', { name: 'Dismiss notification' })).toBeNull()
  })

  it('cleans up the auto-dismiss timer when the toast is closed early', async () => {
    vi.useFakeTimers()
    try {
      const onOpenChange = vi.fn()
      render(<ToastProvider><ToastViewport /><Toast defaultOpen duration={500} onOpenChange={onOpenChange}><ToastTitle>Timed message</ToastTitle><ToastClose /></Toast></ToastProvider>)
      fireEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }))
      const closeCalls = onOpenChange.mock.calls.filter(([open]) => open === false).length
      await act(async () => { vi.advanceTimersByTime(1000) })
      expect(onOpenChange.mock.calls.filter(([open]) => open === false)).toHaveLength(closeCalls)
      expect(screen.queryByRole('status')).toBeNull()
    } finally {
      vi.useRealTimers()
    }
  })
})

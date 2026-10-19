import { act } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { PromiseToast, ToastProvider, ToastViewport } from '../../../packages/ui-react-web/src/desktop/components/Toast/index.js'

function deferred() {
  let resolve!: (value: string) => void
  let reject!: (reason: Error) => void
  const promise = new Promise<string>((res, rej) => { resolve = res; reject = rej })
  return { promise, resolve, reject }
}

describe('PromiseToast', () => {
  it('stays visible while pending, then shows success and auto-dismisses', async () => {
    vi.useFakeTimers()
    try {
      const task = deferred()
      const onOpenChange = vi.fn()
      render(
        <ToastProvider>
          <PromiseToast promise={task.promise} loading="Saving" success="Saved" error="Save failed" resultDuration={1200} onOpenChange={onOpenChange} />
          <ToastViewport />
        </ToastProvider>
      )
      expect(screen.getByText('Saving').closest('[data-variant]')?.getAttribute('data-variant')).toBe('info')
      await act(async () => { vi.advanceTimersByTime(6000) })
      expect(screen.getByText('Saving')).toBeTruthy()
      expect(onOpenChange).not.toHaveBeenCalled()

      await act(async () => { task.resolve('done') })
      expect(screen.getByText('Saved').closest('[data-variant]')?.getAttribute('data-variant')).toBe('success')
      await act(async () => { vi.advanceTimersByTime(1200) })
      expect(onOpenChange).toHaveBeenCalledWith(false)
      expect(screen.queryByText('Saved')).toBeNull()
    } finally {
      vi.useRealTimers()
    }
  })

  it('shows the supplied error content when the promise rejects', async () => {
    const task = deferred()
    render(
      <ToastProvider>
        <PromiseToast promise={task.promise} loading="Saving" success="Saved" error="Save failed" />
        <ToastViewport />
      </ToastProvider>
    )
    await act(async () => { task.reject(new Error('server detail')) })
    expect(screen.getByText('Save failed').closest('[data-variant]')?.getAttribute('data-variant')).toBe('error')
    expect(screen.queryByText('server detail')).toBeNull()
  })

  it('does not reopen a dismissed pending toast when the task settles', async () => {
    const task = deferred()
    render(
      <ToastProvider>
        <PromiseToast promise={task.promise} loading="Saving" success="Saved" error="Save failed" />
        <ToastViewport />
      </ToastProvider>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }))
    expect(screen.queryByText('Saving')).toBeNull()
    await act(async () => { task.resolve('done') })
    expect(screen.queryByText('Saved')).toBeNull()
  })

  it('ignores the previous promise after receiving a new one', async () => {
    const first = deferred()
    const second = deferred()
    const { rerender } = render(
      <ToastProvider>
        <PromiseToast promise={first.promise} loading="Working" success="Done" error="Failed" />
        <ToastViewport />
      </ToastProvider>
    )
    rerender(
      <ToastProvider>
        <PromiseToast promise={second.promise} loading="Working" success="Done" error="Failed" />
        <ToastViewport />
      </ToastProvider>
    )
    await act(async () => { first.resolve('old') })
    expect(screen.getByText('Working')).toBeTruthy()
    expect(screen.queryByText('Done')).toBeNull()
    await act(async () => { second.resolve('new') })
    expect(screen.getByText('Done')).toBeTruthy()
  })
})

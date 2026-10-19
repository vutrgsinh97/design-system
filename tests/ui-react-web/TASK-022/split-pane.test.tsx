import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SplitPane } from '../../../packages/ui-react-web/src/desktop/components/SplitPane/index.js'

function panes(props: Partial<React.ComponentProps<typeof SplitPane>> = {}) {
  return <SplitPane first={<div>First panel</div>} second={<div>Second panel</div>} minSize={100} maxSize={400} defaultSize={200} {...props} />
}

describe('desktop SplitPane', () => {
  it.each([
    { orientation: 'horizontal' as const, start: 200, end: 480, expected: '400', physicalOrientation: 'vertical' },
    { orientation: 'vertical' as const, start: 200, end: -20, expected: '100', physicalOrientation: 'horizontal' }
  ])('resizes $orientation panes with pointer and clamps to limits', ({ orientation, start, end, expected, physicalOrientation }) => {
    const onSizeChange = vi.fn()
    render(panes({ orientation, onSizeChange }))
    const handle = screen.getByRole('separator', { name: 'Resize panels' })
    expect(handle.getAttribute('aria-orientation')).toBe(physicalOrientation)
    fireEvent.pointerDown(handle, { pointerId: 1, button: 0, clientX: 200, clientY: 200 })
    fireEvent.pointerMove(window, { pointerId: 1, clientX: orientation === 'horizontal' ? end : 200, clientY: orientation === 'vertical' ? end : 200 })
    expect(onSizeChange).toHaveBeenLastCalledWith(Number(expected))
  })

  it.each([
    { orientation: 'horizontal' as const, key: '{ArrowRight}', expected: '210' },
    { orientation: 'vertical' as const, key: '{ArrowDown}', expected: '210' }
  ])('supports $orientation keyboard resize and Home/End limits', async ({ orientation, key, expected }) => {
    const user = userEvent.setup()
    render(panes({ orientation }))
    const handle = screen.getByRole('separator', { name: 'Resize panels' })
    handle.focus()
    await user.keyboard(key)
    expect(handle.getAttribute('aria-valuenow')).toBe(expected)
    await user.keyboard('{End}')
    expect(handle.getAttribute('aria-valuenow')).toBe('400')
    await user.keyboard('{Home}')
    expect(handle.getAttribute('aria-valuenow')).toBe('100')
  })

  it('collapses and restores the previous expanded size when configured', async () => {
    const user = userEvent.setup()
    const onCollapseChange = vi.fn()
    render(panes({ collapsible: true, collapsedSize: 0, onCollapseChange }))
    const handle = screen.getByRole('separator', { name: 'Resize panels' })
    handle.focus()
    await user.keyboard('{Enter}')
    expect(handle.getAttribute('aria-valuenow')).toBe('0')
    expect(handle.getAttribute('aria-valuetext')).toBe('Collapsed')
    expect(onCollapseChange).toHaveBeenLastCalledWith(true)
    await user.keyboard('{Enter}')
    expect(handle.getAttribute('aria-valuenow')).toBe('200')
    expect(onCollapseChange).toHaveBeenLastCalledWith(false)
  })

  it('removes pointer listeners on cancel and unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener')
    const onSizeChange = vi.fn()
    const { unmount } = render(panes({ onSizeChange }))
    const handle = screen.getByRole('separator', { name: 'Resize panels' })
    fireEvent.pointerDown(handle, { pointerId: 7, button: 0, clientX: 10 })
    fireEvent.pointerMove(window, { pointerId: 7, clientX: 35 })
    fireEvent.pointerCancel(window, { pointerId: 7 })
    expect(onSizeChange).toHaveBeenCalledOnce()
    expect(removeSpy.mock.calls.some(([type]) => type === 'pointermove')).toBe(true)
    fireEvent.pointerMove(window, { pointerId: 7, clientX: 50 })
    expect(onSizeChange).toHaveBeenCalledOnce()

    fireEvent.pointerDown(handle, { pointerId: 8, button: 0, clientX: 10 })
    const removeCount = removeSpy.mock.calls.filter(([type]) => type === 'pointermove').length
    unmount()
    expect(removeSpy.mock.calls.filter(([type]) => type === 'pointermove').length).toBeGreaterThan(removeCount)
    removeSpy.mockRestore()
  })
})

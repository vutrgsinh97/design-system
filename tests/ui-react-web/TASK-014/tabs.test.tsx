import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../packages/ui-react-web/src/desktop/components/Tabs/index.js'

function TabFixture({ value = 'one', onValueChange = vi.fn() }: { value?: string; onValueChange?: (value: string) => void }) {
  return (
    <Tabs value={value} onValueChange={onValueChange}>
      <TabsList aria-label="Editor tabs">
        <TabsTrigger value="one">One</TabsTrigger>
        <TabsTrigger value="disabled" disabled>Unavailable</TabsTrigger>
        <TabsTrigger value="two">Two</TabsTrigger>
        <TabsTrigger value="three">A long tab title that remains available by scrolling</TabsTrigger>
      </TabsList>
      <TabsContent value="one">First panel</TabsContent>
      <TabsContent value="disabled">Disabled panel</TabsContent>
      <TabsContent value="two">Second panel</TabsContent>
      <TabsContent value="three">Third panel</TabsContent>
    </Tabs>
  )
}

describe('desktop Tabs', () => {
  it('associates tabs and panels and keeps controlled selection with the consumer', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    const { rerender } = render(<TabFixture onValueChange={onValueChange} />)
    const one = screen.getByRole('tab', { name: 'One' })
    const two = screen.getByRole('tab', { name: 'Two' })

    expect(one.getAttribute('aria-controls')).toBeTruthy()
    expect(one.getAttribute('aria-selected')).toBe('true')
    expect(screen.getByRole('tabpanel').textContent).toBe('First panel')

    await user.click(two)
    expect(onValueChange).toHaveBeenCalledWith('two')
    expect(two.getAttribute('aria-selected')).toBe('false')

    rerender(<TabFixture value="two" onValueChange={onValueChange} />)
    expect(screen.getByRole('tab', { name: 'Two' }).getAttribute('aria-selected')).toBe('true')
    expect(screen.getByRole('tabpanel').textContent).toBe('Second panel')
  })

  it('moves focus by keyboard, skips disabled tabs, and reports the new value', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<TabFixture onValueChange={onValueChange} />)
    await user.tab()
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'One' }))
    await user.keyboard('{ArrowRight}')
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Two' }))
    expect(onValueChange).toHaveBeenCalledWith('two')
    await user.keyboard('{End}')
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: /long tab title/ }))
    await user.keyboard('{Home}')
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'One' }))
  })

  it('keeps disabled tabs out of pointer activation and uses a horizontally scrollable list', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<TabFixture onValueChange={onValueChange} />)
    const disabled = screen.getByRole('tab', { name: 'Unavailable' }) as HTMLButtonElement
    expect(disabled.disabled).toBe(true)
    await user.click(disabled)
    expect(onValueChange).not.toHaveBeenCalled()

    const list = screen.getByRole('tablist')
    expect(list.classList.contains('ds-tabs__list')).toBe(true)
    expect(list.children.length).toBe(4)
    expect(screen.getByRole('tab', { name: /long tab title/ })).toBeTruthy()
  })
})

import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EmptyState } from '../../../packages/ui-react-web/src/desktop/components/EmptyState/index.js'
import { Progress } from '../../../packages/ui-react-web/src/desktop/components/Progress/index.js'

describe('desktop Progress', () => {
  it('exposes accessible determinate values, label and optional visible percentage', () => {
    render(<Progress label="Download" value={25} min={0} max={50} showValue />)
    const progress = screen.getByRole('progressbar', { name: 'Download' })
    expect(progress.getAttribute('aria-valuenow')).toBe('25')
    expect(progress.getAttribute('aria-valuemin')).toBe('0')
    expect(progress.getAttribute('aria-valuemax')).toBe('50')
    expect(progress.getAttribute('aria-valuetext')).toBe('50%')
    expect(screen.getByText('50%')).toBeTruthy()
  })

  it('clamps out-of-range values and leaves aria-valuenow absent when indeterminate', () => {
    const { rerender } = render(<Progress aria-label="Build progress" value={140} />)
    const progress = screen.getByRole('progressbar', { name: 'Build progress' })
    expect(progress.getAttribute('aria-valuenow')).toBe('100')

    rerender(<Progress aria-label="Build progress" />)
    expect(screen.getByRole('progressbar', { name: 'Build progress' }).hasAttribute('aria-valuenow')).toBe(false)
    expect(screen.getByRole('progressbar', { name: 'Build progress' }).classList.contains('ds-progress--indeterminate')).toBe(true)
  })

  it('keeps compact styling opt-in and reports an invalid range', () => {
    const { rerender } = render(<Progress label="Progress" value={1} />)
    const regular = screen.getByRole('progressbar', { name: 'Progress' })
    expect(regular.closest('[data-ds-density="compact"]')).toBeNull()
    rerender(<div data-ds-platform="desktop" data-ds-density="compact"><Progress label="Progress" value={1} /></div>)
    expect(screen.getByRole('progressbar', { name: 'Progress' }).closest('[data-ds-platform="desktop"][data-ds-density="compact"]')).toBeTruthy()
    expect(() => render(<Progress aria-label="Invalid" min={10} max={10} value={10} />)).toThrow(RangeError)
  })
})

describe('desktop EmptyState', () => {
  it('connects title and description and keeps optional icon/action slots', () => {
    render(
      <EmptyState
        icon={<svg data-testid="empty-icon" />}
        title="No sources yet"
        description="Add a source to see its contents."
        action={<button>Add source</button>}
      />
    )
    const section = screen.getByRole('region', { name: 'No sources yet' })
    expect(section.getAttribute('aria-describedby')).toBeTruthy()
    expect(screen.getByTestId('empty-icon').parentElement?.getAttribute('aria-hidden')).toBe('true')
    expect(screen.getByRole('button', { name: 'Add source' })).toBeTruthy()
  })

  it('renders long copy and supports content without title, icon or action', () => {
    const longDescription = 'An extended explanation that remains fully readable when the empty state sits in a narrow workspace panel.'.repeat(2)
    render(<EmptyState description={longDescription} />)
    expect(screen.getByText(longDescription).textContent).toBe(longDescription)
  })
})

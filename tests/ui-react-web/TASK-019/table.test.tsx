import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Table,
  TableActions,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow
} from '../../../packages/ui-react-web/src/desktop/components/Table/index.js'

describe('Table composition', () => {
  it('renders semantic table sections, rows, header cells and data cells', () => {
    render(
      <Table aria-label="Sources">
        <TableHeader><TableRow><TableHeaderCell>Source</TableHeaderCell><TableHeaderCell>Branch</TableHeaderCell></TableRow></TableHeader>
        <TableBody><TableRow><TableCell>Frontend</TableCell><TableCell>main</TableCell></TableRow></TableBody>
      </Table>
    )

    expect(screen.getByRole('table', { name: 'Sources' })).toBeTruthy()
    expect(screen.getAllByRole('row')).toHaveLength(2)
    expect(screen.getByRole('columnheader', { name: 'Source' })).toBeTruthy()
    expect(screen.getByRole('cell', { name: 'Frontend' })).toBeTruthy()
  })

  it('exposes selected and disabled states semantically and handles long content', () => {
    const longName = 'a'.repeat(240)
    render(
      <Table aria-label="Files">
        <TableBody>
          <TableRow selected><TableCell>{longName}</TableCell></TableRow>
          <TableRow disabled><TableCell>Unavailable</TableCell></TableRow>
        </TableBody>
      </Table>
    )
    const [selected, disabled] = screen.getAllByRole('row')
    expect(selected.getAttribute('aria-selected')).toBe('true')
    expect(selected.getAttribute('data-selected')).toBe('true')
    expect(disabled.getAttribute('aria-disabled')).toBe('true')
    expect(disabled.hasAttribute('inert')).toBe(true)
    expect(screen.getByRole('cell', { name: longName })).toBeTruthy()
  })

  it('keeps actions keyboard-operable in the action slot', async () => {
    const user = userEvent.setup()
    const onOpen = vi.fn()
    render(
      <Table aria-label="Processes">
        <TableBody>
          <TableRow>
            <TableCell>Build service</TableCell>
            <TableCell><TableActions><button type="button" onClick={onOpen}>Open</button></TableActions></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    const action = screen.getByRole('button', { name: 'Open' })
    await user.tab()
    expect(document.activeElement).toBe(action)
    await user.keyboard('{Enter}')
    expect(onOpen).toHaveBeenCalledTimes(1)
  })

  it('supports compact desktop density as an opt-in container', () => {
    render(
      <div data-ds-platform="desktop" data-ds-density="compact">
        <Table aria-label="Compact table"><TableBody><TableRow><TableCell>Compact row</TableCell></TableRow></TableBody></Table>
      </div>
    )
    expect(screen.getByRole('table', { name: 'Compact table' }).closest('[data-ds-density="compact"]')).not.toBeNull()
    expect(screen.getByRole('row').getAttribute('class')).toContain('ds-table__row')
  })
})

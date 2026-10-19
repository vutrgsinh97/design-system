import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react'
import '../../../styles/theme.css'
import styles from './Table.module.css'

export type TableProps = ComponentPropsWithoutRef<'table'>
export const Table = forwardRef<HTMLTableElement, TableProps>(function Table({ className = '', ...props }, ref) {
  return <table {...props} ref={ref} className={`${styles.scope} ds-table ${className}`.trim()} />
})

export type TableHeaderProps = ComponentPropsWithoutRef<'thead'>
export const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(function TableHeader({ className = '', ...props }, ref) {
  return <thead {...props} ref={ref} className={`${styles.scope} ds-table__header ${className}`.trim()} />
})

export type TableBodyProps = ComponentPropsWithoutRef<'tbody'>
export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(function TableBody({ className = '', ...props }, ref) {
  return <tbody {...props} ref={ref} className={`${styles.scope} ds-table__body ${className}`.trim()} />
})

export type TableRowProps = Omit<ComponentPropsWithoutRef<'tr'>, 'aria-selected' | 'aria-disabled'> & {
  selected?: boolean
  disabled?: boolean
}
export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
  { className = '', selected = false, disabled = false, ...props }, ref
) {
  return (
    <tr
      {...props}
      ref={ref}
      aria-selected={selected || undefined}
      aria-disabled={disabled || undefined}
      inert={disabled || undefined}
      data-selected={selected || undefined}
      data-disabled={disabled || undefined}
      className={`${styles.scope} ds-table__row ${className}`.trim()}
    />
  )
})

export type TableHeaderCellProps = ComponentPropsWithoutRef<'th'>
export const TableHeaderCell = forwardRef<ElementRef<'th'>, TableHeaderCellProps>(function TableHeaderCell(
  { className = '', scope = 'col', ...props }, ref
) {
  return <th {...props} ref={ref} scope={scope} className={`${styles.scope} ds-table__header-cell ${className}`.trim()} />
})

export type TableCellProps = ComponentPropsWithoutRef<'td'>
export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell({ className = '', ...props }, ref) {
  return <td {...props} ref={ref} className={`${styles.scope} ds-table__cell ${className}`.trim()} />
})

export type TableActionsProps = ComponentPropsWithoutRef<'div'>
/** Layout helper for native interactive controls placed inside a TableCell. */
export const TableActions = forwardRef<HTMLDivElement, TableActionsProps>(function TableActions({ className = '', ...props }, ref) {
  return <div {...props} ref={ref} className={`${styles.scope} ds-table__actions ${className}`.trim()} />
})

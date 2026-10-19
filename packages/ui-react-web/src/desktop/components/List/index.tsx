'use client'

import { createContext, forwardRef, useCallback, useContext, useEffect, useRef, useState, type HTMLAttributes, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react'
import '../../../styles/theme.css'
import styles from './List.module.css'

type SelectionContextValue = {
  value: string | undefined
  activeValue: string | undefined
  setValue: (value: string) => void
  focusItem: (value: string) => void
}

const SelectionContext = createContext<SelectionContextValue | null>(null)

export type ListProps = HTMLAttributes<HTMLUListElement> & {
  /** Enables single selection with roving focus and arrow-key navigation. Omit for static lists. */
  selectionMode?: 'none' | 'single'
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

export const List = forwardRef<HTMLUListElement, ListProps>(function List(
  { id, selectionMode = 'none', value: controlledValue, defaultValue, onValueChange, className = '', onKeyDown, children, ...props },
  forwardedRef
) {
  const localRef = useRef<HTMLUListElement>(null)
  const setRef = useCallback((node: HTMLUListElement | null) => {
    localRef.current = node
    if (typeof forwardedRef === 'function') forwardedRef(node)
    else if (forwardedRef) forwardedRef.current = node
  }, [forwardedRef])
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const value = controlledValue === undefined ? uncontrolledValue : controlledValue
  const [activeValue, setActiveValue] = useState(value)
  useEffect(() => setActiveValue(value), [value])

  const context: SelectionContextValue = {
    value,
    activeValue,
    focusItem: nextValue => {
      const item = Array.from(localRef.current?.querySelectorAll<HTMLElement>('[data-ds-list-value]') ?? [])
        .find(candidate => candidate.dataset.dsListValue === nextValue)
      item?.focus()
    },
    setValue: nextValue => {
      if (controlledValue === undefined) setUncontrolledValue(nextValue)
      setActiveValue(nextValue)
      onValueChange?.(nextValue)
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    onKeyDown?.(event)
    if (event.defaultPrevented || selectionMode !== 'single') return
    const target = event.target instanceof Element ? event.target : null
    if (target?.closest('[data-list-action]')) return
    const currentItem = target?.closest<HTMLElement>('[data-ds-list-value]')
    if (event.target !== event.currentTarget && !currentItem) return
    const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('[data-ds-list-value]:not([aria-disabled="true"])'))
    if (!items.length) return
    const currentValue = currentItem?.dataset.dsListValue ?? activeValue ?? value
    const currentIndex = items.findIndex(item => item.dataset.dsListValue === currentValue)
    if (currentItem && (event.key === 'Enter' || event.key === ' ')) {
      const currentItemValue = currentItem.dataset.dsListValue
      if (currentItemValue) {
        event.preventDefault()
        context.setValue(currentItemValue)
      }
      return
    }
    let nextIndex: number | undefined
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % items.length
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') nextIndex = currentIndex < 0 ? items.length - 1 : (currentIndex - 1 + items.length) % items.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = items.length - 1
    if (nextIndex === undefined) return
    event.preventDefault()
    const nextValue = items[nextIndex].dataset.dsListValue
    if (nextValue) {
      context.setValue(nextValue)
      context.focusItem(nextValue)
    }
  }

  return (
    <SelectionContext.Provider value={selectionMode === 'single' ? context : null}>
      <ul
        {...props}
        ref={setRef}
        id={id}
        role={props.role}
        tabIndex={selectionMode === 'single' ? (activeValue || value ? -1 : 0) : props.tabIndex}
        data-ds-list=""
        data-ds-selection-mode={selectionMode}
        onKeyDown={handleKeyDown}
        className={`${styles.scope} ds-list ${className}`.trim()}
      >{children}</ul>
    </SelectionContext.Provider>
  )
})

export type ListItemProps = Omit<HTMLAttributes<HTMLLIElement>, 'value'> & {
  value?: string
  leadingIcon?: ReactNode
  primary?: ReactNode
  secondary?: ReactNode
  badge?: ReactNode
  trailingActions?: ReactNode
  disabled?: boolean
}

export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(function ListItem(
  { value: itemValue, leadingIcon, primary, secondary, badge, trailingActions, disabled = false, children, className = '', onClick, ...props },
  ref
) {
  const selection = useContext(SelectionContext)
  const selected = selection !== null && itemValue !== undefined && itemValue === selection.value
  const active = selection !== null && itemValue !== undefined && itemValue === selection.activeValue

  function handleClick(event: MouseEvent<HTMLLIElement>) {
    onClick?.(event)
    const target = event.target instanceof Element ? event.target : null
    if (!event.defaultPrevented && !disabled && selection && itemValue !== undefined && !target?.closest('[data-list-action]')) {
      selection.setValue(itemValue)
      selection.focusItem(itemValue)
    }
  }

  return (
    <li
      {...props}
      ref={ref}
      id={props.id}
      role={props.role}
      aria-current={selection ? (selected ? 'true' : undefined) : props['aria-current']}
      aria-disabled={disabled ? true : props['aria-disabled']}
      data-ds-list-value={selection ? itemValue : undefined}
      tabIndex={selection ? (active ? 0 : -1) : props.tabIndex}
      data-active={active ? '' : undefined}
      data-selected={selected ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      onClick={handleClick}
      className={`${styles.scope} ds-list__item${selected ? ' ds-list__item--selected' : ''}${disabled ? ' ds-list__item--disabled' : ''} ${className}`.trim()}
    >
      {leadingIcon != null && <span className="ds-list__leading" aria-hidden="true">{leadingIcon}</span>}
      <span className="ds-list__body">
        <span className="ds-list__primary">{primary ?? children}</span>
        {secondary != null && <span className="ds-list__secondary">{secondary}</span>}
      </span>
      {badge != null && <span className="ds-list__badge">{badge}</span>}
      {trailingActions != null && <span data-list-action="" className="ds-list__actions">{trailingActions}</span>}
    </li>
  )
})

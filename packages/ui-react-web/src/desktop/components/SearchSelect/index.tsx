'use client'

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useId,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type ReactNode,
  type Ref
} from 'react'
import '../../../styles/theme.css'
import { useListHighlight } from '../../hooks/useListHighlight.js'
import styles from './SearchSelect.module.css'

export type SearchSelectOption = {
  value: string
  label: string
  description?: ReactNode
  disabled?: boolean
}

export type SearchSelectOptionRenderState = { selected: boolean; highlighted: boolean }

export type SearchSelectProps<T extends SearchSelectOption> = Omit<
  ComponentPropsWithoutRef<'button'>,
  'value' | 'defaultValue' | 'onChange' | 'children' | 'type'
> & {
  ref?: Ref<HTMLButtonElement>
  options: readonly T[]
  /** Selected option value. The consumer owns the selection state. */
  value: string | null
  onValueChange: (value: string | null, option: T | null) => void
  /** Search query. When omitted, the query is kept internally (options are never filtered here). */
  query?: string
  onQueryChange?: (query: string) => void
  /** Infinite scroll: `onLoadMore` is called when the end of the list is visible, `hasMore` is true and `loadingMore` is false. */
  hasMore?: boolean
  loadingMore?: boolean
  onLoadMore?: () => void
  /** Shows a "create" row when the query is non-empty and matches no option label (case-insensitive). */
  onCreate?: (query: string) => void
  createLabel?: (query: string) => ReactNode
  loading?: boolean
  error?: ReactNode
  emptyContent?: ReactNode
  loadingContent?: ReactNode
  placeholder?: string
  /** Placeholder and accessible name of the search input inside the popup. */
  searchPlaceholder?: string
  invalid?: boolean
  renderOption?: (option: T, state: SearchSelectOptionRenderState) => ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Class applied to the root wrapper; `className` goes on the trigger button. */
  rootClassName?: string
}

const CREATE_KEY = '\u0000ds-search-select-create'
const defaultCreateLabel = (query: string) => `Thêm "${query}"`

export function SearchSelect<T extends SearchSelectOption>({
  ref,
  options,
  value,
  onValueChange,
  query: queryProp,
  onQueryChange,
  hasMore = false,
  loadingMore = false,
  onLoadMore,
  onCreate,
  createLabel = defaultCreateLabel,
  loading = false,
  error,
  emptyContent = 'No results',
  loadingContent = 'Loading…',
  placeholder = 'Select…',
  searchPlaceholder = 'Search…',
  disabled = false,
  invalid = false,
  renderOption,
  open: openProp,
  onOpenChange,
  className = '',
  rootClassName = '',
  onClick,
  onKeyDown,
  ...buttonProps
}: SearchSelectProps<T>) {
  const id = useId()
  const listboxId = `${id}-listbox`
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const lastSelected = useRef<T | null>(null)
  const [internalOpen, setInternalOpen] = useState(false)
  const [internalQuery, setInternalQuery] = useState('')
  const open = openProp ?? internalOpen
  const query = queryProp ?? internalQuery
  const openRef = useRef(open)
  openRef.current = open

  const setTriggerRef = useCallback((node: HTMLButtonElement | null) => {
    triggerRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }, [ref])

  const changeOpen = useCallback((nextOpen: boolean) => {
    if (openRef.current === nextOpen) return
    openRef.current = nextOpen
    if (openProp === undefined) setInternalOpen(nextOpen)
    onOpenChange?.(nextOpen)
  }, [openProp, onOpenChange])

  const trimmedQuery = query.trim()
  const showCreate = onCreate != null && trimmedQuery !== '' &&
    !options.some((option) => option.label.toLowerCase() === trimmedQuery.toLowerCase())
  const keys = options.filter((option) => !option.disabled).map((option) => option.value)
  if (showCreate) keys.push(CREATE_KEY)
  const { highlighted, setHighlighted, handleArrowKey } = useListHighlight(keys)

  const found = options.find((option) => option.value === value)
  if (found) lastSelected.current = found
  // Keep the label of a selection that scrolled out of the loaded page or the current search.
  const selectedOption = found ?? (value != null && lastSelected.current?.value === value ? lastSelected.current : null)

  const optionId = (key: string) => key === CREATE_KEY ? `${id}-create` : `${id}-option-${options.findIndex((option) => option.value === key)}`
  const activeId = open && highlighted != null && keys.includes(highlighted) ? optionId(highlighted) : undefined

  useEffect(() => {
    if (open) searchRef.current?.focus()
  }, [open])

  // Start on the selected (or first) item, and keep a valid highlight after a search or a new page so Enter always has a target.
  // Layout effect so the highlight is committed before the next key event reaches the search input.
  const keySignature = keys.join('\n')
  useLayoutEffect(() => {
    if (!open) {
      if (highlighted != null) setHighlighted(null)
    } else if (highlighted == null || !keys.includes(highlighted)) {
      setHighlighted(value != null && keys.includes(value) ? value : keys[0] ?? null)
    }
  }, [open, highlighted, keySignature])

  useEffect(() => {
    if (activeId) document.getElementById(activeId)?.scrollIntoView?.({ block: 'nearest' })
  }, [activeId])

  useEffect(() => {
    if (!open) return
    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) changeOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [open, changeOpen])

  // Re-observing after each page makes the observer fire again if the sentinel is still visible.
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!open || !hasMore || loadingMore || !onLoadMore || !sentinel || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) onLoadMore()
    }, { root: scrollRef.current })
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [open, hasMore, loadingMore, onLoadMore, options.length])

  const close = (returnFocus: boolean) => {
    changeOpen(false)
    if (returnFocus) triggerRef.current?.focus()
  }

  const select = (option: T) => {
    if (option.disabled) return
    lastSelected.current = option
    onValueChange(option.value, option)
    close(true)
  }

  const create = () => {
    onCreate?.(trimmedQuery)
    close(true)
  }

  const changeQuery = (nextQuery: string) => {
    if (queryProp === undefined) setInternalQuery(nextQuery)
    onQueryChange?.(nextQuery)
  }

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented || disabled) return
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      changeOpen(true)
    }
  }

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (handleArrowKey(event)) return
    if (event.key === 'Enter') {
      event.preventDefault()
      if (highlighted === CREATE_KEY && showCreate) create()
      else {
        const option = options.find((item) => item.value === highlighted)
        if (option) select(option)
      }
    } else if (event.key === 'Escape') {
      event.preventDefault()
      close(true)
    } else if (event.key === 'Tab') {
      close(false)
    }
  }

  const listLabelledBy = buttonProps['aria-labelledby']
  const listLabel = listLabelledBy ? undefined : buttonProps['aria-label'] ?? searchPlaceholder

  return (
    <div ref={rootRef} className={`${styles.scope} ds-search-select ${rootClassName}`.trim()}>
      <button
        {...buttonProps}
        ref={setTriggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-invalid={invalid || buttonProps['aria-invalid'] || undefined}
        disabled={disabled}
        className={`ds-search-select__trigger ${className}`.trim()}
        onClick={(event) => { onClick?.(event); if (!event.defaultPrevented) changeOpen(!open) }}
        onKeyDown={handleTriggerKeyDown}
      >
        <span className="ds-search-select__value" data-placeholder={selectedOption ? undefined : true}>
          {selectedOption?.label ?? placeholder}
        </span>
      </button>
      {open && (
        // shortcut: the popup always opens below the trigger with no viewport collision handling; switch to a positioning library (e.g. Floating UI) when it is used near the bottom edge or inside clipped containers.
        <div className="ds-search-select__popup">
          <input
            ref={searchRef}
            type="text"
            role="combobox"
            aria-label={searchPlaceholder}
            aria-autocomplete="list"
            aria-expanded="true"
            aria-controls={listboxId}
            aria-activedescendant={activeId}
            autoComplete="off"
            placeholder={searchPlaceholder}
            value={query}
            className="ds-search-select__search"
            onChange={(event) => { changeQuery(event.currentTarget.value); setHighlighted(null) }}
            onKeyDown={handleSearchKeyDown}
          />
          <div ref={scrollRef} className="ds-search-select__scroll">
            {loading && <div className="ds-search-select__message" role="status">{loadingContent}</div>}
            {error != null && <div className="ds-search-select__message ds-search-select__message--error" role="alert">{error}</div>}
            {!loading && error == null && options.length === 0 && !showCreate && (
              <div className="ds-search-select__message" role="status">{emptyContent}</div>
            )}
            <div id={listboxId} role="listbox" aria-label={listLabel} aria-labelledby={listLabelledBy} aria-busy={loading || loadingMore || undefined} className="ds-search-select__listbox">
              {options.map((option, index) => {
                const selected = option.value === value
                const isHighlighted = option.value === highlighted
                return (
                  <div
                    key={option.value}
                    id={`${id}-option-${index}`}
                    role="option"
                    aria-selected={selected}
                    aria-disabled={option.disabled || undefined}
                    data-highlighted={isHighlighted || undefined}
                    data-disabled={option.disabled || undefined}
                    className="ds-search-select__option"
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseEnter={() => { if (!option.disabled) setHighlighted(option.value) }}
                    onClick={() => select(option)}
                  >
                    {renderOption ? renderOption(option, { selected, highlighted: isHighlighted }) : (
                      <span className="ds-search-select__option-main">
                        {option.label}
                        {option.description != null && <span className="ds-search-select__description">{option.description}</span>}
                      </span>
                    )}
                  </div>
                )
              })}
              {showCreate && (
                <div
                  id={`${id}-create`}
                  role="option"
                  aria-selected={false}
                  data-highlighted={highlighted === CREATE_KEY || undefined}
                  className="ds-search-select__option ds-search-select__option--create"
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setHighlighted(CREATE_KEY)}
                  onClick={create}
                >
                  {createLabel(trimmedQuery)}
                </div>
              )}
            </div>
            {loadingMore && <div className="ds-search-select__message" role="status">{loadingContent}</div>}
            {hasMore && <div ref={sentinelRef} className="ds-search-select__sentinel" aria-hidden="true" />}
          </div>
        </div>
      )}
    </div>
  )
}

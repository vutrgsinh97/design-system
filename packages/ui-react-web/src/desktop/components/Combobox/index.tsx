'use client'

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  type ChangeEventHandler,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEventHandler,
  type ReactNode
} from 'react'
import '../../../styles/theme.css'
import { useListHighlight } from '../../hooks/useListHighlight.js'
import styles from './Combobox.module.css'

export type ComboboxOptionData = {
  value: string
  label: string
  description?: ReactNode
  metadata?: ReactNode
  disabled?: boolean
}

export type ComboboxOptionRenderState = { selected: boolean; highlighted: boolean; disabled: boolean }

export type ComboboxProps = Omit<ComponentPropsWithoutRef<'input'>, 'value' | 'defaultValue' | 'onChange' | 'role' | 'size'> & {
  /** Selected option value. The consumer owns the selection state. */
  value: string | null
  onValueChange: (value: string, option: ComboboxOptionData) => void
  /** Search query. The consumer owns filtering and async result updates. */
  query: string
  onQueryChange: (query: string) => void
  /** Native change callback, called after the controlled query callback. */
  onChange?: ChangeEventHandler<HTMLInputElement>
  /** Native click callback; clicking an already-focused input reopens the popup. */
  onClick?: MouseEventHandler<HTMLInputElement>
  /** When omitted, highlighted state is internal; when supplied, it is controlled. */
  highlightedValue?: string | null
  onHighlightedValueChange?: (value: string | null) => void
  options: readonly ComboboxOptionData[]
  loading?: boolean
  error?: ReactNode
  emptyContent?: ReactNode
  loadingContent?: ReactNode
  renderOption?: (option: ComboboxOptionData, state: ComboboxOptionRenderState) => ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Class applied to the input element. */
  className?: string
  /** Class applied to the root wrapper. */
  rootClassName?: string
}

export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(function Combobox(
  {
    value,
    onValueChange,
    query,
    onQueryChange,
    highlightedValue: highlightedValueProp,
    onHighlightedValueChange,
    options,
    loading = false,
    error,
    emptyContent = 'No results',
    loadingContent = 'Loading…',
    renderOption,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    className = '',
    rootClassName = '',
    onFocus,
    onBlur,
    onChange,
    onClick,
    onKeyDown,
    disabled = false,
    ...inputProps
  },
  forwardedRef
) {
  const generatedId = useId()
  const listboxId = `${generatedId}-listbox`
  const errorId = `${generatedId}-error`
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isOpenControlled = openProp !== undefined
  const open = isOpenControlled ? openProp : internalOpen
  const openRef = useRef(open)
  openRef.current = open

  const setInputRef = useCallback((node: HTMLInputElement | null) => {
    inputRef.current = node
    if (typeof forwardedRef === 'function') forwardedRef(node)
    else if (forwardedRef) forwardedRef.current = node
  }, [forwardedRef])

  const changeOpen = useCallback((nextOpen: boolean) => {
    if (openRef.current === nextOpen) return
    openRef.current = nextOpen
    if (!isOpenControlled) setInternalOpen(nextOpen)
    onOpenChange?.(nextOpen)
  }, [isOpenControlled, onOpenChange])

  useEffect(() => {
    if (!open) return
    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) changeOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [open, changeOpen])

  const enabledOptions = options.filter((option) => !option.disabled)
  const {
    highlighted: highlightedValue,
    setHighlighted: changeHighlight,
    handleArrowKey
  } = useListHighlight(enabledOptions.map((option) => option.value), highlightedValueProp, onHighlightedValueChange)
  const selectedOption = options.find((option) => option.value === value)
  const activeOption = enabledOptions.find((option) => option.value === highlightedValue)
  const activeOptionId = activeOption ? `${generatedId}-option-${options.indexOf(activeOption)}` : undefined

  const selectOption = (option: ComboboxOptionData) => {
    if (option.disabled) return
    onValueChange(option.value, option)
    onQueryChange(option.label)
    changeHighlight(option.value)
    changeOpen(false)
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onQueryChange(event.currentTarget.value)
    onChange?.(event)
    changeOpen(true)
    changeHighlight(null)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && !open) changeOpen(true)
    if (handleArrowKey(event)) return
    if (event.key === 'Enter' && open && activeOption) {
      event.preventDefault()
      selectOption(activeOption)
    } else if (event.key === 'Escape' && open) {
      event.preventDefault()
      changeOpen(false)
      changeHighlight(null)
    }
  }

  const handleInputBlur = (event: FocusEvent<HTMLInputElement>) => {
    onBlur?.(event)
    const nextTarget = event.relatedTarget
    if (!(nextTarget instanceof Node && rootRef.current?.contains(nextTarget)) && open) {
      changeOpen(false)
      changeHighlight(null)
    }
  }
  const describedBy = [inputProps['aria-describedby'], error != null ? errorId : undefined].filter(Boolean).join(' ') || undefined

  return (
    <div ref={rootRef} className={`${styles.scope} ds-combobox ${rootClassName}`.trim()} data-disabled={disabled || undefined}>
      <input
        {...inputProps}
        ref={setInputRef}
        type="text"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-activedescendant={open ? activeOptionId : undefined}
        aria-describedby={describedBy}
        aria-invalid={error != null ? true : inputProps['aria-invalid']}
        disabled={disabled}
        value={open ? query : selectedOption?.label ?? query}
        onFocus={(event) => { onFocus?.(event); if (!disabled) changeOpen(true) }}
        onClick={(event) => { onClick?.(event); if (!disabled) changeOpen(true) }}
        onBlur={handleInputBlur}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className={`ds-combobox__input ${className}`.trim()}
      />
      <div className="ds-combobox__popup" hidden={!open}>
        {loading && <div className="ds-combobox__message" role="status">{loadingContent}</div>}
        {!loading && error == null && options.length === 0 && <div className="ds-combobox__message" role="status">{emptyContent}</div>}
        <div id={listboxId} role="listbox" aria-label={inputProps['aria-label']} aria-labelledby={inputProps['aria-labelledby']} className="ds-combobox__listbox" aria-busy={loading || undefined}>
          {options.map((option, index) => {
            const selected = option.value === value
            const highlighted = option.value === highlightedValue
            const optionId = `${generatedId}-option-${index}`
            const state = { selected, highlighted, disabled: Boolean(option.disabled) }
            return (
              <div
                key={option.value}
                id={optionId}
                role="option"
                aria-selected={selected}
                aria-disabled={option.disabled || undefined}
                data-highlighted={highlighted || undefined}
                data-disabled={option.disabled || undefined}
                className="ds-combobox__option"
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => { if (!option.disabled) changeHighlight(option.value) }}
                onClick={() => selectOption(option)}
              >
                {renderOption ? renderOption(option, state) : (
                  <>
                    <span className="ds-combobox__option-main">{option.label}{option.description != null && <span className="ds-combobox__description">{option.description}</span>}</span>
                    {option.metadata != null && <span className="ds-combobox__metadata">{option.metadata}</span>}
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
      {error != null && <div id={errorId} className="ds-combobox__message ds-combobox__message--error" role="alert">{error}</div>}
    </div>
  )
})

import { useCallback, useState, type KeyboardEvent } from 'react'

/**
 * Internal: highlighted-item state (controlled or not) and ArrowUp/ArrowDown wrap-around
 * over the enabled item keys of a listbox. Shared by Combobox and SearchSelect.
 */
export function useListHighlight(
  keys: readonly string[],
  controlled?: string | null,
  onChange?: (key: string | null) => void
) {
  const [internal, setInternal] = useState<string | null>(null)
  const isControlled = controlled !== undefined
  const highlighted = isControlled ? controlled : internal

  const setHighlighted = useCallback((next: string | null) => {
    if (!isControlled) setInternal(next)
    onChange?.(next)
  }, [isControlled, onChange])

  const move = (direction: 1 | -1) => {
    if (keys.length === 0) {
      setHighlighted(null)
      return
    }
    const index = highlighted == null ? -1 : keys.indexOf(highlighted)
    const nextIndex = index < 0
      ? direction > 0 ? 0 : keys.length - 1
      : (index + direction + keys.length) % keys.length
    setHighlighted(keys[nextIndex])
  }

  /** Handles ArrowUp/ArrowDown; returns true when the key was consumed. */
  const handleArrowKey = (event: KeyboardEvent) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return false
    event.preventDefault()
    move(event.key === 'ArrowDown' ? 1 : -1)
    return true
  }

  return { highlighted, setHighlighted, handleArrowKey }
}

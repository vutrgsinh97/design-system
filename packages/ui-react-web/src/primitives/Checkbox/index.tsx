'use client'

import { forwardRef, useCallback, type ForwardedRef, type InputHTMLAttributes, type ReactNode } from 'react'
import '../../styles/theme.css'
import '../../mobile/styles/mobile.css'
import styles from './Checkbox.module.css'

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'indeterminate'> & {
  children?: ReactNode
  /** Sets the native mixed state and exposes it to assistive technology. */
  indeterminate?: boolean
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { children, className = '', indeterminate = false, ...props },
  ref
) {
  const setInputRef = useCallback((node: HTMLInputElement | null) => {
    if (node) node.indeterminate = indeterminate
    assignRef(ref, node)
  }, [indeterminate, ref])

  return (
    <label className={`${styles.scope} ds-checkbox ${className}`.trim()}>
      <input {...props} ref={setInputRef} type="checkbox" aria-checked={indeterminate ? 'mixed' : props['aria-checked']} className="ds-checkbox__input" />
      {children && <span>{children}</span>}
    </label>
  )
})

function assignRef(ref: ForwardedRef<HTMLInputElement>, node: HTMLInputElement | null) {
  if (typeof ref === 'function') ref(node)
  else if (ref) ref.current = node
}

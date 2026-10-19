import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import '../../styles/theme.css'
import '../../mobile/styles/mobile.css'
import styles from './Input.module.css'

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> & {
  invalid?: boolean
  /** Visual content shown before the input value. Include units in the visible label too. */
  prefix?: ReactNode
  /** Visual content shown after the input value. Use a separate composite for actions. */
  suffix?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { invalid = false, prefix, suffix, className = '', type = 'text', ...props },
  ref
) {
  const isInvalid = invalid || props['aria-invalid'] === true || props['aria-invalid'] === 'true'
  const input = (
    <input
      {...props}
      ref={ref}
      type={type}
      aria-invalid={isInvalid || props['aria-invalid'] || undefined}
      className={`${styles.scope} ds-input ${className}`.trim()}
    />
  )

  if (prefix == null && suffix == null) return input

  return (
    <span className={`${styles.field} ds-input-field`} data-invalid={isInvalid || undefined} data-disabled={props.disabled || undefined}>
      {prefix != null && <span className="ds-input-field__adornment" aria-hidden="true">{prefix}</span>}
      {input}
      {suffix != null && <span className="ds-input-field__adornment" aria-hidden="true">{suffix}</span>}
    </span>
  )
})

import { forwardRef, type InputHTMLAttributes } from 'react'
import '../../../styles/theme.css'
import '../../styles/mobile.css'
import styles from './Input.module.css'

export type InputProps = InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { invalid = false, className = '', type = 'text', ...props },
  ref
) {
  return <input {...props} ref={ref} type={type} aria-invalid={invalid || props['aria-invalid'] || undefined} className={`${styles.scope} ds-mobile-input ${className}`.trim()} />
})

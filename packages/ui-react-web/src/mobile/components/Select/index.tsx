import { forwardRef, type SelectHTMLAttributes } from 'react'
import '../../../styles/theme.css'
import '../../styles/mobile.css'
import styles from './Select.module.css'

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { invalid = false, className = '', children, ...props },
  ref
) {
  return (
    <select {...props} ref={ref} aria-invalid={invalid || props['aria-invalid'] || undefined} className={`${styles.scope} ds-mobile-select ${className}`.trim()}>
      {children}
    </select>
  )
})

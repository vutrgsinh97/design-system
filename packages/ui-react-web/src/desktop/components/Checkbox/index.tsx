import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import '../../../styles/theme.css'
import styles from './Checkbox.module.css'

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & { children?: ReactNode }

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { children, className = '', ...props },
  ref
) {
  return (
    <label className={`${styles.scope} ds-checkbox ${className}`.trim()}>
      <input {...props} ref={ref} type="checkbox" className="ds-checkbox__input" />
      {children && <span>{children}</span>}
    </label>
  )
})

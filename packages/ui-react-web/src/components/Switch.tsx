import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import '../styles/theme.css'
import styles from './Switch.module.css'

export type SwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'role'> & { children?: ReactNode }

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { children, className = '', ...props },
  ref
) {
  return (
    <label className={`${styles.scope} ds-switch ${className}`.trim()}>
      <input {...props} ref={ref} type="checkbox" role="switch" className="ds-switch__input" />
      <span aria-hidden="true" className="ds-switch__track" />
      {children && <span>{children}</span>}
    </label>
  )
})

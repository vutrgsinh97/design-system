import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import '../../../styles/theme.css'
import styles from './Radio.module.css'

export type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & { children?: ReactNode }

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { children, className = '', ...props },
  ref
) {
  return (
    <label className={`${styles.scope} ds-radio ${className}`.trim()}>
      <input {...props} ref={ref} type="radio" className="ds-radio__input" />
      {children && <span>{children}</span>}
    </label>
  )
})

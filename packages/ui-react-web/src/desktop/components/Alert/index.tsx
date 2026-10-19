import { forwardRef, type HTMLAttributes } from 'react'
import '../../../styles/theme.css'
import styles from './Alert.module.css'

export type AlertProps = HTMLAttributes<HTMLDivElement> & {
  variant?: 'info' | 'success' | 'warning' | 'danger'
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { variant = 'info', className = '', role, children, ...props },
  ref
) {
  const status = variant === 'danger' || variant === 'warning' ? 'alert' : 'status'
  const statusLabel = variant === 'danger' ? 'Error' : variant === 'info' ? 'Information' : variant[0].toUpperCase() + variant.slice(1)
  return (
    <div {...props} ref={ref} role={role ?? status} className={`${styles.scope} ds-alert ds-alert--${variant} ${className}`.trim()}>
      <span className="ds-alert__status">{statusLabel}: </span>{children}
    </div>
  )
})

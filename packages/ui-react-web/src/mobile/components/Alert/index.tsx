import { forwardRef, type HTMLAttributes } from 'react'
import '../../../styles/theme.css'
import '../../styles/mobile.css'
import styles from './Alert.module.css'

export type AlertProps = HTMLAttributes<HTMLDivElement> & {
  variant?: 'info' | 'success' | 'warning' | 'danger'
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { variant = 'info', className = '', ...props },
  ref
) {
  return <div {...props} ref={ref} className={`${styles.scope} ds-mobile-alert ds-mobile-alert--${variant} ${className}`.trim()} />
})

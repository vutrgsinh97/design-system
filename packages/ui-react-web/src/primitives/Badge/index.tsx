import { forwardRef, type HTMLAttributes } from 'react'
import '../../styles/theme.css'
import '../../mobile/styles/mobile.css'
import styles from './Badge.module.css'

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: 'neutral' | 'primary' | 'success' | 'warning' | 'error' | 'pending' | 'danger'
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant = 'neutral', className = '', ...props },
  ref
) {
  const statusVariant = variant === 'danger' ? 'error' : variant
  return <span {...props} ref={ref} data-variant={statusVariant} className={`${styles.scope} ds-badge ds-badge--${variant} ${className}`.trim()} />
})

import { forwardRef, type HTMLAttributes } from 'react'
import '../../styles/theme.css'
import styles from './Badge.module.css'

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger'
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant = 'neutral', className = '', ...props },
  ref
) {
  return <span {...props} ref={ref} className={`${styles.scope} ds-badge ds-badge--${variant} ${className}`.trim()} />
})

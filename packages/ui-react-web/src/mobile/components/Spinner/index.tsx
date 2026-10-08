import { forwardRef, type HTMLAttributes } from 'react'
import '../../../styles/theme.css'
import '../../styles/mobile.css'
import styles from './Spinner.module.css'

export type SpinnerProps = HTMLAttributes<HTMLSpanElement> & {
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size = 'md', label = 'Loading', className = '', ...props },
  ref
) {
  return <span {...props} ref={ref} role="status" aria-label={label} className={`${styles.scope} ds-mobile-spinner ds-mobile-spinner--${size} ${className}`.trim()} />
})

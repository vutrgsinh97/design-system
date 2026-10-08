import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import '../styles/theme.css'
import styles from './Button.module.css'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading = false, disabled, className = '', type = 'button', children, ...props },
  ref
) {
  return (
    <button
      {...props}
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`${styles.scope} ds-button ds-button--${variant} ds-button--${size} ${className}`.trim()}
    >
      {loading && <span aria-hidden="true" className="ds-button__spinner" />}
      {children}
    </button>
  )
})

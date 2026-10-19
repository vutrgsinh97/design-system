import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import '../../styles/theme.css'
import '../../mobile/styles/mobile.css'
import '../../config/button-colors.css'
import styles from './Button.module.css'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonBaseProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  fullWidth?: boolean
}

export type ButtonProps = ButtonBaseProps & (
  | { iconOnly?: false; children: ReactNode; startIcon?: ReactNode; endIcon?: ReactNode; icon?: never }
  | { iconOnly: true; icon: ReactNode; 'aria-label': string; children?: never; startIcon?: never; endIcon?: never }
)

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary', size = 'md', loading = false, fullWidth = false,
    iconOnly = false, icon, startIcon, endIcon, disabled,
    className = '', type = 'button', children, ...props
  },
  ref
) {
  return (
    <button
      {...props}
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`${styles.scope} ds-button ds-button--${variant} ds-button--${size}${iconOnly ? ' ds-button--icon-only' : ''}${fullWidth ? ' ds-button--full-width' : ''} ${className}`.trim()}
    >
      {loading ? <span aria-hidden="true" className="ds-button__spinner" /> : iconOnly ? <span aria-hidden="true" className="ds-button__icon">{icon}</span> : startIcon ? <span aria-hidden="true" className="ds-button__icon">{startIcon}</span> : null}
      {!iconOnly && children}
      {!loading && !iconOnly && endIcon && <span aria-hidden="true" className="ds-button__icon">{endIcon}</span>}
    </button>
  )
})

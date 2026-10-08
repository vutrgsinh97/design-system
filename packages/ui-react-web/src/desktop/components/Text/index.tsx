import type { HTMLAttributes } from 'react'
import '../../../styles/theme.css'
import styles from './Text.module.css'

export type TextProps = HTMLAttributes<HTMLElement> & {
  as?: 'p' | 'span' | 'div'
  tone?: 'default' | 'muted' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export function Text({ as: Tag = 'p', tone = 'default', size = 'md', className = '', ...props }: TextProps) {
  return <Tag {...props} className={`${styles.scope} ds-text ds-text--${tone} ds-text--${size} ${className}`.trim()} />
}

import { forwardRef, type HTMLAttributes } from 'react'
import '../../../styles/theme.css'
import '../../styles/mobile.css'
import styles from './Card.module.css'

export type CardProps = HTMLAttributes<HTMLDivElement>

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className = '', ...props },
  ref
) {
  return <div {...props} ref={ref} className={`${styles.scope} ds-mobile-card ${className}`.trim()} />
})

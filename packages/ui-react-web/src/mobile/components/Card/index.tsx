import { forwardRef, type HTMLAttributes } from 'react'
import '../../../styles/theme.css'
import '../../styles/mobile.css'
import styles from './Card.module.css'

export type CardProps = HTMLAttributes<HTMLDivElement>
export type CardSectionProps = HTMLAttributes<HTMLDivElement>
export type CardTitleProps = HTMLAttributes<HTMLHeadingElement>

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card({ className = '', ...props }, ref) {
  return <div {...props} ref={ref} className={`${styles.scope} ds-mobile-card ${className}`.trim()} />
})

export const CardHeader = forwardRef<HTMLDivElement, CardSectionProps>(function CardHeader({ className = '', ...props }, ref) {
  return <div {...props} ref={ref} className={`${styles.scope} ds-mobile-card__header ${className}`.trim()} />
})

export const CardContent = forwardRef<HTMLDivElement, CardSectionProps>(function CardContent({ className = '', ...props }, ref) {
  return <div {...props} ref={ref} className={`${styles.scope} ds-mobile-card__content ${className}`.trim()} />
})

export const CardFooter = forwardRef<HTMLDivElement, CardSectionProps>(function CardFooter({ className = '', ...props }, ref) {
  return <div {...props} ref={ref} className={`${styles.scope} ds-mobile-card__footer ${className}`.trim()} />
})

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(function CardTitle({ className = '', ...props }, ref) {
  return <h2 {...props} ref={ref} className={`${styles.scope} ds-mobile-card__title ${className}`.trim()} />
})

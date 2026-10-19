import { forwardRef, type LabelHTMLAttributes } from 'react'
import '../../styles/theme.css'
import '../../mobile/styles/mobile.css'
import styles from './Label.module.css'

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>

export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { className = '', ...props }, ref
) {
  return <label {...props} ref={ref} className={`${styles.scope} ds-label ${className}`.trim()} />
})

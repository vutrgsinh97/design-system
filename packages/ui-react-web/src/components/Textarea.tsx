import { forwardRef, type TextareaHTMLAttributes } from 'react'
import '../styles/theme.css'
import styles from './Textarea.module.css'

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid = false, className = '', ...props },
  ref
) {
  return <textarea {...props} ref={ref} aria-invalid={invalid || props['aria-invalid'] || undefined} className={`${styles.scope} ds-textarea ${className}`.trim()} />
})

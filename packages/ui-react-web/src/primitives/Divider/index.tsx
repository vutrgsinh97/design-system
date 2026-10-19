import { forwardRef, type HTMLAttributes } from 'react'
import '../../styles/theme.css'
import '../../mobile/styles/mobile.css'
import styles from './Divider.module.css'

export type DividerProps = HTMLAttributes<HTMLHRElement>

export const Divider = forwardRef<HTMLHRElement, DividerProps>(function Divider(
  { className = '', ...props },
  ref
) {
  return <hr {...props} ref={ref} className={`${styles.scope} ds-divider ${className}`.trim()} />
})

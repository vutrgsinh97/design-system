import { forwardRef, type HTMLAttributes } from 'react'
import '../../../styles/theme.css'
import styles from './Panel.module.css'

export type PanelProps = HTMLAttributes<HTMLDivElement>
export type PanelSectionProps = HTMLAttributes<HTMLDivElement>
export type PanelTitleProps = HTMLAttributes<HTMLHeadingElement> & { as?: 'h1' | 'h2' | 'h3' }
export { PanelBackButton } from './PanelBackButton.js'
export type { PanelBackButtonProps } from './PanelBackButton.js'

export const Panel = forwardRef<HTMLDivElement, PanelProps>(function Panel({ className = '', ...props }, ref) {
  return <div {...props} ref={ref} className={`${styles.scope} ds-panel ${className}`.trim()} />
})

export const PanelHeader = forwardRef<HTMLDivElement, PanelSectionProps>(function PanelHeader({ className = '', ...props }, ref) {
  return <div {...props} ref={ref} className={`${styles.scope} ds-panel__header ${className}`.trim()} />
})

export const PanelTitle = forwardRef<HTMLHeadingElement, PanelTitleProps>(function PanelTitle(
  { as: Heading = 'h2', className = '', ...props },
  ref
) {
  return <Heading {...props} ref={ref} className={`${styles.scope} ds-panel__title ${className}`.trim()} />
})

export const PanelActions = forwardRef<HTMLDivElement, PanelSectionProps>(function PanelActions({ className = '', ...props }, ref) {
  return <div {...props} ref={ref} className={`${styles.scope} ds-panel__actions ${className}`.trim()} />
})

export const PanelContent = forwardRef<HTMLDivElement, PanelSectionProps>(function PanelContent({ className = '', ...props }, ref) {
  return <div {...props} ref={ref} className={`${styles.scope} ds-panel__content ${className}`.trim()} />
})

export const PanelFooter = forwardRef<HTMLDivElement, PanelSectionProps>(function PanelFooter({ className = '', ...props }, ref) {
  return <div {...props} ref={ref} className={`${styles.scope} ds-panel__footer ${className}`.trim()} />
})

import { forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react'
import '../../../styles/theme.css'
import styles from './EmptyState.module.css'

export type EmptyStateProps = Omit<HTMLAttributes<HTMLElement>, 'title'> & {
  icon?: ReactNode
  title?: ReactNode
  description?: ReactNode
  action?: ReactNode
}

export const EmptyState = forwardRef<HTMLElement, EmptyStateProps>(function EmptyState(
  { icon, title, description, action, className = '', ...props },
  ref
) {
  const titleId = useId()
  const descriptionId = useId()
  const hasTitle = title != null
  const hasDescription = description != null

  return (
    <section
      {...props}
      ref={ref}
      aria-labelledby={props['aria-labelledby'] ?? (hasTitle ? titleId : undefined)}
      aria-describedby={props['aria-describedby'] ?? (hasDescription ? descriptionId : undefined)}
      className={`${styles.scope} ds-empty-state ${className}`.trim()}
    >
      {icon != null && <div className="ds-empty-state__icon" aria-hidden="true">{icon}</div>}
      {hasTitle && <h2 id={titleId} className="ds-empty-state__title">{title}</h2>}
      {hasDescription && <div id={descriptionId} className="ds-empty-state__description">{description}</div>}
      {action != null && <div className="ds-empty-state__action">{action}</div>}
    </section>
  )
})

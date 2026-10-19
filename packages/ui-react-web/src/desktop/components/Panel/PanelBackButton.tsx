import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Button } from '../../../primitives/Button/index.js'

export type PanelBackButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'aria-label'> & {
  'aria-label': string
}

export const PanelBackButton = forwardRef<HTMLButtonElement, PanelBackButtonProps>(function PanelBackButton(
  { className = '', type = 'button', ...props },
  ref
) {
  return (
    <Button
      {...props}
      ref={ref}
      type={type}
      variant="outline"
      iconOnly
      icon={
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m14.5 5-7 7 7 7" />
        </svg>
      }
      className={`ds-panel__back ${className}`.trim()}
    />
  )
})

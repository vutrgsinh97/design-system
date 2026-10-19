'use client'

import { cloneElement, forwardRef, isValidElement, type ComponentPropsWithoutRef, type ElementRef, type ReactElement, type ReactNode } from 'react'
import * as Primitive from '@radix-ui/react-tooltip'
import '../../../styles/theme.css'
import styles from './Tooltip.module.css'

export const TooltipProvider = Primitive.Provider
export const Tooltip = Primitive.Root

type TooltipTriggerProps = ComponentPropsWithoutRef<typeof Primitive.Trigger>

export const TooltipTrigger = forwardRef<ElementRef<typeof Primitive.Trigger>, TooltipTriggerProps>(function TooltipTrigger(props, ref) {
  const child = props.asChild && isValidElement(props.children)
    ? props.children as ReactElement<{ disabled?: boolean; onPointerMove?: (event: React.PointerEvent) => void }>
    : null
  const triggerChild = child?.props.disabled
    ? cloneElement(child, {
        onPointerMove(event) {
          child.props.onPointerMove?.(event)
          if (!event.defaultPrevented) event.preventDefault()
        }
      })
    : props.children

  return <Primitive.Trigger {...props} ref={ref}>{triggerChild}</Primitive.Trigger>
})

export type TooltipContentProps = ComponentPropsWithoutRef<typeof Primitive.Content> & {
  /** Optional keyboard shortcut shown alongside the tooltip label. */
  shortcut?: ReactNode
}

export const TooltipContent = forwardRef<ElementRef<typeof Primitive.Content>, TooltipContentProps>(
  function TooltipContent({ className = '', children, shortcut, sideOffset = 6, ...props }, ref) {
    return (
      <Primitive.Portal>
        <Primitive.Content
          {...props}
          ref={ref}
          sideOffset={sideOffset}
          className={`${styles.scope} ds-tooltip__content ${className}`.trim()}
        >
          <span className="ds-tooltip__label">{children}</span>
          {shortcut != null && <kbd className="ds-tooltip__shortcut">{shortcut}</kbd>}
        </Primitive.Content>
      </Primitive.Portal>
    )
  }
)

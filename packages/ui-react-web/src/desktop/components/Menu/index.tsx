'use client'

import { forwardRef, type ComponentPropsWithoutRef, type ElementRef, type ReactNode } from 'react'
import * as Primitive from '@radix-ui/react-dropdown-menu'
import '../../../styles/theme.css'
import styles from './Menu.module.css'

export const DropdownMenu = Primitive.Root
export const DropdownMenuTrigger = Primitive.Trigger

export type DropdownMenuContentProps = ComponentPropsWithoutRef<typeof Primitive.Content>

export const DropdownMenuContent = forwardRef<ElementRef<typeof Primitive.Content>, DropdownMenuContentProps>(
  function DropdownMenuContent({ className = '', sideOffset = 4, children, ...props }, ref) {
    return (
      <Primitive.Portal>
        <Primitive.Content
          {...props}
          ref={ref}
          sideOffset={sideOffset}
          className={`${styles.scope} ds-menu__content ${className}`.trim()}
        >
          {children}
        </Primitive.Content>
      </Primitive.Portal>
    )
  }
)

export type DropdownMenuItemProps = ComponentPropsWithoutRef<typeof Primitive.Item> & {
  /** Optional visual key hint shown at the end of the item. */
  shortcut?: ReactNode
  /** Marks an action as destructive while retaining the menuitem role. */
  destructive?: boolean
}

export const DropdownMenuItem = forwardRef<ElementRef<typeof Primitive.Item>, DropdownMenuItemProps>(
  function DropdownMenuItem({ className = '', shortcut, destructive = false, children, ...props }, ref) {
    return (
      <Primitive.Item
        {...props}
        ref={ref}
        data-destructive={destructive ? '' : undefined}
        className={`${styles.scope} ds-menu__item ${className}`.trim()}
      >
        <span className="ds-menu__item-label">{children}</span>
        {shortcut != null && <span className="ds-menu__shortcut" aria-hidden="true">{shortcut}</span>}
      </Primitive.Item>
    )
  }
)

export type DropdownMenuSeparatorProps = ComponentPropsWithoutRef<typeof Primitive.Separator>

export const DropdownMenuSeparator = forwardRef<ElementRef<typeof Primitive.Separator>, DropdownMenuSeparatorProps>(
  function DropdownMenuSeparator({ className = '', ...props }, ref) {
    return <Primitive.Separator {...props} ref={ref} className={`${styles.scope} ds-menu__separator ${className}`.trim()} />
  }
)

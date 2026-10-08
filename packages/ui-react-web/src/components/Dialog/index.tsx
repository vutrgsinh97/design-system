'use client'

import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react'
import * as Primitive from '@radix-ui/react-dialog'
import '../../styles/theme.css'
import styles from './Dialog.module.css'

export const Dialog = Primitive.Root
export const DialogTrigger = Primitive.Trigger
export const DialogTitle = Primitive.Title
export const DialogDescription = Primitive.Description
export const DialogClose = Primitive.Close

export type DialogContentProps = ComponentPropsWithoutRef<typeof Primitive.Content>

export const DialogContent = forwardRef<ElementRef<typeof Primitive.Content>, DialogContentProps>(
  function DialogContent({ className = '', children, ...props }, ref) {
    return (
      <Primitive.Portal>
        <Primitive.Overlay className="ds-dialog__overlay" />
        <Primitive.Content {...props} ref={ref} className={`${styles.scope} ds-dialog__content ${className}`.trim()}>
          {children}
        </Primitive.Content>
      </Primitive.Portal>
    )
  }
)

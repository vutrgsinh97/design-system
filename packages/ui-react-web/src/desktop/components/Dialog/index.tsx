'use client'

import { forwardRef, type ComponentPropsWithoutRef, type ElementRef, type HTMLAttributes } from 'react'
import * as Primitive from '@radix-ui/react-dialog'
import '../../../styles/theme.css'
import styles from './Dialog.module.css'

export const Dialog = Primitive.Root
export const DialogTrigger = Primitive.Trigger
export const DialogTitle = Primitive.Title
export const DialogDescription = Primitive.Description
export const DialogClose = Primitive.Close

export type DialogSectionProps = HTMLAttributes<HTMLDivElement>

export const DialogHeader = forwardRef<HTMLDivElement, DialogSectionProps>(function DialogHeader({ className = '', ...props }, ref) {
  return <div {...props} ref={ref} className={`${styles.scope} ds-dialog__header ${className}`.trim()} />
})

export const DialogBody = forwardRef<HTMLDivElement, DialogSectionProps>(function DialogBody({ className = '', ...props }, ref) {
  return <div {...props} ref={ref} className={`${styles.scope} ds-dialog__body ${className}`.trim()} />
})

export const DialogFooter = forwardRef<HTMLDivElement, DialogSectionProps>(function DialogFooter({ className = '', ...props }, ref) {
  return <div {...props} ref={ref} className={`${styles.scope} ds-dialog__footer ${className}`.trim()} />
})

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

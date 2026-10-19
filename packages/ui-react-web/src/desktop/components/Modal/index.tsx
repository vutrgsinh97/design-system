'use client'

import type { ComponentProps, ReactElement, ReactNode } from 'react'
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../Dialog/index.js'
import styles from './Modal.module.css'

export type ModalProps = Omit<ComponentProps<typeof Dialog>, 'children'> & {
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
  footer?: ReactNode
  trigger?: ReactElement
  className?: string
  showCloseButton?: boolean
}

export function Modal({
  title,
  description,
  children,
  footer,
  trigger,
  className = '',
  showCloseButton = true,
  ...dialogProps
}: ModalProps) {
  return (
    <Dialog {...dialogProps}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        {...(description ? {} : { 'aria-describedby': undefined })}
        className={`${styles.content} ${className}`.trim()}
      >
        <DialogHeader className={styles.header}>
          <DialogTitle className={styles.title}>{title}</DialogTitle>
          {description && <DialogDescription className={styles.description}>{description}</DialogDescription>}
          {showCloseButton && (
            <DialogClose className={styles.close} aria-label="Close modal">
              <span aria-hidden="true">×</span>
            </DialogClose>
          )}
        </DialogHeader>
        {children && <DialogBody className={styles.body}>{children}</DialogBody>}
        {footer && <DialogFooter className={styles.footer}>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  )
}

'use client'

import { forwardRef, type ComponentPropsWithoutRef, type ElementRef, type ReactNode } from 'react'
import * as Primitive from '@radix-ui/react-toast'
import '../../../styles/theme.css'
import styles from './Toast.module.css'

export const ToastProvider = Primitive.Provider

export type ToastStatus = 'info' | 'success' | 'warning' | 'error'
export type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'

export type ToastProps = ComponentPropsWithoutRef<typeof Primitive.Root> & {
  /** `variant` remains supported for existing consumers. */
  variant?: ToastStatus
  status?: ToastStatus
}

export const Toast = forwardRef<ElementRef<typeof Primitive.Root>, ToastProps>(function Toast(
  { variant = 'info', status, className = '', ...props }, ref
) {
  return <Primitive.Root {...props} ref={ref} data-variant={status ?? variant} className={`${styles.scope} ds-toast ${className}`.trim()} />
})

export type ToastViewportProps = ComponentPropsWithoutRef<typeof Primitive.Viewport> & {
  position?: ToastPosition
}
export const ToastViewport = forwardRef<ElementRef<typeof Primitive.Viewport>, ToastViewportProps>(function ToastViewport(
  { className = '', position = 'bottom-right', 'aria-label': ariaLabel = 'Notifications', ...props }, ref
) {
  return <Primitive.Viewport {...props} ref={ref} data-position={position} aria-label={ariaLabel} className={`${styles.scope} ds-toast__viewport ${className}`.trim()} />
})

export type ToastTitleProps = ComponentPropsWithoutRef<typeof Primitive.Title>
export const ToastTitle = forwardRef<ElementRef<typeof Primitive.Title>, ToastTitleProps>(function ToastTitle(
  { className = '', ...props }, ref
) {
  return <Primitive.Title {...props} ref={ref} className={`${styles.scope} ds-toast__title ${className}`.trim()} />
})

export type ToastDescriptionProps = ComponentPropsWithoutRef<typeof Primitive.Description>
export const ToastDescription = forwardRef<ElementRef<typeof Primitive.Description>, ToastDescriptionProps>(function ToastDescription(
  { className = '', ...props }, ref
) {
  return <Primitive.Description {...props} ref={ref} className={`${styles.scope} ds-toast__description ${className}`.trim()} />
})

export type ToastActionProps = ComponentPropsWithoutRef<typeof Primitive.Action>
export const ToastAction = forwardRef<ElementRef<typeof Primitive.Action>, ToastActionProps>(function ToastAction(
  { className = '', ...props }, ref
) {
  return <Primitive.Action {...props} ref={ref} className={`${styles.scope} ds-toast__action ${className}`.trim()} />
})

export type ToastCloseProps = Omit<ComponentPropsWithoutRef<typeof Primitive.Close>, 'children'> & {
  children?: ReactNode
}
export const ToastClose = forwardRef<ElementRef<typeof Primitive.Close>, ToastCloseProps>(function ToastClose(
  { className = '', children, ...props }, ref
) {
  return (
    <Primitive.Close {...props} ref={ref} aria-label={props['aria-label'] ?? 'Dismiss notification'} className={`${styles.scope} ds-toast__close ${className}`.trim()}>
      {children ?? <><span aria-hidden="true">×</span><span className="ds-toast__visually-hidden">Dismiss notification</span></>}
    </Primitive.Close>
  )
})

export { PromiseToast } from './PromiseToast.js'
export type { PromiseToastProps } from './PromiseToast.js'

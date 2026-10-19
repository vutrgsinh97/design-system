'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { Spinner } from '../../../primitives/Spinner/index.js'
import { Toast, ToastClose, ToastTitle, type ToastProps } from './index.js'
import styles from './PromiseToast.module.css'

type PromisePhase = 'loading' | 'success' | 'error'

export type PromiseToastProps = Omit<ToastProps, 'children' | 'defaultOpen' | 'duration' | 'open' | 'status' | 'variant'> & {
  /** A task already started and owned by the consumer. */
  promise: PromiseLike<unknown>
  loading: ReactNode
  success: ReactNode
  error: ReactNode
  /** Time in milliseconds to show the result; defaults to 4000. */
  resultDuration?: number
}

export function PromiseToast({ promise, loading, success, error, resultDuration = 4000, onOpenChange, ...props }: PromiseToastProps) {
  const [settlement, setSettlement] = useState<{ promise: PromiseLike<unknown>; phase: PromisePhase }>({ promise, phase: 'loading' })
  const [dismissedPromise, setDismissedPromise] = useState<PromiseLike<unknown> | null>(null)
  const phase = settlement.promise === promise ? settlement.phase : 'loading'
  const duration = Number.isFinite(resultDuration) && resultDuration > 0 ? resultDuration : 4000

  useEffect(() => {
    let active = true
    setSettlement({ promise, phase: 'loading' })
    Promise.resolve(promise).then(
      () => { if (active) setSettlement({ promise, phase: 'success' }) },
      () => { if (active) setSettlement({ promise, phase: 'error' }) }
    )
    return () => { active = false }
  }, [promise])

  return (
    <Toast
      {...props}
      key={phase}
      status={phase === 'loading' ? 'info' : phase}
      duration={phase === 'loading' ? Infinity : duration}
      open={dismissedPromise !== promise}
      onOpenChange={(open) => {
        setDismissedPromise(open ? null : promise)
        onOpenChange?.(open)
      }}
    >
      <div className={styles.content}>
        {phase === 'loading' && <Spinner size="sm" aria-hidden="true" />}
        <ToastTitle>{phase === 'loading' ? loading : phase === 'success' ? success : error}</ToastTitle>
      </div>
      <ToastClose />
    </Toast>
  )
}

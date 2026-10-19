'use client'

import { useState } from 'react'
import {
  Button,
  FormField,
  Modal,
  PromiseToast,
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  Select,
  type ToastPosition,
  type ToastStatus
} from '@company/ui-react-web/desktop'
import styles from './modal-toast-showcase.module.css'

const positions: ToastPosition[] = [
  'top-left', 'top-center', 'top-right',
  'bottom-left', 'bottom-center', 'bottom-right'
]

const messages: Record<ToastStatus, { title: string; description: string }> = {
  info: { title: 'Information', description: 'A new version is available to review.' },
  success: { title: 'Changes saved', description: 'Your changes were saved successfully.' },
  warning: { title: 'Check your input', description: 'Some fields need your attention.' },
  error: { title: 'Action failed', description: 'Please try again in a moment.' }
}

function ExampleModal({ kind, onComplete }: { kind: 'information' | 'delete'; onComplete: (status: ToastStatus, title: string, description: string) => void }) {
  const [open, setOpen] = useState(false)
  const destructive = kind === 'delete'

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      trigger={<Button variant={destructive ? 'danger' : 'secondary'}>Open {destructive ? 'delete' : 'information'} modal</Button>}
      title={destructive ? 'Delete project?' : 'Review changes'}
      description={destructive ? 'This action cannot be undone.' : 'Check the details before continuing.'}
      footer={(
        <>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant={destructive ? 'danger' : 'primary'}
            onClick={() => {
              setOpen(false)
              onComplete('success', destructive ? 'Project deleted' : 'Changes saved', 'This was a demo action; no data was changed.')
            }}
          >
            {destructive ? 'Delete project' : 'Save changes'}
          </Button>
        </>
      )}
    >
      <p className={styles.modalText}>
        {destructive
          ? 'The project and its data will be removed permanently. This demo does not delete real data.'
          : 'This content can be any React elements supplied by the consumer.'}
      </p>
    </Modal>
  )
}

export function ModalToastShowcase() {
  const [position, setPosition] = useState<ToastPosition>('bottom-right')
  const [toast, setToast] = useState<{ id: number; status: ToastStatus; title: string; description: string } | null>(null)
  const [promiseToast, setPromiseToast] = useState<{ id: number; promise: Promise<void> } | null>(null)

  function showToast(status: ToastStatus, title = messages[status].title, description = messages[status].description) {
    setToast({ id: Date.now(), status, title, description })
  }

  function showPromiseToast(shouldReject: boolean) {
    const promise = new Promise<void>((resolve, reject) => {
      window.setTimeout(() => shouldReject ? reject(new Error('Demo failure')) : resolve(), 1800)
    })
    setPromiseToast({ id: Date.now(), promise })
  }

  return (
    <section id="modal-toast" className={styles.showcase} aria-labelledby="modal-toast-title">
      <div className={styles.intro}>
        <span className={styles.eyebrow}>FEEDBACK</span>
        <h2 id="modal-toast-title">Modal &amp; Toast</h2>
        <p>Modal asks for attention. Toast reports a result without interrupting the page.</p>
      </div>
      <div className={styles.group}>
        <h3>Modal with custom content and footer</h3>
        <div className={styles.actions}>
          <ExampleModal kind="information" onComplete={showToast} />
          <ExampleModal kind="delete" onComplete={showToast} />
        </div>
      </div>
      <div className={styles.group}>
        <h3>Toast status and position</h3>
        <FormField label="Viewport position" className={styles.position}>
          <Select value={position} onChange={(event) => setPosition(event.target.value as ToastPosition)}>
            {positions.map((value) => <option key={value} value={value}>{value}</option>)}
          </Select>
        </FormField>
        <div className={styles.actions}>
          {(Object.keys(messages) as ToastStatus[]).map((status) => (
            <Button key={status} variant="outline" size="sm" onClick={() => showToast(status)}>{status}</Button>
          ))}
        </div>
      </div>
      <div className={styles.group}>
        <h3>Promise toast</h3>
        <div className={styles.actions}>
          <Button variant="outline" size="sm" onClick={() => showPromiseToast(false)}>Run successful task</Button>
          <Button variant="outline" size="sm" onClick={() => showPromiseToast(true)}>Run failed task</Button>
        </div>
      </div>

      <ToastProvider>
        {toast && (
          <Toast key={toast.id} defaultOpen status={toast.status} duration={4000}>
            <div>
              <ToastTitle>{toast.title}</ToastTitle>
              <ToastDescription>{toast.description}</ToastDescription>
            </div>
            <ToastAction altText="Acknowledge this demo notification" onClick={() => setToast(null)}>Got it</ToastAction>
            <ToastClose />
          </Toast>
        )}
        {promiseToast && (
          <PromiseToast
            key={promiseToast.id}
            promise={promiseToast.promise}
            loading="Task in progress"
            success="Task completed"
            error="Task failed"
            onOpenChange={(open) => { if (!open) setPromiseToast(null) }}
          />
        )}
        <ToastViewport position={position} />
      </ToastProvider>
    </section>
  )
}

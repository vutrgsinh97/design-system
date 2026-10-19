import { cloneElement, isValidElement, useId, type ReactElement, type ReactNode } from 'react'
import { Label } from '../../primitives/Label/index.js'
import styles from './FormField.module.css'

type ControlProps = {
  id?: string
  placeholder?: string
  'aria-describedby'?: string
  'aria-invalid'?: boolean | 'true' | 'false'
}

export type FormFieldProps = {
  label: ReactNode
  children: ReactElement<ControlProps>
  hint?: ReactNode
  error?: ReactNode
  /** Floating placement is intended for a single-line Input. */
  labelPlacement?: 'outside' | 'floating'
  className?: string
}

export function FormField({ label, children, hint, error, labelPlacement = 'outside', className = '' }: FormFieldProps) {
  const generatedId = useId()
  if (!isValidElement<ControlProps>(children)) return null
  const controlId = children.props.id ?? generatedId
  const hintId = hint ? `${generatedId}-hint` : undefined
  const errorId = error ? `${generatedId}-error` : undefined
  const describedBy = [children.props['aria-describedby'], hintId, errorId].filter(Boolean).join(' ') || undefined
  const floating = labelPlacement === 'floating'
  const control = cloneElement(children, {
    id: controlId,
    'aria-describedby': describedBy,
    'aria-invalid': error ? true : children.props['aria-invalid'],
    ...(floating ? { placeholder: children.props.placeholder ?? ' ' } : {})
  })
  const fieldLabel = <Label htmlFor={controlId}>{label}</Label>

  return (
    <div className={`${styles.scope} ds-form-field${floating ? ' ds-form-field--floating' : ''} ${className}`.trim()}>
      {floating ? <span className="ds-form-field__floating-control">{control}{fieldLabel}</span> : <>{fieldLabel}{control}</>}
      {hint && <span id={hintId} className="ds-form-field__hint">{hint}</span>}
      {error && <span id={errorId} className="ds-form-field__error">{error}</span>}
    </div>
  )
}

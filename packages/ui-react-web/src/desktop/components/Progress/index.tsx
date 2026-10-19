import { forwardRef, useId, type HTMLAttributes } from 'react'
import '../../../styles/theme.css'
import styles from './Progress.module.css'

export type ProgressProps = Omit<HTMLAttributes<HTMLDivElement>, 'aria-valuenow' | 'aria-valuemin' | 'aria-valuemax'> & {
  /** Omit for an indeterminate progress indicator. */
  value?: number
  min?: number
  max?: number
  label?: string
  showValue?: boolean
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  {
    value,
    min = 0,
    max = 100,
    label,
    showValue = false,
    className = '',
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-valuetext': ariaValueText,
    ...props
  },
  ref
) {
  if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min) {
    throw new RangeError('Progress max must be a finite number greater than min')
  }
  const labelId = useId()
  const determinate = value !== undefined && Number.isFinite(value)
  const boundedValue = determinate ? Math.max(min, Math.min(max, value)) : undefined
  const percentage = boundedValue === undefined ? undefined : ((boundedValue - min) / (max - min)) * 100
  const formattedValue = boundedValue === undefined ? undefined : `${Math.round(percentage ?? 0)}%`

  return (
    <div className={`${styles.scope} ds-progress__container`}>
      {label && (
        <div className="ds-progress__label-row">
          <span id={labelId} className="ds-progress__label">{label}</span>
          {showValue && formattedValue && <span className="ds-progress__value-label">{formattedValue}</span>}
        </div>
      )}
      <div
        {...props}
        ref={ref}
        role="progressbar"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy ?? (!ariaLabel && label ? labelId : undefined)}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={boundedValue}
        aria-valuetext={ariaValueText ?? (showValue ? formattedValue : undefined)}
        className={`${styles.scope} ds-progress ${boundedValue === undefined ? 'ds-progress--indeterminate' : ''} ${className}`.trim()}
      >
        <span className="ds-progress__track" aria-hidden="true">
          <span className="ds-progress__indicator" style={percentage === undefined ? undefined : { width: `${percentage}%` }} />
        </span>
      </div>
    </div>
  )
})

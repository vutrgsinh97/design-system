'use client'

import { createContext, forwardRef, useCallback, useContext, useEffect, useId, useRef, useState, type HTMLAttributes, type KeyboardEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import '../../../styles/theme.css'
import styles from './SplitPane.module.css'

type SplitOrientation = 'horizontal' | 'vertical'

type ResizeContextValue = {
  orientation: SplitOrientation
  size: number
  minSize: number
  maxSize: number
  collapsible: boolean
  collapsedSize: number
  firstPaneId: string
  secondPaneId: string
  resizeTo: (size: number) => void
  toggleCollapse: () => void
}

const ResizeContext = createContext<ResizeContextValue | null>(null)

export type SplitPaneProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> & {
  orientation?: SplitOrientation
  size?: number
  defaultSize?: number
  minSize?: number
  maxSize?: number
  onSizeChange?: (size: number) => void
  collapsible?: boolean
  collapsedSize?: number
  onCollapseChange?: (collapsed: boolean) => void
  first: ReactNode
  second: ReactNode
}

function clampSize(size: number, minSize: number, maxSize: number, collapsible: boolean, collapsedSize: number) {
  if (collapsible && size <= collapsedSize) return collapsedSize
  return Math.max(minSize, Math.min(maxSize, size))
}

export const SplitPane = forwardRef<HTMLDivElement, SplitPaneProps>(function SplitPane(
  {
    orientation = 'horizontal',
    size: controlledSize,
    defaultSize = 280,
    minSize: requestedMinSize = 160,
    maxSize: requestedMaxSize = Number.POSITIVE_INFINITY,
    onSizeChange,
    collapsible = false,
    collapsedSize: requestedCollapsedSize = 0,
    onCollapseChange,
    first,
    second,
    className = '',
    ...props
  },
  ref
) {
  const minSize = Math.max(0, requestedMinSize)
  const maxSize = Math.max(minSize, requestedMaxSize)
  const collapsedSize = Math.max(0, Math.min(requestedCollapsedSize, maxSize))
  const [uncontrolledSize, setUncontrolledSize] = useState(() => clampSize(defaultSize, minSize, maxSize, collapsible, collapsedSize))
  const requestedSize = controlledSize ?? uncontrolledSize
  const size = clampSize(requestedSize, minSize, maxSize, collapsible, collapsedSize)
  const rootId = useId()
  const firstPaneId = `${rootId}-first`
  const secondPaneId = `${rootId}-second`
  const expandedSizeRef = useRef(Math.max(minSize, defaultSize))
  const lastCollapsedRef = useRef(collapsible && size <= collapsedSize)
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    if (controlledSize !== undefined) {
      const isCollapsed = collapsible && size <= collapsedSize
      lastCollapsedRef.current = isCollapsed
      if (!isCollapsed) expandedSizeRef.current = size
    }
  }, [controlledSize, size, collapsible, collapsedSize])

  const resizeTo = useCallback((rawSize: number) => {
    const nextSize = clampSize(rawSize, minSize, maxSize, collapsible, collapsedSize)
    if (controlledSize === undefined) setUncontrolledSize(nextSize)
    onSizeChange?.(nextSize)
    const isCollapsed = collapsible && nextSize <= collapsedSize
    if (isCollapsed !== lastCollapsedRef.current) {
      lastCollapsedRef.current = isCollapsed
      onCollapseChange?.(isCollapsed)
    }
    if (!isCollapsed) expandedSizeRef.current = nextSize
  }, [controlledSize, minSize, maxSize, collapsible, collapsedSize, onSizeChange, onCollapseChange])

  const toggleCollapse = useCallback(() => {
    if (!collapsible) return
    const isCollapsed = size <= collapsedSize
    resizeTo(isCollapsed ? Math.max(minSize, expandedSizeRef.current) : collapsedSize)
  }, [collapsible, size, collapsedSize, minSize, resizeTo])

  const context: ResizeContextValue = {
    orientation,
    size,
    minSize,
    maxSize,
    collapsible,
    collapsedSize,
    firstPaneId,
    secondPaneId,
    resizeTo,
    toggleCollapse
  }

  return (
    <ResizeContext.Provider value={context}>
      <div
        {...props}
        ref={ref}
        id={props.id ?? rootId}
        data-orientation={orientation}
        data-collapsed={collapsible && size <= collapsedSize ? 'true' : 'false'}
        className={`${styles.scope} ds-split-pane ds-split-pane--${orientation}${dragging ? ' ds-split-pane--dragging' : ''} ${className}`.trim()}
      >
        <div id={firstPaneId} className="ds-split-pane__panel ds-split-pane__panel--first" style={orientation === 'horizontal' ? { flexBasis: `${size}px` } : { flexBasis: `${size}px` }}>
          {first}
        </div>
        <ResizeHandle onDraggingChange={setDragging} />
        <div id={secondPaneId} className="ds-split-pane__panel ds-split-pane__panel--second">{second}</div>
      </div>
    </ResizeContext.Provider>
  )
})

export type ResizeHandleProps = Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  onDraggingChange?: (dragging: boolean) => void
}

export const ResizeHandle = forwardRef<HTMLDivElement, ResizeHandleProps>(function ResizeHandle(
  { className = '', onPointerDown, onKeyDown, onDraggingChange, ...props },
  ref
) {
  const resize = useContext(ResizeContext)
  if (!resize) throw new Error('ResizeHandle must be rendered inside SplitPane')
  const api = resize as ResizeContextValue
  const cleanupRef = useRef<(() => void) | null>(null)
  const cleanup = useCallback(() => {
    if (!cleanupRef.current) return
    cleanupRef.current()
    cleanupRef.current = null
    onDraggingChange?.(false)
  }, [onDraggingChange])

  useEffect(() => () => {
    cleanupRef.current?.()
    cleanupRef.current = null
  }, [])

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    onPointerDown?.(event)
    if (event.defaultPrevented || event.button !== 0) return
    event.preventDefault()
    cleanup()
    const startingPoint = api.orientation === 'horizontal' ? event.clientX : event.clientY
    const startingSize = api.size
    const pointerId = event.pointerId
    const move = (nativeEvent: PointerEvent) => {
      if (nativeEvent.pointerId !== pointerId) return
      const point = api.orientation === 'horizontal' ? nativeEvent.clientX : nativeEvent.clientY
      api.resizeTo(startingSize + point - startingPoint)
    }
    const finish = (nativeEvent: PointerEvent) => {
      if (nativeEvent.pointerId !== pointerId) return
      cleanup()
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', finish)
    window.addEventListener('pointercancel', finish)
    cleanupRef.current = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', finish)
      window.removeEventListener('pointercancel', finish)
    }
    onDraggingChange?.(true)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    if (api.collapsible && event.key === 'Enter') {
      event.preventDefault()
      api.toggleCollapse()
      return
    }
    const step = event.shiftKey ? 50 : 10
    const positiveKey = api.orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown'
    const negativeKey = api.orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp'
    if (event.key === positiveKey) {
      event.preventDefault()
      api.resizeTo(api.size + step)
    } else if (event.key === negativeKey) {
      event.preventDefault()
      api.resizeTo(api.size - step)
    } else if (event.key === 'Home') {
      event.preventDefault()
      api.resizeTo(api.collapsible ? api.collapsedSize : api.minSize)
    } else if (event.key === 'End' && Number.isFinite(api.maxSize)) {
      event.preventDefault()
      api.resizeTo(api.maxSize)
    }
  }

  return (
    <div
      {...props}
      ref={ref}
      role="separator"
      tabIndex={0}
      aria-orientation={api.orientation === 'horizontal' ? 'vertical' : 'horizontal'}
      aria-controls={`${api.firstPaneId} ${api.secondPaneId}`}
      aria-valuenow={api.size}
      aria-valuemin={api.collapsible ? api.collapsedSize : api.minSize}
      aria-valuemax={Number.isFinite(api.maxSize) ? api.maxSize : undefined}
      aria-valuetext={api.collapsible && api.size <= api.collapsedSize ? 'Collapsed' : `${api.size} pixels`}
      aria-label={props['aria-label'] ?? 'Resize panels'}
      data-orientation={api.orientation}
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
      className={`${styles.scope} ds-resize-handle ds-resize-handle--${api.orientation} ${className}`.trim()}
    />
  )
})

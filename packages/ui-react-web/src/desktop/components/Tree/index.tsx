'use client'

import { createContext, forwardRef, useCallback, useContext, useEffect, useId, useRef, useState, type CSSProperties, type HTMLAttributes, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react'
import '../../../styles/theme.css'
import styles from './Tree.module.css'

type TreeContextValue = {
  treeId: string
  expandedIds: Set<string>
  selectedId: string | null
  activeId: string | undefined
  level: number
  parentId?: string
  setActiveId: (id: string) => void
  toggleExpanded: (id: string, expanded?: boolean) => void
  select: (id: string) => void
  focusTree: () => void
}

const TreeContext = createContext<TreeContextValue | null>(null)

export type TreeProps = Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> & {
  expandedIds?: string[]
  defaultExpandedIds?: string[]
  onExpandedIdsChange?: (ids: string[]) => void
  selectedId?: string | null
  defaultSelectedId?: string | null
  onSelectedIdChange?: (id: string | null) => void
}

export const Tree = forwardRef<HTMLDivElement, TreeProps>(function Tree(
  {
    expandedIds: controlledExpandedIds,
    defaultExpandedIds = [],
    onExpandedIdsChange,
    selectedId: controlledSelectedId,
    defaultSelectedId = null,
    onSelectedIdChange,
    className = '',
    id,
    onKeyDown,
    children,
    ...props
  },
  forwardedRef
) {
  const generatedId = useId()
  const treeId = id ?? generatedId
  const rootRef = useRef<HTMLDivElement>(null)
  const setRootRef = useCallback((node: HTMLDivElement | null) => {
    rootRef.current = node
    if (typeof forwardedRef === 'function') forwardedRef(node)
    else if (forwardedRef) forwardedRef.current = node
  }, [forwardedRef])
  const [uncontrolledExpandedIds, setUncontrolledExpandedIds] = useState(defaultExpandedIds)
  const expandedIds = new Set(controlledExpandedIds ?? uncontrolledExpandedIds)
  const [uncontrolledSelectedId, setUncontrolledSelectedId] = useState<string | null>(defaultSelectedId)
  const selectedId = controlledSelectedId === undefined ? uncontrolledSelectedId : controlledSelectedId
  const [activeId, setActiveId] = useState<string | undefined>(selectedId ?? undefined)
  useEffect(() => setActiveId(selectedId ?? undefined), [selectedId])

  const context: TreeContextValue = {
    treeId,
    expandedIds,
    selectedId,
    activeId,
    level: 1,
    setActiveId,
    focusTree: () => rootRef.current?.focus(),
    toggleExpanded: (itemId, expanded) => {
      const next = new Set(expandedIds)
      if (expanded ?? !next.has(itemId)) next.add(itemId)
      else next.delete(itemId)
      const nextIds = [...next]
      if (controlledExpandedIds === undefined) setUncontrolledExpandedIds(nextIds)
      onExpandedIdsChange?.(nextIds)
    },
    select: itemId => {
      if (controlledSelectedId === undefined) setUncontrolledSelectedId(itemId)
      setActiveId(itemId)
      onSelectedIdChange?.(itemId)
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event)
    if (event.defaultPrevented || event.target !== event.currentTarget) return
    const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('[role="treeitem"][data-tree-item-id]'))
      .filter(item => !item.closest('[role="group"][hidden]'))
    if (!items.length) return
    const currentId = activeId ?? selectedId ?? items[0].dataset.treeItemId
    const currentIndex = items.findIndex(item => item.dataset.treeItemId === currentId)
    const current = items[currentIndex < 0 ? 0 : currentIndex]
    const itemId = current.dataset.treeItemId
    if (!itemId) return

    let next: HTMLElement | undefined
    if (event.key === 'ArrowDown') next = items[Math.min(items.length - 1, Math.max(0, currentIndex) + 1)]
    if (event.key === 'ArrowUp') next = items[Math.max(0, currentIndex - 1)]
    if (event.key === 'Home') next = items[0]
    if (event.key === 'End') next = items[items.length - 1]
    if (next) {
      event.preventDefault()
      const nextId = next.dataset.treeItemId
      if (nextId) setActiveId(nextId)
      return
    }

    if (event.key === 'ArrowRight' && current.dataset.treeHasChildren === 'true') {
      event.preventDefault()
      if (!expandedIds.has(itemId)) {
        context.toggleExpanded(itemId, true)
      } else {
        next = items.find(item => item.dataset.treeParent === itemId)
        const nextId = next?.dataset.treeItemId
        if (nextId) setActiveId(nextId)
      }
      return
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      if (expandedIds.has(itemId)) context.toggleExpanded(itemId, false)
      else {
        const parentId = current.dataset.treeParent
        if (parentId) setActiveId(parentId)
      }
      return
    }
    if ((event.key === 'Enter' || event.key === ' ') && current.getAttribute('aria-disabled') !== 'true') {
      event.preventDefault()
      context.select(itemId)
    }
  }

  return (
    <TreeContext.Provider value={context}>
      <div
        {...props}
        ref={setRootRef}
        id={treeId}
        role="tree"
        tabIndex={props.tabIndex ?? 0}
        aria-activedescendant={activeId ? `${treeId}-${encodeURIComponent(activeId)}` : undefined}
        onKeyDown={handleKeyDown}
        className={`${styles.scope} ds-tree ${className}`.trim()}
      >{children}</div>
    </TreeContext.Provider>
  )
})

export type TreeItemProps = Omit<HTMLAttributes<HTMLDivElement>, 'id'> & {
  id: string
  label: ReactNode
  icon?: ReactNode
  metadata?: ReactNode
  loading?: boolean
  hasChildren?: boolean
  disabled?: boolean
  children?: ReactNode
}

export const TreeItem = forwardRef<HTMLDivElement, TreeItemProps>(function TreeItem(
  { id, label, icon, metadata, loading = false, hasChildren, disabled = false, children, className = '', onClick, style, ...props },
  ref
) {
  const tree = useContext(TreeContext)
  if (!tree) throw new Error('TreeItem must be rendered inside Tree')
  const api = tree as TreeContextValue
  const expanded = api.expandedIds.has(id)
  const containsChildren = hasChildren ?? (children != null || loading)
  const treeItemId = `${api.treeId}-${encodeURIComponent(id)}`
  const childContext: TreeContextValue = { ...api, level: api.level + 1, parentId: id }

  function handleClick(event: MouseEvent<HTMLDivElement>) {
    onClick?.(event)
    const target = event.target instanceof Element ? event.target : null
    if (event.defaultPrevented || target?.closest('[data-tree-expander]')) return
    if (target?.closest('[role=treeitem]') !== event.currentTarget) return
    api.setActiveId(id)
    if (!disabled) api.select(id)
    api.focusTree()
  }

  function toggle(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation()
    if (disabled) return
    api.toggleExpanded(id)
    api.setActiveId(id)
    api.focusTree()
  }

  return (
    <div
      {...props}
      ref={ref}
      id={treeItemId}
      role="treeitem"
      aria-level={api.level}
      aria-expanded={containsChildren ? expanded : undefined}
      aria-selected={api.selectedId === id}
      aria-disabled={disabled || undefined}
      aria-busy={loading || undefined}
      data-tree-item-id={id}
      data-tree-parent={api.parentId}
      data-tree-has-children={containsChildren ? 'true' : 'false'}
      style={{ '--ds-tree-level': api.level, ...style } as CSSProperties}
      onClick={handleClick}
      className={`${styles.scope} ds-tree__item ${className}`.trim()}
    >
      <div className={`ds-tree__row${api.activeId === id ? ' ds-tree__row--active' : ''}${api.selectedId === id ? ' ds-tree__row--selected' : ''}${disabled ? ' ds-tree__row--disabled' : ''}`}>
        {containsChildren ? (
          <button
            type="button"
            tabIndex={-1}
            aria-label={`${expanded ? 'Collapse' : 'Expand'} ${typeof label === 'string' ? label : 'item'}`}
            aria-expanded={expanded}
            aria-disabled={disabled || undefined}
            disabled={disabled}
            data-tree-expander=""
            className="ds-tree__expander"
            onClick={toggle}
          >{expanded ? '▾' : '▸'}</button>
        ) : <span className="ds-tree__expander ds-tree__expander--empty" aria-hidden="true" />}
        {icon != null && <span className="ds-tree__icon" aria-hidden="true">{icon}</span>}
        <span className="ds-tree__label">{label}</span>
        {metadata != null && <span className="ds-tree__metadata">{metadata}</span>}
        {loading && <span className="ds-tree__loading" role="status">Loading…</span>}
      </div>
      {containsChildren && (
        <div role="group" hidden={!expanded} className="ds-tree__group">
          <TreeContext.Provider value={childContext}>
            {children}
            {loading && children == null && <div className="ds-tree__loading-placeholder" aria-hidden="true" />}
          </TreeContext.Provider>
        </div>
      )}
    </div>
  )
})

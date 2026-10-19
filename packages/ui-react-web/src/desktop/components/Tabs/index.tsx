'use client'

import { forwardRef, type ElementRef } from 'react'
import * as Primitive from '@radix-ui/react-tabs'
import '../../../styles/theme.css'
import styles from './Tabs.module.css'

function cx(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(' ')
}

/** Root for an accessible desktop tab set. Supports Radix controlled and uncontrolled state. */
export const Tabs = forwardRef<ElementRef<typeof Primitive.Root>, Primitive.TabsProps>(function Tabs(
  { className, ...props }, ref
) {
  return <Primitive.Root {...props} ref={ref} className={cx(styles.scope, 'ds-tabs', className)} />
})

export const TabsList = forwardRef<ElementRef<typeof Primitive.List>, Primitive.TabsListProps>(function TabsList(
  { className, ...props }, ref
) {
  return <Primitive.List {...props} ref={ref} className={cx(styles.scope, 'ds-tabs__list', className)} />
})

export const TabsTrigger = forwardRef<ElementRef<typeof Primitive.Trigger>, Primitive.TabsTriggerProps>(function TabsTrigger(
  { className, ...props }, ref
) {
  return <Primitive.Trigger {...props} ref={ref} className={cx(styles.scope, 'ds-tabs__trigger', className)} />
})

export const TabsContent = forwardRef<ElementRef<typeof Primitive.Content>, Primitive.TabsContentProps>(function TabsContent(
  { className, ...props }, ref
) {
  return <Primitive.Content {...props} ref={ref} className={cx(styles.scope, 'ds-tabs__content', className)} />
})

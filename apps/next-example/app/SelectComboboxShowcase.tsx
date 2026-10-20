'use client'

import { useCallback, useState } from 'react'
import { Button, Card, CardContent, CardHeader, CardTitle, Combobox, SearchSelect, Select, Text } from '@vutrgsinh97/ui-react-web/desktop'
import type { ComboboxOptionData, SearchSelectOption } from '@vutrgsinh97/ui-react-web/desktop'
import styles from './select-combobox-showcase.module.css'

const PAGE_SIZE = 30
const fakeRows: SearchSelectOption[] = Array.from({ length: 500 }, (_, index) => {
  const n = String(index + 1).padStart(3, '0')
  return { value: `user-${n}`, label: `User ${n}`, description: `user${n}@example.com`, disabled: index % 47 === 46 }
})
const sources: ComboboxOptionData[] = [
  { value: 'web', label: 'Web app', description: 'apps/web' },
  { value: 'api', label: 'API service', description: 'services/api' },
  { value: 'docs', label: 'Documentation', description: 'apps/docs' }
]

type Mode = 'results' | 'loading' | 'empty' | 'error' | 'disabled'
const matches = (label: string, query: string) => label.toLowerCase().includes(query.trim().toLowerCase())

export function SelectComboboxShowcase() {
  const [mode, setMode] = useState<Mode>('results')
  const [nativeValue, setNativeValue] = useState('')
  const [comboValue, setComboValue] = useState<string | null>(null)
  const [comboQuery, setComboQuery] = useState('')
  const [rows, setRows] = useState(fakeRows)
  const [value, setValue] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [count, setCount] = useState(PAGE_SIZE)
  const [loadingMore, setLoadingMore] = useState(false)

  const filtered = mode === 'results' ? rows.filter(row => matches(row.label, query)) : []
  const loadMore = useCallback(() => {
    setLoadingMore(true)
    setTimeout(() => { setCount(current => current + PAGE_SIZE); setLoadingMore(false) }, 400)
  }, [])
  const states = {
    loading: mode === 'loading',
    error: mode === 'error' ? 'Could not load data' : undefined,
    disabled: mode === 'disabled'
  }

  return (
    <Card className="demo-card">
      <CardHeader><CardTitle>Select &amp; Combobox</CardTitle></CardHeader>
      <CardContent>
        <div className={styles.modes} aria-label="Demo state">
          {(['results', 'loading', 'empty', 'error', 'disabled'] as const).map(nextMode => (
            <Button key={nextMode} size="sm" variant={mode === nextMode ? 'secondary' : 'ghost'} onClick={() => setMode(nextMode)}>{nextMode}</Button>
          ))}
        </div>
        <div className={styles.grid}>
          <section className={styles.column}>
            <label htmlFor="demo-native-select">Native Select</label>
            <Select id="demo-native-select" value={nativeValue} onChange={event => setNativeValue(event.currentTarget.value)} disabled={states.disabled} aria-invalid={mode === 'error' || undefined}>
              <option value="">Choose a role</option>
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </Select>
            <Text size="sm" tone="muted">Short, static lists in simple forms and on mobile: the platform picker is fastest there.</Text>
          </section>
          <section className={styles.column}>
            <label htmlFor="demo-combobox">Combobox</label>
            <Combobox
              id="demo-combobox"
              value={comboValue}
              onValueChange={setComboValue}
              query={comboQuery}
              onQueryChange={setComboQuery}
              options={mode === 'results' ? sources.filter(source => matches(source.label, comboQuery)) : []}
              loading={states.loading}
              error={states.error}
              disabled={states.disabled}
              placeholder="Type to search sources"
            />
            <Text size="sm" tone="muted">Typing is the main action (search boxes, autocomplete); the text field stays visible.</Text>
          </section>
          <section className={styles.column}>
            <span id="demo-search-select-label">SearchSelect</span>
            <SearchSelect
              aria-labelledby="demo-search-select-label"
              options={filtered.slice(0, count)}
              value={value}
              onValueChange={setValue}
              query={query}
              onQueryChange={nextQuery => { setQuery(nextQuery); setCount(PAGE_SIZE) }}
              hasMore={count < filtered.length}
              loadingMore={loadingMore}
              onLoadMore={loadMore}
              onCreate={label => {
                const created = { value: `new-${Date.now()}`, label }
                setRows(current => [created, ...current])
                setValue(created.value)
                setQuery('')
              }}
              loading={states.loading}
              error={states.error}
              disabled={states.disabled}
              invalid={mode === 'error'}
              emptyContent="No matching users"
              placeholder="Choose a user"
              searchPlaceholder="Search users"
            />
            <Text size="sm" tone="muted">Picking one value from a long or remote list (500 rows here, loaded 30 at a time) where search, paging or “create” help.</Text>
            <Text size="sm" tone="muted">Selected: {value ?? 'none'}</Text>
          </section>
        </div>
      </CardContent>
    </Card>
  )
}

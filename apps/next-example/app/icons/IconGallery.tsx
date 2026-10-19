'use client'

import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import type { IconEntry } from './types'
import styles from './icons.module.css'

const pageSize = 72
const sizes = [24, 32, 48] as const
type PreviewMode = 'original' | 'tint'

export function IconGallery({ icons }: { icons: IconEntry[] }) {
  const [query, setQuery] = useState('')
  const [size, setSize] = useState<(typeof sizes)[number]>(32)
  const [mode, setMode] = useState<PreviewMode>('original')
  const [color, setColor] = useState('#2557d6')
  const [visibleCount, setVisibleCount] = useState(pageSize)
  const [copiedName, setCopiedName] = useState('')
  const [announcement, setAnnouncement] = useState('')

  const matches = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
    return terms.length === 0 ? icons : icons.filter((icon) =>
      terms.every((term) => icon.name.includes(term) || icon.componentName.toLowerCase().includes(term))
    )
  }, [icons, query])

  useEffect(() => { setVisibleCount(pageSize) }, [query])

  async function copyImport(icon: IconEntry) {
    const statement = `import { ${icon.componentName} } from '@vutrgsinh97/icons-react/${icon.name}'`
    try {
      await navigator.clipboard.writeText(statement)
      setCopiedName(icon.name)
      setAnnouncement(`Copied import for ${icon.name}`)
    } catch {
      setAnnouncement(`Could not copy ${icon.name}; select the import text instead`)
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Design system / Assets</p>
          <h1>Icon gallery</h1>
          <p className={styles.intro}>Explore the SVG source set and copy one React import at a time.</p>
        </div>
        <div className={styles.total} aria-label={`${icons.length} icons available`}>
          <strong>{icons.length.toLocaleString()}</strong>
          <span>icons</span>
        </div>
      </div>

      <section className={styles.panel} aria-label="Icon controls">
        <div className={styles.searchGroup}>
          <label htmlFor="icon-search">Search icons</label>
          <input
            id="icon-search"
            type="search"
            placeholder="Try arrow, file, circle..."
            autoComplete="off"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className={styles.controlGroup}>
          <span className={styles.controlLabel}>Size</span>
          <div className={styles.segmented} role="group" aria-label="Preview size">
            {sizes.map((option) => (
              <button key={option} type="button" aria-pressed={size === option} onClick={() => setSize(option)}>{option}</button>
            ))}
          </div>
        </div>
        <div className={styles.controlGroup}>
          <span className={styles.controlLabel}>Appearance</span>
          <div className={styles.segmented} role="group" aria-label="Preview appearance">
            <button type="button" aria-pressed={mode === 'original'} onClick={() => setMode('original')}>Original</button>
            <button type="button" aria-pressed={mode === 'tint'} onClick={() => setMode('tint')}>Tint</button>
          </div>
        </div>
        <div className={styles.colorGroup}>
          <label htmlFor="icon-tint">Tint color</label>
          <input id="icon-tint" type="color" value={color} disabled={mode !== 'tint'} onChange={(event) => setColor(event.target.value)} />
        </div>
      </section>

      <div className={styles.results}>
        <p aria-live="polite">Showing {Math.min(visibleCount, matches.length)} of {matches.length.toLocaleString()} icons</p>
        <span>SVG previews load as you scroll</span>
      </div>

      {matches.length === 0 ? (
        <div className={styles.empty}>
          <strong>No icons found</strong>
          <p>Try a shorter name or another keyword.</p>
        </div>
      ) : (
        <ul className={styles.grid}>
          {matches.slice(0, visibleCount).map((icon) => {
            const src = `/icons/svg/${icon.name}`
            const tintStyle: CSSProperties = {
              width: size, height: size, backgroundColor: color,
              maskImage: `url("${src}")`, WebkitMaskImage: `url("${src}")`
            }
            return (
              <li className={styles.card} key={icon.name}>
                <div className={styles.preview}>
                  {mode === 'original'
                    ? <img src={src} width={size} height={size} loading="lazy" alt="" />
                    : <span className={styles.tintedIcon} style={tintStyle} aria-hidden="true" />}
                </div>
                <div className={styles.cardBody}>
                  <p className={styles.iconName} title={icon.name}>{icon.name}</p>
                  <code className={styles.componentName} title={icon.componentName}>{icon.componentName}</code>
                  <button className={styles.copyButton} type="button" onClick={() => copyImport(icon)} aria-label={`Copy import for ${icon.name}`}>
                    {copiedName === icon.name ? 'Copied ✓' : 'Copy import'}
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {visibleCount < matches.length && (
        <button className={styles.moreButton} type="button" onClick={() => setVisibleCount((count) => count + pageSize)}>
          Show more icons
        </button>
      )}
      <p className={styles.note}>Tint is a preview only. React icons keep their SVG source colors; use currentColor in source files to inherit Button color.</p>
      <p className={styles.srOnly} role="status" aria-live="polite">{announcement}</p>
    </main>
  )
}

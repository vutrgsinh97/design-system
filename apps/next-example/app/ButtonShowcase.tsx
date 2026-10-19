'use client'

import { useState } from 'react'
import { Button, type ButtonVariant } from '@vutrgsinh97/ui-react-web/button'

const variants: { name: string; variant: ButtonVariant }[] = [
  { name: 'Primary', variant: 'primary' },
  { name: 'Secondary', variant: 'secondary' },
  { name: 'Outline', variant: 'outline' },
  { name: 'Ghost', variant: 'ghost' },
  { name: 'Danger', variant: 'danger' }
]

function PlusIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
}

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
}

export function ButtonShowcase() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  return (
    <section className="button-showcase" data-ds-theme={theme} aria-labelledby="button-showcase-title">
      <div className="button-showcase__header">
        <div>
          <p className="button-showcase__eyebrow">Primitive</p>
          <h2 id="button-showcase-title">Button</h2>
          <p className="button-showcase__description">Variants, sizes, icons and states share one configurable color system.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          {theme === 'light' ? 'Preview dark' : 'Preview light'}
        </Button>
      </div>

      <div className="button-showcase__section">
        <h3>Variants</h3>
        <div className="button-showcase__row">
          {variants.map(({ name, variant }) => <Button key={variant} variant={variant}>{name}</Button>)}
        </div>
      </div>

      <div className="button-showcase__section">
        <h3>Sizes</h3>
        <div className="button-showcase__row">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </div>

      <div className="button-showcase__section">
        <h3>Icons</h3>
        <div className="button-showcase__row">
          <Button startIcon={<PlusIcon />}>Add item</Button>
          <Button variant="secondary" endIcon={<ArrowIcon />}>Continue</Button>
          <Button variant="outline" iconOnly icon={<PlusIcon />} aria-label="Add item" />
        </div>
      </div>

      <div className="button-showcase__section">
        <h3>States and layout</h3>
        <div className="button-showcase__row">
          <Button loading>Saving</Button>
          <Button disabled>Disabled</Button>
          <div className="button-showcase__wide"><Button variant="outline" size="sm" fullWidth>Full width</Button></div>
        </div>
      </div>
    </section>
  )
}

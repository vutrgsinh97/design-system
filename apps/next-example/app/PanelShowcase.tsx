'use client'

import { useState } from 'react'
import {
  Button,
  FormField,
  Input,
  Panel,
  PanelActions,
  PanelBackButton,
  PanelContent,
  PanelFooter,
  PanelHeader,
  PanelTitle
} from '@vutrgsinh97/ui-react-web/desktop'
import styles from './panel-showcase.module.css'

function ExampleContent() {
  return (
    <>
      <h4 className={styles.contentTitle}>Content area</h4>
      <p className={styles.description}>Place any components here. This is example content, not a fixed part of Panel.</p>
      <div className={styles.field}>
        <FormField label="Name"><Input placeholder="Enter a name" /></FormField>
      </div>
      <div className={styles.note} role="note">ⓘ &nbsp; This is some helpful information.</div>
    </>
  )
}

function MoreIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="5" cy="12" r="1.7" />
      <circle cx="12" cy="12" r="1.7" />
      <circle cx="19" cy="12" r="1.7" />
    </svg>
  )
}

export function PanelShowcase() {
  const [notice, setNotice] = useState('')

  const actions = (
    <PanelActions>
      <Button variant="ghost" size="sm" onClick={() => setNotice('Share action belongs to the consumer.')}>Share</Button>
      <Button variant="outline" size="sm" iconOnly icon={<MoreIcon />} aria-label="More panel actions" onClick={() => setNotice('More actions belong to the consumer.')} />
    </PanelActions>
  )

  return (
    <section id="panel" className={styles.showcase} data-ds-platform="desktop" aria-labelledby="panel-showcase-title">
      <div className={styles.intro}>
        <span className={styles.eyebrow}>COMPOSITE</span>
        <h2 id="panel-showcase-title">Panel</h2>
        <p>Compose a header, content, and optional actions or footer. Back navigation is supplied by the app.</p>
      </div>

      <div className={styles.variants}>
        <div className={styles.variant}>
          <p className={styles.variantLabel}>01 · Minimal</p>
          <Panel aria-labelledby="panel-minimal-title">
            <PanelHeader><PanelTitle as="h3" id="panel-minimal-title">Panel title</PanelTitle></PanelHeader>
            <PanelContent><ExampleContent /></PanelContent>
          </Panel>
        </div>

        <div className={styles.variant}>
          <p className={styles.variantLabel}>02 · Back + header actions</p>
          <Panel aria-labelledby="panel-actions-title">
            <PanelHeader>
              <PanelBackButton aria-label="Go back" onClick={() => setNotice('Back navigation belongs to the consumer.')} />
              <PanelTitle as="h3" id="panel-actions-title">Panel title</PanelTitle>
              {actions}
            </PanelHeader>
            <PanelContent><ExampleContent /></PanelContent>
          </Panel>
        </div>

        <div className={styles.variant}>
          <p className={styles.variantLabel}>03 · Back + actions + footer</p>
          <Panel aria-labelledby="panel-footer-title">
            <PanelHeader>
              <PanelBackButton aria-label="Go back" onClick={() => setNotice('Back navigation belongs to the consumer.')} />
              <PanelTitle as="h3" id="panel-footer-title">Panel title</PanelTitle>
              {actions}
            </PanelHeader>
            <PanelContent><ExampleContent /></PanelContent>
            <PanelFooter>
              <Button variant="outline" onClick={() => setNotice('Cancel belongs to the consumer.')}>Cancel</Button>
              <Button onClick={() => setNotice('Save belongs to the consumer.')}>Save changes</Button>
            </PanelFooter>
          </Panel>
        </div>
      </div>
      <p className={styles.status} role="status" aria-live="polite">{notice}</p>
    </section>
  )
}

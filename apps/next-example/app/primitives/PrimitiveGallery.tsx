'use client'

import { useState } from 'react'
import {
  Badge,
  Button,
  Checkbox,
  Divider,
  FormField,
  Input,
  Label,
  Radio,
  Select,
  Spinner,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@vutrgsinh97/ui-react-web/desktop'
import styles from './primitives.module.css'

export function PrimitiveGallery() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [density, setDensity] = useState<'default' | 'compact'>('default')

  return (
    <main className={styles.page}>
      <div className={styles.intro}>
        <div>
          <p className={styles.eyebrow}>Component catalog</p>
          <h1>Primitives</h1>
          <p>Shared building blocks for desktop and mobile web. Combine these into layouts such as Card; keep application data outside the primitives.</p>
        </div>
        <div className={styles.controls}>
          <Button variant="outline" size="sm" onClick={() => setDensity(density === 'default' ? 'compact' : 'default')}>
            {density === 'default' ? 'Preview compact' : 'Preview default'}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            {theme === 'light' ? 'Preview dark' : 'Preview light'}
          </Button>
        </div>
      </div>

      <div className={styles.catalog} data-ds-theme={theme} data-ds-platform="desktop" data-ds-density={density}>
        <section className={styles.group} aria-labelledby="fields-title">
          <header><span className={styles.kicker}>Form controls</span><h2 id="fields-title">Text entry</h2><p>Input, Label and FormField share native form behavior. Prefix and suffix are visual adornments.</p></header>
          <div className={styles.grid}>
            <div className={styles.demo}>
              <h3>Input + Label</h3>
              <FormField label="Full name" hint="Use the name shown on your profile."><Input placeholder="Your name" /></FormField>
            </div>
            <div className={styles.demo}>
              <h3>Floating label</h3>
              <FormField label="Project name" labelPlacement="floating"><Input /></FormField>
            </div>
            <div className={styles.demo}>
              <h3>Floating, prefilled</h3>
              <FormField label="Project name" labelPlacement="floating"><Input defaultValue="Design system" /></FormField>
            </div>
            <div className={styles.demo}>
              <h3>Floating, error</h3>
              <FormField label="Email" labelPlacement="floating" error="Enter a valid email address."><Input type="email" defaultValue="invalid" /></FormField>
            </div>
            <div className={styles.demo}>
              <h3>Floating, disabled</h3>
              <FormField label="Read only" labelPlacement="floating"><Input disabled /></FormField>
            </div>
            <div className={styles.demo}>
              <h3>Prefix</h3>
              <FormField label="Username"><Input prefix="@" placeholder="username" autoComplete="username" /></FormField>
            </div>
            <div className={styles.demo}>
              <h3>Suffix</h3>
              <FormField label="Weight (kg)"><Input suffix="kg" inputMode="decimal" placeholder="0" /></FormField>
            </div>
            <div className={styles.demo}>
              <h3>Error</h3>
              <FormField label="Email" error="Enter a valid email address."><Input type="email" defaultValue="not-an-email" /></FormField>
            </div>
            <div className={styles.demo}>
              <h3>Disabled</h3>
              <FormField label="Company"><Input defaultValue="Example Inc." disabled /></FormField>
            </div>
            <div className={styles.demo}>
              <h3>Textarea</h3>
              <FormField label="Message"><Textarea rows={3} placeholder="Write a message" /></FormField>
            </div>
          </div>
        </section>

        <section className={styles.group} aria-labelledby="choices-title">
          <header><span className={styles.kicker}>Form controls</span><h2 id="choices-title">Choices</h2><p>Select keeps native keyboard and mobile picker behavior. Checkbox, Radio and Switch use native inputs.</p></header>
          <div className={styles.grid}>
            <div className={styles.demo}>
              <h3>Select</h3>
              <FormField label="Country"><Select defaultValue=""><option value="" disabled>Choose a country</option><option value="vn">Vietnam</option><option value="sg">Singapore</option></Select></FormField>
            </div>
            <div className={styles.demo}>
              <h3>Select states</h3>
              <FormField label="Required region" error="Choose a region to continue."><Select invalid defaultValue=""><option value="" disabled>Choose a region</option><option value="north">North</option><option value="south">South</option></Select></FormField>
              <FormField label="Unavailable region"><Select disabled defaultValue="central"><option value="central">Central</option></Select></FormField>
            </div>
            <div className={styles.demo}>
              <h3>Checkbox</h3>
              <Checkbox defaultChecked>Email me updates</Checkbox>
              <Checkbox disabled>Unavailable option</Checkbox>
            </div>
            <div className={styles.demo}>
              <h3>Checkbox, mixed selection</h3>
              <Checkbox indeterminate>Some project files selected</Checkbox>
              <Text size="sm" tone="muted">The parent selection includes only part of its group.</Text>
            </div>
            <div className={styles.demo}>
              <h3>Radio</h3>
              <Radio name="catalog-delivery" defaultChecked>Standard delivery</Radio>
              <Radio name="catalog-delivery">Express delivery</Radio>
            </div>
            <div className={styles.demo}>
              <h3>Switch</h3>
              <Switch defaultChecked>Notifications</Switch>
              <Switch disabled>Unavailable setting</Switch>
            </div>
          </div>
        </section>

        <section className={styles.group} aria-labelledby="content-title">
          <header><span className={styles.kicker}>Content and feedback</span><h2 id="content-title">Content pieces</h2><p>These primitives can sit inside Card slots or another composed layout.</p></header>
          <div className={styles.grid}>
            <div className={styles.demo}>
              <h3>Text</h3>
              <Text size="lg">Primary content</Text>
              <Text tone="muted" size="sm">Supporting content in a muted tone</Text>
              <Text tone="danger" size="sm">Validation message</Text>
            </div>
            <div className={styles.demo}>
              <h3>Label</h3>
              <Label htmlFor="catalog-standalone">Standalone label</Label>
              <Input id="catalog-standalone" placeholder="Label is connected" />
            </div>
            <div className={styles.demo}>
              <h3>Badge</h3>
              <div className={styles.inline}><Badge>Neutral</Badge><Badge variant="primary">Primary</Badge><Badge variant="success">Success</Badge><Badge variant="warning">Warning</Badge><Badge variant="danger">Danger</Badge></div>
            </div>
            <div className={styles.demo}>
              <h3>Spinner</h3>
              <div className={styles.inline}><Spinner size="sm" label="Small loading" /><Spinner label="Loading" /><Spinner size="lg" label="Large loading" /></div>
            </div>
            <div className={styles.demo}>
              <h3>Divider</h3>
              <Text size="sm">Content above</Text><Divider /><Text size="sm">Content below</Text>
            </div>
            <div className={styles.demo}>
              <h3>Button</h3>
              <div className={styles.inline}><Button size="sm">Primary</Button><Button size="sm" variant="outline">Outline</Button></div>
              <Text size="sm" tone="muted">Variants, icons and states are shown on the home page.</Text>
            </div>
          </div>
        </section>

        <section className={styles.group} aria-labelledby="navigation-title">
          <header><span className={styles.kicker}>Desktop controls</span><h2 id="navigation-title">Navigation and help</h2><p>Tabs support keyboard navigation and overflowing labels. Tooltip adds short help without changing the button action.</p></header>
          <div className={styles.grid}>
            <div className={styles.demo}>
              <h3>Tabs</h3>
              <Tabs defaultValue="details">
                <TabsList aria-label="Example views">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="disabled" disabled>Unavailable</TabsTrigger>
                </TabsList>
                <TabsContent value="details">Project details appear here.</TabsContent>
                <TabsContent value="activity">Recent activity appears here.</TabsContent>
                <TabsContent value="disabled">Unavailable content.</TabsContent>
              </Tabs>
            </div>
            <div className={styles.demo}>
              <h3>Tooltip</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild><Button variant="outline" size="sm">Hover or focus me</Button></TooltipTrigger>
                  <TooltipContent shortcut="⌘K">Open command menu</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

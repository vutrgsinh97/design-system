import { DesktopWorkspaceControlsShowcase } from './DesktopWorkspaceControlsShowcase'
import { DesktopCollectionsShowcase } from './DesktopCollectionsShowcase'
import { ButtonShowcase } from './ButtonShowcase'
import { PanelShowcase } from './PanelShowcase'
import { ModalToastShowcase } from './ModalToastShowcase'
import { SelectComboboxShowcase } from './SelectComboboxShowcase'
import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  FormField,
  Checkbox,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  Input,
  Select,
  Spinner,
  Switch,
  Text,
  Textarea
} from '@vutrgsinh97/ui-react-web/desktop'

export default function Home() {
  return (
    <main className="demo">
      <header>
        <Badge variant="primary">Design system</Badge>
        <h1>Desktop components</h1>
        <Text tone="muted">Next.js integration example</Text>
      </header>
      <ButtonShowcase />
      <PanelShowcase />
      <ModalToastShowcase />
      <SelectComboboxShowcase />
      <Card className="demo-card">
        <CardHeader><CardTitle>Build with shared controls</CardTitle></CardHeader>
        <CardContent>
        <div className="demo-row">
          <Button>Primary button</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <span className="demo-status"><Spinner label="Loading example" />Loading…</span>
        </div>
        <div className="demo-fields">
          <FormField label="Name" hint="This field connects its label and hint automatically."><Input placeholder="Your name" /></FormField>
          <FormField label="Select"><Select defaultValue="one"><option value="one">One</option><option value="two">Two</option></Select></FormField>
          <FormField label="Message"><Textarea placeholder="Write a message" /></FormField>
        </div>
        <div className="demo-row"><Checkbox>Remember me</Checkbox><Switch>Notifications</Switch></div>
        <Alert variant="success">This alert uses shared design tokens.</Alert>
        <Dialog>
          <DialogTrigger asChild><Button variant="secondary">Open dialog</Button></DialogTrigger>
          <DialogContent>
            <DialogTitle>Example dialog</DialogTitle>
            <DialogDescription>Keyboard focus and dismissal are handled by Radix.</DialogDescription>
            <DialogClose asChild><Button>Close</Button></DialogClose>
          </DialogContent>
        </Dialog>
        </CardContent>
      </Card>
      <DesktopCollectionsShowcase />
      <DesktopWorkspaceControlsShowcase />
    </main>
  )
}

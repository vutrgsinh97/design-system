import {
  Alert,
  Badge,
  Button,
  Card,
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
} from '@company/ui-react-web/desktop'

export default function Home() {
  return (
    <main className="demo">
      <header>
        <Badge variant="primary">Design system</Badge>
        <h1>Desktop components</h1>
        <Text tone="muted">Next.js integration example</Text>
      </header>
      <Card className="demo-card">
        <div className="demo-row">
          <Button>Primary button</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Spinner label="Loading example" />
        </div>
        <div className="demo-fields">
          <label>Input<Input placeholder="Your name" /></label>
          <label>Select<Select defaultValue="one"><option value="one">One</option><option value="two">Two</option></Select></label>
          <label>Message<Textarea placeholder="Write a message" /></label>
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
      </Card>
    </main>
  )
}

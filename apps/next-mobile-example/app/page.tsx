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
  Divider,
  Input,
  Radio,
  Select,
  Spinner,
  Switch,
  Text,
  Textarea
} from '@company/ui-react-web/mobile'

export default function MobilePlayground() {
  return (
    <main className="mobile-demo" data-ds-platform="mobile">
      <header className="mobile-demo__header">
        <span className="mobile-demo__label">Mobile playground</span>
        <div className="mobile-demo__eyebrow"><Badge variant="primary">Mobile UI</Badge><Spinner size="sm" label="Ready" /></div>
        <h1>Your day, in focus.</h1>
        <Text tone="muted">A separate mobile design with larger touch targets and a bottom sheet.</Text>
      </header>

      <div className="mobile-demo__stack">
        <Card className="mobile-demo__card">
          <div className="mobile-demo__section-title"><h2>Quick actions</h2><Badge variant="success">Active</Badge></div>
          <Text tone="muted">Actions are sized for touch and fill the available width.</Text>
          <div className="mobile-demo__actions">
            <Button>Continue</Button>
            <Button variant="secondary">Save for later</Button>
            <Button variant="ghost">View details</Button>
          </div>
        </Card>

        <Card className="mobile-demo__card">
          <h2>Profile settings</h2>
          <div className="mobile-demo__fields">
            <label>Display name<Input placeholder="Your name" /></label>
            <label>Team<Select defaultValue="design"><option value="design">Design</option><option value="engineering">Engineering</option></Select></label>
            <label>About you<Textarea placeholder="A few words about yourself" /></label>
            <Checkbox defaultChecked>Share my profile</Checkbox>
            <Switch defaultChecked>Notifications</Switch>
            <fieldset className="mobile-demo__choice">
              <legend>Updates</legend>
              <Radio name="update-frequency" defaultChecked>Every day</Radio>
              <Radio name="update-frequency">Once a week</Radio>
            </fieldset>
          </div>
        </Card>

        <Alert variant="info">The mobile components use their own visual styles.</Alert>
        <Divider />
        <Dialog>
          <DialogTrigger asChild><Button variant="secondary">Open bottom sheet</Button></DialogTrigger>
          <DialogContent>
            <DialogTitle>Mobile dialog</DialogTitle>
            <DialogDescription>This dialog appears as a bottom sheet on mobile.</DialogDescription>
            <div className="mobile-demo__actions"><DialogClose asChild><Button>Done</Button></DialogClose></div>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  )
}

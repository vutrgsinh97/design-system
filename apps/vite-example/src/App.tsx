import { Button, Card, Input, Text } from '@company/ui-react-web/desktop'

export function App() {
  return (
    <main>
      <h1>Vite + React example</h1>
      <Card>
        <Text>Only the components imported here should enter this app bundle.</Text>
        <label>Name<Input placeholder="Your name" /></label>
        <Button>Continue</Button>
      </Card>
    </main>
  )
}

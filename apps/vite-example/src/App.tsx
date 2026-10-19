import { Button, Card, CardContent, CardHeader, CardTitle, FormField, Input, Text } from '@vutrgsinh97/ui-react-web/desktop'

export function App() {
  return (
    <main>
      <h1>Vite + React example</h1>
      <Card>
        <CardHeader><CardTitle>Shared primitives</CardTitle></CardHeader>
        <CardContent>
        <Text>Only the components imported here should enter this app bundle.</Text>
        <FormField label="Name"><Input placeholder="Your name" /></FormField>
        <Button>Continue</Button>
        </CardContent>
      </Card>
    </main>
  )
}

'use client'

import { Badge, Button, Card, CardContent, CardFooter, CardHeader, CardTitle, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, List, ListItem, Table, TableActions, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from '@vutrgsinh97/ui-react-web/desktop'

export function DesktopCollectionsShowcase() {
  return (
      <Card className="demo-card">
        <CardHeader><CardTitle>Desktop list, menu and table</CardTitle></CardHeader>
        <CardContent>
          <List aria-label="Example sources" selectionMode="single" defaultValue="web">
            <ListItem value="web" primary="Web app" secondary="apps/web" badge={<Badge variant="success">Ready</Badge>} />
            <ListItem value="api" primary="API service" secondary="services/api" badge={<Badge variant="pending">Pending</Badge>} />
          </List>
          <div className="demo-row">
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="outline">Source actions</Button></DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Open details</DropdownMenuItem>
                <DropdownMenuItem destructive>Remove from view</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <Table aria-label="Example builds"><TableHeader><TableRow><TableHeaderCell>Source</TableHeaderCell><TableHeaderCell>Status</TableHeaderCell><TableHeaderCell>Actions</TableHeaderCell></TableRow></TableHeader>
              <TableBody><TableRow><TableCell>Web app</TableCell><TableCell><Badge variant="success">Ready</Badge></TableCell><TableCell><TableActions><Button size="sm" variant="outline">Open</Button><Button size="sm" variant="ghost">More</Button></TableActions></TableCell></TableRow></TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter>
          <span>Showing 1 sample source</span>
          <Button size="sm" variant="outline">Add source</Button>
        </CardFooter>
      </Card>
  )
}

# @company/ui-react-web

Private React web UI components for desktop and mobile web. Replace the placeholder `@company` scope before publishing.

```tsx
import { Button } from '@company/ui-react-web/desktop'
import { Button as MobileButton } from '@company/ui-react-web/mobile'
```

Direct component paths include `/desktop/button` and `/mobile/button`. The root path and `/button` remain desktop aliases for existing consumers. The package includes CSS automatically in Vite and Next.js; React and React DOM are peer dependencies.

See the workspace [README](../../README.md) for the two playground routes, local development, release, and bundle verification.

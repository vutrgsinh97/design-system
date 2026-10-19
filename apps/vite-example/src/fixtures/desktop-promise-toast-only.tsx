import { PromiseToast, ToastProvider, ToastViewport } from '@vutrgsinh97/ui-react-web/desktop/toast'

export const demo = (
  <ToastProvider>
    <PromiseToast promise={Promise.resolve()} loading="Working" success="Done" error="Failed" />
    <ToastViewport />
  </ToastProvider>
)
